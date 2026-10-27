'use client';
import {useEffect,useRef,useState} from 'react';
import {LiveRanking,RoundResult} from './live-ranking';
import {Invite,Social} from './social';
import {AVATARS} from './game-options';
import {AvatarGraphic,AVATAR_META} from './avatars';
import {playHit,playMiss,playRoundWin,playPodiumFanfare} from './sound';
import {QuestionStudio,type StudioConfig} from './question-studio';

function Figure({errors=0}:{errors?:number}){
  return (
    <svg className="figure" viewBox="0 0 260 270" aria-label={`${errors} de 6 errores`}>
      <path className="scaffold" d="M30 245H230 M68 245V24H186V54 M68 60L104 24"/>
      {errors>0&&<circle cx="186" cy="78" r="22"/>}
      {errors>1&&<path d="M186 100V168"/>}
      {errors>2&&<path d="M186 116L150 148"/>}
      {errors>3&&<path d="M186 116L222 148"/>}
      {errors>4&&<path d="M186 168L154 216"/>}
      {errors>5&&<path d="M186 168L218 216"/>}
    </svg>
  );
}

function WelcomeIllustration(){
  return (
    <svg className="welcomeArt" viewBox="0 0 360 290" fill="none" aria-hidden="true">
      <rect x="42" y="112" width="115" height="132" rx="4" fill="#FFF5EB" stroke="#F59E2D" strokeWidth="6"/>
      <path d="M58 148C72 135 84 162 72 170C60 178 55 158 68 152" stroke="#4A1D1F" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M112 205C124 192 138 205 128 216" stroke="#4A1D1F" strokeWidth="2.5" strokeLinecap="round"/>

      <rect x="194" y="96" width="96" height="148" rx="4" fill="#FFF5EB" stroke="#F59E2D" strokeWidth="6"/>
      <circle cx="222" cy="130" r="10" stroke="#4A1D1F" strokeWidth="2"/>
      <path d="M214 164Q224 156 234 164Q244 156 254 164" stroke="#4A1D1F" strokeWidth="2" strokeLinecap="round"/>
      <path d="M208 205Q228 192 248 205T276 205" stroke="#4A1D1F" strokeWidth="2" strokeLinecap="round"/>
      <path d="M208 220Q228 207 248 220T276 220" stroke="#4A1D1F" strokeWidth="2" strokeLinecap="round"/>

      <path d="M126 62L96 254" stroke="#C86D22" strokeWidth="8" strokeLinecap="round"/>
      <path d="M168 62L194 254" stroke="#C86D22" strokeWidth="8" strokeLinecap="round"/>
      <path d="M147 60V246" stroke="#A65315" strokeWidth="6" strokeLinecap="round"/>
      <rect x="112" y="156" width="70" height="14" rx="3" fill="#C86D22"/>
      <rect x="108" y="182" width="78" height="10" rx="3" fill="#A65315"/>

      <rect x="76" y="74" width="132" height="92" rx="4" fill="#FFFFFF" stroke="#4A1D1F" strokeWidth="2.5"/>
      <circle cx="182" cy="96" r="11" fill="#FFD13B"/>
      <path d="M94 102Q114 94 134 102T164 102" stroke="#8CE0F5" strokeWidth="10" strokeLinecap="round"/>
      <path d="M96 124H178" stroke="#8CE0F5" strokeWidth="11" strokeLinecap="round"/>
      <rect x="92" y="142" width="24" height="12" rx="6" fill="#8CE0F5"/>
      <rect x="126" y="142" width="28" height="12" rx="6" fill="#A9F06A"/>
      <rect x="162" y="142" width="24" height="12" rx="6" fill="#8CE0F5"/>

      <rect x="246" y="164" width="68" height="82" rx="4" fill="#FFF9F2" stroke="#FFC72C" strokeWidth="6"/>
      <circle cx="280" cy="196" r="11" stroke="#E0533C" strokeWidth="3"/>
      <circle cx="280" cy="196" r="5" fill="#E0533C"/>
      <path d="M280 207V236" stroke="#4A1D1F" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M280 224C270 218 266 224 274 228" stroke="#4A1D1F" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M280 220C290 214 294 220 286 224" stroke="#4A1D1F" strokeWidth="2.5" strokeLinecap="round"/>

      <g transform="translate(42, 58) rotate(22)">
        <rect width="54" height="24" rx="3" fill="#84D846" stroke="#52A71C" strokeWidth="2"/>
        <circle cx="27" cy="12" r="6" fill="#52A71C"/>
      </g>
      <g transform="translate(248, 86) rotate(-18)">
        <rect width="78" height="34" rx="4" fill="#84D846" stroke="#52A71C" strokeWidth="2"/>
        <circle cx="39" cy="17" r="9" fill="#52A71C"/>
        <circle cx="16" cy="17" r="3" fill="#A9F06A"/>
        <circle cx="62" cy="17" r="3" fill="#A9F06A"/>
      </g>
      <g transform="translate(182, 146) rotate(32)">
        <rect width="48" height="22" rx="3" fill="#84D846" stroke="#52A71C" strokeWidth="2"/>
        <circle cx="24" cy="11" r="5" fill="#52A71C"/>
      </g>
      <g transform="translate(292, 134) rotate(14)">
        <rect width="50" height="22" rx="3" fill="#84D846" stroke="#52A71C" strokeWidth="2"/>
        <circle cx="25" cy="11" r="5" fill="#52A71C"/>
      </g>
      <g transform="translate(26, 224) rotate(-52)">
        <rect width="64" height="28" rx="4" fill="#84D846" stroke="#52A71C" strokeWidth="2"/>
        <circle cx="32" cy="14" r="7" fill="#52A71C"/>
      </g>

      <ellipse cx="216" cy="70" rx="14" ry="9" transform="rotate(-12 216 70)" fill="#FFD859" stroke="#E0A81E" strokeWidth="2"/>
      <ellipse cx="44" cy="140" rx="11" ry="7" transform="rotate(28 44 140)" fill="#FFD859" stroke="#E0A81E" strokeWidth="2"/>
      <ellipse cx="192" cy="204" rx="12" ry="8" transform="rotate(24 192 204)" fill="#FFD859" stroke="#E0A81E" strokeWidth="2"/>
      <ellipse cx="322" cy="236" rx="7" ry="5" transform="rotate(-22 322 236)" fill="#FFD859" stroke="#E0A81E" strokeWidth="1.8"/>
    </svg>
  );
}

