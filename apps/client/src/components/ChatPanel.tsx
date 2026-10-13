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
          className="bg-black/60 backdrop-blur-md text-white text-sm px-3 py-2 rounded-xl border border-white/15 hover:bg-black/70"
        >
          Chat {lines.length > 0 ? `(${lines.length})` : ''}
        </button>
      )}

      {open && (
        <div className="bg-black/70 backdrop-blur-md rounded-xl border border-white/15 overflow-hidden flex flex-col max-h-56">
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/10">
            <span className="text-xs font-medium text-white/80">Akwa chat</span>
            <button type="button" onClick={() => setOpen(false)} className="text-white/50 hover:text-white text-xs">
              Close
            </button>
          </div>
          <div ref={listRef} className="flex-1 overflow-y-auto px-3 py-2 space-y-1 text-xs">
            {lines.length === 0 && (
              <p className="text-white/40">Say something... On est ensemble</p>
            )}
            {lines.map((l) => (
              <div key={l.id} className="text-white/90">
                <span className="text-mboa-yellow font-medium">{l.username}</span>
                <span className="text-white/50">: </span>
                {l.text}
              </div>
            ))}
          </div>
          <form onSubmit={submit} className="flex border-t border-white/10">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={120}
              placeholder="Message..."
              className="flex-1 bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-white/30"
            />
            <button type="submit" className="px-3 text-mboa-yellow text-sm font-medium hover:text-yellow-300">
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
