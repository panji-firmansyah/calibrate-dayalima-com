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
  // Split dimensions into two columns
  const midpoint = Math.ceil(dimensions.length / 2);
  const leftCol = dimensions.slice(0, midpoint);
  const rightCol = dimensions.slice(midpoint);

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div
        className="rounded-lg border border-border bg-white overflow-hidden"
        style={{ boxShadow: "var(--shadow-md)" }}
      >
        {/* Main layout: left info + right scores */}
        <div className="grid md:grid-cols-[2fr_3fr] min-h-[480px]">
          {/* Left Panel */}
          <div className="p-8 sm:p-10 flex flex-col justify-between border-r border-border">
            <div>
              {/* Logo */}
              <div className="flex items-center gap-2 mb-8">
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
              <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight text-text-primary uppercase tracking-tight">
                Your Pulse
                <br />
                Check
              </h1>

              <p className="mt-4 text-xs uppercase tracking-wider text-text-muted leading-relaxed max-w-[280px]">
                Hasil assessment dari ruangan ini.
                <br />
                Data Anda, bukan data riset.
              </p>
            </div>

            <div className="mt-8">
              <p className="text-[10px] text-text-placeholder italic">
                Data dari {respondentCount} peserta — diisi dari assessment
                sebelum session dimulai
              </p>
            </div>
          </div>

          {/* Right Panel */}
          <div className="p-8 sm:p-10 flex flex-col">
            {/* Average Score — Hero */}
            <div className="mb-8 pb-8 border-b border-border">
              <p className="text-sm text-text-muted mb-2">
                Rata-rata skor peserta hari ini
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl sm:text-6xl font-extrabold text-text-primary tracking-tight border-2 border-brand px-4 py-1">
                  {avgTotal.toFixed(1)}
                </span>
                <span className="text-xl text-text-muted font-medium">
                  / {maxTotal}
                </span>
              </div>
            </div>

            {/* Dimension Scores — 2 columns */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-6 flex-1">
              {/* Left column */}
              <div className="space-y-6">
                {leftCol.map((dim) => (
                  <DimensionRow key={dim.label} {...dim} />
                ))}
              </div>
              {/* Right column */}
              <div className="space-y-6">
                {rightCol.map((dim) => (
                  <DimensionRow key={dim.label} {...dim} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DimensionRow({
  label,
  score,
  scaleMax,
}: DimensionScore) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm font-medium text-text-secondary">
        {label}
      </span>
      <span className="text-lg font-bold text-text-primary whitespace-nowrap">
        <span className="text-brand">{score.toFixed(1)}</span>
        <span className="text-text-muted font-medium text-sm">
          {" "}
          / {scaleMax}
        </span>
      </span>
    </div>
  );
}
