import { Schema, type, MapSchema } from '@colyseus/schema';
import { PlayerSchema } from './PlayerSchema';

export class WorldState extends Schema {
  @type({ map: PlayerSchema })
  players = new MapSchema<PlayerSchema>();

  @type('string')
  districtId: string = 'akwa';

  @type('number')
  serverTime: number = Date.now();
}
