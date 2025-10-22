import { NextResponse } from 'next/server';
export const dynamic = 'force-static'; // static until real API wired; can switch to SSR if needed
export async function GET() {
    // TODO: integrate Google Places API and cache via Vercel KV
    return NextResponse.json({ reviews: [] });
}