"use client";

import { clsx } from "clsx";
import type { CharacterTemplate } from "@/constants/character-templates";

interface TemplateCardProps {
  template: CharacterTemplate;
  selected: boolean;
  onClick: () => void;
}

export function TemplateCard({ template, selected, onClick }: TemplateCardProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "card text-left cursor-pointer",
        selected && "card-selected"
      )}
    >
      <div className="flex items-center gap-3 mb-2">
        <span
          className="text-2xl w-10 h-10 flex items-center justify-center rounded-full"
          style={{ backgroundColor: `${template.color}20` }}
        >
          {template.emoji}
        </span>
        <span className="font-semibold" style={{ color: template.color }}>
          {template.name}
        </span>
      </div>
      <p className="text-sm text-gray-600 line-clamp-3">{template.personality}</p>
    </button>
  );
}

interface CustomTemplateCardProps {
  selected: boolean;
  onClick: () => void;
}

export function CustomTemplateCard({ selected, onClick }: CustomTemplateCardProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "card text-left cursor-pointer border-dashed",
        selected && "card-selected"
      )}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl w-10 h-10 flex items-center justify-center rounded-full bg-gray-100">
          ✏️
        </span>
        <span className="font-semibold text-gray-700">カスタムで作成</span>
      </div>
      <p className="text-sm text-gray-600">
        自分だけのオリジナルキャラクターを作成しましょう
      </p>
    </button>
  );
}
