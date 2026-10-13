export type ItemCategory =
  | 'clothing'
  | 'food'
  | 'tool'
  | 'status'
  | 'consumable'
  | 'misc';

export interface Item {
  id: string;
  name: string;
  nameFr: string;
  category: ItemCategory;
  description: string;
  price: number;
  stackable: boolean;
  maxStack?: number;
  slot?: 'top' | 'bottom' | 'shoes' | 'accessory' | 'head';
  appearanceId?: string;
}

export interface InventorySlot {
  itemId: string;
  quantity: number;
}

export interface Inventory {
  slots: InventorySlot[];
  maxSlots: number;
}
