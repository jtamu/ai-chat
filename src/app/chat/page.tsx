"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport } from "ai";

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

  const { messages, status, sendMessage } = useChat({
    transport: new TextStreamChatTransport({
      api: "/api/chat",
      body: character ? { character } : undefined,
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
      turnCount >= MAX_TURNS
    )
      return;
    sendMessage({ text: input });
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
      <header className="bg-white/80 backdrop-blur-sm border-b border-[var(--card-border)] px-4 py-3 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white font-bold">
              {character.name.charAt(0)}
            </div>
            <div>
              <h1 className="font-semibold text-gray-800">{character.name}</h1>
              <p className="text-xs text-gray-500">
                {turnCount}/{MAX_TURNS} 往復
              </p>
            </div>
          </div>
          <button
            onClick={handleNewChat}
            className="text-sm text-[var(--primary)] hover:text-[var(--primary-dark)] font-medium"
          >
            新しいキャラクター
          </button>
        </div>
      </header>

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
            <div
              key={message.id}
              className={`flex animate-fade-in ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 ${
                  message.role === "user" ? "message-user" : "message-assistant"
                }`}
              >
                {message.role === "assistant" && (
                  <p className="text-xs font-medium text-[var(--primary)] mb-1">
                    {character.name}
                  </p>
                )}
                <div className="whitespace-pre-wrap">
                  {message.parts.map((part, i) => {
                    if (part.type === "text") {
                      return <span key={`${message.id}-${i}`}>{part.text}</span>;
                    }
                    return null;
                  })}
                </div>
              </div>
            </div>
          ))}

          {isLoading && messages.at(-1)?.role !== "assistant" && (
            <div className="flex justify-start animate-fade-in">
              <div className="message-assistant px-4 py-3">
                <p className="text-xs font-medium text-[var(--primary)] mb-1">
                  {character.name}
                </p>
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="bg-white/80 backdrop-blur-sm border-t border-[var(--card-border)] px-4 py-4 sticky bottom-0">
        <div className="max-w-2xl mx-auto">
          {isLimitReached ? (
            <div className="text-center">
              <p className="text-gray-600 mb-3">
                会話の制限（{MAX_TURNS}往復）に達しました
              </p>
              <button onClick={handleNewChat} className="btn-primary">
                新しい会話を始める
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="メッセージを入力..."
                className="input-field flex-1"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="btn-primary px-6"
              >
                送信
              </button>
            </form>
          )}
        </div>
      </footer>
    </div>
  );
}
