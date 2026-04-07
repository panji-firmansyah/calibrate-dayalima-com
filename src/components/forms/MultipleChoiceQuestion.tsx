"use client";

import type { MultipleChoiceQuestionDef } from "@/types";

interface Props {
  question: MultipleChoiceQuestionDef;
  index: number;
  value: number | null;
  onChange: (questionId: string, value: number) => void;
}

export default function MultipleChoiceQuestion({
  question,
  index,
  value,
  onChange,
}: Props) {
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

      <div className="space-y-2 pl-10">
        {question.options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(question.id, option.value)}
            className={`
              w-full text-left px-4 py-3 rounded-md border text-sm transition-all cursor-pointer
              ${
                value === option.value
                  ? "bg-brand text-white border-brand shadow-brand"
                  : "bg-white text-text-primary border-border hover:border-border-hover hover:bg-neutral-50"
              }
            `}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
