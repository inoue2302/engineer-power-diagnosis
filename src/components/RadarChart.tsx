import type { StatusScores } from "@/types/diagnosis";

type RadarChartProps = {
  scores: StatusScores;
};

const LABELS: { key: keyof StatusScores; label: string }[] = [
  { key: "technique", label: "技術力" },
  { key: "problemSolving", label: "問題解決" },
  { key: "learning", label: "学習意欲" },
  { key: "communication", label: "対人力" },
  { key: "survival", label: "実戦力" },
];

const SIZE = 200;
const CENTER = SIZE / 2;
const RADIUS = 70;
const LEVELS = 4;

const polarToCartesian = (angle: number, radius: number) => {
  const rad = ((angle - 90) * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.cos(rad),
    y: CENTER + radius * Math.sin(rad),
  };
};

const getPolygonPoints = (values: number[]) =>
  values
    .map((v, i) => {
      const angle = (360 / values.length) * i;
      const r = (v / 100) * RADIUS;
      const { x, y } = polarToCartesian(angle, r);
      return `${x},${y}`;
    })
    .join(" ");

const getGridPoints = (level: number) => {
  const r = (level / LEVELS) * RADIUS;
  return Array.from({ length: 5 })
    .map((_, i) => {
      const angle = (360 / 5) * i;
      const { x, y } = polarToCartesian(angle, r);
      return `${x},${y}`;
    })
    .join(" ");
};

export const RadarChart = ({ scores }: RadarChartProps) => {
  const values = LABELS.map((l) => scores[l.key]);

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="w-full max-w-[250px]"
      >
        {/* Grid lines */}
        {Array.from({ length: LEVELS }).map((_, i) => (
          <polygon
            key={i}
            points={getGridPoints(i + 1)}
            fill="none"
            stroke="rgba(255,107,0,0.12)"
            strokeWidth="0.5"
          />
        ))}

        {/* Axis lines */}
        {LABELS.map((_, i) => {
          const angle = (360 / 5) * i;
          const { x, y } = polarToCartesian(angle, RADIUS);
          return (
            <line
              key={i}
              x1={CENTER}
              y1={CENTER}
              x2={x}
              y2={y}
              stroke="rgba(255,107,0,0.1)"
              strokeWidth="0.5"
            />
          );
        })}

        {/* Data polygon */}
        <polygon
          points={getPolygonPoints(values)}
          fill="rgba(255,107,0,0.15)"
          stroke="var(--energy-orange)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {values.map((v, i) => {
          const angle = (360 / 5) * i;
          const r = (v / 100) * RADIUS;
          const { x, y } = polarToCartesian(angle, r);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="3"
              fill="var(--energy-orange)"
              filter="drop-shadow(0 0 4px rgba(255,107,0,0.6))"
            />
          );
        })}

        {/* Labels */}
        {LABELS.map((l, i) => {
          const angle = (360 / 5) * i;
          const { x, y } = polarToCartesian(angle, RADIUS + 18);
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="var(--foreground)"
              fontSize="9"
              fontFamily="'Dela Gothic One', sans-serif"
              opacity="0.7"
            >
              {l.label}
            </text>
          );
        })}

        {/* Score values */}
        {values.map((v, i) => {
          const angle = (360 / 5) * i;
          const r = (v / 100) * RADIUS;
          const { x, y } = polarToCartesian(angle, r > 20 ? r - 12 : r + 14);
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="var(--energy-gold)"
              fontSize="8"
              fontFamily="'DotGothic16', monospace"
            >
              {v}
            </text>
          );
        })}
      </svg>
    </div>
  );
};
