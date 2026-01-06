"use client";

import { Card } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Input";

interface CharacterFormProps {
  name: string;
  personality: string;
  onNameChange: (value: string) => void;
  onPersonalityChange: (value: string) => void;
}

export function CharacterForm({
  name,
  personality,
  onNameChange,
  onPersonalityChange,
}: CharacterFormProps) {
  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        キャラクター設定
      </h2>

      <div className="space-y-4">
        <Input
          id="name"
          label="名前"
          required
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="キャラクターの名前を入力"
          maxLength={50}
        />

        <Textarea
          id="personality"
          label="性格・口調"
          required
          value={personality}
          onChange={(e) => onPersonalityChange(e.target.value)}
          placeholder="キャラクターの性格や話し方を詳しく入力してください"
          maxLength={500}
          showCount
        />
      </div>
    </Card>
  );
}
