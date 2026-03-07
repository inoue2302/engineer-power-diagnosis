"use server";

import { enhanceDiagnosisResult } from "@/lib/rag/enhance-chain";
import { checkGlobalRateLimit } from "@/lib/rate-limit";
import type { DiagnosisResult, EnhancedDiagnosisResult } from "@/types/diagnosis";

type EnhanceResponse =
  | { success: true; result: EnhancedDiagnosisResult }
  | { success: false; error: string };

export const enhanceDiagnosis = async (
  baseResult: DiagnosisResult,
  userMessages: string[]
): Promise<EnhanceResponse> => {
  const globalAllowed = await checkGlobalRateLimit();
  if (!globalAllowed) {
    return { success: false, error: "本日の利用上限に達しました" };
  }

  try {
    const enhanced = await enhanceDiagnosisResult(baseResult, userMessages);
    return { success: true, result: enhanced };
  } catch {
    return { success: false, error: "RAG強化に失敗しました" };
  }
};
