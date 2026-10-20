import { useEffect, useMemo, useState } from 'react';
import {
  LiveKitRoom, VideoConference, PreJoin, RoomAudioRenderer,
  type LocalUserChoices,
} from '@livekit/components-react';
import { ArrowLeft, ArrowRight, Check, Copy, Link2, LockKeyhole, Radio, ShieldCheck, Video, Wifi } from 'lucide-react';

const DEFAULT_URL = import.meta.env.VITE_LIVEKIT_URL ?? '';
type Mode = 'join' | 'meeting';

function newRoomName() {
  return 'meet-' + Math.random().toString(36).slice(2, 8);
}

export default function App() {
  const [mode, setMode] = useState<Mode>('join');
  const [serverUrl, setServerUrl] = useState(DEFAULT_URL);
  const [token, setToken] = useState('');
  const [roomName, setRoomName] = useState(newRoomName);
  const [participantName, setParticipantName] = useState('');
  const [error, setError] = useState('');
  const [connected, setConnected] = useState(false);
  const [copied, setCopied] = useState(false);
  const [choices, setChoices] = useState<LocalUserChoices | undefined>();

  const validUrl = useMemo(() => /^wss?:\/\//i.test(serverUrl.trim()), [serverUrl]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const room = params.get('room');
    if (room) setRoomName(room);
    const url = params.get('url');
    if (url) setServerUrl(url);
  }, []);

  function join(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!validUrl) { setError('Enter a valid LiveKit WebSocket URL (wss://...).'); return; }
    if (!token.trim()) { setError('Paste a participant token with permission to join this room.'); return; }
    if (!participantName.trim()) { setError('Enter your display name.'); return; }
    if (!roomName.trim()) { setError('Enter a room name.'); return; }
    setMode('meeting');
  }

  async function copyInvite() {
    const invite = new URL(window.location.href);
    invite.searchParams.set('room', roomName);
    if (serverUrl.trim()) invite.searchParams.set('url', serverUrl.trim());
    try {
      await navigator.clipboard.writeText(invite.toString());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch { setError('Clipboard access was blocked. Copy the URL from your browser address bar instead.'); }
  }

  if (mode === 'meeting') {
    return (
      <div className="meeting-shell">
        <header className="meeting-topbar">
          <button className="brand compact" onClick={() => { setMode('join'); setConnected(false); }} aria-label="Back to join screen">
            <span className="brand-mark"><Video size={19} /></span><span>livekit<span className="brand-light"> meet</span></span>
          </button>
          <div className="room-label"><span className="live-dot" />{roomName}</div>
          <button className="invite-button" onClick={copyInvite}>{copied ? <Check size={16}/> : <Copy size={16}/>} {copied ? 'Copied invite' : 'Copy invite'}</button>
        </header>
        <div className="conference">
          <LiveKitRoom
            serverUrl={serverUrl.trim()}
            token={token.trim()}
            connect={true}
            video={choices?.videoEnabled ?? true}
            audio={choices?.audioEnabled ?? true}
            onConnected={() => { setConnected(true); setError(''); }}
            onDisconnected={() => { setConnected(false); setMode('join'); }}
            onError={(e) => { setError(e.message || 'Unable to connect to LiveKit.'); setMode('join'); }}
            data-lk-theme="default"
            style={{ height: '100%' }}
          >
            <RoomAudioRenderer />
            <VideoConference />
          </LiveKitRoom>
        </div>
        {error && <div className="toast-error" role="alert">{error}</div>}
        <div className="connection-status">{connected ? <><span className="live-dot"/> Connected</> : <><span className="pulse-dot"/> Connecting…</>} <span className="status-divider">·</span> LiveKit WebRTC</div>
      </div>
    );
  }

  return (
    <main className="page">
      <nav className="topbar">
        <a className="brand" href="#" onClick={(e) => { e.preventDefault(); setMode('join'); }}>
          <span className="brand-mark"><Video size={20} strokeWidth={2.5}/></span>
          <span>livekit<span className="brand-light"> meet</span></span>
        </a>
        <a className="docs-link" href="https://docs.livekit.io/" target="_blank" rel="noreferrer">Documentation <ArrowRight size={15}/></a>
      </nav>

      <section className="hero">
        <div className="eyebrow"><span className="eyebrow-icon"><Radio size={13}/></span> OPEN SOURCE VIDEO MEETINGS</div>
        <h1>Make room for<br/><span>great conversations.</span></h1>
        <p className="hero-copy">A simple, powerful video meeting experience built with React and LiveKit. Join a room and bring your team together.</p>
      </section>

      <section className="join-layout">
        <div className="join-card">
          <div className="card-heading">
            <div><h2>Join a meeting</h2><p>Connect to your LiveKit server.</p></div>
            <div className="card-icon"><Video size={20}/></div>
          </div>
          <form onSubmit={join}>
            <label htmlFor="name">Your name</label>
            <input id="name" autoComplete="name" placeholder="e.g. Alex Morgan" value={participantName} onChange={e => setParticipantName(e.target.value)} />
            <div className="label-row"><label htmlFor="room">Room name</label><button type="button" className="text-action" onClick={() => setRoomName(newRoomName())}>Generate room</button></div>
            <div className="input-with-icon"><Link2 size={16}/><input id="room" placeholder="team-standup" value={roomName} onChange={e => setRoomName(e.target.value)} /></div>
            <label htmlFor="server">LiveKit server URL</label>
            <input id="server" spellCheck={false} placeholder="wss://your-project.livekit.cloud" value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
            <label htmlFor="token">Participant token</label>
            <textarea id="token" spellCheck={false} placeholder="Paste your LiveKit participant JWT…" value={token} onChange={e => setToken(e.target.value)} rows={3}/>
            <p className="field-hint"><LockKeyhole size={13}/> Token is used in your browser only. Never paste your API secret here.</p>
            {error && <div className="form-error" role="alert">{error}</div>}
            <button className="primary-button" type="submit">Continue to meeting <ArrowRight size={17}/></button>
          </form>
          <div className="card-foot"><ShieldCheck size={15}/> Secure connection over WebRTC</div>
        </div>

        <aside className="side-panel">
          <div className="preview-art">
            <div className="orbit orbit-one"/><div className="orbit orbit-two"/>
            <div className="preview-center"><div className="preview-logo"><Video size={31}/></div><span className="preview-spark spark-a">✳</span><span className="preview-spark spark-b">✦</span></div>
            <div className="floating-chip chip-top"><span className="mini-avatar avatar-purple">A</span><span>Alex Morgan</span><span className="audio-bars"><i/><i/><i/><i/></span></div>
            <div className="floating-chip chip-bottom"><span className="mini-avatar avatar-orange">J</span><span>Jamie Lee</span><span className="muted-chip">Connected</span></div>
          </div>
          <div className="feature-list">
            <div className="feature"><span className="feature-icon purple"><Wifi size={17}/></span><div><h3>Low-latency video</h3><p>Real-time audio and video powered by LiveKit.</p></div></div>
            <div className="feature"><span className="feature-icon orange"><ShieldCheck size={17}/></span><div><h3>Direct connection</h3><p>Your browser connects straight to your LiveKit server.</p></div></div>
            <div className="feature"><span className="feature-icon green"><LockKeyhole size={17}/></span><div><h3>You control access</h3><p>Use a participant token issued by your own trusted system.</p></div></div>
          </div>
          <div className="setup-note"><div className="note-icon"><ArrowRight size={16}/></div><div><strong>Already have a token?</strong><p>Enter your LiveKit URL and participant JWT to start. Need a token? Use your server-side token generator or LiveKit CLI.</p><a href="https://docs.livekit.io/home/server/generating-tokens/" target="_blank" rel="noreferrer">Token documentation <ArrowRight size={13}/></a></div></div>
        </aside>
      </section>

      <footer className="footer"><span>Built with <a href="https://livekit.io/" target="_blank" rel="noreferrer">LiveKit</a> and React</span><span className="footer-right"><span className="live-dot"/> Ready when you are</span></footer>
    </main>
  );
}