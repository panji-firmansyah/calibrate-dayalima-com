"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { QuizConfig } from "@/types";

type Phase = "intro" | "question" | "reveal" | "closing";

interface Props {
  quiz: QuizConfig;
  eventSlug: string;
}

export default function QuizSlideshow({ quiz, eventSlug }: Props) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("intro");
  const [qIndex, setQIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const total = quiz.questions.length;
  const question = quiz.questions[qIndex];

  const transition = useCallback((fn: () => void) => {
    setTransitioning(true);
    setTimeout(() => {
      fn();
      setTransitioning(false);
    }, 200);
  }, []);

  const advance = useCallback(() => {
    if (transitioning) return;
    transition(() => {
      if (phase === "intro") {
        setPhase("question");
        setQIndex(0);
      } else if (phase === "question") {
        setPhase("reveal");
      } else if (phase === "reveal") {
        if (qIndex < total - 1) {
          setQIndex((i) => i + 1);
          setPhase("question");
        } else {
          setPhase("closing");
        }
      }
      // closing: do nothing on advance
    });
  }, [phase, qIndex, total, transitioning, transition]);

  const goBack = useCallback(() => {
    if (transitioning) return;
    transition(() => {
      if (phase === "closing") {
        setPhase("reveal");
        setQIndex(total - 1);
      } else if (phase === "reveal") {
        setPhase("question");
      } else if (phase === "question") {
        if (qIndex > 0) {
          setQIndex((i) => i - 1);
          setPhase("reveal");
        } else {
          setPhase("intro");
        }
      }
      // intro: do nothing on goBack
    });
  }, [phase, qIndex, total, transitioning, transition]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (
        e.key === "ArrowRight" ||
        e.key === " " ||
        e.key === "Enter"
      ) {
        e.preventDefault();
        advance();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goBack();
      } else if (e.key === "Escape") {
        router.push(`/`);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [advance, goBack, router, eventSlug]);

  const choiceLabels = ["A", "B", "C", "D"];

  return (
    <div
      className="fixed inset-0 bg-[#1C1917] text-white flex flex-col cursor-pointer select-none"
      onClick={advance}
    >
      {/* Content */}
      <div
        className={`flex-1 flex items-center justify-center px-8 sm:px-16 transition-opacity duration-200 ${
          transitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* ========== INTRO ========== */}
        {phase === "intro" && (
          <div className="text-center max-w-3xl">
            <div className="inline-block px-4 py-1.5 rounded-full border border-[#DC2626]/30 bg-[#DC2626]/10 mb-8">
              <span className="text-sm font-semibold tracking-widest uppercase text-[#DC2626]">
                {quiz.subtitle}
              </span>
            </div>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tight leading-none">
              {quiz.title}
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-white/40">
              10 pertanyaan. 4 pilihan generasi. Research-backed
              reveal.
            </p>
            <p className="mt-12 text-sm text-white/25 animate-pulse">
              Tekan Space atau klik untuk mulai
            </p>
          </div>
        )}

        {/* ========== QUESTION (Screen A) ========== */}
        {phase === "question" && question && (
          <div className="w-full max-w-4xl">
            {/* Question number */}
            <div className="mb-8 sm:mb-12">
              <span className="text-6xl sm:text-8xl font-extrabold text-[#DC2626]/20 tabular-nums">
                {String(question.id).padStart(2, "0")}
              </span>
            </div>

            {/* Stereotype text */}
            <blockquote className="text-3xl sm:text-4xl md:text-5xl font-bold leading-snug tracking-tight">
              <span className="text-white/90">
                &ldquo;{question.stereotype}&rdquo;
              </span>
            </blockquote>

            {/* Subtext */}
            <p className="mt-6 text-base sm:text-lg text-white/30 uppercase tracking-widest font-semibold">
              Generasi mana?
            </p>

            {/* 4 choices */}
            <div className="mt-8 sm:mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {quiz.choices.map((choice, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-4 sm:py-5 text-center"
                >
                  <span className="block text-xs font-bold text-[#DC2626] mb-1">
                    {choiceLabels[i]}
                  </span>
                  <span className="text-sm sm:text-base font-medium text-white/70">
                    {choice}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========== REVEAL (Screen B) ========== */}
        {phase === "reveal" && question && (
          <div className="w-full max-w-3xl">
            {/* Reveal badge */}
            <div className="flex items-center gap-4 mb-6 sm:mb-8">
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#DC2626] text-white text-sm font-bold tracking-wider uppercase">
                Reveal
              </span>
              <span className="text-sm text-white/30 tabular-nums font-medium">
                {String(question.id).padStart(2, "0")} / {total}
              </span>
            </div>

            {/* Common bias */}
            <p className="text-base sm:text-lg text-white/40 mb-4">
              Bias umum:{" "}
              <span className="text-white/60 font-semibold">
                {question.commonBias}
              </span>
            </p>

            {/* Reveal text */}
            <p className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-snug text-white/90">
              {question.reveal}
            </p>

            {/* Source */}
            <p className="mt-8 sm:mt-12 text-xs sm:text-sm text-white/25 font-medium">
              Source: {question.source}
            </p>
          </div>
        )}

        {/* ========== CLOSING ========== */}
        {phase === "closing" && (
          <div className="text-center max-w-3xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-snug text-white/90">
              {quiz.closing.headline}
            </h2>
            <p className="mt-8 text-lg sm:text-xl text-white/50 leading-relaxed">
              {quiz.closing.insight}
            </p>
            <div className="mt-12 pt-8 border-t border-white/10">
              <p className="text-base sm:text-lg text-[#DC2626] font-semibold">
                {quiz.closing.bridge}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div className="px-8 py-4 flex items-center justify-between text-xs text-white/20">
        <span className="font-semibold tracking-widest uppercase">
          Daya Lima
        </span>
        {(phase === "question" || phase === "reveal") && (
          <span className="tabular-nums">
            {question.id} / {total}
          </span>
        )}
        <span className="hidden sm:block">
          Space / Arrow &rarr; next &middot; Arrow &larr; back &middot;
          Esc exit
        </span>
      </div>
    </div>
  );
}
