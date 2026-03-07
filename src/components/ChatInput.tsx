"use client";

import { useState, type FormEvent } from "react";

type ChatInputProps = {
  onSend: (message: string) => void;
  disabled?: boolean;
};

export const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={disabled}
        placeholder={disabled ? "応答を待っています..." : "回答を入力..."}
        className="flex-1 rounded-lg border border-[rgba(255,107,0,0.2)] bg-[rgba(255,255,255,0.05)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[rgba(240,230,211,0.3)] focus:outline-none focus:border-[var(--energy-orange)] focus:shadow-[0_0_10px_rgba(255,107,0,0.15)] transition-all"
      />
      <button
        type="submit"
        disabled={disabled || !input.trim()}
        className="rounded-lg border border-[var(--energy-orange)] bg-[rgba(255,107,0,0.1)] px-5 py-3 text-sm font-bold text-[var(--energy-orange)] transition-all hover:bg-[rgba(255,107,0,0.2)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
      >
        送信
      </button>
    </form>
  );
};
