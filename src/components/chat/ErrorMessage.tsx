"use client";

import { Button } from "@/components/ui/Button";

interface ErrorMessageProps {
  error: Error;
  onRetry?: () => void;
}

export function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  const isNetworkError =
    error.message.includes("fetch") ||
    error.message.includes("network") ||
    error.message.includes("Network");

  return (
    <div className="flex justify-center animate-fade-in">
      <div className="bg-red-50 border-2 border-[var(--error)] rounded-xl px-4 py-3 max-w-[80%]">
        <p className="text-sm font-medium text-[var(--error)] mb-1">
          エラーが発生しました
        </p>
        <p className="text-sm text-gray-600 mb-3">
          {isNetworkError
            ? "ネットワーク接続を確認してください"
            : "メッセージの送信に失敗しました。もう一度お試しください"}
        </p>
        {onRetry && (
          <Button variant="secondary" size="sm" onClick={onRetry}>
            再試行
          </Button>
        )}
      </div>
    </div>
  );
}
