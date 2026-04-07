import { NextRequest, NextResponse } from "next/server";
import { signToken, setAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  const validUser = process.env.ADMIN_USERNAME;
  const validPass = process.env.ADMIN_PASSWORD;

  if (!validUser || !validPass) {
    console.error("[auth/login] Missing ADMIN_USERNAME or ADMIN_PASSWORD");
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  if (
    username?.toLowerCase() !== validUser.toLowerCase() ||
    password !== validPass
  ) {
    return NextResponse.json(
      { error: "Username atau password salah" },
      { status: 401 }
    );
  }

  const token = await signToken({ user: username, role: "admin" });
  await setAuthCookie(token);

  return NextResponse.json({ success: true });
}
