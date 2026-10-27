'use client';
import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import {AvatarGraphic} from './avatars';

export function Count({value}:{value:number}){
  const [shown,setShown]=useState(value);
  const current=useRef(value);
  useEffect(()=>{
    const from=current.current;
    if(from===value)return;
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame:number;
    const start=performance.now();
    function tick(now:number){
      const t=reduced?1:Math.min(1,(now-start)/900);
      current.current=Math.round(from+(value-from)*(1-(1-t)**3));
      setShown(current.current);
      if(t<1)frame=requestAnimationFrame(tick);
    }
    frame=requestAnimationFrame(tick);
    return()=>cancelAnimationFrame(frame);
  },[value]);
  return <>{shown}</>;
}

function CrownSvg({className='podiumCrown'}:{className?:string}){
  return (
    <svg className={className} viewBox="0 0 48 36" fill="none" aria-hidden="true">
      <path d="M4 30L8 10L18 20L24 6L30 20L40 10L44 30H4Z" fill="#FFC72C" stroke="#E09B00" strokeWidth="2" strokeLinejoin="round"/>
      <circle cx="24" cy="5" r="3" fill="#FF5722"/>
      <circle cx="7" cy="9" r="2.5" fill="#FFC72C"/>
      <circle cx="41" cy="9" r="2.5" fill="#FFC72C"/>
      <path d="M24 17L26.5 22L24 27L21.5 22L24 17Z" fill="#E63946"/>
      <rect x="4" y="30" width="40" height="4" rx="2" fill="#E09B00"/>
    </svg>
  );
}

function Points({score}:{score:number}){
  const prev=useRef(score);
  const [gain,setGain]=useState<{amount:number;key:number}|null>(null);
  useEffect(()=>{
    if(score>prev.current)setGain({amount:score-prev.current,key:Date.now()});
    prev.current=score;
  },[score]);
  return (
    <strong className="scorePill">
      +<Count value={score}/>
      {gain&&<span key={gain.key} className="pointGain">+{gain.amount}</span>}
    </strong>
  );
}

