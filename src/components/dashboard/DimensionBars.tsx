interface DimensionData {
  label: string;
  score: number;
  scaleMax: number;
}

interface Props {
  dimensions: DimensionData[];
}

function getInsight(score: number, scaleMax: number): string {
  const pct = score / scaleMax;
  if (pct < 0.5) return "Perlu perhatian segera";
  if (pct < 0.7) return "Dalam pengembangan";
  return "Area kekuatan";
}

function getColor(score: number, scaleMax: number): string {
  const pct = score / scaleMax;
  if (pct < 0.5) return "#DC2626";
  if (pct < 0.7) return "#F59E0B";
  return "#22C55E";
}

export default function DimensionBars({ dimensions }: Props) {
  return (
    <div className="space-y-4">
      {dimensions.map((dim) => {
        const pct = (dim.score / dim.scaleMax) * 100;
        const color = getColor(dim.score, dim.scaleMax);
        const insight = getInsight(dim.score, dim.scaleMax);

        return (
          <div key={dim.label}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-text-primary">
                {dim.label}
              </span>
              <span className="text-text-secondary">
                {dim.score.toFixed(1)} / {dim.scaleMax}
              </span>
            </div>
            <div className="h-3 rounded-full bg-neutral-100 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${pct}%`, backgroundColor: color }}
              />
            </div>
            <span className="text-xs text-text-muted mt-0.5 block">
              {insight}
            </span>
          </div>
        );
      })}
    </div>
  );
}
