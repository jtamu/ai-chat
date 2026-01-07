"use client";

import { Button } from "@/components/ui/Button";

interface ChatHeaderProps {
  characterName: string;
  turnCount: number;
  maxTurns: number;
  onNewChat: () => void;
}

export function ChatHeader({
  characterName,
  turnCount,
  maxTurns,
  onNewChat,
}: ChatHeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-[var(--card-border)] px-4 py-3 sticky top-0 z-10">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white font-bold">
            {characterName.charAt(0)}
          </div>
          <div>
            <h1 className="font-semibold text-gray-800">{characterName}</h1>
            <p className="text-xs text-gray-500">
              {turnCount}/{maxTurns} 往復
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onNewChat}>
          <span className="hidden sm:inline">新しいキャラクター</span>
          <span className="sm:hidden">戻る</span>
        </Button>
      </div>
    </header>
  );
}
