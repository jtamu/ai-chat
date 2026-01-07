"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  characterTemplates,
  type CharacterTemplate,
} from "@/constants/character-templates";
import { Button } from "@/components/ui/Button";
import {
  TemplateCard,
  CustomTemplateCard,
} from "@/components/character/TemplateCard";
import { CharacterForm } from "@/components/character/CharacterForm";

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
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent mb-3">
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
              <TemplateCard
                key={template.id}
                template={template}
                selected={selectedTemplate?.id === template.id && !customMode}
                onClick={() => handleTemplateSelect(template)}
              />
            ))}

            <CustomTemplateCard
              selected={customMode}
              onClick={handleCustomMode}
            />
          </div>
        </section>

        <section className="mb-8">
          <CharacterForm
            name={name}
            personality={personality}
            onNameChange={setName}
            onPersonalityChange={setPersonality}
          />
        </section>

        <div className="text-center">
          <Button
            onClick={handleStartChat}
            disabled={!isValid}
            size="lg"
          >
            会話を始める
          </Button>
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
