import assert from 'node:assert/strict';
import {handle} from '../app/api/game/handler.ts';
import {BANK} from '../app/api/game/engine.ts';
const rows=new Map();
const db={prepare(sql){let args;return {bind(...a){args=a;return this},async first(){await new Promise(r=>setTimeout(r,Math.random()*3));const v=rows.get(args[0]);return v?{...v}:null},async run(){await new Promise(r=>setTimeout(r,Math.random()*3));if(sql.startsWith('INSERT')){if(rows.has(args[0]))throw Error('duplicate');rows.set(args[0],{state:args[1],revision:0});return {meta:{changes:1}}}const row=rows.get(args[1]);if(row.revision!==args[2])return {meta:{changes:0}};rows.set(args[1],{state:args[0],revision:row.revision+1});return {meta:{changes:1}}}}}};
async function req(b){const r=await handle(new Request('https://game.test/api/game',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)}),db);return {status:r.status,...await r.json()};}
const host=await req({action:'create'});assert.equal(host.status,200);
const players=await Promise.all(Array.from({length:20},(_,i)=>req({action:'join',code:host.code,name:`Alumno ${i}`})));assert(players.every(p=>p.status===200));assert.equal(JSON.parse(rows.get(host.code).state).players.length,20);
assert.equal((await req({action:'join',code:host.code,name:'Extra'})).status,400);
assert.equal((await req({action:'start',code:host.code,token:players[0].token})).status,400);
const round=await req({action:'start',code:host.code,token:host.token});assert.equal(round.phase,'playing');
const r=JSON.parse(rows.get(host.code).state);assert(r.players.every(p=>[...p.order].sort().join() === [...r.words].sort().join()));assert(new Set(r.players.map(p=>p.order.join())).size>1);
for(let n=0;n<5;n++){
 const room=JSON.parse(rows.get(host.code).state);
 await Promise.all(players.map(async player=>{const p=room.players.find(p=>p.token===player.token);const word=BANK[p.order[n]].word;const bad='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').find(c=>!word.includes(c));await req({action:'guess',code:host.code,token:p.token,round:n,letter:bad});await req({action:'guess',code:host.code,token:p.token,round:n,letter:bad});for(const letter of new Set(word)){const ans=await req({action:'guess',code:host.code,token:p.token,round:n,letter});assert.equal(ans.status,200);assert(!('order' in ans.me));assert(!('words' in ans));}}));
 const state=await req({action:'state',code:host.code,token:host.token});assert.equal(state.phase,n===4?'finished':'results');assert(state.ranking.every(p=>p.score===(n+1)*90));if(n<4)await req({action:'start',code:host.code,token:host.token});
}
const h2=await req({action:'create'});const p2=await req({action:'join',code:h2.code,name:'Tiempo'});await req({action:'start',code:h2.code,token:h2.token});let rr=JSON.parse(rows.get(h2.code).state);rr.deadline=Date.now()-1;rows.get(h2.code).state=JSON.stringify(rr);const expired=await req({action:'guess',code:h2.code,token:p2.token,round:0,letter:'A'});assert.equal(expired.phase,'results');assert.equal(expired.me.score,0);assert.equal(expired.me.guessed.length,0);
console.log('PASS: 20 concurrent players; 5 rounds; scoring; duplicate letters; host authorization; timer expiry; private answers; shuffled equal words.');

const socialHost=await req({action:'create'});
const fox=await req({action:'join',code:socialHost.code,name:'Zorro',avatar:'🐸'});
const panda=await req({action:'join',code:socialHost.code,name:'Panda',avatar:'🐼'});
assert.equal(fox.me.avatar,'🐸');assert.deepEqual(fox.ranking,[]);
const chat=await req({action:'message',code:socialHost.code,token:fox.token,text:'¡Hola, sala!'});assert.equal(chat.status,200);
const other=await req({action:'state',code:socialHost.code,token:panda.token});assert.equal(other.messages[0].text,'¡Hola, sala!');assert.equal(other.messages[0].avatar,'🐸');assert(!('sender' in other.messages[0]));
assert.equal((await req({action:'message',code:socialHost.code,token:fox.token,text:'spam'})).status,400);
await req({action:'start',code:socialHost.code,token:socialHost.token});
assert.equal((await req({action:'message',code:socialHost.code,token:panda.token,text:'una respuesta'})).status,400);
assert.equal((await req({action:'message',code:socialHost.code,token:panda.token,text:'🔥'})).status,200);
assert.equal((await req({action:'state',code:socialHost.code,token:socialHost.token})).ranking.length,2);
console.log('PASS: avatars; organizer-only ranking; shared messages; emoji during rounds; message rate limit.');
