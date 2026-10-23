import React, { useState, useEffect, useRef } from 'react';

interface ChatLine {
  id: string;
  username: string;
  text: string;
  timestamp: number;
}

interface Props {
  onSend: (text: string) => void;
}

function ChatIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M4 4h16a2 2 0 012 2v9a2 2 0 01-2 2H9l-5 4v-4H4a2 2 0 01-2-2V6a2 2 0 012-2z"
      />
    </svg>
  );
}

function CloseIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M18.3 5.7a1 1 0 00-1.4 0L12 10.6 7.1 5.7a1 1 0 10-1.4 1.4l4.9 4.9-4.9 4.9a1 1 0 101.4 1.4l4.9-4.9 4.9 4.9a1 1 0 001.4-1.4L13.4 12l4.9-4.9a1 1 0 000-1.4z"
      />
    </svg>
  );
}

function SendIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="currentColor" d="M3.4 20.6L22 12 3.4 3.4 3 10l12 2-12 2z" />
    </svg>
  );
}

export function ChatPanel({ onSend }: Props) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [lines, setLines] = useState<ChatLine[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const d = (e as CustomEvent).detail;
      if (!d?.text) return;
      setLines((prev) =>
        [
          ...prev,
          {
            id: `${d.timestamp}-${d.playerId}`,
            username: d.username || 'Someone',
            text: d.text,
            timestamp: d.timestamp || Date.now(),
          },
        ].slice(-40)
      );
    };
    window.addEventListener('mboa:chat', handler);
    return () => window.removeEventListener('mboa:chat', handler);
  }, []);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [lines]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    onSend(t);
    setText('');
  };

  return (
    <div className="absolute bottom-24 left-3 z-50 pointer-events-auto w-[min(320px,90vw)]">
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-black/70 backdrop-blur-md text-white text-sm font-medium pl-2.5 pr-3.5 py-2.5 rounded-2xl border border-white/20 hover:bg-black/80 shadow-lg"
          aria-label="Open chat"
        >
          <span className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-mboa-yellow/90 text-black">
            <ChatIcon className="w-5 h-5" />
            {lines.length > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center border border-black/40">
                {lines.length > 9 ? '9+' : lines.length}
              </span>
            )}
          </span>
          <span>Chat</span>
        </button>
      )}

      {open && (
        <div className="bg-black/80 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden flex flex-col max-h-60 shadow-xl">
          <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 bg-white/5">
            <div className="flex items-center gap-2 text-white">
              <ChatIcon className="w-4 h-4 text-mboa-yellow" />
              <span className="text-xs font-semibold">Akwa chat</span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10"
              aria-label="Close chat"
            >
              <CloseIcon />
            </button>
          </div>
          <div ref={listRef} className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5 text-xs min-h-[72px]">
            {lines.length === 0 && (
              <p className="text-white/40">Say something… « On est ensemble »</p>
            )}
            {lines.map((l) => (
              <div key={l.id} className="text-white/90 leading-snug">
                <span className="text-mboa-yellow font-semibold">{l.username}</span>
                <span className="text-white/40"> · </span>
                <span>{l.text}</span>
              </div>
            ))}
          </div>
          <form onSubmit={submit} className="flex gap-2 p-2 border-t border-white/10">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={120}
              placeholder="Message…"
              className="flex-1 bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-mboa-yellow/60"
            />
            <button
              type="submit"
              className="shrink-0 w-10 h-10 rounded-xl bg-mboa-yellow text-black flex items-center justify-center hover:bg-yellow-400"
              aria-label="Send"
            >
              <SendIcon />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
