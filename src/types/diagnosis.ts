export type MessageRole = "user" | "assistant";

export type Message = {
  id: string;
  role: MessageRole;
  content: string;
};

export type Rank = "下級戦士" | "中級戦士" | "上級戦士" | "エリート戦士" | "伝説の戦士";

export type WarriorType =
  | "技術特化型"
  | "バランス型"
  | "コミュ力特化型"
  | "学習意欲型"
  | "サバイバー型";

export type DiagnosisResult = {
  powerLevel: number;
  rank: Rank;
  type: WarriorType;
  comment: string;
  advice: string;
};

export type DiagnosisPhase = "idle" | "chatting" | "result";
