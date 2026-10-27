import {AVATARS,REACTIONS} from '../../game-options.ts';
import {sanitizeWordItem,shuffle,expire,guess,view,type Room,type WordItem} from './engine.ts';

const json=(v:unknown,status=200)=>Response.json(v,{status,headers:{'Cache-Control':'no-store'}});

function pickPlayerOrder(words:number[], existingOrders:string[]): number[] {
  let order = shuffle(words);
  for (let tries = 0; tries < 24 && existingOrders.includes(order.join(',')); tries++) {
    order = shuffle(words);
  }
  return order;
}

function buildCustomConfig(b: any) {
  const title = String(b.title || '').trim().slice(0, 60);
  const rawSec = Number(b.roundSeconds);
  const roundSeconds = [30, 45, 60, 90, 120].includes(rawSec) ? rawSec : 60;

  let customBank: WordItem[] | undefined;
  let words: number[];

  if (Array.isArray(b.questions) && b.questions.length > 0) {
    const cleaned: WordItem[] = [];
    const seen = new Set<string>();
    for (const q of b.questions) {
      const item = sanitizeWordItem(q);
      if (item && !seen.has(item.word)) {
        seen.add(item.word);
        cleaned.push(item);
      }
      if (cleaned.length >= 20) break;
    }
    if (!cleaned.length) {
      throw Error('Agrega al menos 1 palabra válida (mínimo 2 letras de la A a la Z) con su pregunta o pista.');
    }
    customBank = cleaned;
    const requestedRounds = Number(b.maxRounds) || cleaned.length;
    const count = Math.max(1, Math.min(cleaned.length, Math.min(15, requestedRounds)));
    const allIndices = cleaned.map((_, i) => i);
    words = count < cleaned.length ? shuffle(allIndices).slice(0, count) : allIndices;
  } else {
    words = shuffle([0,1,3,4,5,7,9]).slice(0,5);
  }

  return {title, roundSeconds, customBank, words};
}

