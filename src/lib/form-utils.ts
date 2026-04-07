import { NextResponse } from "next/server";
import { supabase } from "./supabase";

export function validateRequired(
  body: Record<string, unknown>,
  fields: string[]
): NextResponse | null {
  for (const field of fields) {
    if (!body[field] && body[field] !== 0 && body[field] !== false) {
      return NextResponse.json(
        { error: `Missing required field: ${field}` },
        { status: 400 }
      );
    }
  }
  return null;
}

export function validateEmail(email: string): NextResponse | null {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Invalid email format" },
      { status: 400 }
    );
  }
  return null;
}

export async function insertToSupabase(
  table: string,
  data: Record<string, unknown>,
  logPrefix: string
): Promise<NextResponse> {
  const { error } = await supabase.from(table).insert(data);

  if (error) {
    console.error(`[${logPrefix}] Supabase error:`, error.message);
    return NextResponse.json(
      { error: "Failed to submit. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
