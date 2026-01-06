"use client";

import { FormEvent } from "react";
import { Button } from "@/components/ui/Button";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled,
  isLoading,
}: ChatInputProps) {
  return (
    <form onSubmit={onSubmit} className="flex gap-3">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="メッセージを入力..."
        className="input-field flex-1"
        disabled={disabled || isLoading}
      />
      <Button
        type="submit"
        disabled={!value.trim() || isLoading}
        size="md"
        className="px-6"
      >
        送信
      </Button>
    </form>
  );
}

interface LimitReachedProps {
  maxTurns: number;
  onNewChat: () => void;
}

export function LimitReached({ maxTurns, onNewChat }: LimitReachedProps) {
  return (
    <div className="text-center">
      <p className="text-gray-600 mb-3">
        会話の制限（{maxTurns}往復）に達しました
      </p>
      <Button onClick={onNewChat}>新しい会話を始める</Button>
    </div>
  );
}
