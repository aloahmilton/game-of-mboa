# Game of Mboa 🇨🇲

**Live your Cameroon story.**

Game of Mboa is a free, multiplayer, browser-based life simulation game set in a virtual Cameroon (starting with Douala). Players create characters, work, socialize, eat, party, and build status in a culturally authentic virtual world.

Inspired by the viral success of games like Lagos Life, but built from the ground up for Cameroonian culture, humour, language (Camfranglais), districts, food, and daily life.

## Vision

- Hyper-local Cameroonian experience (Douala first → Yaoundé → other cities)
- Free to play, free to build on
- Open platform so other Cameroonian developers can add jobs, places, events, and mini-games
- Full support for mobile, keyboard, and gamepad (manette)
- Privacy-friendly (anonymous or custom characters)
- Completely free & open-source stack

## Current Status

**Phase 1 – Foundation** (in progress)

- [x] Project structure & documentation
- [x] Shared types
- [x] Colyseus multiplayer server
- [x] Phaser client with basic movement
- [x] Input system (Touch + Keyboard + Gamepad)
- [x] Ads system (MockProvider ready)
- [ ] Character visuals polish
- [ ] First playable loop online

## Tech Stack (All Free / Open Source)

| Layer              | Technology                          |
|--------------------|-------------------------------------|
| Monorepo           | pnpm + Turborepo                    |
| Language           | TypeScript                          |
| Client             | React + Vite + Phaser 3 + Tailwind  |
| Multiplayer        | Colyseus                            |
| Database           | PostgreSQL (Supabase free tier)     |
| Auth               | Supabase Auth                       |
| Map                | MapLibre GL JS + OpenStreetMap      |
| Avatars            | DiceBear + Universal LPC            |
| Analytics          | PostHog (self-host or free tier)    |
| Ads                | MockProvider → AdMob / AppLovin later |
| Hosting            | Vercel + Railway / Render / Fly.io  |

## Project Structure

```
game-of-mboa/
├── apps/
│   ├── client/          # React + Phaser game
│   ├── server/          # Colyseus multiplayer server
│   └── web/             # Landing page (future)
├── packages/
│   ├── shared/          # Shared types & constants
│   ├── ads/             # Ad system (Mock + future providers)
│   ├── character/       # Character creation system
│   └── config/          # Shared configs
├── docs/                # Architecture documentation
└── README.md
```

## Quick Start

```bash
pnpm install

# Terminal 1 – Server
cd apps/server && pnpm dev

# Terminal 2 – Client
cd apps/client && pnpm dev
```

Open http://localhost:5173

## Documentation

- [Architecture Overview](docs/architecture.md)
- [Character System](docs/character-system.md)
- [Districts & Map](docs/districts.md)
- [Input & Controls](docs/input-system.md)
- [Needs & Activities](docs/needs-and-activities.md)
- [Ads System](docs/ads-system.md)
- [Design Skills](docs/design-skills.md)
- [Roadmap](docs/roadmap.md)

## License

MIT

## Made with ❤️ for Cameroon

Mboa = Home.  
This is our digital home.
