import Link from "next/link";
import { getAllEvents } from "@/config/events";
import { Lock, Presentation } from "lucide-react";

export default function EventHub() {
  const events = getAllEvents();
  const eventsWithDashboard = events.filter(([, e]) => e.features.dashboard);

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold tracking-widest uppercase text-text-muted">
            Daya Lima
          </p>
          <h1 className="mt-1 text-3xl font-bold text-text-primary">
            Calibrate
          </h1>
          <p className="mt-2 text-text-secondary">
            Diagnostic tools untuk talent management organisasi Anda
          </p>
        </div>

        {/* Event Cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          {events.map(([slug, event]) => (
            <div
              key={slug}
              className="rounded-lg border border-border bg-bg-card overflow-hidden transition-all hover:border-border-hover hover:shadow-md"
            >
              <Link
                href={`/${slug}`}
                className="group block p-6"
              >
                <div className="flex items-center gap-2 mb-2">
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
                <p className="text-sm text-text-secondary">
                  {event.tagline}
                </p>
                <p className="mt-3 text-sm font-medium text-brand group-hover:underline">
                  Lihat detail &rarr;
                </p>
              </Link>
              {event.quiz && (
                <div className="px-6 pb-5">
                  <Link
                    href={`/${slug}/quiz`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-white/80 bg-[#1C1917] hover:bg-[#292524] px-3 py-1.5 rounded transition-colors"
                  >
                    <Presentation size={12} />
                    Buka Quiz Slideshow
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Admin Section */}
        {eventsWithDashboard.length > 0 && (
          <div className="mt-10 pt-8 border-t border-border">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Lock size={14} className="text-text-muted" />
              <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Admin
              </span>
            </div>
            <div className="flex justify-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-border bg-bg-card text-sm font-medium text-text-secondary hover:border-border-hover hover:text-text-primary transition-colors"
              >
                <Lock size={14} />
                Masuk ke Dashboard
              </Link>
            </div>
          </div>
        )}

        <footer className="mt-12 text-center text-xs text-text-muted">
          Daya Lima &middot; Calibrate Talent Diagnostic
        </footer>
      </div>
    </main>
  );
}
