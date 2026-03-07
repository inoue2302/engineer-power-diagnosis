"use server";

import { enhanceDiagnosisResult } from "@/lib/rag/enhance-chain";
import type { DiagnosisResult, EnhancedDiagnosisResult } from "@/types/diagnosis";

type EnhanceResponse =
  | { success: true; result: EnhancedDiagnosisResult }
  | { success: false; error: string };

export const enhanceDiagnosis = async (
  baseResult: DiagnosisResult,
  userMessages: string[]
): Promise<EnhanceResponse> => {
  try {
    const enhanced = await enhanceDiagnosisResult(baseResult, userMessages);
    return { success: true, result: enhanced };
  } catch {
    return { success: false, error: "RAG強化に失敗しました" };
  }
};
