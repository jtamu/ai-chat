"use client";

import { FormEvent, useRef, useState, DragEvent } from "react";
import { Button } from "@/components/ui/Button";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  disabled?: boolean;
  isLoading?: boolean;
  onImageSelect?: (file: File | null) => void;
  selectedImage?: File | null;
}

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

export function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled,
  isLoading,
  onImageSelect,
  selectedImage,
}: ChatInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileSelect = (file: File | null) => {
    if (!file) {
      setImagePreview(null);
      onImageSelect?.(null);
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      alert("対応している画像形式: JPEG, PNG, GIF, WebP");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      alert("画像サイズは10MB以下にしてください");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    onImageSelect?.(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileSelect(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    onImageSelect?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && ALLOWED_IMAGE_TYPES.includes(file.type)) {
      handleFileSelect(file);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`transition-all ${isDragging ? "opacity-70 scale-[0.99]" : ""}`}
    >
      {imagePreview && (
        <div className="mb-3 relative inline-block">
          <img
            src={imagePreview}
            alt="プレビュー"
            className="max-w-[200px] max-h-[200px] rounded-lg border-2 border-[var(--card-border)]"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
            aria-label="画像を削除"
          >
            ×
          </button>
        </div>
      )}

      <form onSubmit={onSubmit} className="flex gap-3">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept={ALLOWED_IMAGE_TYPES.join(",")}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isLoading || !!selectedImage}
          className="px-3 py-2 rounded-lg border-2 border-[var(--card-border)] bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="画像を添付"
        >
          📎
        </button>
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
          disabled={(!value.trim() && !selectedImage) || isLoading}
          size="md"
          className="px-6"
        >
          送信
        </Button>
      </form>
    </div>
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
