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
  const radius = 170;
  const levels = 5;

  const axisData = axes.map((a, i) => ({
    ...a,
    angle: -Math.PI / 2 + ((2 * Math.PI) / axes.length) * i,
  }));

  // Grid pentagons
  const grids = Array.from({ length: levels }, (_, level) => {
    const r = (radius * (level + 1)) / levels;
    const points = axisData
      .map((a) => `${(cx + r * Math.cos(a.angle)).toFixed(1)},${(cy + r * Math.sin(a.angle)).toFixed(1)}`)
      .join(" ");
    return <polygon key={level} points={points} fill="none" stroke="rgba(28,25,23,0.08)" strokeWidth={1} />;
  });

  // Axis lines
  const axisLines = axisData.map((a) => (
    <line
      key={a.key}
      x1={cx}
      y1={cy}
      x2={cx + radius * Math.cos(a.angle)}
      y2={cy + radius * Math.sin(a.angle)}
      stroke="rgba(28,25,23,0.08)"
      strokeWidth={1}
    />
  ));

  // Score polygon
  const scorePoints = axisData
    .map((a) => {
      const r = (radius * a.score) / 5;
      return `${(cx + r * Math.cos(a.angle)).toFixed(1)},${(cy + r * Math.sin(a.angle)).toFixed(1)}`;
    })
    .join(" ");

  // Score dots
  const dots = axisData.map((a) => {
    const r = (radius * a.score) / 5;
    return (
      <circle
        key={a.key}
        cx={cx + r * Math.cos(a.angle)}
        cy={cy + r * Math.sin(a.angle)}
        r={5}
        fill="#DC2626"
        stroke="#FFFFFF"
        strokeWidth={2}
      />
    );
  });

  // Labels
  const labels = axisData.map((a) => {
    const labelR = radius + 35;
    const x = cx + labelR * Math.cos(a.angle);
    const y = cy + labelR * Math.sin(a.angle);

    let anchor: "middle" | "start" | "end" = "middle";
    if (Math.cos(a.angle) > 0.3) anchor = "start";
    if (Math.cos(a.angle) < -0.3) anchor = "end";

    let yOffset = 0;
    if (Math.sin(a.angle) < -0.3) yOffset = -6;
    if (Math.sin(a.angle) > 0.3) yOffset = 14;

    return (
      <g key={a.key}>
        <text
          x={x}
          y={y + yOffset}
          textAnchor={anchor}
          fill="#292524"
          fontSize={14}
          fontWeight={700}
        >
          {a.label}
        </text>
        <text
          x={x}
          y={y + yOffset + 16}
          textAnchor={anchor}
          fill="#DC2626"
          fontSize={16}
          fontWeight={800}
        >
          {a.score.toFixed(1)}
        </text>
      </g>
    );
  });

  return (
    <div className="w-full max-w-md mx-auto">
      <svg viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {grids}
        {axisLines}
        <polygon
          points={scorePoints}
          fill="rgba(220,38,38,0.10)"
          stroke="rgba(220,38,38,0.35)"
          strokeWidth={4}
          filter="url(#glow)"
        />
        <polygon
          points={scorePoints}
          fill="rgba(220,38,38,0.18)"
          stroke="#DC2626"
          strokeWidth={2}
        />
        {dots}
        {labels}
      </svg>
    </div>
  );
}
