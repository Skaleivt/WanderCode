<<<<<<< Updated upstream
// lib/api/serverApi.ts

import { NextRequest } from 'next/server';

export function checkServerSession(request: NextRequest): boolean {
  const token = request.cookies.get('auth_token')?.value;

  if (token && token.length > 10) {
    return true;
  }

  return false;
}
=======
// серверні запити

// тимчасова заглушка
export async function checkServerSession() {
  return {
    headers: {
      'set-cookie': [],
    },
  };
}
>>>>>>> Stashed changes
