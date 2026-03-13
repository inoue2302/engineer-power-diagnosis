"use client";

import { useState, type FormEvent } from "react";

const MAX_LENGTH = 300;

type ChatInputProps = {
  onSend: (message: string) => void;
  disabled?: boolean;
};

export const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [input, setInput] = useState("");

  const isOverLimit = input.length > MAX_LENGTH;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || disabled || isOverLimit) return;
    onSend(trimmed);
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-1.5">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={MAX_LENGTH + 50}
          disabled={disabled}
          placeholder={disabled ? "応答を待っています..." : "回答を入力..."}
          className={`flex-1 rounded-lg border bg-[rgba(255,255,255,0.05)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[rgba(240,230,211,0.3)] focus:outline-none focus:shadow-[0_0_10px_rgba(255,107,0,0.15)] transition-all ${
            isOverLimit
              ? "border-red-500 focus:border-red-500"
              : "border-[rgba(255,107,0,0.2)] focus:border-[var(--energy-orange)]"
          }`}
        />
        <button
          type="submit"
          disabled={disabled || !input.trim() || isOverLimit}
          className="rounded-lg border border-[var(--energy-orange)] bg-[rgba(255,107,0,0.1)] px-5 py-3 text-sm font-bold text-[var(--energy-orange)] transition-all hover:bg-[rgba(255,107,0,0.2)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          送信
        </button>
      </div>
      {isOverLimit && (
        <div className="text-left text-xs text-red-500 font-gothic">
          ながすぎだ。{MAX_LENGTH}文字以内にしろ。
        </div>
      )}
      {input.length > 0 && (
        <div className={`text-right text-[10px] font-dot ${isOverLimit ? "text-red-500" : "text-[rgba(240,230,211,0.3)]"}`}>
          {input.length}/{MAX_LENGTH}
        </div>
      )}
    </form>
  );
};
