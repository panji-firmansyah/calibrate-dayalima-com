import { notFound } from "next/navigation";
import { EVENTS } from "@/config/events";
import BookACallForm from "@/components/forms/BookACallForm";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ event: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { event: slug } = await params;
  const event = EVENTS[slug];
  if (!event) return {};

  return {
    title: `Book a Call — ${event.name}`,
    description: `Jadwalkan sesi konsultasi untuk ${event.name}`,
  };
}

export default async function BookACallPage({ params }: Props) {
  const { event: slug } = await params;
  const event = EVENTS[slug];

  if (!event || !event.features.bookACall) notFound();

  return (
    <main className="flex-1 flex items-start justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-md">
        <div
          className="rounded-lg border border-border bg-bg-card p-6 sm:p-8"
          style={{ boxShadow: "var(--shadow-sm)" }}
        >
          <div className="text-center mb-8">
            <p className="text-xs font-semibold tracking-widest uppercase text-text-muted">
              Daya Lima
            </p>
            <h1 className="mt-1 text-2xl font-bold text-text-primary">
              Book a Call
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              Jadwalkan sesi konsultasi untuk {event.name}
            </p>
          </div>

          <BookACallForm slug={slug} />
        </div>

        <footer className="mt-6 text-center text-xs text-text-muted">
          Daya Lima &middot; Calibrate Talent Diagnostic
        </footer>
      </div>
    </main>
  );
}
