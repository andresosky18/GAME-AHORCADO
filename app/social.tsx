'use client';
import {useEffect,useState} from 'react';
import {REACTIONS} from './game-options';
import {AvatarGraphic} from './avatars';

export function Invite({code}:{code:string}){
  const [url,setUrl]=useState(''),[qr,setQr]=useState(''),[copied,setCopied]=useState(false);
  useEffect(()=>{
    let active=true;
    const u=`${location.origin}/?sala=${code}`;
    setUrl(u);
    import('qrcode')
      .then(m=>m.default.toDataURL(u,{width:240,margin:1,color:{dark:'#14451f',light:'#ffffff'}}))
      .then(v=>{if(active)setQr(v)})
      .catch(()=>{});
    return()=>{active=false};
  },[code]);

  async function copyLink(){
    try{
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(()=>setCopied(false),2000);
    }catch{}
  }

  return (
    <div className="inviteCard">
      <div className="inviteMain">
        <div className="qrFrame">
          {qr ? (
            <img src={qr} width="132" height="132" alt="Código QR de la sala"/>
          ) : (
            <div className="qrPlaceholder"/>
          )}
        </div>
        <div className="inviteMeta">
          <span className="inviteEyebrow">CÓDIGO DE SALA</span>
          <b className="inviteCode">{code}</b>
          <button type="button" className={'copyBtn '+(copied?'copied':'')} onClick={copyLink}>
            {copied ? '✓ Enlace copiado' : 'Copiar enlace'}
          </button>
        </div>
      </div>
      <div className="inviteUrlBox">
        <input aria-label="Enlace de la sala" readOnly value={url} onFocus={e=>e.target.select()}/>
      </div>
    </div>
  );
}

export function Social({game,send,busy}:{game:any;send:(text:string)=>Promise<void>;busy:boolean}){
  const [text,setText]=useState('');
  const messages=(game.messages||[]).slice(-4);
  const latestMsg=messages[messages.length-1];
  const isCompactPlayerRound = !game.host && game.phase === 'playing';

  if (isCompactPlayerRound) {
    return (
      <section className="social socialCompact" aria-label="Reacciones rápidas">
        <div className="compactBar">
          <div className="reactions compactReactions">
            {REACTIONS.map(e=>(
              <button type="button" key={e} disabled={busy} onClick={()=>send(e)} aria-label={`Enviar ${e}`}>
                {e}
              </button>
            ))}
          </div>
          {latestMsg && (
            <div className="latestToast" key={latestMsg.id}>
              <span className="toastAvatar"><AvatarGraphic id={latestMsg.avatar}/></span>
              <b>{latestMsg.name}:</b>
              <em>{latestMsg.text}</em>
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="social">
      <div className="socialTitle">
        <div className="socialTitleLeft">
          <b>Reacciones de la sala</b>
          <span className="socialSub">Mensajes en tiempo real</span>
        </div>
        <span className="liveTag">En vivo</span>
      </div>
      <div className="messages" aria-live="polite" aria-relevant="additions">
        {messages.length ? (
          messages.map((m:any)=>(
            <div className={'chatBubble '+(REACTIONS.includes(m.text)?'reactionBubble':'')} key={m.id}>
              <span className="chatAvatar"><AvatarGraphic id={m.avatar}/></span>
              <div className="chatContent">
                <small>{m.name}</small>
                <p>{m.text}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="chatEmpty">
            <span>Toca un emoji para saludar a la sala</span>
          </div>
        )}
      </div>
      <div className="reactions">
        {REACTIONS.map(e=>(
          <button type="button" key={e} disabled={busy} onClick={()=>send(e)} aria-label={`Enviar ${e}`}>
            {e}
          </button>
        ))}
      </div>
      {game.phase!=='playing' ? (
        <form className="chatForm" onSubmit={async e=>{e.preventDefault();if(text.trim()){await send(text);setText('');}}}>
          <input
            aria-label="Mensaje para la sala"
            value={text}
            onChange={e=>setText(e.target.value)}
            placeholder="Escribe un mensaje…"
            maxLength={80}
          />
          <button disabled={busy||!text.trim()} aria-label="Enviar mensaje">
            Enviar
          </button>
        </form>
      ) : (
        <small className="chatHint">El chat de texto vuelve al terminar la ronda.</small>
      )}
    </section>
  );
}
