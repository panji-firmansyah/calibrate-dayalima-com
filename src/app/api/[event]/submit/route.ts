import { NextRequest, NextResponse } from "next/server";
import { EVENTS } from "@/config/events";
import { validateRequired, insertToSupabase } from "@/lib/form-utils";
import { computeTotalScore } from "@/lib/scoring";
import { supabase } from "@/lib/supabase";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ event: string }> }
) {
  const { event: slug } = await params;
  const eventConfig = EVENTS[slug];

  if (!eventConfig) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const body = await request.json();

  // Honeypot check
  if (body.website) {
    return NextResponse.json({ success: true });
  }

  // Validate required contact fields
  const requiredFields = eventConfig.contactFields
    .filter((f) => f.required)
    .map((f) => f.id);
  const fieldError = validateRequired(body, requiredFields);
  if (fieldError) return fieldError;

  // Validate all questions are answered — dynamic per question type
  const scores: Record<string, number> = {};
  for (const q of eventConfig.questions) {
    const val = Number(body[q.id]);

    if (q.type === "likert") {
      if (isNaN(val) || val < q.scaleMin || val > q.scaleMax) {
        return NextResponse.json(
          { error: `Invalid answer for ${q.label} (expected ${q.scaleMin}-${q.scaleMax})` },
          { status: 400 }
        );
      }
    } else if (q.type === "multiple-choice") {
      const validValues = q.options.map((o) => o.value);
      if (isNaN(val) || !validValues.includes(val)) {
        return NextResponse.json(
          { error: `Invalid answer for ${q.label}` },
          { status: 400 }
        );
      }
    }

    scores[q.id] = val;
  }

  const totalScore = computeTotalScore(scores, eventConfig);

  // Look up event_id from calibrate_events
  const { data: eventRow } = await supabase
    .from("calibrate_events")
    .select("id")
    .eq("slug", slug)
    .single();

  if (!eventRow) {
    return NextResponse.json(
      { error: "Event not configured in database" },
      { status: 500 }
    );
  }

  return insertToSupabase(
    eventConfig.table,
    {
      event_id: eventRow.id,
      nama: body.nama,
      perusahaan: body.perusahaan ?? null,
      jabatan: body.jabatan ?? null,
      scores,
      total_score: totalScore,
    },
    `submit/${slug}`
  );
}
