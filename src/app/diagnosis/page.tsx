"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { sendMessage } from "@/app/actions/chat";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import type { Message, DiagnosisPhase } from "@/types/diagnosis";

function generateId() {
  return crypto.randomUUID();
}

export default function DiagnosisPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [phase, setPhase] = useState<DiagnosisPhase>("idle");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  // オープニングメッセージ取得
  useEffect(() => {
    async function init() {
      setPhase("chatting");
      setIsLoading(true);

      const result = await sendMessage([
        { role: "user", content: "診断を開始してください" },
      ]);

      if (result.success) {
        setMessages([
          {
            id: generateId(),
            role: "assistant",
            content: result.message,
          },
        ]);
      } else {
        setMessages([
          {
            id: generateId(),
            role: "assistant",
            content: result.error,
          },
        ]);
      }
      setIsLoading(false);
    }
    init();
  }, []);

  const handleSend = async (content: string) => {
    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    // API用のメッセージ（オープニングの"診断を開始してください"を含める）
    const apiMessages = [
      { role: "user" as const, content: "診断を開始してください" },
      ...updatedMessages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    const result = await sendMessage(apiMessages);

    if (result.success) {
      const assistantMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: result.message,
      };
      setMessages([...updatedMessages, assistantMessage]);

      // 診断結果のJSONが含まれていたら結果フェーズへ
      if (result.message.includes('"powerLevel"')) {
        setPhase("result");
      }
    } else {
      setMessages([
        ...updatedMessages,
        {
          id: generateId(),
          role: "assistant",
          content: result.error,
        },
      ]);
    }

    setIsLoading(false);
  };

  // 進捗表示: assistantメッセージから (N/10) を検出
  const progressMatch = [...messages]
    .reverse()
    .find((m) => m.role === "assistant")
    ?.content.match(/[（(](\d+)\/10[）)]/);
  const currentQuestion = progressMatch ? parseInt(progressMatch[1], 10) : null;

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-[rgba(255,107,0,0.15)] bg-[rgba(5,5,5,0.9)] backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">👑</span>
            <span className="font-gothic text-sm energy-text">
              戦闘力診断
            </span>
          </div>
          {currentQuestion !== null && phase === "chatting" && (
            <div className="flex items-center gap-2">
              <div className="font-dot text-xs scouter-text">
                {currentQuestion}/10
              </div>
              <div className="w-20 h-1.5 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[var(--energy-orange)] to-[var(--energy-gold)] rounded-full transition-all duration-500"
                  style={{ width: `${(currentQuestion / 10) * 100}%` }}
                />
              </div>
            </div>
          )}
          {phase === "result" && (
            <div className="font-dot text-xs scouter-text animate-scouter-blink">
              COMPLETE
            </div>
          )}
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
          ))}
          {isLoading && (
            <ChatMessage role="assistant" content="" isLoading />
          )}
          <div ref={bottomRef} />
        </div>
      </main>

      {/* Input */}
      <footer className="sticky bottom-0 border-t border-[rgba(255,107,0,0.15)] bg-[rgba(5,5,5,0.9)] backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-4 py-3">
          {phase === "result" ? (
            <div className="flex gap-2">
              <a
                href="/"
                className="flex-1 text-center rounded-lg border border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.05)] px-4 py-3 text-sm text-[var(--foreground)] transition-all hover:bg-[rgba(255,255,255,0.1)]"
              >
                トップに戻る
              </a>
              <a
                href="/diagnosis"
                className="flex-1 text-center rounded-lg border border-[var(--energy-orange)] bg-[rgba(255,107,0,0.1)] px-4 py-3 text-sm font-bold text-[var(--energy-orange)] transition-all hover:bg-[rgba(255,107,0,0.2)]"
              >
                もう一度診断する
              </a>
            </div>
          ) : (
            <ChatInput onSend={handleSend} disabled={isLoading || phase === "idle"} />
          )}
        </div>
      </footer>
    </div>
  );
}
