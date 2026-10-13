import { Schema, type } from '@colyseus/schema';

export class PlayerSchema extends Schema {
  @type('string') id: string = '';
  @type('string') username: string = '';
  @type('string') startingClass: string = 'debrouillard';

  @type('string') skinTone: string = 'medium';
  @type('string') hairStyle: string = 'fade';
  @type('string') hairColor: string = 'black';
  @type('string') face: string = 'default';
  @type('string') top: string = 'simple-shirt';
  @type('string') bottom: string = 'jeans';
  @type('string') shoes: string = 'sneakers';

  @type('number') x: number = 400;
  @type('number') y: number = 300;
  @type('string') districtId: string = 'akwa';
  @type('string') direction: string = 'down';

  @type('boolean') isMoving: boolean = false;
  @type('boolean') isRunning: boolean = false;
  @type('string') currentActivity: string = '';

  @type('number') hunger: number = 80;
  @type('number') energy: number = 90;
  @type('number') fun: number = 70;
  @type('number') social: number = 60;
  @type('number') hygiene: number = 85;

  @type('number') money: number = 3500;
}