export default function Home(){
  const [game,setGame]=useState<any>(null),
    [session,setSession]=useState<any>(null),
    [code,setCode]=useState(''),
    [name,setName]=useState(''),
    [avatar,setAvatar]=useState('🦊'),
    [error,setError]=useState(''),
    [busy,setBusy]=useState(false),
    [clock,setClock]=useState(Date.now()),
    [mobileStep,setMobileStep]=useState<'welcome'|'join'>('welcome'),
    [editingAvatar,setEditingAvatar]=useState(false),
    [showStudio,setShowStudio]=useState(false),
    [editingRoomQuestions,setEditingRoomQuestions]=useState(false),
    [soundOn,setSoundOn]=useState(true);

  const locked=useRef(false),latest=useRef(0),offset=useRef(0),prevPhase=useRef('');

  useEffect(()=>{
    const q=new URLSearchParams(location.search).get('sala');
    if(q){
      setCode(q);
      setMobileStep('join');
    }
    try{
      sessionStorage.removeItem('lehman-session');
      const s=JSON.parse(sessionStorage.getItem('ahorcado-session')||'null');
      if(s&&(!q||q===s.code))setSession(s);
    }catch{}
    const t=setInterval(()=>setClock(Date.now()),250);
    return()=>clearInterval(t);
  },[]);

  useEffect(()=>{
    if(game?.phase === 'finished' && prevPhase.current !== 'finished'){
      playPodiumFanfare(soundOn);
    }
    if(game?.phase) prevPhase.current = game.phase;
  },[game?.phase, soundOn]);

  async function call(action:string,data:any={},s=session){
    const seq=++latest.current;
    const res=await fetch('/api/game',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({...s,...data,action})
    });
    const v:any=await res.json();
    if(!res.ok)throw Error(v.error||'No se pudo conectar.');
    if(seq>=latest.current){
      offset.current=v.now-Date.now();
      setGame(v);
    }
    return v;
  }

  useEffect(()=>{
    if(!session)return;
    let live=true;
    let timer:any;
    async function poll(){
      if(locked.current){
        timer=setTimeout(poll,1000);
        return;
      }
      try{
        await call('state',{},session);
        if(live)setError('');
      }catch(e){
        if(live)setError((e as Error).message);
      }
      if(live)timer=setTimeout(poll,1200);
    }
    poll();
    return()=>{
      live=false;
      clearTimeout(timer);
    };
  },[session]);

  async function act(action:string,data:any={}){
    if(locked.current)return;
    locked.current=true;
    setBusy(true);
    setError('');
    try{
      const prevErrs = game?.me?.errors ?? 0;
      const prevWon = game?.me?.won ?? false;
      const v=await call(action,data);
      if(v.token){
        const s={code:v.code,token:v.token};
        sessionStorage.setItem('ahorcado-session',JSON.stringify(s));
        setSession(s);
      }
      if(action==='guess' && v.me){
        if(v.me.won && !prevWon) playRoundWin(soundOn);
        else if(v.me.errors > prevErrs) playMiss(soundOn);
        else playHit(soundOn);
      }
    }catch(e){
      setError((e as Error).message);
    }finally{
      locked.current=false;
      setBusy(false);
    }
  }

  const me=game?.me,
    playing=game?.phase==='playing',
    totalRounds=game?.total||5,
    roundSec=game?.roundSeconds||60,
    seconds=game?Math.max(0,Math.ceil((game.deadline-clock-offset.current)/1000)):roundSec;

  useEffect(()=>{
    const key=(e:KeyboardEvent)=>{
      if((e.target as HTMLElement)?.tagName==='INPUT')return;
      const c=e.key.toUpperCase();
      if(playing&&me&&!me.done&&/^[A-Z]$/.test(c)&&!me.guessed.includes(c)){
        act('guess',{letter:c,round:game.round});
      }
    };
    window.addEventListener('keydown',key);
    return()=>window.removeEventListener('keydown',key);
  },[game,busy,soundOn]);

  function leave(){
    if(game&&game.phase!=='finished'&&!confirm('Puedes volver desde este dispositivo si conservas la sesión. ¿Salir y borrar tu acceso a esta sala?'))return;
    sessionStorage.removeItem('ahorcado-session');
    setSession(null);
    setGame(null);
    setError('');
  }

  return (
    <main className={game?(game.host?'hostView':'playerView'):'homeView'}>
      {/* Top App Bar */}
      <header className="topHeader">
        {game ? (
          <button type="button" className="circleIconBtn" onClick={leave} aria-label="Salir de la sala" title="Salir de la sala">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
        ) : mobileStep === 'join' ? (
          <button type="button" className="circleIconBtn mobileOnlyBtn" onClick={()=>setMobileStep('welcome')} aria-label="Volver">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
        ) : (
          <span className="headerSpacer mobileOnlyBtn"/>
        )}

        <a className="brand" href="/">
          <span className="brandText">
            {game
              ? game.host
                ? game.phase==='finished'
                  ? '¡Felicidades!'
                  : `Sala ${game.code}`
                : game.phase==='finished'
                ? '¡Resultados Finales!'
                : `Ronda ${Math.max(1,(game.round??0)+1)} de ${totalRounds}`
              : showStudio
              ? 'Editor de Preguntas'
              : mobileStep==='join'
              ? 'Entrar a jugar'
              : 'Ahorcado'}
          </span>
        </a>

        <div className="headerActions">
          <button
            type="button"
            className="circleIconBtn soundBtn"
            onClick={()=>setSoundOn(s=>!s)}
            aria-label={soundOn?'Silenciar efectos de sonido':'Activar efectos de sonido'}
            title={soundOn?'Sonido activado':'Sonido silenciado'}
          >
            {soundOn ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <line x1="23" y1="9" x2="17" y2="15"/>
                <line x1="17" y1="9" x2="23" y2="15"/>
              </svg>
            )}
          </button>
          {game ? (
            <span className="roomCodeChip">{game.code}</span>
          ) : (
            <span className="liveChip">En vivo</span>
          )}
        </div>
      </header>

      {error&&(
        <div role="alert" className="error">
          <span>{error}</span>
          {session&&!game&&<button type="button" onClick={leave}>Volver al inicio</button>}
        </div>
      )}

      {!game ? (
        showStudio ? (
          <QuestionStudio
            mode="create"
            busy={busy}
            onCancel={()=>setShowStudio(false)}
            onSubmit={async(cfg:StudioConfig)=>{
              await act('create',cfg);
              setShowStudio(false);
            }}
          />
        ) : (
        <section className={'landing step-' + mobileStep}>
          {/* Screen 1 / Left Column: Welcome Illustration & Hero */}
          <div className="welcomePanel">
            <h1 className="welcomeTitle">
              Bienvenido a<br/>Ahorcado
            </h1>

            <div className="illustrationWrap">
              <WelcomeIllustration/>
            </div>

            <p className="welcomeSubtitle">
              Juego público en tiempo real para exposiciones, clases o amigos.<br/>
              Crea tus propias preguntas o únete con un código.
            </p>

            <div className="welcomeMobileActions">
              <button type="button" className="limeBtn" onClick={()=>setMobileStep('join')}>
                Entrar a una sala
              </button>
              <button type="button" className="softGrayBtn" onClick={()=>setShowStudio(true)} disabled={busy}>
                ✨ Crear sala / Poner mis preguntas
              </button>
            </div>
          </div>

          {/* Screen 2 / Right Column: Entry Form with Illustrated Avatars */}
          <div className="entryPanel">
            <div className="entryHeader">
              <h2>Ingresa a la partida</h2>
              <p>
                ¡Hola! Elige tu personaje, escribe tu nombre e introduce el código de 6 letras de la sala.
              </p>
            </div>

            <form onSubmit={e=>{e.preventDefault();act('join',{code,name,avatar});}}>
              <span className="fieldLabel">Elige tu personaje</span>
              <div className="avatarPicker" role="group" aria-label="Elige tu personaje">
                {AVATARS.map(a=>(
                  <button
                    type="button"
                    aria-label={`Personaje ${AVATAR_META[a]?.label || a}`}
                    aria-pressed={avatar===a}
                    key={a}
                    className={avatar===a?'selected':''}
                    onClick={()=>setAvatar(a)}
                  >
                    <AvatarGraphic id={a}/>
                  </button>
                ))}
              </div>

              <div className="softInputGroup">
                <div className="softInputWrap">
                  <input
                    aria-label="Tu nombre o apodo"
                    value={name}
                    onChange={e=>setName(e.target.value)}
                    placeholder="Nombre o apodo"
                    maxLength={24}
                    required
                    autoComplete="nickname"
                  />
                  <svg className="inputIcon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>

                <div className="softInputWrap">
                  <input
                    aria-label="Código de sala"
                    className="codeInput"
                    value={code}
                    onChange={e=>setCode(e.target.value.toUpperCase().replace(/[^A-Z2-9]/g,''))}
                    placeholder="Código de sala (ej. ABC234)"
                    maxLength={6}
                    minLength={6}
                    required
                  />
                  <svg className="inputIcon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
              </div>

              <button className="limeBtn submitBtn" disabled={busy}>
                {busy?'Entrando…':'Comenzar a jugar'}
              </button>
            </form>

            <div className="hostCreateFooter">
              <button type="button" className="softGrayBtn" onClick={()=>setShowStudio(true)} disabled={busy}>
                ✨ Crear una sala / Poner mis preguntas
              </button>
            </div>
          </div>
        </section>
        )
      ) : (
        <>
          <div className="gameTop">
            {game.host ? (
              <div className="hostTitleBlock">
                <div className="hostTitleRow">
                  <h1>
                    {game.phase==='lobby'
                      ? (game.title || '¡Que entre el grupo!')
                      : game.phase==='finished'
                      ? 'Podio de Ganadores 🏆'
                      : `Ronda ${game.round+1} de ${totalRounds}`}
                  </h1>
                  <span className="countBadge">
                    {game.phase==='lobby'
                      ? `${game.count} / 20 jugadores`
                      : `${game.completed} de ${game.count} listos`}
                  </span>
                  {game.phase==='lobby' && (
                    <button
                      type="button"
                      className="editQuestionsPillBtn"
                      onClick={()=>setEditingRoomQuestions(v=>!v)}
                    >
                      {editingRoomQuestions ? 'Cerrar editor ▲' : `✏️ Editar preguntas (${totalRounds})`}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="playerIdentity">
                <button
                  type="button"
                  className="playerAvatarBox clickableAvatar"
                  onClick={()=>setEditingAvatar(v=>!v)}
                  title="Toca para cambiar tu personaje"
                >
                  <AvatarGraphic id={me?.avatar||'🦊'}/>
                  <span className="editAvatarBadge" aria-hidden="true">✎</span>
                </button>
                <div className="playerIdentityMeta">
                  <b>{me?.name}</b>
                  <button
                    type="button"
                    className="changeAvatarLink"
                    onClick={()=>setEditingAvatar(v=>!v)}
                  >
                    {editingAvatar ? 'Cerrar selector ▲' : 'Cambiar personaje ▾'}
                  </button>
                </div>
                <strong className="playerScorePill">+{me?.score||0}</strong>
              </div>
            )}

            <div className="gameTopRight">
              {game.host&&game.phase==='results'&&(
                <button className="limeBtn compactLimeBtn" disabled={busy} onClick={()=>act('start')}>
                  Siguiente ronda ({game.round+2}/{totalRounds}) →
                </button>
              )}
              {playing&&(
                <div className={'timer '+(seconds<=10?'urgent':'')}>
                  <b>{seconds}</b>
                  <span>s</span>
                </div>
              )}
            </div>
          </div>

          {/* Host In-Lobby Question Studio Modal/Drawer */}
          {game.host && game.phase === 'lobby' && editingRoomQuestions && (
            <div className="inLobbyStudioWrap">
              <QuestionStudio
                mode="edit"
                busy={busy}
                initialTitle={game.title || 'Partida en Vivo'}
                initialRoundSeconds={game.roundSeconds || 60}
                initialQuestions={game.questions}
                onCancel={()=>setEditingRoomQuestions(false)}
                onSubmit={async(cfg:StudioConfig)=>{
                  await act('configure', cfg);
                  setEditingRoomQuestions(false);
                }}
              />
            </div>
          )}

          {/* In-room Avatar Switcher Drawer for Players */}
          {!game.host && editingAvatar && (
            <div className="inRoomAvatarDrawer">
              <div className="drawerTop">
                <b>Elige un nuevo personaje</b>
                <button type="button" onClick={()=>setEditingAvatar(false)}>Listo ✓</button>
              </div>
              <div className="avatarPicker compactAvatarGrid">
                {AVATARS.map(a=>(
                  <button
                    type="button"
                    key={a}
                    className={me?.avatar===a?'selected':''}
                    disabled={busy}
                    onClick={async()=>{
                      await act('avatar',{avatar:a});
                      setEditingAvatar(false);
                    }}
                  >
                    <AvatarGraphic id={a}/>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className={'arena '+(game.host?'hostArena ':'')+(game.phase==='lobby'?'lobbyArena':'')}>
            {game.host ? (
              <>
                <div className="hostLeftCol">
                  <section className="board">
                    {game.phase==='lobby' ? (
                      <div className="waiting">
                        <Invite code={game.code}/>

                        <div className="lobbyDeckCard">
                          <div className="lobbyDeckInfo">
                            <span className="lobbyDeckLabel">Preguntas de la sala</span>
                            <b>{game.title || 'Cultura General & Amigos'}</b>
                            <small>{totalRounds} {totalRounds===1?'ronda':'rondas'} · {roundSec}s por palabra</small>
                          </div>
                          <button
                            type="button"
                            className="lobbyEditDeckBtn"
                            onClick={()=>setEditingRoomQuestions(v=>!v)}
                          >
                            {editingRoomQuestions ? 'Cerrar ▲' : '✏️ Editar'}
                          </button>
                        </div>

                        <details className="rules">
                          <summary>¿Cómo funciona la puntuación?</summary>
                          <p>Cada jugador tiene {roundSec} segundos y 6 vidas para resolver la palabra.</p>
                          <p>100 puntos por acierto menos 10 por error. El menor tiempo total desempata.</p>
                        </details>
                        <button
                          className="limeBtn startMatchBtn"
                          disabled={busy||!game.count}
                          onClick={()=>act('start')}
                        >
                          {game.count
                            ? `¡Iniciar partida! (${game.count} ${game.count===1?'jugador':'jugadores'})`
                            : 'Esperando jugadores…'}
                        </button>
                      </div>
                    ) : (
                      <div className="hostControls">
                        <div className="hostStatusInfo">
                          {playing ? (
                            <span className="hostPlaying"><i/> Ronda {game.round+1} en curso</span>
                          ) : game.phase==='finished' ? (
                            <span className="hostFinishedBadge">¡Partida completada!</span>
                          ) : (
                            <span className="hostPausedBadge">Ronda {game.round+1} completada</span>
                          )}
                          <small>
                            {game.phase==='finished'
                              ? 'El podio final con los ganadores está en pantalla.'
                              : `${game.completed} de ${game.count} participantes terminaron esta palabra.`}
                          </small>
                        </div>
                        {game.phase==='results'&&(
                          <button className="limeBtn" disabled={busy} onClick={()=>act('start')}>
                            Iniciar ronda {game.round+2} →
                          </button>
                        )}
                        {game.phase==='finished'&&(
                          <button
                            type="button"
                            className="limeBtn"
                            onClick={()=>{
                              sessionStorage.removeItem('ahorcado-session');
                              setSession(null);
                              setGame(null);
                              setShowStudio(true);
                            }}
                          >
                            ✨ Crear otra sala / Nuevas preguntas
                          </button>
                        )}
                      </div>
                    )}
                  </section>
                  <Social game={game} busy={busy} send={text=>act('message',{text})}/>
                </div>
                <LiveRanking game={game}/>
              </>
            ) : (
              <>
                {/* When the game finishes, Players ALSO see the Grand Finale Animated Podium! */}
                {game.phase === 'finished' && (
                  <LiveRanking game={game}/>
                )}

                <section className="board playerBoard">
                  {playing && (
                    <div className="timeProgressBar" aria-hidden="true">
                      <span
                        className={seconds<=10?'urgent':''}
                        style={{width:`${Math.max(0,Math.min(100,(seconds/roundSec)*100))}%`}}
                      />
                    </div>
                  )}
                  {game.phase==='lobby' ? (
                    <div className="waiting playerWaiting">
                      <div className="waitingAvatarRing">
                        <AvatarGraphic id={me?.avatar||'🦊'}/>
                      </div>
                      <h2>¡Estás dentro, {me?.name}!</h2>
                      <p>Puedes cambiar tu personaje aquí mientras empieza la partida<span className="dots">…</span></p>

                      <div className="lobbyAvatarSwitcher">
                        <span className="switcherLabel">Tu personaje (toca para cambiar):</span>
                        <div className="avatarPicker">
                          {AVATARS.map(a=>(
                            <button
                              type="button"
                              key={a}
                              disabled={busy}
                              className={me?.avatar===a?'selected':''}
                              onClick={()=>act('avatar',{avatar:a})}
                              aria-label={`Cambiar a ${AVATAR_META[a]?.label || a}`}
                            >
                              <AvatarGraphic id={a}/>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="roster">
                        {game.roster?.map((p:any)=>(
                          <div key={p.id} className="rosterChip">
                            <span className="rosterChipAvatar"><AvatarGraphic id={p.avatar}/></span>
                            <small>{p.name}</small>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="personal">
                      <div className="clueBox">
                        <div className="puzzleTop">
                          <span className={'eyebrow '+(me.won?'won':me.done?'done':'')}>
                            {me.won?'¡PALABRA DESCUBIERTA!':me.done?'FIN DEL TURNO':'PISTA'}
                          </span>
                          <span className="mistakes" aria-label={`${6-me.errors} vidas restantes`}>
                            <span className="mistakeDots" aria-hidden="true">
                              {Array.from({length:6},(_,i)=>(
                                <i key={i} className={i<me.errors?'used':''}/>
                              ))}
                            </span>
                            <small>{6-me.errors} vidas</small>
                          </span>
                        </div>
                        <p className="clue">{me.clue}</p>
                      </div>

                      <div className="stageCenter">
                        <div className="figureCompactWrap">
                          <Figure errors={me.errors}/>
                        </div>
                        <div
                          className="letters"
                          style={{'--word-len': Math.max(5, me.mask.length)} as React.CSSProperties}
                        >
                          {me.mask.map((c:string,i:number)=>(
                            <span className={c==='_'?'empty':'revealed'} key={`${game.round}-${i}-${c}`}>
                              {c==='_'?'':c}
                            </span>
                          ))}
                        </div>
                      </div>

                      {playing&&!me.done ? (
                        <div className="keyboard" role="group" aria-label="Teclado">
                          {['QWERTYUIOP','ASDFGHJKL','ZXCVBNM'].map(row=>(
                            <div key={row} className="keyRow">
                              {[...row].map(c=>(
                                <button
                                  type="button"
                                  key={c}
                                  disabled={busy||me.guessed.includes(c)||seconds===0}
                                  className={me.guessed.includes(c)?(me.mask.includes(c)?'hit':'miss'):''}
                                  onClick={()=>act('guess',{letter:c,round:game.round})}
                                >
                                  {c}
                                </button>
                              ))}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <RoundResult me={me} finished={game.phase==='finished'} round={game.round}/>
                      )}
                    </div>
                  )}
                </section>

                <Social game={game} busy={busy} send={text=>act('message',{text})}/>

                {/* Bottom Winner / Score Action Bar */}
                {(game.phase==='results' || game.phase==='finished') && me && (
                  <div className="bottomSummaryBar">
                    <div className="bottomSummaryLeft">
                      <span>{game.phase==='finished' ? 'Ganaste' : 'Tu Puntaje'}</span>
                      <strong>+{me.score}</strong>
                    </div>
                    {game.phase==='finished' ? (
                      <button type="button" className="playAgainLimeBtn" onClick={leave}>
                        ↻ Jugar de nuevo
                      </button>
                    ) : (
                      <span className="waitingNextPill">Siguiente ronda pronto…</span>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </main>
  );
}
