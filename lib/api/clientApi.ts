// lib/api/clientApi.ts

export async function checkSession(): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/session', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error during session check:', error);
    return false;
  }
}

export async function getMe() {
  return null;
}
