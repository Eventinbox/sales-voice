"use client";
import { Message } from "@/lib/types";
import StatusPill from "./StatusPill";

interface ChatBubbleProps {
  message: Message;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isVendor = message.sender === 'vendor';

  return (
    <div className={`flex ${isVendor ? 'justify-end' : 'justify-start'} mb-4 gap-2`}>
      {!isVendor && (
        <div className="w-8 h-8 rounded-full bg-primary shrink-0" />
      )}
      <div className="max-w-[80%]">
        <div className={`p-4 ${
          isVendor
            ? 'bg-primary text-on-primary rounded-2xl rounded-br-[2px]'
            : 'bg-surface-container-lowest text-on-surface border border-surface-container-high rounded-2xl rounded-bl-[2px]'
        }`}>
          <p className="text-body-md leading-relaxed">
            {message.text.split('₦').map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && <span className="font-extrabold">₦</span>}
              </span>
            ))}
          </p>
        </div>
        {message.type === 'confirmation' && (
          <div className="mt-2 flex justify-start">
            <StatusPill
              label={`✓ Sale Logged: ₦${message.confirmationAmount}`}
              variant="outline"
              color="primary"
            />
          </div>
        )}
        <p className={`text-[10px] text-on-surface-variant mt-1 ${isVendor ? 'text-right' : 'text-left'}`}>
          {message.timestamp}
        </p>
      </div>
    </div>
  );
}