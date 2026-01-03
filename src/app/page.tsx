"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  characterTemplates,
  type CharacterTemplate,
} from "@/constants/character-templates";

export default function Home() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] =
    useState<CharacterTemplate | null>(null);
  const [customMode, setCustomMode] = useState(false);
  const [name, setName] = useState("");
  const [personality, setPersonality] = useState("");

  const handleTemplateSelect = (template: CharacterTemplate) => {
    setSelectedTemplate(template);
    setCustomMode(false);
    setName(template.name);
    setPersonality(template.personality);
  };

  const handleCustomMode = () => {
    setSelectedTemplate(null);
    setCustomMode(true);
    setName("");
    setPersonality("");
  };

  const handleStartChat = () => {
    if (!name.trim() || !personality.trim()) return;

    const character = {
      name: name.trim(),
      personality: personality.trim(),
    };

    sessionStorage.setItem("character", JSON.stringify(character));
    router.push("/chat");
  };

  const isValid = name.trim() && personality.trim();

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent mb-3">
            AI キャラクターチャット
          </h1>
          <p className="text-lg text-gray-600">
            オリジナルキャラクターを作成して会話を楽しもう！
          </p>
        </header>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            テンプレートから選ぶ
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {characterTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className={`card text-left cursor-pointer ${
                  selectedTemplate?.id === template.id && !customMode
                    ? "card-selected"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className="text-2xl w-10 h-10 flex items-center justify-center rounded-full"
                    style={{ backgroundColor: `${template.color}20` }}
                  >
                    {template.emoji}
                  </span>
                  <span
                    className="font-semibold"
                    style={{ color: template.color }}
                  >
                    {template.name}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {template.personality}
                </p>
              </button>
            ))}

            <button
              onClick={handleCustomMode}
              className={`card text-left cursor-pointer border-dashed ${
                customMode ? "card-selected" : ""
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl w-10 h-10 flex items-center justify-center rounded-full bg-gray-100">
                  ✏️
                </span>
                <span className="font-semibold text-gray-700">
                  カスタムで作成
                </span>
              </div>
              <p className="text-sm text-gray-600">
                自分だけのオリジナルキャラクターを作成しましょう
              </p>
            </button>
          </div>
        </section>

        <section className="card mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            キャラクター設定
          </h2>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                名前 <span className="text-[var(--error)]">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="キャラクターの名前を入力"
                className="input-field"
                maxLength={50}
              />
            </div>

            <div>
              <label
                htmlFor="personality"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                性格・口調 <span className="text-[var(--error)]">*</span>
              </label>
              <textarea
                id="personality"
                value={personality}
                onChange={(e) => setPersonality(e.target.value)}
                placeholder="キャラクターの性格や話し方を詳しく入力してください"
                className="input-field min-h-[120px] resize-y"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1 text-right">
                {personality.length}/500
              </p>
            </div>
          </div>
        </section>

        <div className="text-center">
          <button
            onClick={handleStartChat}
            disabled={!isValid}
            className="btn-primary text-lg px-8 py-3"
          >
            会話を始める
          </button>
          {!isValid && (
            <p className="text-sm text-gray-500 mt-2">
              名前と性格・口調を入力してください
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
