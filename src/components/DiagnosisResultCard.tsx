import { match } from "ts-pattern";
import type { DiagnosisResult, Rank } from "@/types/diagnosis";
import { RadarChart } from "@/components/RadarChart";
import { ShareButtons } from "@/components/ShareButtons";

type DiagnosisResultCardProps = {
  result: DiagnosisResult;
};

const getRankColor = (rank: Rank) =>
  match(rank)
    .with("伝説の戦士", () => "from-[#ffd700] to-[#ff6b00]")
    .with("エリート戦士", () => "from-[#ff9500] to-[#ff6b00]")
    .with("上級戦士", () => "from-[#4dc9f6] to-[#39ff14]")
    .with("中級戦士", () => "from-[#39ff14] to-[#4dc9f6]")
    .with("下級戦士", () => "from-[#888] to-[#aaa]")
    .exhaustive();

const Divider = () => {
  return (
    <div className="flex items-center gap-2 justify-center opacity-30">
      <div className="w-12 h-px bg-gradient-to-r from-transparent to-[var(--energy-orange)]" />
      <div className="w-1.5 h-1.5 rotate-45 border border-[var(--energy-orange)]" />
      <div className="w-12 h-px bg-gradient-to-l from-transparent to-[var(--energy-orange)]" />
    </div>
  );
};

export const DiagnosisResultCard = ({ result }: DiagnosisResultCardProps) => {
  const rankColor = getRankColor(result.rank);

  return (
    <div className="relative w-full max-w-md mx-auto space-y-4 animate-result-explosion">
      {/* Shockwave ring */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border-2 border-[var(--energy-orange)] animate-shockwave pointer-events-none" />

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

      <Divider />

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

      {/* ロードマップ */}
      {result.roadmap && (
        <>
          <Divider />

          <div className="rounded-lg border border-[rgba(255,107,0,0.15)] bg-[rgba(255,107,0,0.05)] p-4 space-y-4">
            <p className="font-dot text-[10px] text-[var(--energy-amber)] tracking-wider">
              GROWTH ROADMAP
            </p>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-[var(--scouter-green)] mt-1.5" />
                  <div className="w-px flex-1 bg-[rgba(57,255,20,0.2)]" />
                </div>
                <div>
                  <p className="font-dot text-[10px] text-[var(--scouter-green)] tracking-wider mb-1">
                    3 MONTHS
                  </p>
                  <p className="text-sm leading-relaxed text-[var(--foreground)] opacity-80">
                    {result.roadmap.shortTerm}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-[var(--energy-amber)] mt-1.5" />
                  <div className="w-px flex-1 bg-[rgba(255,149,0,0.2)]" />
                </div>
                <div>
                  <p className="font-dot text-[10px] text-[var(--energy-amber)] tracking-wider mb-1">
                    1 YEAR
                  </p>
                  <p className="text-sm leading-relaxed text-[var(--foreground)] opacity-80">
                    {result.roadmap.midTerm}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-[var(--energy-orange)] mt-1.5" />
                </div>
                <div>
                  <p className="font-dot text-[10px] text-[var(--energy-orange)] tracking-wider mb-1">
                    3-5 YEARS
                  </p>
                  <p className="text-sm leading-relaxed text-[var(--foreground)] opacity-80">
                    {result.roadmap.longTerm}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* おすすめスキル */}
      {result.recommendedSkills && result.recommendedSkills.length > 0 && (
        <div className="rounded-lg border border-[rgba(255,107,0,0.15)] bg-[rgba(255,107,0,0.05)] p-4 space-y-3">
          <p className="font-dot text-[10px] text-[var(--energy-amber)] tracking-wider">
            NEXT SKILLS TO ACQUIRE
          </p>
          <div className="flex flex-wrap gap-2">
            {result.recommendedSkills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-[rgba(255,107,0,0.3)] bg-[rgba(255,107,0,0.1)] px-3 py-1 text-xs text-[var(--energy-gold)]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      <Divider />

      {/* シェアボタン */}
      <ShareButtons result={result} />
    </div>
  );
};
