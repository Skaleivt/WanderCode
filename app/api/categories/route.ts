

import { NextResponse } from 'next/server'; 
import { nextServer } from '@/lib/api/api';
import { cookies } from 'next/headers';



export async function GET() {
  try {
    const cookieStore = await cookies();

    const res = await nextServer.get("/categories", {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (err) {
    console.error("Categories error:", err);
    return NextResponse.json(
      { error: "Failed to load categories" },
      { status: 500 }
    );
  }
}