// lib/api/serverApi.ts
import { NextRequest } from 'next/server';

// Defines the expected response structure for session checks,
// specifically including a place for setting cookies (headers).
export interface SessionCheckResponse {
    headers: {
        'set-cookie': string | string[] | undefined;
    };
}

// Function to check server-side session based on incoming request cookies.
// It must be async and return a headers object for Next.js Middleware compatibility.
export async function checkServerSession(request: NextRequest): Promise<SessionCheckResponse> {
    const token = request.cookies.get('auth_token')?.value;

    if (token && token.length > 10) {
        // In a real application, this would involve validating the token with the backend
        // and potentially refreshing the session, returning new cookies.
        return { headers: { 'set-cookie': undefined } };
    }

    // Returns a dummy headers object if the session is not found or invalid.
    return { headers: { 'set-cookie': undefined } };
}
