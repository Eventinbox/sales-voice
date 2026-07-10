export type Sender = "user" | "bot";
export type MessageType = "text" | "sale" | "debt" | "price";

export interface SaleData {
  item: string;
  qty: number;
  amount: number;
}

export interface DebtData {
  person: string;
  amount: number;
  type: "owed" | "owes"; // owed = customer owes vendor, owes = vendor owes supplier
}

export interface PriceData {
  item: string;
  min: number;
  max: number;
  avg: number;
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  type: MessageType;
  data?: SaleData | DebtData | PriceData;
}
