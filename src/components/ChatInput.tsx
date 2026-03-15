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
      <div className="relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={MAX_LENGTH + 50}
          disabled={disabled}
          rows={3}
          placeholder={disabled ? "応答を待っています..." : "回答を入力..."}
          className={`w-full rounded-lg border bg-[rgba(255,255,255,0.05)] px-4 py-3 pr-16 text-base text-[var(--foreground)] placeholder:text-[rgba(240,230,211,0.3)] focus:outline-none focus:shadow-[0_0_10px_rgba(255,107,0,0.15)] transition-all resize-none ${
            isOverLimit
              ? "border-red-500 focus:border-red-500"
              : "border-[rgba(255,107,0,0.2)] focus:border-[var(--energy-orange)]"
          }`}
        />
        <button
          type="submit"
          disabled={disabled || !input.trim() || isOverLimit}
          className="absolute right-2 top-2 rounded-lg border border-[var(--energy-orange)] bg-[rgba(255,107,0,0.15)] p-2 text-[var(--energy-orange)] transition-all hover:bg-[rgba(255,107,0,0.3)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          aria-label="送信"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
          </svg>
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
