"use client";

import { useState } from "react";
import type { EventConfig } from "@/types";
import LikertQuestion from "./LikertQuestion";
import MultipleChoiceQuestion from "./MultipleChoiceQuestion";
import { CheckCircle } from "lucide-react";

interface Props {
  event: EventConfig;
  slug: string;
}

type Status = "idle" | "loading" | "success" | "error";

export default function DiagnosticForm({ event, slug }: Props) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [contactData, setContactData] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const [step, setStep] = useState(0);
  const allQuestionsAnswered = event.questions.every((q) => answers[q.id] != null);

  function handleAnswer(questionId: string, value: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  function handleContactChange(fieldId: string, value: string) {
    setContactData((prev) => ({ ...prev, [fieldId]: value }));
  }

  function goToContact() {
    if (!allQuestionsAnswered) return;
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch(`/api/${slug}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...answers, ...contactData }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Terjadi kesalahan");
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setErrorMsg("Gagal mengirim. Periksa koneksi internet Anda.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-16 px-6">
        <CheckCircle
          className="mx-auto mb-4 text-green-500"
          size={56}
          strokeWidth={1.5}
        />
        <h2 className="text-xl font-bold text-text-primary mb-2">
          Terima kasih!
        </h2>
        <p className="text-text-secondary max-w-md mx-auto">
          Respons Anda telah berhasil dikirim. Tim kami akan menghubungi Anda
          untuk langkah selanjutnya.
        </p>
        {event.features.bookACall && (
          <a
            href={`/${slug}/book-a-call`}
            className="inline-block mt-6 px-6 py-2.5 rounded-md bg-brand text-white text-sm font-medium hover:bg-brand-hover transition-colors"
          >
            Book a Call
          </a>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute opacity-0 h-0 w-0 pointer-events-none"
      />

      {step === 0 && (
        <div>
          <div className="mb-6">
            <p className="text-sm text-text-muted">
              Tidak ada jawaban benar atau salah. Jawab sesuai kondisi
              organisasi Anda saat ini.
            </p>
          </div>

          {event.questions.map((q, i) => {
            switch (q.type) {
              case "likert":
                return (
                  <LikertQuestion
                    key={q.id}
                    question={q}
                    scale={event.scale}
                    index={i}
                    value={answers[q.id] ?? null}
                    onChange={handleAnswer}
                  />
                );
              case "multiple-choice":
                return (
                  <MultipleChoiceQuestion
                    key={q.id}
                    question={q}
                    index={i}
                    value={answers[q.id] ?? null}
                    onChange={handleAnswer}
                  />
                );
            }
          })}

          <button
            type="button"
            onClick={goToContact}
            disabled={!allQuestionsAnswered}
            className="w-full h-12 rounded-md bg-brand text-white text-sm font-medium hover:bg-brand-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Lanjut
          </button>
        </div>
      )}

      {step === 1 && (
        <div>
          <button
            type="button"
            onClick={() => setStep(0)}
            className="text-sm text-brand hover:underline mb-4 cursor-pointer"
          >
            &larr; Kembali ke pertanyaan
          </button>

          <p className="text-sm text-text-muted mb-6">
            Lengkapi data kontak Anda untuk menerima hasil diagnostic.
          </p>

          <div className="space-y-4 mb-6">
            {event.contactFields.map((field) => (
              <div key={field.id}>
                <label
                  htmlFor={field.id}
                  className="block text-sm font-medium text-text-secondary mb-1.5"
                >
                  {field.label}
                  {field.required && (
                    <span className="text-brand ml-0.5">*</span>
                  )}
                </label>
                <input
                  id={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  required={field.required}
                  autoComplete={field.autocomplete}
                  value={contactData[field.id] ?? ""}
                  onChange={(e) =>
                    handleContactChange(field.id, e.target.value)
                  }
                  className="w-full h-11 rounded-md border border-border bg-white px-3 text-sm text-text-primary placeholder:text-text-placeholder focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none transition-colors"
                />
              </div>
            ))}
          </div>

          {errorMsg && (
            <p className="text-sm text-brand mb-4">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full h-12 rounded-md bg-brand text-white text-sm font-medium hover:bg-brand-hover disabled:opacity-60 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {status === "loading" ? "Mengirim..." : "Submit Diagnostic"}
          </button>
        </div>
      )}
    </form>
  );
}
