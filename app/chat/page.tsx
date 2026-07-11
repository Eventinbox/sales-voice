"use client";
import { useState, useRef, useEffect } from "react";
import { mockMessages, currentUser } from "@/lib/mock-data";
import { Message } from "@/lib/types";
import { formatTime } from "@/lib/utils";
import ChatBubble from "@/components/ChatBubble";
import ActionBar from "@/components/ActionBar";

let localIdCounter = 0;

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [inputValue, setInputValue] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const vendorMessage: Message = {
      id: `local-${++localIdCounter}`,
      sender: 'vendor',
      text: trimmed,
      timestamp: formatTime(),
      type: 'text',
    };
    setMessages((prev) => [...prev, vendorMessage]);
    setInputValue("");

    // Simulated acknowledgment only — real sale/debt parsing happens
    // server-side via the Gemma function-calling layer, not here.
    setTimeout(() => {
      const assistantReply: Message = {
        id: `local-${++localIdCounter}`,
        sender: 'assistant',
        text: "Got it! I've noted that down for you.",
        timestamp: formatTime(),
        type: 'text',
      };
      setMessages((prev) => [...prev, assistantReply]);
    }, 700);
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="px-5 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-market flex items-center justify-center text-white font-bold">SV</div>
          <h1 className="text-headline-lg text-primary font-bold">Sales Voice</h1>
        </div>
        <img src={currentUser.avatar} className="w-10 h-10 rounded-full border-2 border-primary" alt="avatar" />
      </header>

      <div className="flex justify-center mb-6">
        <span className="px-4 py-1 bg-surface-container-high rounded-full text-xs font-bold text-on-surface-variant">
          Today, July 11
        </span>
      </div>

      <div className="px-5 flex-1 overflow-y-auto space-y-2 pb-40">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      <ActionBar
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSend}
        onRecordSale={() => setInputValue("Sold ")}
        onNewDebt={() => setInputValue("New debt: ")}
      />
    </div>
  );
}