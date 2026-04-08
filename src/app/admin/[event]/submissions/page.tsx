import { notFound } from "next/navigation";
import Link from "next/link";
import { EVENTS } from "@/config/events";
import { supabase } from "@/lib/supabase";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ event: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { event: slug } = await params;
  const event = EVENTS[slug];
  if (!event) return {};
  return { title: `Submissions — ${event.name}` };
}

export default async function SubmissionsPage({ params }: Props) {
  const { event: slug } = await params;
  const event = EVENTS[slug];
  if (!event) notFound();

  // Fetch event_id
  const { data: eventRow } = await supabase
    .from("calibrate_events")
    .select("id")
    .eq("slug", slug)
    .single();

  if (!eventRow) notFound();

  // Fetch all submissions
  const { data: rows } = await supabase
    .from(event.table)
    .select("*")
    .eq("event_id", eventRow.id)
    .order("created_at", { ascending: false });

  const submissions = rows ?? [];
  const questionLabels = event.questions.map((q) => ({
    id: q.id,
    label: q.label,
  }));

  return (
    <main className="flex-1 px-4 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-primary transition-colors mb-4"
          >
            <ArrowLeft size={14} />
            Kembali ke Admin
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">
                {event.name}
              </h1>
              <p className="text-sm text-text-secondary mt-1">
                {submissions.length} submissions
              </p>
            </div>
            {event.status === "active" && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-green-500">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500" />
                Live
              </span>
            )}
          </div>
        </div>

        {/* Table */}
        {submissions.length === 0 ? (
          <div
            className="rounded-lg border border-border bg-bg-card p-12 text-center"
            style={{ boxShadow: "var(--shadow-sm)" }}
          >
            <p className="text-text-muted">Belum ada data submissions.</p>
          </div>
        ) : (
          <div
            className="rounded-lg border border-border bg-bg-card overflow-hidden"
            style={{ boxShadow: "var(--shadow-sm)" }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-bg-subtle">
                    <th className="text-left px-4 py-3 font-semibold text-text-muted text-xs uppercase tracking-wider">
                      #
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-text-muted text-xs uppercase tracking-wider">
                      Nama
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-text-muted text-xs uppercase tracking-wider">
                      Perusahaan
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-text-muted text-xs uppercase tracking-wider">
                      Jabatan
                    </th>
                    {questionLabels.map((q) => (
                      <th
                        key={q.id}
                        className="text-center px-3 py-3 font-semibold text-text-muted text-xs uppercase tracking-wider"
                      >
                        {q.label}
                      </th>
                    ))}
                    <th className="text-center px-4 py-3 font-semibold text-text-muted text-xs uppercase tracking-wider">
                      Total
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-text-muted text-xs uppercase tracking-wider">
                      Waktu
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {submissions.map(
                    (
                      row: {
                        id: string;
                        nama: string;
                        perusahaan: string;
                        jabatan: string;
                        scores: Record<string, number>;
                        total_score: number;
                        created_at: string;
                      },
                      idx: number
                    ) => {
                      const scores =
                        typeof row.scores === "string"
                          ? JSON.parse(row.scores)
                          : row.scores ?? {};
                      return (
                        <tr
                          key={row.id}
                          className="hover:bg-bg-subtle/50 transition-colors"
                        >
                          <td className="px-4 py-3 text-text-muted tabular-nums">
                            {idx + 1}
                          </td>
                          <td className="px-4 py-3 font-medium text-text-primary whitespace-nowrap">
                            {row.nama}
                          </td>
                          <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                            {row.perusahaan}
                          </td>
                          <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                            {row.jabatan}
                          </td>
                          {questionLabels.map((q) => (
                            <td
                              key={q.id}
                              className="px-3 py-3 text-center tabular-nums text-text-secondary"
                            >
                              {scores[q.id] ?? "—"}
                            </td>
                          ))}
                          <td className="px-4 py-3 text-center font-bold text-text-primary tabular-nums">
                            {row.total_score}
                          </td>
                          <td className="px-4 py-3 text-text-muted text-xs whitespace-nowrap">
                            {new Date(row.created_at).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <footer className="mt-12 text-center text-xs text-text-muted">
          Daya Lima &middot; {event.name}
        </footer>
      </div>
    </main>
  );
}
