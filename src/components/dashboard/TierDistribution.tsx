import type { TierDef } from "@/types";

interface TierRow {
  tier: TierDef;
  count: number;
  percent: number;
}

interface Props {
  distribution: TierRow[];
}

export default function TierDistribution({ distribution }: Props) {
  // Render from highest tier to lowest
  const reversed = [...distribution].reverse();

  return (
    <div className="space-y-3">
      {reversed.map(({ tier, count, percent }) => (
        <div key={tier.name}>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-semibold" style={{ color: tier.color }}>
              {tier.name}
            </span>
            <span className="text-text-secondary">
              {count} ({percent}%)
            </span>
          </div>
          <div className="h-3 rounded-full bg-neutral-100 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${percent}%`, backgroundColor: tier.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
