"use server";

import { cookies } from "next/headers";
import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "@/lib/system-prompt";
import { checkGlobalRateLimit } from "@/lib/rate-limit";
import type { MessageRole } from "@/types/diagnosis";

const anthropic = new Anthropic();

// Limits
const MAX_MESSAGE_LENGTH = 500;
const PER_USER_DAILY_LIMIT = 50;
const COOKIE_NAME = "diagnosis_count";

// Cookie-based per-user daily rate limit
const checkUserRateLimit = async (): Promise<boolean> => {
  const cookieStore = await cookies();
  const today = new Date().toISOString().slice(0, 10);
  const raw = cookieStore.get(COOKIE_NAME)?.value;

  let count = 0;
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed.date === today) {
        count = parsed.count;
      }
    } catch {
      // corrupted cookie, reset
    }
  }

  if (count >= PER_USER_DAILY_LIMIT) return false;

  cookieStore.set(COOKIE_NAME, JSON.stringify({ date: today, count: count + 1 }), {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 86400,
  });

  return true;
};

type ChatMessage = {
  role: MessageRole;
  content: string;
};

type ChatResponse =
  | { success: true; message: string }
  | { success: false; error: string };

const VALID_ROLES: MessageRole[] = ["user", "assistant"];

const validateMessages = (messages: unknown): messages is ChatMessage[] => {
  if (!Array.isArray(messages)) return false;
  return messages.every(
    (msg) =>
      typeof msg === "object" &&
      msg !== null &&
      VALID_ROLES.includes(msg.role) &&
      typeof msg.content === "string" &&
      msg.content.trim().length > 0 &&
      msg.content.length <= MAX_MESSAGE_LENGTH
  );
};

export const sendMessage = async (
  messages: ChatMessage[]
): Promise<ChatResponse> => {
  if (!validateMessages(messages)) {
    return { success: false, error: "不正なリクエストだ。出直せ。" };
  }

  // Layer 1: Global limit (Upstash Redis)
  const globalAllowed = await checkGlobalRateLimit();
  if (!globalAllowed) {
    return {
      success: false,
      error: "フン…今日は測定希望者が多すぎた。俺様のスカウターも限界だ。明日出直せ。",
    };
  }

  // Layer 2: Per-user limit (Cookie)
  const userAllowed = await checkUserRateLimit();
  if (!userAllowed) {
    return {
      success: false,
      error: "フン…貴様は今日やりすぎだ。明日また来い。",
    };
  }

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    const textBlock = response.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return { success: false, error: "応答を取得できませんでした" };
    }

    return { success: true, message: textBlock.text };
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return {
        success: false,
        error:
          "フン…今日の測定はここまでだ。俺様にも休息は必要なのだ。明日また来い。",
      };
    }

    if (error instanceof Anthropic.APIError && error.status === 529) {
      return {
        success: false,
        error:
          "チッ…俺様のスカウターが過負荷で使えん。少し時間を置いてから来い。",
      };
    }

    return {
      success: false,
      error: "くっ…通信障害だと？貴様のせいではないが、もう一度試せ。",
    };
  }
};
