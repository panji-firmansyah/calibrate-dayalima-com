import { notFound } from "next/navigation";
import { EVENTS } from "@/config/events";
import { supabase } from "@/lib/supabase";
import {
  calculateAverages,
  calculateTierDistribution,
  findStrongestWeakest,
  getTier,
  getQuestionScaleMax,
  getMaxPossibleScore,
} from "@/lib/scoring";
import type { Submission } from "@/types";
import type { Metadata } from "next";

import StatCards from "@/components/dashboard/StatCards";
import RadarChart from "@/components/dashboard/RadarChart";
import DimensionBars from "@/components/dashboard/DimensionBars";
import TierDistribution from "@/components/dashboard/TierDistribution";
import DimensionBreakdown from "@/components/dashboard/DimensionBreakdown";
import DashboardShell from "@/components/dashboard/DashboardShell";
import PulseCheckDashboard from "@/components/dashboard/PulseCheckDashboard";

interface Props {
  params: Promise<{ event: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { event: slug } = await params;
  const event = EVENTS[slug];
  if (!event) return {};
  return { title: `Dashboard — ${event.name}` };
}

export default async function DashboardPage({ params }: Props) {
  const { event: slug } = await params;
  const event = EVENTS[slug];

  if (!event || !event.features.dashboard) notFound();

  // Fetch event_id
  const { data: eventRow } = await supabase
    .from("calibrate_events")
    .select("id")
    .eq("slug", slug)
    .single();

  if (!eventRow) notFound();

  // Fetch all submissions for this event
  const { data: rawSubmissions } = await supabase
    .from(event.table)
    .select("*")
    .eq("event_id", eventRow.id)
    .order("created_at", { ascending: true });

  const submissions: Submission[] = (rawSubmissions ?? []).map((r) => ({
    id: r.id,
    event_id: r.event_id,
    nama: r.nama,
    perusahaan: r.perusahaan,
    jabatan: r.jabatan,
    scores: r.scores as Record<string, number>,
    total_score: r.total_score,
    created_at: r.created_at,
  }));

  // Build dimension config from event questions (config-driven, no hardcodes)
  const questionIds = event.questions.map((q) => q.id);
  const dimConfig = event.questions.map((q) => ({
    key: q.id,
    label: q.label,
    short: q.label,
    scaleMax: getQuestionScaleMax(q),
  }));

  // Calculate aggregates
  const { dimensions: avgDimensions, total: avgTotal } = calculateAverages(
    submissions,
    questionIds
  );
  const tierDist = calculateTierDistribution(submissions, event.tiers);

  const labels: Record<string, string> = {};
  for (const d of dimConfig) labels[d.key] = d.short;
  const { strongest, weakest } = findStrongestWeakest(avgDimensions, labels);

  const avgTier = getTier(Math.round(avgTotal), event.tiers);

  // Build radar axes
  const radarAxes = dimConfig.map((d) => ({
    key: d.key,
    label: d.short,
    score: avgDimensions[d.key] ?? 0,
  }));

  // Build dimension bars data (with per-question scaleMax)
  const dimensionBarsData = dimConfig.map((d) => ({
    label: d.label,
    score: avgDimensions[d.key] ?? 0,
    scaleMax: d.scaleMax,
  }));

  // Find strongest/weakest scores for stat cards
  const strongestScore =
    avgDimensions[dimConfig.find((d) => d.short === strongest)?.key ?? ""] ?? 0;
  const weakestScore =
    avgDimensions[dimConfig.find((d) => d.short === weakest)?.key ?? ""] ?? 0;

  const now = new Date();
  const metaText = `Data per ${now.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })} \u2022 ${submissions.length} responden`;

  const maxTotal = getMaxPossibleScore(event);

  if (submissions.length === 0) {
    return (
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="text-center">
          <p className="text-xs font-semibold tracking-widest uppercase text-text-muted">
            Daya Lima
          </p>
          <h1 className="mt-1 text-2xl font-bold text-text-primary">
            {event.name} — Dashboard
          </h1>
          <p className="mt-4 text-text-secondary">
            Belum ada data responden.
          </p>
        </div>
      </main>
    );
  }

  // Pulse Check layout — presentation-style dashboard
  if (event.dashboardLayout === "pulse-check") {
    return (
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full">
          <DashboardShell>
            <PulseCheckDashboard
              eventName={event.name}
              avgTotal={avgTotal}
              maxTotal={maxTotal}
              dimensions={dimensionBarsData}
              respondentCount={submissions.length}
            />
          </DashboardShell>

          <footer className="mt-8 text-center text-xs text-text-muted">
            Daya Lima &middot; {event.name}
          </footer>
        </div>
      </main>
    );
  }

  // Default layout — full analytics dashboard
  return (
    <main className="flex-1 px-4 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto">
        <DashboardShell>
          {/* Header */}
          <div className="text-center mb-8">
            <p className="text-xs font-semibold tracking-widest uppercase text-brand">
              Daya Lima
            </p>
            <h1 className="mt-1 text-3xl font-bold text-text-primary">
              {event.name}
            </h1>
            <p className="text-sm font-semibold uppercase tracking-wider text-brand">
              Dashboard
            </p>
            <p className="mt-2 text-sm text-text-muted">
              {metaText}
            </p>
          </div>

          {/* Stat Cards */}
          <StatCards
            total={submissions.length}
            avgScore={avgTotal}
            avgTier={avgTier}
            strongest={{ label: strongest, score: strongestScore }}
            weakest={{ label: weakest, score: weakestScore }}
          />

          {/* Row 2: Radar + Dimension Bars */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div
              className="rounded-lg border border-border bg-bg-card p-6"
              style={{ boxShadow: "var(--shadow-sm)" }}
            >
              <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-4">
                Profil Rata-rata
              </h2>
              <RadarChart axes={radarAxes} />
            </div>
            <div
              className="rounded-lg border border-border bg-bg-card p-6"
              style={{ boxShadow: "var(--shadow-sm)" }}
            >
              <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-4">
                Skor Per Dimensi
              </h2>
              <DimensionBars dimensions={dimensionBarsData} />
            </div>
          </div>

          {/* Row 3: Tier Distribution + Dimension Breakdown */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div
              className="rounded-lg border border-border bg-bg-card p-6"
              style={{ boxShadow: "var(--shadow-sm)" }}
            >
              <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-4">
                Distribusi Tier
              </h2>
              <TierDistribution distribution={tierDist} />
            </div>
            <div
              className="rounded-lg border border-border bg-bg-card p-6"
              style={{ boxShadow: "var(--shadow-sm)" }}
            >
              <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-4">
                Distribusi Jawaban Per Dimensi
              </h2>
              <DimensionBreakdown
                submissions={submissions}
                dimensions={dimConfig}
                scaleMin={event.scale.min}
                scaleMax={event.scale.max}
              />
            </div>
          </div>
        </DashboardShell>

        {/* Footer */}
        <footer className="mt-8 text-center text-xs text-text-muted">
          Daya Lima &middot; Calibrate Talent Diagnostic
        </footer>
      </div>
    </main>
  );
}
