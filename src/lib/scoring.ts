import type { TierDef, Submission, EventConfig, Question } from "@/types";

export function getTier(score: number, tiers: TierDef[]): TierDef {
  for (const tier of [...tiers].reverse()) {
    if (score >= tier.min && score <= tier.max) return tier;
  }
  return tiers[0];
}

export function getMaxPossibleScore(config: EventConfig): number {
  if (config.scoring.maxScore) return config.scoring.maxScore;

  let max = 0;
  for (const q of config.questions) {
    if (q.type === "likert") {
      max += q.scaleMax;
    } else if (q.type === "multiple-choice") {
      max += Math.max(...q.options.map((o) => o.value));
    }
  }
  return max;
}

export function computeTotalScore(
  scores: Record<string, number>,
  config: EventConfig
): number {
  const { method, weights } = config.scoring;

  switch (method) {
    case "sum":
      return Object.values(scores).reduce((a, b) => a + b, 0);

    case "weighted": {
      let total = 0;
      for (const [key, val] of Object.entries(scores)) {
        total += val * (weights?.[key] ?? 1);
      }
      return Math.round(total * 10) / 10;
    }

    case "percentage": {
      const sum = Object.values(scores).reduce((a, b) => a + b, 0);
      const maxPossible = getMaxPossibleScore(config);
      return maxPossible > 0
        ? Math.round((sum / maxPossible) * 1000) / 10
        : 0;
    }
  }
}

export function getQuestionScaleMax(q: Question): number {
  if (q.type === "likert") return q.scaleMax;
  if (q.type === "multiple-choice") return Math.max(...q.options.map((o) => o.value));
  return 5;
}

export function calculateAverages(
  submissions: Submission[],
  questionIds: string[]
): { dimensions: Record<string, number>; total: number } {
  if (submissions.length === 0) {
    return {
      dimensions: Object.fromEntries(questionIds.map((q) => [q, 0])),
      total: 0,
    };
  }

  const sums: Record<string, number> = {};
  for (const qId of questionIds) sums[qId] = 0;
  let totalSum = 0;

  for (const sub of submissions) {
    for (const qId of questionIds) {
      sums[qId] += sub.scores[qId] ?? 0;
    }
    totalSum += sub.total_score;
  }

  const n = submissions.length;
  const dimensions: Record<string, number> = {};
  for (const qId of questionIds) {
    dimensions[qId] = Math.round((sums[qId] / n) * 10) / 10;
  }

  return { dimensions, total: Math.round((totalSum / n) * 10) / 10 };
}

export function calculateTierDistribution(
  submissions: Submission[],
  tiers: TierDef[]
): { tier: TierDef; count: number; percent: number }[] {
  const counts = new Map<string, number>();
  for (const t of tiers) counts.set(t.name, 0);

  for (const sub of submissions) {
    const tier = getTier(sub.total_score, tiers);
    counts.set(tier.name, (counts.get(tier.name) ?? 0) + 1);
  }

  const total = submissions.length || 1;
  return tiers.map((tier) => {
    const count = counts.get(tier.name) ?? 0;
    return {
      tier,
      count,
      percent: Math.round((count / total) * 100),
    };
  });
}

export function findStrongestWeakest(
  dimensions: Record<string, number>,
  labels: Record<string, string>
): { strongest: string; weakest: string } {
  let strongest = "";
  let weakest = "";
  let max = -Infinity;
  let min = Infinity;

  for (const [key, val] of Object.entries(dimensions)) {
    if (val > max) {
      max = val;
      strongest = labels[key] ?? key;
    }
    if (val < min) {
      min = val;
      weakest = labels[key] ?? key;
    }
  }

  return { strongest, weakest };
}

/**
 * Generate a color gradient from red to green for N scale steps.
 */
export function generateScaleColors(scaleMin: number, scaleMax: number): string[] {
  const steps = scaleMax - scaleMin + 1;
  if (steps <= 1) return ["#DC2626"];
  if (steps === 2) return ["#DC2626", "#22C55E"];
  if (steps === 3) return ["#DC2626", "#F59E0B", "#22C55E"];
  if (steps === 4) return ["#DC2626", "#F59E0B", "#3B82F6", "#22C55E"];
  if (steps === 5) return ["#991B1B", "#DC2626", "#F59E0B", "#3B82F6", "#22C55E"];

  // For 6+ steps, interpolate
  const anchors = [
    [153, 27, 27],   // #991B1B
    [220, 38, 38],   // #DC2626
    [245, 158, 11],  // #F59E0B
    [59, 130, 246],  // #3B82F6
    [34, 197, 94],   // #22C55E
  ];

  const colors: string[] = [];
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    const anchorIdx = t * (anchors.length - 1);
    const lo = Math.floor(anchorIdx);
    const hi = Math.min(lo + 1, anchors.length - 1);
    const frac = anchorIdx - lo;

    const r = Math.round(anchors[lo][0] + (anchors[hi][0] - anchors[lo][0]) * frac);
    const g = Math.round(anchors[lo][1] + (anchors[hi][1] - anchors[lo][1]) * frac);
    const b = Math.round(anchors[lo][2] + (anchors[hi][2] - anchors[lo][2]) * frac);
    colors.push(`rgb(${r},${g},${b})`);
  }
  return colors;
}
