import Link from "next/link";
import { getAllEvents } from "@/config/events";
import { BarChart3, FileText, Table2 } from "lucide-react";
import type { Metadata } from "next";
import LogoutButton from "./LogoutButton";

export const metadata: Metadata = {
  title: "Admin",
};

export default function AdminPage() {
  const events = getAllEvents();
  const eventsWithFeatures = events;

  return (
    <main className="flex-1 flex items-start justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-text-muted">
              Daya Lima
            </p>
            <h1 className="mt-1 text-2xl font-bold text-text-primary">
              Calibrate Admin
            </h1>
          </div>
          <LogoutButton />
        </div>

        {/* Event List */}
        <div className="space-y-4">
          {eventsWithFeatures.map(([slug, event]) => (
            <div
              key={slug}
              className="rounded-lg border border-border bg-bg-card p-6"
              style={{ boxShadow: "var(--shadow-sm)" }}
            >
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-semibold text-text-primary">
                  {event.name}
                </h2>
                {event.status === "active" && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-green-500">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500" />
                    Live
                  </span>
                )}
                {event.status === "closed" && (
                  <span className="text-xs font-medium text-text-muted">
                    Selesai
                  </span>
                )}
              </div>
              <p className="text-sm text-text-secondary mb-4">
                {event.tagline}
              </p>

              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/admin/${slug}/submissions`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-brand text-white text-sm font-medium hover:bg-brand-hover transition-colors"
                >
                  <Table2 size={15} />
                  Data Submissions
                </Link>
                {event.features.dashboard && (
                  <Link
                    href={`/${slug}/dashboard`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md border border-border text-sm font-medium text-text-secondary hover:border-border-hover hover:text-text-primary transition-colors"
                  >
                    <BarChart3 size={15} />
                    Dashboard
                  </Link>
                )}
                {event.features.report && (
                  <Link
                    href={`/${slug}/report`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md border border-border text-sm font-medium text-text-secondary hover:border-border-hover hover:text-text-primary transition-colors"
                  >
                    <FileText size={15} />
                    Report
                  </Link>
                )}
              </div>
            </div>
          ))}

          {eventsWithFeatures.length === 0 && (
            <p className="text-center text-text-muted py-8">
              Belum ada event dengan dashboard atau report.
            </p>
          )}
        </div>

        <footer className="mt-12 text-center text-xs text-text-muted">
          Daya Lima &middot; Calibrate Talent Diagnostic
        </footer>
      </div>
    </main>
  );
}
