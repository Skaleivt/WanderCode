// lib/api/serverApi.ts

import { NextRequest } from 'next/server';

export function checkServerSession(request: NextRequest): boolean {
  const token = request.cookies.get('auth_token')?.value;

  if (token && token.length > 10) {
    return true;
  }

  return false;
}
