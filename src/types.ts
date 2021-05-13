export interface Order {
  price: number;
  size: number;
}

export interface GroupedOrder extends Order {
  total: number;
}

export interface OrderSet {
  asks: Order[];
  bids: Order[];
}

export type GroupSize =
  | 0.5
  | 1
  | 2.5
  | 5
  | 10
  | 25
  | 50
  | 100
  | 250
  | 500
  | 1000
  | 2500;
