"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { MessageBubble, TypingIndicator } from "@/components/chat/MessageBubble";
import { ChatInput, LimitReached } from "@/components/chat/ChatInput";
import { ErrorMessage } from "@/components/chat/ErrorMessage";

interface Character {
  name: string;
  personality: string;
}

const MAX_TURNS = 20;

export default function ChatPage() {
  const router = useRouter();
  const [character, setCharacter] = useState<Character | null>(null);
  const [input, setInput] = useState("");
  const [turnCount, setTurnCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, status, error, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  useEffect(() => {
    const stored = sessionStorage.getItem("character");
    if (stored) {
      setCharacter(JSON.parse(stored));
    } else {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const userMessages = messages.filter((m) => m.role === "user");
    setTurnCount(userMessages.length);
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !input.trim() ||
      status === "streaming" ||
      status === "submitted" ||
      turnCount >= MAX_TURNS ||
      !character
    )
      return;
    sendMessage(
      { text: input },
      {
        body: { character },
      }
    );
    setInput("");
  };

  const handleNewChat = () => {
    sessionStorage.removeItem("character");
    router.push("/");
  };

  const isLimitReached = turnCount >= MAX_TURNS;
  const isLoading = status === "streaming" || status === "submitted";

  if (!character) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ChatHeader
        characterName={character.name}
        turnCount={turnCount}
        maxTurns={MAX_TURNS}
        onNewChat={handleNewChat}
      />

      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-2">
                {character.name}との会話を始めましょう！
              </p>
              <p className="text-sm">下のフォームからメッセージを送信してね</p>
            </div>
          )}

          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              characterName={character.name}
            />
          ))}

          {isLoading && messages.at(-1)?.role !== "assistant" && (
            <TypingIndicator characterName={character.name} />
          )}

          {error && <ErrorMessage error={error} />}

          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="bg-white/80 backdrop-blur-sm border-t border-[var(--card-border)] px-4 py-4 sticky bottom-0">
        <div className="max-w-2xl mx-auto">
          {isLimitReached ? (
            <LimitReached maxTurns={MAX_TURNS} onNewChat={handleNewChat} />
          ) : (
            <ChatInput
              value={input}
              onChange={setInput}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          )}
        </div>
      </footer>
    </div>
  );
}
