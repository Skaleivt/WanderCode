// app/api/users/saved/route.ts

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Saved users endpoint is active' });
}
