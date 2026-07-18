"use client";
import { useState, useRef, useEffect } from "react";
import { Message } from "@/lib/types";
import { fetchMessages, sendMessage } from "@/lib/api";
import ChatBubble from "@/components/ChatBubble";
import ActionBar from "@/components/ActionBar";
import AvatarBadge from "@/components/AvatarBadge";
import { useProfile } from "@/lib/profile";

export default function ChatPage() {
  const { profile } = useProfile();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages()
      .then(setMessages)
      .catch(() => setError("Couldn't reach the backend. Is it running on localhost:4000?"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    const trimmed = inputValue.trim();
    if (!trimmed || sending) return;

    setInputValue("");
    setSending(true);
    try {
      const { vendorMessage, assistantMessage, updatedPriceBenchmark } = await sendMessage(trimmed);
      setMessages((prev) => [...prev, vendorMessage, assistantMessage]);
      if (updatedPriceBenchmark) {
        window.dispatchEvent(new Event("sales-voice:prices-updated"));
      }
    } catch {
      setError("Message didn't send — check the backend is running.");
      setInputValue(trimmed);
    } finally {
      setSending(false);
    }
  }

  const todayDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col h-screen">
      <header className="px-5 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-market flex items-center justify-center text-white font-bold">
            SV
          </div>
          <h1 className="text-headline-lg text-primary font-bold">Sales Voice</h1>
        </div>
        {profile && (
          <AvatarBadge
            name={profile.name}
            avatar={profile.avatar}
            className="w-10 h-10 rounded-full border-2 border-primary bg-surface-container"
          />
        )}
      </header>

      <div className="flex justify-center mb-6">
        <span className="px-4 py-1 bg-surface-container-high rounded-full text-xs font-bold text-on-surface-variant">
          {todayDate}
        </span>
      </div>

      <div className="px-5 flex-1 overflow-y-auto space-y-2 pb-40">
        {loading && (
          <p className="text-center text-on-surface-variant text-body-md">Loading conversation...</p>
        )}
        {error && <p className="text-center text-error text-body-md">{error}</p>}
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
