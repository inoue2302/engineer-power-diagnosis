import type { DiagnosisResult } from "@/types/diagnosis";
import { RadarChart } from "@/components/RadarChart";

type DiagnosisResultCardProps = {
  result: DiagnosisResult;
};

function getRankColor(rank: string) {
  switch (rank) {
    case "伝説の戦士":
      return "from-[#ffd700] to-[#ff6b00]";
    case "エリート戦士":
      return "from-[#ff9500] to-[#ff6b00]";
    case "上級戦士":
      return "from-[#4dc9f6] to-[#39ff14]";
    case "中級戦士":
      return "from-[#39ff14] to-[#4dc9f6]";
    default:
      return "from-[#888] to-[#aaa]";
  }
}

export function DiagnosisResultCard({ result }: DiagnosisResultCardProps) {
  const rankColor = getRankColor(result.rank);

  return (
    <div className="w-full max-w-md mx-auto space-y-4 animate-slide-up">
      {/* 戦闘力 */}
      <div className="text-center space-y-2">
        <p className="font-dot text-xs text-[var(--scouter-green)] tracking-widest">
          POWER LEVEL
        </p>
        <p
          className={`font-gothic text-5xl sm:text-6xl bg-gradient-to-r ${rankColor} bg-clip-text text-transparent animate-energy-flicker`}
        >
          {result.powerLevel.toLocaleString()}
        </p>
      </div>

      {/* ランク＆タイプ */}
      <div className="flex justify-center gap-3">
        <div className="rounded-lg border border-[rgba(255,107,0,0.3)] bg-[rgba(255,107,0,0.08)] px-4 py-2 text-center">
          <p className="font-dot text-[10px] text-[var(--energy-amber)] tracking-wider mb-0.5">
            RANK
          </p>
          <p className="font-gothic text-sm text-[var(--foreground)]">
            {result.rank}
          </p>
        </div>
        <div className="rounded-lg border border-[rgba(255,107,0,0.3)] bg-[rgba(255,107,0,0.08)] px-4 py-2 text-center">
          <p className="font-dot text-[10px] text-[var(--energy-amber)] tracking-wider mb-0.5">
            TYPE
          </p>
          <p className="font-gothic text-sm text-[var(--foreground)]">
            {result.type}
          </p>
        </div>
      </div>

      {/* レーダーチャート */}
      {result.scores && <RadarChart scores={result.scores} />}

      {/* 区切り */}
      <div className="flex items-center gap-2 justify-center opacity-30">
        <div className="w-12 h-px bg-gradient-to-r from-transparent to-[var(--energy-orange)]" />
        <div className="w-1.5 h-1.5 rotate-45 border border-[var(--energy-orange)]" />
        <div className="w-12 h-px bg-gradient-to-l from-transparent to-[var(--energy-orange)]" />
      </div>

      {/* コメント */}
      <div className="rounded-lg border border-[rgba(255,107,0,0.15)] bg-[rgba(255,107,0,0.05)] p-4 space-y-3">
        <p className="text-sm leading-relaxed text-[var(--foreground)]">
          {result.comment}
        </p>
        <div className="border-t border-[rgba(255,107,0,0.1)] pt-3">
          <p className="font-dot text-[10px] text-[var(--energy-amber)] tracking-wider mb-1">
            ADVICE
          </p>
          <p className="text-sm leading-relaxed text-[var(--foreground)] opacity-80">
            「{result.advice}」
          </p>
        </div>
      </div>
    </div>
  );
}
