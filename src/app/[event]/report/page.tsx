import { notFound } from "next/navigation";
import { EVENTS } from "@/config/events";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ event: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { event: slug } = await params;
  const event = EVENTS[slug];
  if (!event) return {};

  return { title: `Report — ${event.name}` };
}

export default async function ReportPage({ params }: Props) {
  const { event: slug } = await params;
  const event = EVENTS[slug];

  if (!event || !event.features.report) notFound();

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="text-center">
        <p className="text-xs font-semibold tracking-widest uppercase text-text-muted">
          Daya Lima
        </p>
        <h1 className="mt-1 text-2xl font-bold text-text-primary">
          {event.name} — Report
        </h1>
        <p className="mt-2 text-text-secondary">
          Report sedang dalam pengembangan.
        </p>
      </div>
    </main>
  );
}
