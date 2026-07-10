import { Message } from "./types";

export const mockMessages: Message[] = [
  {
    id: "1",
    text: "sold 2 bags of rice for 15k",
    sender: "user",
    type: "text",
  },
  {
    id: "2",
    text: "Got it — logged that sale for you.",
    sender: "bot",
    type: "sale",
    data: { item: "Rice", qty: 2, amount: 15000 },
  },
  {
    id: "3",
    text: "Musa still owes me 3k from last week",
    sender: "user",
    type: "text",
  },
  {
    id: "4",
    text: "Noted. Added to your outstanding debts.",
    sender: "bot",
    type: "debt",
    data: { person: "Musa", amount: 3000, type: "owed" },
  },
  {
    id: "5",
    text: "what's rice going for around here?",
    sender: "user",
    type: "text",
  },
  {
    id: "6",
    text: "Here's what nearby shops are charging for rice:",
    sender: "bot",
    type: "price",
    data: { item: "Rice", min: 7000, max: 8000, avg: 7500 },
  },
];
