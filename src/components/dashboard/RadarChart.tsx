"use client";

interface Axis {
  key: string;
  label: string;
  score: number;
}

interface Props {
  axes: Axis[];
}

export default function RadarChart({ axes }: Props) {
  const size = 480;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 160;
  const levels = 5;

  const axisData = axes.map((a, i) => ({
    ...a,
    angle: -Math.PI / 2 + ((2 * Math.PI) / axes.length) * i,
  }));

  function polyPoints(r: number) {
    return axisData
      .map(
        (a) =>
          `${(cx + r * Math.cos(a.angle)).toFixed(1)},${(cy + r * Math.sin(a.angle)).toFixed(1)}`
      )
      .join(" ");
  }

  // Alternating filled bands (target-ring effect)
  const bands = Array.from({ length: levels }, (_, level) => {
    const outerR = (radius * (level + 1)) / levels;
    const fill = level % 2 === 0 ? "rgba(250,250,249,1)" : "rgba(245,245,244,1)";
    return (
      <polygon
        key={`band-${level}`}
        points={polyPoints(outerR)}
        fill={fill}
        stroke="none"
      />
    );
  }).reverse(); // render outer first so inner overlays

  // Grid lines (subtle)
  const gridLines = Array.from({ length: levels }, (_, level) => {
    const r = (radius * (level + 1)) / levels;
    return (
      <polygon
        key={`grid-${level}`}
        points={polyPoints(r)}
        fill="none"
        stroke="rgba(231,229,228,0.6)"
        strokeWidth={1}
      />
    );
  });

  // Axis spokes
  const spokes = axisData.map((a) => (
    <line
      key={`spoke-${a.key}`}
      x1={cx}
      y1={cy}
      x2={cx + radius * Math.cos(a.angle)}
      y2={cy + radius * Math.sin(a.angle)}
      stroke="rgba(231,229,228,0.6)"
      strokeWidth={1}
    />
  ));

  // Level labels (1-5) along the top axis
  const levelLabels = Array.from({ length: levels }, (_, level) => {
    const r = (radius * (level + 1)) / levels;
    const topAxis = axisData[0]; // top axis (-PI/2)
    const x = cx + r * Math.cos(topAxis.angle) + 8;
    const y = cy + r * Math.sin(topAxis.angle) + 4;
    return (
      <text
        key={`lvl-${level}`}
        x={x}
        y={y}
        fill="#A8A29E"
        fontSize={9}
        fontWeight={500}
      >
        {level + 1}
      </text>
    );
  });

  // Score polygon points
  const scorePoints = axisData
    .map((a) => {
      const r = (radius * a.score) / 5;
      return `${(cx + r * Math.cos(a.angle)).toFixed(1)},${(cy + r * Math.sin(a.angle)).toFixed(1)}`;
    })
    .join(" ");

  // Data point coordinates
  const dataPoints = axisData.map((a) => {
    const r = (radius * a.score) / 5;
    return {
      key: a.key,
      x: cx + r * Math.cos(a.angle),
      y: cy + r * Math.sin(a.angle),
    };
  });

  // Labels with score badges
  const labels = axisData.map((a) => {
    const labelR = radius + 42;
    const x = cx + labelR * Math.cos(a.angle);
    const y = cy + labelR * Math.sin(a.angle);

    let anchor: "middle" | "start" | "end" = "middle";
    if (Math.cos(a.angle) > 0.3) anchor = "start";
    if (Math.cos(a.angle) < -0.3) anchor = "end";

    let yOffset = 0;
    if (Math.sin(a.angle) < -0.3) yOffset = -8;
    if (Math.sin(a.angle) > 0.3) yOffset = 16;

    return (
      <g key={`label-${a.key}`}>
        <text
          x={x}
          y={y + yOffset}
          textAnchor={anchor}
          fill="#44403C"
          fontSize={12}
          fontWeight={600}
          letterSpacing="0.01em"
        >
          {a.label}
        </text>
        <text
          x={x}
          y={y + yOffset + 16}
          textAnchor={anchor}
          fill="#DC2626"
          fontSize={15}
          fontWeight={800}
        >
          {a.score.toFixed(1)}
        </text>
      </g>
    );
  });

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Gradient fill for score area */}
          <radialGradient id="scoreGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(220,38,38,0.28)" />
            <stop offset="100%" stopColor="rgba(220,38,38,0.08)" />
          </radialGradient>
          {/* Glow filter */}
          <filter id="scoreGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Dot glow */}
          <filter id="dotGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* Filled bands (target rings) */}
        {bands}

        {/* Grid lines */}
        {gridLines}

        {/* Axis spokes */}
        {spokes}

        {/* Level labels */}
        {levelLabels}

        {/* Score area — glow layer */}
        <polygon
          points={scorePoints}
          fill="none"
          stroke="rgba(220,38,38,0.2)"
          strokeWidth={8}
          filter="url(#scoreGlow)"
        />

        {/* Score area — gradient fill */}
        <polygon
          points={scorePoints}
          fill="url(#scoreGradient)"
          stroke="#DC2626"
          strokeWidth={2.5}
          strokeLinejoin="round"
        />

        {/* Data point glow */}
        {dataPoints.map((p) => (
          <circle
            key={`glow-${p.key}`}
            cx={p.x}
            cy={p.y}
            r={8}
            fill="rgba(220,38,38,0.2)"
            filter="url(#dotGlow)"
          />
        ))}

        {/* Data points */}
        {dataPoints.map((p) => (
          <circle
            key={`dot-${p.key}`}
            cx={p.x}
            cy={p.y}
            r={5}
            fill="#DC2626"
            stroke="#FFFFFF"
            strokeWidth={2.5}
          />
        ))}

        {/* Labels + scores */}
        {labels}
      </svg>
    </div>
  );
}
