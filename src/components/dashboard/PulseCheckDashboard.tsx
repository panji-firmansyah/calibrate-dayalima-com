"use client";

import RadarChart from "./RadarChart";

interface DimensionScore {
  label: string;
  score: number;
  scaleMax: number;
}

interface Props {
  eventName: string;
  avgTotal: number;
  maxTotal: number;
  dimensions: DimensionScore[];
  respondentCount: number;
}

export default function PulseCheckDashboard({
  eventName,
  avgTotal,
  maxTotal,
  dimensions,
  respondentCount,
}: Props) {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div
        className="rounded-lg border border-border bg-white overflow-hidden"
        style={{ boxShadow: "var(--shadow-md)" }}
      >
        {/* Main layout: stacked on mobile, side-by-side on desktop */}
        <div className="grid md:grid-cols-[2fr_3fr]">
          {/* Left Panel */}
          <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-border md:min-h-[480px]">
            <div>
              {/* Logo */}
              <div className="flex items-center gap-2 mb-6 md:mb-8">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16 2L28 28H4L16 2Z" fill="#DC2626" />
                </svg>
                <div>
                  <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-text-primary">
                    Daya Lima
                  </div>
                  <div className="text-[8px] tracking-wider uppercase text-text-muted">
                    Recruitment
                  </div>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight text-text-primary uppercase tracking-tight">
                Your Pulse
                <br />
                Check
              </h1>

              <p className="mt-3 md:mt-4 text-xs uppercase tracking-wider text-text-muted leading-relaxed max-w-[280px]">
                Hasil assessment dari ruangan ini.
                <br />
                Data Anda, bukan data riset.
              </p>
            </div>

            <div className="mt-6 md:mt-8">
              <p className="text-[10px] text-text-placeholder italic">
                Data dari {respondentCount} peserta — diisi dari assessment
                sebelum session dimulai
              </p>
            </div>
          </div>

          {/* Right Panel */}
          <div className="p-6 sm:p-8 md:p-10 flex flex-col">
            {/* Average Score — Hero */}
            <div className="mb-6 md:mb-8 pb-6 md:pb-8 border-b border-border">
              <p className="text-sm text-text-muted mb-2">
                Rata-rata skor peserta hari ini
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-text-primary tracking-tight border-2 border-brand px-3 sm:px-4 py-1">
                  {avgTotal.toFixed(1)}
                </span>
                <span className="text-lg sm:text-xl text-text-muted font-medium">
                  / {maxTotal}
                </span>
              </div>
            </div>

            {/* Radar Chart */}
            <div className="mb-6 pb-6 border-b border-border">
              <div className="max-w-[240px] sm:max-w-xs mx-auto">
                <RadarChart
                  axes={dimensions.map((d) => ({
                    key: d.label,
                    label: d.label,
                    score: d.score,
                  }))}
                />
              </div>
            </div>

            {/* Dimension Scores — single col on mobile, 2 cols on sm+ */}
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4 sm:gap-y-6 flex-1">
              {dimensions.map((dim) => (
                <DimensionRow key={dim.label} {...dim} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DimensionRow({ label, score, scaleMax }: DimensionScore) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm font-medium text-text-secondary">{label}</span>
      <span className="text-base sm:text-lg font-bold text-text-primary whitespace-nowrap">
        <span className="text-brand">{score.toFixed(1)}</span>
        <span className="text-text-muted font-medium text-xs sm:text-sm">
          {" "}
          / {scaleMax}
        </span>
      </span>
    </div>
  );
}
