import type { DiagnosisResult } from "@/types/diagnosis";

export function parseDiagnosisResult(
  content: string
): DiagnosisResult | null {
  const jsonMatch = content.match(/```json\s*([\s\S]*?)```/);
  if (!jsonMatch) return null;

  try {
    const parsed = JSON.parse(jsonMatch[1]);

    if (
      typeof parsed.powerLevel === "number" &&
      typeof parsed.rank === "string" &&
      typeof parsed.type === "string" &&
      typeof parsed.comment === "string" &&
      typeof parsed.advice === "string" &&
      typeof parsed.scores === "object" &&
      parsed.scores !== null
    ) {
      return parsed as DiagnosisResult;
    }

    // scores が無い場合でもフォールバック
    if (
      typeof parsed.powerLevel === "number" &&
      typeof parsed.rank === "string" &&
      typeof parsed.type === "string" &&
      typeof parsed.comment === "string" &&
      typeof parsed.advice === "string"
    ) {
      return {
        ...parsed,
        scores: {
          technique: 50,
          problemSolving: 50,
          learning: 50,
          communication: 50,
          survival: 50,
        },
      } as DiagnosisResult;
    }
    return null;
  } catch {
    return null;
  }
}

export function stripJsonBlock(content: string): string {
  return content.replace(/```json\s*[\s\S]*?```/g, "").trim();
}