export async function handle(req:Request,db:D1Database){try{
 if(req.headers.get('origin')&&req.headers.get('origin')!==new URL(req.url).origin)return json({error:'Origen no permitido.'},403);
 const b=await req.json() as {
   action:string;
   code?:string;
   token?:string;
   name?:string;
   round?:number;
   letter:string;
   avatar?:string;
   text?:string;
   title?:string;
   roundSeconds?:number;
   maxRounds?:number;
   questions?:Array<{word?:string;display?:string;clue?:string}>;
 };
 if(!db)throw Error('La sala no está disponible.');
 const now=Date.now();

 if(b.action==='create') {
   const code=[...crypto.getRandomValues(new Uint8Array(6))].map(n=>'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[n%31]).join('');
   const token=crypto.randomUUID();
   const cfg=buildCustomConfig(b);
   const r:Room={
     code,
     title:cfg.title,
     roundSeconds:cfg.roundSeconds,
     customBank:cfg.customBank,
     host:token,
     phase:'lobby',
     round:-1,
     deadline:0,
     started:0,
     created:now,
     words:cfg.words,
     players:[]
   };
   await db.prepare('INSERT INTO rooms(code,state,revision) VALUES(?,?,0)').bind(code,JSON.stringify(r)).run();
   return json({token,...view(r,token,now)});
 }

 const code=String(b.code||'').toUpperCase();
 if(!/^[A-Z2-9]{6}$/.test(code))throw Error('Escribe el código de seis caracteres.');

 for(let retry=0;retry<60;retry++) {
   const row=await db.prepare('SELECT state,revision FROM rooms WHERE code=?').bind(code).first<{state:string;revision:number}>();
   if(!row)throw Error('No encontramos esa sala.');
   const r:Room=JSON.parse(row.state);
   if(now-r.created>86400000)throw Error('Esta sala venció. Crea una nueva.');
   expire(r,now);
   let token=String(b.token||'');

   if(b.action==='join'){
     if(r.phase!=='lobby')throw Error('La partida ya comenzó.');
     if(r.players.length>=20)throw Error('La sala ya tiene 20 participantes.');
     const name=String(b.name||'').trim().slice(0,24);
     if(!name)throw Error('Escribe tu nombre.');
     if(r.players.some(p=>p.name.toLowerCase()===name.toLowerCase()))throw Error('Ese nombre ya está en uso; añade tu apellido.');
     const existingOrders=r.players.map(p=>p.order.join(','));
     const order=pickPlayerOrder(r.words, existingOrders);
     token=crypto.randomUUID();
     r.players.push({
       id:crypto.randomUUID(),
       token,
       name,
       avatar:AVATARS.includes(b.avatar||'')?b.avatar:AVATARS[r.players.length%AVATARS.length],
       order,
       guessed:[],
       errors:0,
       done:false,
       won:false,
       score:0,
       time:0,
       roundScore:0
     });
   } else {
     const p=r.players.find(p=>p.token===token);
     if(token!==r.host&&!p)throw Error('Vuelve a entrar a la sala.');

     if(b.action==='configure'){
       if(token!==r.host)throw Error('Solo el anfitrión puede editar las preguntas.');
       if(r.phase!=='lobby')throw Error('Solo puedes editar las preguntas antes de iniciar la partida.');
       const cfg=buildCustomConfig(b);
       r.title=cfg.title;
       r.roundSeconds=cfg.roundSeconds;
       r.customBank=cfg.customBank;
       r.words=cfg.words;
       const assigned:string[]=[];
       for(const pl of r.players){
         pl.order=pickPlayerOrder(r.words, assigned);
         assigned.push(pl.order.join(','));
       }
     }
     else if(b.action==='start'){
       if(token!==r.host)throw Error('Solo el anfitrión puede iniciar.');
       if(!['lobby','results'].includes(r.phase))throw Error('La ronda ya está en curso.');
       if(!r.players.length)throw Error('Espera a que entre al menos un participante.');
       r.round++;
       r.phase='playing';
       r.started=now;
       r.deadline=now+(r.roundSeconds||60)*1000;
       for(const p of r.players){
         p.guessed=[];
         p.errors=0;
         p.done=false;
         p.won=false;
         p.roundScore=0;
         p.roundTime=999999;
       }
     }
     else if(b.action==='guess'){
       if(!p)throw Error('Entra como participante para jugar.');
       if(b.round===r.round&&/^[A-Z]$/.test(b.letter))guess(r,p,b.letter,now);
     }
     else if(b.action==='avatar'){
       if(!p)throw Error('Entra como participante para cambiar tu avatar.');
       if(!AVATARS.includes(b.avatar||''))throw Error('Elige un avatar válido.');
       p.avatar=b.avatar;
     }
     else if(b.action==='message'){
       const text=String(b.text||'').trim().slice(0,80);
       if(!text)throw Error('Escribe un mensaje.');
       if(r.phase==='playing'&&!REACTIONS.includes(text))throw Error('Durante la ronda puedes enviar emojis.');
       const sender=p?.id||'host';
       r.messages=(r.messages||[]).filter(m=>now-m.at<120000);
       if(r.messages.some(m=>m.sender===sender&&now-m.at<1800))throw Error('Espera un momento antes de enviar otro.');
       r.messages.push({id:crypto.randomUUID(),sender,name:p?.name||'Anfitrión',avatar:p?.avatar||'🦊',text,at:now});
       r.messages=r.messages.slice(-30);
     }
     else if(b.action!=='state')throw Error('Acción no válida.');
   }

   const next=JSON.stringify(r);
   if(next!==row.state){
     const result=await db.prepare('UPDATE rooms SET state=?,revision=revision+1 WHERE code=? AND revision=?').bind(next,code,row.revision).run();
     if(!result.meta.changes){
       await new Promise(resolve=>setTimeout(resolve,10+Math.random()*40));
       continue;
     }
   }
   return json({...(b.action==='join'?{token}:{}),...view(r,token,now)});
 }
 return json({error:'Muchos movimientos a la vez. Intenta de nuevo.'},409);
}catch(e){return json({error:e instanceof Error?e.message:'No se pudo conectar.'},400);}}
