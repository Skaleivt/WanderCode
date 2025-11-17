// lib/api/api.ts
import axios from 'axios';
export function logErrorResponse(errorData: unknown) {
  if (errorData) {
    console.error('API Error Response:', JSON.stringify(errorData, null, 2));
  }
}
export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  withCredentials: true,
});
