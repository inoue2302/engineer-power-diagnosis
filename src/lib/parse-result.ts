import type { DiagnosisResult, Rank, WarriorType, StatusScores, Roadmap } from "@/types/diagnosis";

const RANKS: readonly string[] = ["下級戦士", "中級戦士", "上級戦士", "エリート戦士", "伝説の戦士"];
const WARRIOR_TYPES: readonly string[] = [
  "技術特化型", "バランス型", "コミュ力特化型", "学習意欲型", "サバイバー型",
];

const isRank = (value: string): value is Rank =>
  RANKS.includes(value);

const isWarriorType = (value: string): value is WarriorType =>
  WARRIOR_TYPES.includes(value);

const isStatusScores = (value: unknown): value is StatusScores => {
  if (typeof value !== "object" || value === null) return false;
  return (
    "technique" in value && typeof value.technique === "number" &&
    "problemSolving" in value && typeof value.problemSolving === "number" &&
    "learning" in value && typeof value.learning === "number" &&
    "communication" in value && typeof value.communication === "number" &&
    "survival" in value && typeof value.survival === "number"
  );
};

const isRoadmap = (value: unknown): value is Roadmap => {
  if (typeof value !== "object" || value === null) return false;
  return (
    "shortTerm" in value && typeof value.shortTerm === "string" &&
    "midTerm" in value && typeof value.midTerm === "string" &&
    "longTerm" in value && typeof value.longTerm === "string"
  );
};

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((s: unknown) => typeof s === "string");

const isDiagnosisResult = (value: unknown): value is DiagnosisResult => {
  if (typeof value !== "object" || value === null) return false;
  if (!("powerLevel" in value && typeof value.powerLevel === "number")) return false;
  if (!("rank" in value && typeof value.rank === "string" && isRank(value.rank))) return false;
  if (!("type" in value && typeof value.type === "string" && isWarriorType(value.type))) return false;
  if (!("comment" in value && typeof value.comment === "string")) return false;
  if (!("advice" in value && typeof value.advice === "string")) return false;
  if (!("scores" in value && isStatusScores(value.scores))) return false;
  return true;
};

const DEFAULT_SCORES: StatusScores = {
  technique: 50,
  problemSolving: 50,
  learning: 50,
  communication: 50,
  survival: 50,
};

export function parseDiagnosisResult(
  content: string
): DiagnosisResult | null {
  const jsonMatch = content.match(/```json\s*([\s\S]*?)```/);
  if (!jsonMatch) return null;

  try {
    const parsed: unknown = JSON.parse(jsonMatch[1]);

    if (isDiagnosisResult(parsed)) {
      // roadmap / recommendedSkills はオプショナルなので追加検証
      const result: DiagnosisResult = {
        powerLevel: parsed.powerLevel,
        rank: parsed.rank,
        type: parsed.type,
        scores: parsed.scores,
        comment: parsed.comment,
        advice: parsed.advice,
      };
      if ("roadmap" in parsed && isRoadmap(parsed.roadmap)) {
        result.roadmap = parsed.roadmap;
      }
      if ("recommendedSkills" in parsed && isStringArray(parsed.recommendedSkills)) {
        result.recommendedSkills = parsed.recommendedSkills;
      }
      return result;
    }

    // scores が無い場合のフォールバック（デフォルトスコアで補完）
    if (typeof parsed !== "object" || parsed === null) return null;
    if (!("powerLevel" in parsed && typeof parsed.powerLevel === "number")) return null;
    if (!("rank" in parsed && typeof parsed.rank === "string" && isRank(parsed.rank))) return null;
    if (!("type" in parsed && typeof parsed.type === "string" && isWarriorType(parsed.type))) return null;
    if (!("comment" in parsed && typeof parsed.comment === "string")) return null;
    if (!("advice" in parsed && typeof parsed.advice === "string")) return null;

    const result: DiagnosisResult = {
      powerLevel: parsed.powerLevel,
      rank: parsed.rank,
      type: parsed.type,
      comment: parsed.comment,
      advice: parsed.advice,
      scores: DEFAULT_SCORES,
    };
    if ("roadmap" in parsed && isRoadmap(parsed.roadmap)) {
      result.roadmap = parsed.roadmap;
    }
    if ("recommendedSkills" in parsed && isStringArray(parsed.recommendedSkills)) {
      result.recommendedSkills = parsed.recommendedSkills;
    }
    return result;
  } catch {
    return null;
  }
}

export function stripJsonBlock(content: string): string {
  return content.replace(/```json\s*[\s\S]*?```/g, "").trim();
}
