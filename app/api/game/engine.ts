export type WordItem = {word:string;display:string;clue:string};

export const BANK: WordItem[] = [
 {word:'GRAVEDAD',display:'GRAVEDAD',clue:'Fuerza invisible de la naturaleza que nos mantiene con los pies en la Tierra y hace caer los objetos.'},
 {word:'AMAZONAS',display:'AMAZONAS',clue:'El río más caudaloso del planeta y hogar de la selva tropical más grande del mundo.'},
 {word:'KARAOKE',display:'KARAOKE',clue:'Actividad donde cantas tus canciones favoritas siguiendo la letra en una pantalla frente a tus amigos.'},
 {word:'ECLIPSE',display:'ECLIPSE',clue:'Fenómeno astronómico en el que la Luna o la Tierra bloquean temporalmente la luz del Sol.'},
 {word:'OXIGENO',display:'OXÍGENO',clue:'Elemento químico presente en el aire e indispensable para la respiración de los seres vivos.'},
 {word:'VOLCAN',display:'VOLCÁN',clue:'Montaña o abertura de la corteza terrestre por donde emerge magma, ceniza y gases del interior.'},
 {word:'BRUJULA',display:'BRÚJULA',clue:'Instrumento con una aguja imantada que señala siempre el norte y sirve para orientarse.'},
 {word:'CONCIERTO',display:'CONCIERTO',clue:'Espectáculo musical en vivo donde el público canta frente al escenario de su artista favorito.'},
 {word:'GALAXIA',display:'GALAXIA',clue:'Inmenso conjunto de miles de millones de estrellas, planetas, gas y polvo cósmico unidos en el espacio.'},
 {word:'DIAMANTE',display:'DIAMANTE',clue:'Mineral natural compuesto de carbono puro, famoso por ser el más duro y brillante de la Tierra.'}
];

export function sanitizeWordItem(raw: {word?:string;display?:string;clue?:string}): WordItem | null {
  const rawWord = String(raw?.display || raw?.word || '').trim().toUpperCase();
  const cleanWord = rawWord
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z]/g, '')
    .slice(0, 18);
  const clue = String(raw?.clue || '').trim().slice(0, 220);
  if (cleanWord.length < 2 || !clue) return null;
  const display = rawWord.replace(/[^A-ZÁÉÍÓÚÜÑ]/g, '').slice(0, 18) || cleanWord;
  return {word: cleanWord, display, clue};
}

export const shuffle = <T,>(a:T[]) => {let b=[...a];for(let i=b.length-1;i>0;i--){let j=crypto.getRandomValues(new Uint32Array(1))[0]%(i+1);[b[i],b[j]]=[b[j],b[i]];}return b;};
export type Player={id:string;token:string;name:string;avatar?:string;order:number[];guessed:string[];errors:number;done:boolean;won:boolean;score:number;time:number;roundScore:number;roundTime?:number};
export type Message={id:string;sender:string;name:string;avatar:string;text:string;at:number};
export type RoundWinner={round:number;id:string;name:string;avatar:string;score:number};
export type Room={
  title?:string;
  roundSeconds?:number;
  customBank?:WordItem[];
  messages?:Message[];
  roundWinners?:RoundWinner[];
  code:string;
  host:string;
  phase:'lobby'|'playing'|'results'|'finished';
  round:number;
  deadline:number;
  started:number;
  created:number;
  words:number[];
  players:Player[];
};

export function getBank(r:Room): WordItem[] {
  return r.customBank && r.customBank.length > 0 ? r.customBank : BANK;
}

export function expire(r:Room,now:number){
  const totalRounds = r.words.length || 5;
  if(r.phase==='playing'&&(now>=r.deadline||r.players.every(p=>p.done))){
    r.phase=r.round>=totalRounds-1?'finished':'results';
    for(const p of r.players)p.done=true;
    r.roundWinners=r.roundWinners||[];
    if(!r.roundWinners.some(w=>w.round===r.round)&&r.players.length){
      const sorted=[...r.players].sort((a,b)=>b.roundScore-a.roundScore||(a.roundTime||999999)-(b.roundTime||999999)||b.score-a.score);
      const best=sorted[0];
      if(best){
        r.roundWinners.push({round:r.round,id:best.id,name:best.name,avatar:best.avatar||'🦊',score:best.roundScore});
      }
    }
  }
}

export function guess(r:Room,p:Player,letter:string,now:number){
  if(r.phase!=='playing'||p.done||now>=r.deadline||p.guessed.includes(letter))return;
  p.guessed.push(letter);
  const bank=getBank(r);
  const w=bank[p.order[r.round]]?.word || '';
  if(!w)return;
  if(!w.includes(letter))p.errors++;
  p.won=[...w].every(c=>p.guessed.includes(c));
  p.done=p.won||p.errors>=6;
  if(p.won){
    p.roundScore=100-10*p.errors;
    p.score+=p.roundScore;
    const elapsed=now-r.started;
    p.roundTime=elapsed;
    p.time+=elapsed;
  }
  expire(r,now);
}

export function view(r:Room,token:string,now:number){
  const p=r.players.find(p=>p.token===token);
  const host=r.host===token;
  if(!host&&!p)throw Error('Vuelve a entrar a la sala.');
  const bank=getBank(r);
  const w=p&&r.round>=0?bank[p.order[r.round]]:null;
  const sorted=[...r.players]
    .sort((a,b)=>b.score-a.score||a.time-b.time||a.name.localeCompare(b.name))
    .map(x=>({id:x.id,name:x.name,avatar:x.avatar||'🦊',score:x.score,time:x.time,done:x.done,roundScore:x.roundScore}));
  const activeQuestions = host
    ? (r.customBank && r.customBank.length > 0
        ? r.customBank
        : r.words.map(idx => BANK[idx]).filter(Boolean))
    : undefined;
  return {
    code:r.code,
    title:r.title||'',
    roundSeconds:r.roundSeconds||60,
    host,
    phase:r.phase,
    round:r.round,
    deadline:r.deadline,
    now,
    total:r.words.length||5,
    count:r.players.length,
    completed:r.players.filter(p=>p.done).length,
    messages:(r.messages||[]).filter(m=>now-m.at<120000).map(({sender,...m})=>m),
    roundWinners:r.roundWinners||[],
    roster:r.phase==='lobby'?r.players.map(x=>({id:x.id,name:x.name,avatar:x.avatar||'🦊'})):[],
    ranking:host?sorted:[],
    podium:r.phase==='finished'?sorted:undefined,
    questions:activeQuestions,
    me:p?{
      id:p.id,
      name:p.name,
      avatar:p.avatar||'🦊',
      guessed:p.guessed,
      errors:p.errors,
      done:p.done,
      won:p.won,
      score:p.score,
      roundScore:p.roundScore,
      clue:w?.clue,
      mask:w?[...w.word].map(c=>p.guessed.includes(c)?c:'_'):[],
      answer:r.phase==='finished'?w?.display:undefined
    }:null
  };
}
