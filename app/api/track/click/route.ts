import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { handle, type, ts } = await req.json();

    if (!handle || !type || typeof handle !== "string" || typeof type !== "string") {
      return new NextResponse(null, { status: 400 });
    }

    await Promise.all([
      kv.incr(`stats:clicks:${handle}:${type}`),
      kv.lpush(`stats:clicklog:${handle}`, JSON.stringify({ ts: ts ?? Date.now(), type })),
      kv.ltrim(`stats:clicklog:${handle}`, 0, 999),
    ]);

    return new NextResponse(null, { status: 204 });
  } catch {
    return new NextResponse(null, { status: 500 });
  }
}
