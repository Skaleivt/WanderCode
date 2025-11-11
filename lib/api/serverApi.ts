// серверні запити
// lib/api/serverApi.ts

import { NextRequest } from 'next/server';

/**
 * Checks if a user session is valid based on the provided token or cookies.
 * NOTE: The logic here MUST be compatible with the Next.js Edge Runtime (no Node.js-specific code).
 */
export function checkServerSession(request: NextRequest): boolean {
  // Тут павінна быць ваша фактычная логіка праверкі токена
  // Напрыклад, чытанне печыва (cookies) і валідацыя токена

  const token = request.cookies.get('auth_token')?.value;

  if (token && token.length > 10) {
    // Умоўны прыклад: лічым сесію сапраўднай, калі токен доўгі
    return true;
  }

  return false;
}

// Калі ласка, пераканайцеся, што слова 'export' прысутнічае!
