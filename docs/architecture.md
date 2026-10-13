# Architecture - Game of Mboa

## Stack
- Client: React + Vite + Phaser 3 + Tailwind
- Server: Colyseus (authoritative)
- Shared: TypeScript types and constants
- Ads: MockProvider then AdMob
- Web: Landing page

## Principles
1. Authoritative server
2. Browser-first (phones)
3. Free stack
4. Modular and open
5. Cultural authenticity

## Data flow (movement)
1. Client sends input
2. Server validates and updates PlayerSchema
3. Server broadcasts state
4. Clients interpolate
