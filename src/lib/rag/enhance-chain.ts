import { ChatAnthropic } from "@langchain/anthropic";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { retrieveKnowledge } from "./retriever";
import type { DiagnosisResult, EnhancedDiagnosisResult, Roadmap } from "@/types/diagnosis";

const ENHANCE_PROMPT = PromptTemplate.fromTemplate(`あなたは技術キャリアアドバイザーです。
以下のエンジニア診断結果を、ナレッジベースの情報をもとにより具体的・実践的に強化してください。

## ベース診断結果
- 戦闘力: {powerLevel}
- ランク: {rank}
- タイプ: {type}
- ユーザーの回答要約: {userContext}

## ナレッジベースから取得した関連情報
{retrievedKnowledge}

## 出力指示
以下のJSON形式で、強化版の roadmap と recommendedSkills のみを出力してください。
他の説明は不要です。JSONのみ出力してください。

- roadmap の各項目は王子口調（「〜しろ」「〜だ」）で書く
- ナレッジベースの具体的な技術名・トレンド・キャリア情報を反映させる
- 元の診断結果のタイプ・専門分野に合った内容にする

\`\`\`json
{{
  "roadmap": {{
    "shortTerm": "3ヶ月以内の具体的アクション",
    "midTerm": "1年以内の目標",
    "longTerm": "3〜5年後のキャリア像"
  }},
  "recommendedSkills": ["スキル1", "スキル2", "スキル3"]
}}
\`\`\``);

const model = new ChatAnthropic({
  model: "claude-sonnet-4-20250514",
  maxTokens: 512,
  temperature: 0.7,
});

const chain = RunnableSequence.from([
  ENHANCE_PROMPT,
  model,
  new StringOutputParser(),
]);

const mapCategoryFromType = (type: string): string | undefined => {
  if (type.includes("技術")) return "frontend";
  if (type.includes("バランス")) return "fullstack";
  if (type.includes("コミュ")) return "leadership";
  if (type.includes("学習")) return "learning";
  if (type.includes("サバイバー")) return "infrastructure";
  return undefined;
};

export const enhanceDiagnosisResult = async (
  baseResult: DiagnosisResult,
  userMessages: string[]
): Promise<EnhancedDiagnosisResult> => {
  const category = mapCategoryFromType(baseResult.type);
  const query = `${baseResult.type} ${baseResult.rank} エンジニア キャリア ${userMessages.slice(0, 3).join(" ")}`;

  const docs = await retrieveKnowledge(query, category);
  const retrievedKnowledge = docs.length > 0
    ? docs.map((d) => `[${d.metadata.title}]\n${d.content}`).join("\n\n---\n\n")
    : "関連情報なし";

  const result = await chain.invoke({
    powerLevel: baseResult.powerLevel.toString(),
    rank: baseResult.rank,
    type: baseResult.type,
    userContext: userMessages.slice(0, 3).join("、"),
    retrievedKnowledge,
  });

  const jsonMatch = result.match(/```json\s*([\s\S]*?)```/) ?? result.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return { ...baseResult, isEnhanced: true };
  }

  try {
    const jsonStr = jsonMatch[1] ?? jsonMatch[0];
    const enhanced = JSON.parse(jsonStr) as {
      roadmap?: Roadmap;
      recommendedSkills?: string[];
    };

    return {
      ...baseResult,
      isEnhanced: true,
      originalRoadmap: baseResult.roadmap,
      originalRecommendedSkills: baseResult.recommendedSkills,
      ...(enhanced.roadmap ? { roadmap: enhanced.roadmap } : {}),
      ...(enhanced.recommendedSkills ? { recommendedSkills: enhanced.recommendedSkills } : {}),
    };
  } catch {
    return { ...baseResult, isEnhanced: true };
  }
};
