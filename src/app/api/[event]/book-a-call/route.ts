import { NextRequest, NextResponse } from "next/server";
import { EVENTS } from "@/config/events";
import {
  validateRequired,
  validateEmail,
  insertToSupabase,
} from "@/lib/form-utils";
import { supabase } from "@/lib/supabase";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ event: string }> }
) {
  const { event: slug } = await params;
  const eventConfig = EVENTS[slug];

  if (!eventConfig || !eventConfig.features.bookACall) {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  const body = await request.json();

  // Honeypot check
  if (body.website) {
    return NextResponse.json({ success: true });
  }

  const fieldError = validateRequired(body, [
    "nama",
    "email",
    "whatsapp",
    "perusahaan",
    "jabatan",
  ]);
  if (fieldError) return fieldError;

  const emailError = validateEmail(body.email);
  if (emailError) return emailError;

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
    "calibrate_book_calls",
    {
      event_id: eventRow.id,
      nama: body.nama,
      email: body.email,
      whatsapp: body.whatsapp,
      perusahaan: body.perusahaan,
      jabatan: body.jabatan,
      topik: body.topik ?? null,
      pesan: body.pesan ?? null,
    },
    `book-a-call/${slug}`
  );
}
