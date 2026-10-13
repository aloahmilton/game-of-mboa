import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/40 via-[#0D1B2A] to-[#0D1B2A]" />
        <div className="relative max-w-5xl mx-auto px-6 pt-16 pb-24 text-center">
          <p className="text-yellow-400 font-medium tracking-wide text-sm mb-4">CAMEROON • OPEN SOURCE • FREE</p>
          <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight mb-6">
            Game of Mboa
          </h1>
          <p className="text-xl sm:text-2xl text-white/80 max-w-2xl mx-auto mb-4">
            Live your Cameroon story.
          </p>
          <p className="text-white/60 max-w-xl mx-auto mb-10">
            A free multiplayer life-sim set in virtual Douala. Work, hustle, go to the maquis,
            dance in Akwa, build status — with real Cameroonian flavour.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#play"
              className="inline-block px-8 py-4 rounded-xl bg-yellow-400 text-black font-bold text-lg hover:bg-yellow-300 transition"
            >
              Play now (coming soon)
            </a>
            <a
              href="https://github.com/aloahmilton/game-of-mboa"
              target="_blank"
              rel="noreferrer"
              className="inline-block px-8 py-4 rounded-xl border border-white/30 font-semibold hover:bg-white/10 transition"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center mb-12">Built for Mboa</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'Douala districts', desc: 'Akwa, Bonanjo, New Bell, Bépanda… real vibes, real places.' },
            { title: 'Hustle & status', desc: 'Taxi-moto, market, office, content creator. Climb from débrouillard to connecté.' },
            { title: 'Maquis & dance', desc: 'Poisson braisé, Castel, Makossa. Social is the real game.' },
            { title: 'Phone + Manette', desc: 'Touch joystick, keyboard, or gamepad. Play how you want.' },
            { title: '100% free stack', desc: 'Open source. No paywall. Built so other Cameroonian devs can contribute.' },
            { title: 'Camfranglais ready', desc: 'The language and humour of the streets, not a generic African template.' },
          ].map((f) => (
            <div key={f.title} className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="font-semibold text-lg mb-2 text-yellow-400">{f.title}</h3>
              <p className="text-white/70 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Classes */}
      <section className="bg-white/5 border-y border-white/10 py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-8">Choose your path</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-orange-500/40 bg-orange-500/10 p-6">
              <h3 className="text-xl font-bold text-orange-400 mb-2">Débrouillard</h3>
              <p className="text-white/70 text-sm">Start with almost nothing. Hustle harder. Earn every CFA.</p>
            </div>
            <div className="rounded-2xl border border-blue-500/40 bg-blue-500/10 p-6">
              <h3 className="text-xl font-bold text-blue-400 mb-2">Connecté</h3>
              <p className="text-white/70 text-sm">Born with advantages. More money, better start. Stay on top.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="play" className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">First playable version is being built</h2>
        <p className="text-white/60 mb-8">
          Server + client are ready. We are deploying the foundation now.
          Star the repo and follow progress.
        </p>
        <a
          href="https://github.com/aloahmilton/game-of-mboa"
          target="_blank"
          rel="noreferrer"
          className="inline-block px-8 py-4 rounded-xl bg-green-600 font-bold hover:bg-green-500 transition"
        >
          Star on GitHub →
        </a>
      </section>

      <footer className="border-t border-white/10 py-8 text-center text-white/40 text-sm">
        <p>Game of Mboa · Made with ❤️ for Cameroon · MIT License</p>
        <p className="mt-2">Mboa = Home. This is our digital home.</p>
      </footer>
    </div>
  );
}
