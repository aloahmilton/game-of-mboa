import React, { useState, useEffect, useRef } from 'react';
import { ColyseusClient } from './game/network/ColyseusClient';
import { createGame } from './game/main';
import { HUD } from './components/HUD';

type Screen = 'menu' | 'game';

export default function App() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [username, setUsername] = useState('');
  const [startingClass, setStartingClass] = useState<'connecte' | 'debrouillard'>('debrouillard');
  const [status, setStatus] = useState('');
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

      setScreen('game');

      setTimeout(() => {
        if (gameRef.current) {
          gameRef.current.destroy(true);
        }
        gameRef.current = createGame('game-container', network);
      }, 50);
    } catch (err: any) {
      console.error(err);
      setStatus('Could not connect to server. Is it running?');
    }
  };

  useEffect(() => {
    return () => {
      gameRef.current?.destroy(true);
      networkRef.current?.leave();
    };
  }, []);

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
          />

          <label className="block text-sm mb-2 opacity-80">Starting path</label>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
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
      <HUD />
    </div>
  );
}
