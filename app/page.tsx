"use client";

import { useState, useRef, useEffect } from "react";
import { Message } from "./types";
import { mockMessages } from "./mockData";
import ChatMessage from "../components/ChatMessage";
import Dashboard from "../components/Dashboard";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [input, setInput] = useState("");
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const threadEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    if (!input.trim()) return;
    const newMessage: Message = {
      id: crypto.randomUUID(),
      text: input.trim(),
      sender: "user",
      type: "text",
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  }

  return (
    <div className="flex h-dvh flex-col bg-stone-50">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-stone-200 bg-stone-50/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-stone-800">Sales Voice</h1>
            <p className="text-xs text-stone-500">
              Talk. We'll handle the books.
            </p>
          </div>
          <button
            onClick={() => setDashboardOpen(true)}
            className="rounded-lg bg-orange-700 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-800"
          >
            Dashboard
          </button>
        </div>
      </header>

      {/* Chat thread */}
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={threadEndRef} />
      </main>

      {/* Input bar */}
      <div className="sticky bottom-0 border-t border-stone-200 bg-stone-50 px-4 py-3">
        <div className="mx-auto flex max-w-2xl items-center gap-2">
          <button
            aria-label="Voice input"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-stone-200 text-stone-600 hover:bg-stone-300"
          >
            🎤
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Tell me what happened..."
            className="min-w-0 flex-1 rounded-full border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-200"
          />
          <button
            onClick={handleSend}
            aria-label="Send message"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-700 text-white hover:bg-orange-800"
          >
            ➤
          </button>
        </div>
      </div>

      <Dashboard
        open={dashboardOpen}
        onClose={() => setDashboardOpen(false)}
        messages={messages}
      />
    </div>
  );
}
