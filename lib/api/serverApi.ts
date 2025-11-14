// lib/api/serverApi.ts (Выпраўлена для кампіляцыі)

import { NextRequest } from 'next/server';

// !!! НОВЫ ТЫП ВЯРТАННЯ !!!
export interface SessionCheckResponse {
  headers: {
    'set-cookie': string | string[] | undefined;
  };
}

// !!! ЗМЕНА ФУНКЦЫІ: Цяпер яна асінхронная і вяртае аб'ект !!!
export async function checkServerSession(
  request: NextRequest
): Promise<SessionCheckResponse> {
  const token = request.cookies.get('auth_token')?.value;

  if (token && token.length > 10) {
    // Калі токен ёсць, у ідэале тут павінен быць выклік бэкенда.
    // Для кампіляцыі проста вяртаем пусты аб'ект загалоўкаў:
    return { headers: { 'set-cookie': undefined } };
  }

  // Калі токена няма, таксама вяртаем аб'ект з пустымі загалоўкамі
  return { headers: { 'set-cookie': undefined } };
}
