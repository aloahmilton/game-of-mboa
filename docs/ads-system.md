# Ads System - Game of Mboa

Prefer rewarded ads. Never interrupt walking or chatting.

## Placements
- extra_energy, double_pay, daily_bonus, after_shift, low_energy

## Usage
```ts
import { adManager } from '@mboa/ads';
const result = await adManager.show({
  type: 'rewarded',
  placement: 'extra_energy',
  playerId: myId,
});
```

Start with MockProvider (free). Swap to AdMob later.
