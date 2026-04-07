"use client";

import type { LikertQuestionDef, ScaleConfig } from "@/types";

interface Props {
  question: LikertQuestionDef;
  scale: ScaleConfig;
  index: number;
  value: number | null;
  onChange: (questionId: string, value: number) => void;
}

export default function LikertQuestion({
  question,
  scale,
  index,
  value,
  onChange,
}: Props) {
  const min = question.scaleMin;
  const max = question.scaleMax;
  const buttons = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div className="mb-8">
      <div className="flex items-start gap-3 mb-4">
        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-neutral-100 text-text-secondary text-sm font-semibold flex items-center justify-center">
          {index + 1}
        </span>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand">
            {question.label}
          </span>
          <p
            className="mt-1 text-text-primary leading-relaxed"
            dangerouslySetInnerHTML={{ __html: question.text }}
          />
        </div>
      </div>

      <div className="flex gap-2 pl-10">
        {buttons.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(question.id, n)}
            className={`
              w-12 h-12 rounded-md border text-sm font-semibold transition-all cursor-pointer
              ${
                value === n
                  ? "bg-brand text-white border-brand shadow-brand"
                  : "bg-white text-text-secondary border-border hover:border-border-hover hover:bg-neutral-50"
              }
            `}
          >
            {n}
          </button>
        ))}
      </div>

      <div className="flex justify-between pl-10 mt-1.5 text-[10px] text-text-muted">
        <span>{scale.minLabel}</span>
        <span>{scale.maxLabel}</span>
      </div>
    </div>
  );
}
