import { Message, DebtEntry, PriceBenchmark, ShopProfile, AppSettings } from './types';

export const currentUser: ShopProfile = {
  name: "Mama Tolu",
  shopName: "Mama Tolu Provisions",
  avatar: "https://i.pravatar.cc/150?u=mama-tolu",
  phone: "+234 803 123 4567",
};

export const mockSettings: AppSettings = {
  currency: 'NGN',
  notificationsEnabled: true,
  voiceInputEnabled: true,
};

export const mockMessages: Message[] = [
  {
    id: '1',
    sender: 'assistant',
    text: "Good morning Mama Tolu! How can I help you log your sales today?",
    timestamp: '08:00 AM',
    type: 'text',
  },
  {
    id: '2',
    sender: 'vendor',
    text: "I just sold 2 mudu of garri to Bisi for 4,000 Naira",
    timestamp: '08:15 AM',
    type: 'text',
  },
  {
    id: '3',
    sender: 'assistant',
    text: "Got it. I've recorded a sale of ₦4,000 for 2 mudu of garri.",
    timestamp: '08:15 AM',
    type: 'confirmation',
    confirmationAmount: '4,000',
  },
  {
    id: '4',
    sender: 'vendor',
    text: "Iya Risi took a bag of rice on credit. Total is 45,000 Naira",
    timestamp: '09:30 AM',
    type: 'text',
  },
  {
    id: '5',
    sender: 'assistant',
    text: "Recorded. ₦45,000 added to Iya Risi's debt account.",
    timestamp: '09:31 AM',
    type: 'confirmation',
    confirmationAmount: '45,000',
  },
];

export const mockDebts: DebtEntry[] = [
  { id: 'd1', personName: 'Bisi', item: 'Garri (2 mudu)', amount: 2500, date: '2026-07-10 10:15 AM', type: 'customer', status: 'UNPAID', note: "Promised to pay on Friday" },
  { id: 'd2', personName: 'Iya Risi', item: 'Rice (1 bag)', amount: 45000, date: '2026-07-11 09:30 AM', type: 'customer', status: 'UNPAID' },
  { id: 's1', personName: 'Mallam Abu', item: 'Bulk Rice Supply', amount: 120000, date: '2026-06-28 04:00 PM', type: 'supplier', status: 'UNPAID', note: "Due by end of month" },
];

export const mockPrices: PriceBenchmark[] = [
  { item: 'White Garri (Mudu)', currentPrice: 2200, minMarketPrice: 2000, maxMarketPrice: 2500, trend: 'stable' },
  { item: 'Rice (1 bag)', currentPrice: 45000, minMarketPrice: 42000, maxMarketPrice: 48000, trend: 'up' },
  { item: 'Beans (Paint Bucket)', currentPrice: 3500, minMarketPrice: 3200, maxMarketPrice: 4000, trend: 'down' },
  { item: 'Groundnut Oil (Bottle)', currentPrice: 1800, minMarketPrice: 1600, maxMarketPrice: 2000, trend: 'stable' },
];