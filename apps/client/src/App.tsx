import React, { useState, useEffect, useRef } from 'react';
import { ColyseusClient } from './game/network/ColyseusClient';
import { createGame } from './game/main';
import { HUD } from './components/HUD';
import { ActivityBar } from './components/ActivityBar';

type Screen = 'menu' | 'game';

interface LiveNeeds {
  hunger: number;
  energy: number;
  fun: number;
  social: number;
  hygiene: number;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [username, setUsername] = useState('');
  const [startingClass, setStartingClass] = useState<'connecte' | 'debrouillard'>('debrouillard');
  const [status, setStatus] = useState('');
  const [money, setMoney] = useState(0);
  const [district, setDistrict] = useState('Akwa');
  const [needs, setNeeds] = useState<LiveNeeds>({
    hunger: 80,
    energy: 90,
    fun: 70,
    social: 60,
    hygiene: 85,
  });
  const [notification, setNotification] = useState('');

  const gameRef = useRef<Phaser.Game | null>(null);
  const networkRef = useRef<ColyseusClient | null>(null);

  const startGame = async () => {
    if (!username.trim()) {
      setStatus('Enter a username');
      return;
    }

    setStatus('Connecting...');
    try {
      const network = new ColyseusClient();
      await network.joinWorld({
        username: username.trim(),
        startingClass,
      });
      networkRef.current = network;

      if (network.room) {
        const syncLocal = () => {
          const sessionId = network.sessionId;
          if (!sessionId || !network.room) return;
          const me = network.room.state.players.get(sessionId);
          if (!me) return;
          setMoney(me.money ?? 0);
          setDistrict(me.districtId === 'akwa' ? 'Akwa' : me.districtId || 'Akwa');
          setNeeds({
            hunger: me.hunger ?? 80,
            energy: me.energy ?? 90,
            fun: me.fun ?? 70,
            social: me.social ?? 60,
            hygiene: me.hygiene ?? 85,
          });
        };

        network.room.onStateChange(syncLocal);
        network.room.onMessage('welcome', () => setTimeout(syncLocal, 100));
      }

      setScreen('game');
      setStatus('');

      setTimeout(() => {
        if (gameRef.current) gameRef.current.destroy(true);
        gameRef.current = createGame('game-container', network);
      }, 50);
    } catch (err: any) {
      console.error(err);
      setStatus('Could not connect. Start the server first (apps/server).');
    }
  };

  useEffect(() => {
    const onNotify = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setNotification(detail?.message || '');
      setTimeout(() => setNotification(''), 3000);
    };
    const onActivity = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setNotification(detail?.message || 'Activity done');
      setTimeout(() => setNotification(''), 3000);
    };
    window.addEventListener('mboa:notification', onNotify);
    window.addEventListener('mboa:activity-result', onActivity);
    return () => {
      window.removeEventListener('mboa:notification', onNotify);
      window.removeEventListener('mboa:activity-result', onActivity);
      gameRef.current?.destroy(true);
      networkRef.current?.leave();
    };
  }, []);

  const handleActivity = (activityId: string) => {
    networkRef.current?.sendActivity(activityId);
  };

  if (screen === 'menu') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-mboa-night to-mboa-green p-4">
        <div className="w-full max-w-md bg-black/40 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/10">
          <h1 className="text-3xl font-bold text-center mb-1">Game of Mboa</h1>
          <p className="text-center text-white/60 text-sm mb-6">Live your Cameroon story</p>

          <label className="block text-sm mb-1 opacity-80">Username</label>
          <input
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-mboa-yellow mb-4"
            placeholder="Your name in Mboa"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength={20}
            onKeyDown={(e) => e.key === 'Enter' && startGame()}
          />

          <label className="block text-sm mb-2 opacity-80">Starting path</label>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setStartingClass('debrouillard')}
              className={`py-3 rounded-lg border text-sm font-medium transition ${
                startingClass === 'debrouillard'
                  ? 'bg-orange-600 border-orange-400'
                  : 'bg-white/5 border-white/20 hover:bg-white/10'
              }`}
            >
              Debrouillard
              <div className="text-xs opacity-70 mt-1">Start from zero</div>
            </button>
            <button
              type="button"
              onClick={() => setStartingClass('connecte')}
              className={`py-3 rounded-lg border text-sm font-medium transition ${
                startingClass === 'connecte'
                  ? 'bg-blue-600 border-blue-400'
                  : 'bg-white/5 border-white/20 hover:bg-white/10'
              }`}
            >
              Connecte
              <div className="text-xs opacity-70 mt-1">Born with advantages</div>
            </button>
          </div>

          <button
            type="button"
            onClick={startGame}
            className="w-full py-3 rounded-lg bg-mboa-yellow text-black font-semibold hover:bg-yellow-400 transition"
          >
            Enter Mboa
          </button>

          {status && <p className="text-center text-sm mt-4 text-red-300">{status}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div id="game-container" className="absolute inset-0" />
      <HUD money={money} district={district} needs={needs} />
      <ActivityBar onActivity={handleActivity} />
      {notification && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-black/80 text-white text-sm px-4 py-2 rounded-lg border border-white/20">
          {notification}
        </div>
      )}
    </div>
  );
}
