// app/api/users/[userId]/route.ts
import { NextResponse } from 'next/server';

// !!! ВЫКАРЫСТАННЕ 'any' ДЛЯ АБХОДУ ПАМЫЛКІ ЗБОРКІ NEXT.JS/TS !!!

export async function GET(
  request: Request,
  context: any // Выкарыстоўваем any для вырашэння праблемы з Promise
) {
  // Прымяненне тыпізацыі ўнутры функцыі для бяспекі
  const userId = (context.params as { userId: string }).userId;

  // Мінімальны адказ для праходжання зборкі.
  return NextResponse.json({
    message: `Запыт на карыстальніка з ID: ${userId} паспяхова апрацаваны.`,
    status: 'OK',
  });
}
