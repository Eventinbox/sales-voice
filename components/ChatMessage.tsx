import { Message } from "../app/types";
import ActionCard from "./ActionCard";

export default function ChatMessage({ message }: { message: Message }) {
  const isUser = message.sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] ${isUser ? "items-end" : "items-start"} flex flex-col`}
      >
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
            isUser
              ? "rounded-br-sm bg-orange-700 text-white"
              : "rounded-bl-sm bg-stone-200 text-stone-800"
          }`}
        >
          {message.text}
        </div>
        {!isUser && message.data && (
          <div className="w-full">
            <ActionCard type={message.type} data={message.data} />
          </div>
        )}
      </div>
    </div>
  );
}
