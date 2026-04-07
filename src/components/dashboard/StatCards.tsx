import type { TierDef } from "@/types";

interface Props {
  total: number;
  avgScore: number;
  avgTier: TierDef;
  strongest: { label: string; score: number };
  weakest: { label: string; score: number };
}

export default function StatCards({
  total,
  avgScore,
  avgTier,
  strongest,
  weakest,
}: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
      <Card label="Responden" value={String(total)} />
      <Card label="Rata-rata Score" value={avgScore.toFixed(1)} />
      <Card
        label="Tier Rata-rata"
        value={avgTier.name}
        valueColor={avgTier.color}
        small
      />
      <Card
        label="Dimensi Terkuat"
        value={`${strongest.label} (${strongest.score.toFixed(1)})`}
        highlight="green"
        small
      />
      <Card
        label="Perlu Perhatian"
        value={`${weakest.label} (${weakest.score.toFixed(1)})`}
        highlight="red"
        small
      />
    </div>
  );
}

function Card({
  label,
  value,
  valueColor,
  highlight,
  small,
}: {
  label: string;
  value: string;
  valueColor?: string;
  highlight?: "green" | "red";
  small?: boolean;
}) {
  const borderClass =
    highlight === "green"
      ? "border-green-200 bg-green-50/50"
      : highlight === "red"
        ? "border-red-200 bg-red-50/50"
        : "border-border bg-bg-card";

  return (
    <div
      className={`rounded-lg border p-5 text-center ${borderClass}`}
      style={{ boxShadow: "var(--shadow-sm)" }}
    >
      <div
        className={`font-bold text-text-primary ${small ? "text-base" : "text-2xl"}`}
        style={valueColor ? { color: valueColor } : undefined}
      >
        {value}
      </div>
      <div className="text-xs text-text-muted mt-1">
        {label}
      </div>
    </div>
  );
}
