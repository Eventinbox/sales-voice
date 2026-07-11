export type User = {
  id: string;
  name: string;
  avatar: string;
};

export type MessageType = 'text' | 'confirmation';

export interface Message {
  id: string;
  sender: 'assistant' | 'vendor';
  text: string;
  timestamp: string;
  type: MessageType;
  confirmationAmount?: string;
}

export interface DebtEntry {
  id: string;
  personName: string;
  item: string;
  amount: number;
  date: string;
  type: 'customer' | 'supplier'; // customer = Who owes me, supplier = Who I owe
  status: 'PAID' | 'UNPAID';
  note?: string;
}

export interface PriceBenchmark {
  item: string;
  currentPrice: number;
  minMarketPrice: number;
  maxMarketPrice: number;
  trend: 'up' | 'down' | 'stable';
}

export interface ShopProfile {
  name: string;
  shopName: string;
  avatar: string;
}

export type Currency = 'NGN' | 'USD' | 'GHS';

export interface AppSettings {
  currency: Currency;
  notificationsEnabled: boolean;
  voiceInputEnabled: boolean;
}