export function FinalPodiumHero({
  standings,
  isFinale,
  title,
  countText,
  leaderNotice
}:{
  standings:any[];
  isFinale:boolean;
  title:string;
  countText?:string;
  leaderNotice?:string;
}){
  const top1 = standings[0];
  const top2 = standings[1];
  const top3 = standings[2];

  return (
    <div className={'podiumHero '+(isFinale?'finalCeremony':'')}>
      {isFinale && (
        <>
          <div className="sunburstWrap" aria-hidden="true">
            <div className="sunburstRays"/>
          </div>
          <div className="ceremonyConfetti" aria-hidden="true">
            {Array.from({length:42},(_,i)=>(
              <i
                key={i}
                style={{
                  left:`${(i*23)%100}%`,
                  animationDelay:`${(i%12)*0.14}s`,
                  animationDuration:`${2.4+(i%5)*0.35}s`,
                  background:['#FFC72C','#FF5722','#14451F','#38BDF8','#EC4899','#FFFFFF'][i%6],
                  transform:`rotate(${i*29}deg)`
                }}
              />
            ))}
          </div>
        </>
      )}

      <div className="podiumHeaderBar">
        <span className="podiumTitle">{title}</span>
        {countText && <span className="podiumCountPill">{countText}</span>}
      </div>

      {leaderNotice&&(
        <div key={leaderNotice} className="leaderNotice" role="status">
          👑 ¡<b>{leaderNotice}</b> sube al puesto #1!
        </div>
      )}

      <div className="podiumStage">
        {/* 2nd Place (Left) */}
        <div className="podiumCol second">
          <div className="podiumContestant">
            <div className={'podiumAvatarRing '+(top2?'filled':'empty')}>
              {top2 ? <AvatarGraphic id={top2.avatar||'🦊'}/> : <span>—</span>}
            </div>
            <b className="podiumName">{top2 ? top2.name : 'Puesto 2'}</b>
            <span className="podiumScoreTag">+{top2 ? <Count value={top2.score}/> : 0}</span>
          </div>
          <div className="podiumPedestal">
            <div className="pedestalTop"/>
            <div className="pedestalFront">2</div>
          </div>
        </div>

        {/* 1st Place (Center, Tallest) */}
        <div className="podiumCol first">
          <div className="podiumContestant">
            <div className="crownWrap">
              <CrownSvg/>
            </div>
            <div className={'podiumAvatarRing '+(top1?'filled':'empty')}>
              {top1 ? <AvatarGraphic id={top1.avatar||'🦊'}/> : <span>👑</span>}
              {isFinale && top1 && (
                <div className="winnerSparkles" aria-hidden="true">
                  <i className="sp1">✦</i>
                  <i className="sp2">✦</i>
                  <i className="sp3">★</i>
                </div>
              )}
            </div>
            <b className="podiumName">{top1 ? top1.name : 'Puesto 1'}</b>
            <span className="podiumScoreTag">+{top1 ? <Count value={top1.score}/> : 0}</span>
          </div>
          <div className="podiumPedestal">
            <div className="pedestalTop"/>
            <div className="pedestalFront">1</div>
          </div>
        </div>

        {/* 3rd Place (Right) */}
        <div className="podiumCol third">
          <div className="podiumContestant">
            <div className={'podiumAvatarRing '+(top3?'filled':'empty')}>
              {top3 ? <AvatarGraphic id={top3.avatar||'🦊'}/> : <span>—</span>}
            </div>
            <b className="podiumName">{top3 ? top3.name : 'Puesto 3'}</b>
            <span className="podiumScoreTag">+{top3 ? <Count value={top3.score}/> : 0}</span>
          </div>
          <div className="podiumPedestal">
            <div className="pedestalTop"/>
            <div className="pedestalFront">3</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RoundWinnersStrip({roundWinners}:{roundWinners:any[]}){
  if (!roundWinners || !roundWinners.length) return null;
  return (
    <div className="roundWinnersBlock">
      <h4>Mejor de cada ronda</h4>
      <div className="roundWinnersGrid">
        {roundWinners.map((rw:any)=>(
          <div key={rw.round} className="roundWinnerCard">
            <div className="rwAvatarWrap">
              <AvatarGraphic id={rw.avatar||'🦊'}/>
              <CrownSvg className="rwMiniCrown"/>
            </div>
            <b>{rw.name}</b>
            <span className="rwPill">Ronda {rw.round+1}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LiveRanking({game}:{game:any}){
  const list=useRef<HTMLOListElement>(null);
  const positions=useRef(new Map<string,{x:number;y:number}>());
  const previous=useRef(new Map<string,number>());
  const [leader,setLeader]=useState('');
  const lastLeader=useRef('');
  const standings = game.ranking?.length ? game.ranking : (game.podium || []);
  const signature=standings.map((p:any)=>`${p.id}:${p.score}`).join('|');

  useLayoutEffect(()=>{
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    const next=new Map<string,{x:number;y:number}>();
    list.current?.querySelectorAll<HTMLElement>('li[data-id]').forEach(el=>{
      const id=el.dataset.id!;
      const y=el.offsetTop,x=el.offsetLeft;
      next.set(id,{x,y});
      const old=positions.current.get(id);
      if(old!==undefined&&(old.y!==y||old.x!==x)&&!reduced){
        el.animate(
          [{transform:`translate(${old.x-x}px, ${old.y-y}px)`},{transform:'translate(0,0)'}],
          {duration:850,easing:'cubic-bezier(.22,1,.36,1)'}
        );
      }
      const player=standings.find((p:any)=>p.id===id);
      if(player&&previous.current.has(id)&&player.score>previous.current.get(id)!&&!reduced){
        el.animate(
          [{backgroundColor:'#d9f99d'},{backgroundColor:'#f7fee7'},{backgroundColor:'#ffffff'}],
          {duration:1500}
        );
      }
      if(player)previous.current.set(id,player.score);
    });
    positions.current=next;
    const first=standings[0];
    if(first?.score>0&&lastLeader.current&&lastLeader.current!==first.id)setLeader(first.name);
    lastLeader.current=first?.id||'';
  },[signature]);

  useEffect(()=>{
    if(!leader)return;
    const t=setTimeout(()=>setLeader(''),3500);
    return()=>clearTimeout(t);
  },[leader]);

  const isLobby = game.phase === 'lobby';
  const isFinished = game.phase === 'finished';
  const totalRounds = game.total || 5;

  return (
    <aside className="rankingCard">
      {isLobby ? (
        <div className="lobbyHeroBanner">
          <div className="podiumHeaderBar">
            <span className="podiumTitle">{game.title ? `🎯 ${game.title}` : 'Sala de Jugadores'}</span>
            <span className="podiumCountPill">{game.count} / 20</span>
          </div>
          <p className="lobbyHeroSub">
            El podio final se revelará al concluir {totalRounds === 1 ? 'la ronda' : `las ${totalRounds} rondas`}
          </p>
          <div className="lobbyCapacityTrack" aria-hidden="true">
            <span style={{width:`${Math.max(4,(game.count/20)*100)}%`}}/>
          </div>
        </div>
      ) : (
        <FinalPodiumHero
          standings={standings}
          isFinale={isFinished}
          title={isFinished ? '¡Felicidades!' : 'Podio en Vivo'}
          countText={`${game.count} / 20`}
          leaderNotice={leader}
        />
      )}

      {/* White Rounded Sheet Below */}
      <div className="rankingSheet">
        <RoundWinnersStrip roundWinners={game.roundWinners}/>

        <div className="sheetHeader">
          <h3>
            {isLobby
              ? 'Participantes conectados'
              : isFinished
              ? 'Resultados de todos los participantes'
              : 'Clasificación general'}
          </h3>
          <small>
            {isLobby
              ? 'Escanea el código QR para aparecer en la lista'
              : isFinished
              ? `Partida de ${totalRounds} ${totalRounds === 1 ? 'ronda' : 'rondas'} completada`
              : `Ronda ${game.round+1} de ${totalRounds} en curso`}
          </small>
        </div>

        {!standings.length ? (
          <div className="emptyRank">
            <p>Aún no han entrado jugadores. Comparte el código o el QR para empezar.</p>
            <div className="joinSteps">
              <div className="stepCard">
                <span className="stepPill">Paso 1</span>
                <b>Escanea el QR</b>
                <small>O abre el enlace en tu teléfono</small>
              </div>
              <div className="stepCard">
                <span className="stepPill">Paso 2</span>
                <b>Elige tu personaje</b>
                <small>Puedes cambiarlo dentro de la sala</small>
              </div>
              <div className="stepCard">
                <span className="stepPill">Paso 3</span>
                <b>Sube al podio</b>
                <small>Gana puntos en {totalRounds === 1 ? 'la ronda' : `las ${totalRounds} rondas`}</small>
              </div>
            </div>
          </div>
        ) : (
          <ol ref={list} className="rankingList">
            {standings.map((p:any,i:number)=>(
              <li
                data-id={p.id}
                key={p.id}
                className={(p.id===game.me?.id?'you ':'')+(i===0&&p.score>0?'leader':'')}
              >
                <span className="position">{i+1}</span>
                <span className="rankAvatar"><AvatarGraphic id={p.avatar||'🦊'}/></span>
                <div className="player">
                  <b>{p.name}{p.id===game.me?.id?' (tú)':''}</b>
                  <div className="playerBadges">
                    <span className={'statusTag '+(isLobby?'ready':p.done?'done':'active')}>
                      {isLobby?'Listo para jugar':p.done?'Ronda completada':'Jugando ahora…'}
                    </span>
                  </div>
                </div>
                <Points score={p.score}/>
              </li>
            ))}
          </ol>
        )}
      </div>
    </aside>
  );
}

export function RoundResult({me,finished,round}:{me:any;finished:boolean;round:number}){
  return (
    <div key={round} className={'result '+(me.won?'won':'zero')} role="status">
      {me.won&&(
        <div className="confetti" aria-hidden="true">
          {Array.from({length:20},(_,i)=>(
            <i
              key={i}
              style={{
                left:`${(i*37)%100}%`,
                animationDelay:`${i%6*.09}s`,
                background:['#84d846','#f59e2d','#14451f','#ffd166'][i%4],
                transform:`rotate(${i*31}deg)`
              }}
            />
          ))}
        </div>
      )}
      <span className="resultPill">{me.won ? `Ronda ${round+1} superada` : `Ronda ${round+1}`}</span>
      <h2>{me.won?'¡Ganaste la ronda!':finished?'¡Partida completada!':'¡Sigue intentando!'}</h2>
      <div className="resultRewardRow">
        <span className="rewardChip">+{me.roundScore} pts en ronda</span>
        <span className="rewardChip totalChip">Total: {me.score} pts</span>
      </div>
      <p>
        {finished
          ? 'Aquí abajo tienes el podio final de ganadores.'
          : 'Prepárate, el anfitrión lanzará la siguiente palabra en breve.'}
      </p>
    </div>
  );
}
