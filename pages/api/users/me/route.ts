// створити приватний ендпоінт на отримання інформації про поточного користувача
// створити приватний ендпоінт для додавання статті до збережених статей користувача
// створити приватний ендпоінт для видалення статті зі збережених статей користувача
// створити приватний ендпоінт для оновлення аватару корситувача
// створити приватний ендпоінт для оновлення даних користувача

import { cookies } from "next/headers";
import { api } from "../../api";
import { NextResponse } from "next/server";
import { isAxiosError } from "axios";
import { logErrorResponse } from "../../_utils/utils";

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const body = await request.json();

    const res = await api.patch("/users/me", body, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.status }
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
