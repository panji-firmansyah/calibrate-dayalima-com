import type { Submission } from "@/types";
import { generateScaleColors } from "@/lib/scoring";

interface Props {
  submissions: Submission[];
  dimensions: { key: string; short: string }[];
  scaleMin: number;
  scaleMax: number;
}

export default function DimensionBreakdown({
  submissions,
  dimensions,
  scaleMin,
  scaleMax,
}: Props) {
  const total = submissions.length || 1;
  const scaleRange = Array.from(
    { length: scaleMax - scaleMin + 1 },
    (_, i) => scaleMin + i
  );
  const colors = generateScaleColors(scaleMin, scaleMax);

  return (
    <div>
      <div className="space-y-3">
        {dimensions.map((dim) => {
          const counts: Record<number, number> = {};
          for (const s of scaleRange) counts[s] = 0;

          for (const sub of submissions) {
            const val = sub.scores[dim.key];
            if (val >= scaleMin && val <= scaleMax) counts[val]++;
          }

          return (
            <div key={dim.key} className="flex items-center gap-3">
              <span className="w-20 shrink-0 text-sm font-medium text-text-primary">
                {dim.short}
              </span>
              <div className="flex flex-1 h-6 rounded overflow-hidden bg-neutral-100">
                {scaleRange.map((s, idx) => {
                  const pct = (counts[s] / total) * 100;
                  if (pct === 0) return null;
                  return (
                    <div
                      key={s}
                      className="flex items-center justify-center text-[10px] font-semibold text-white transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: colors[idx],
                      }}
                      title={`Skor ${s}: ${counts[s]} (${Math.round(pct)}%)`}
                    >
                      {pct >= 8 ? `${Math.round(pct)}%` : ""}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4">
        {scaleRange.map((s, idx) => (
          <div
            key={s}
            className="flex items-center gap-1.5 text-xs text-text-muted"
          >
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: colors[idx] }}
            />
            Skor {s}
          </div>
        ))}
      </div>
    </div>
  );
}
