"use client";

import { clsx } from "clsx";
import type { UIMessage } from "@ai-sdk/react";

interface MessageBubbleProps {
  message: UIMessage;
  characterName?: string;
}

export function MessageBubble({ message, characterName }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={clsx(
        "flex animate-fade-in",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={clsx(
          "max-w-[80%] px-4 py-3",
          isUser ? "message-user" : "message-assistant"
        )}
      >
        {!isUser && characterName && (
          <p className="text-xs font-medium text-[var(--primary)] mb-1">
            {characterName}
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
  );
}

interface TypingIndicatorProps {
  characterName?: string;
}

export function TypingIndicator({ characterName }: TypingIndicatorProps) {
  return (
    <div className="flex justify-start animate-fade-in">
      <div className="message-assistant px-4 py-3">
        {characterName && (
          <p className="text-xs font-medium text-[var(--primary)] mb-1">
            {characterName}
          </p>
        )}
        <div className="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}
