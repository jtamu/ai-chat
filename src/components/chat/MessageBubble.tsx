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
            if (part.type === "image" && part.image) {
              const imageUrl =
                typeof part.image === "string" && part.image.startsWith("data:")
                  ? part.image
                  : `data:image/jpeg;base64,${part.image}`;
              return (
                <img
                  key={`${message.id}-${i}`}
                  src={imageUrl}
                  alt="添付画像"
                  className="max-w-full rounded-lg mt-2 border border-[var(--card-border)]"
                />
              );
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
