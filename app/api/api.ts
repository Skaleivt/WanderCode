import axios from 'axios';

export const api = axios.create({
  baseURL: `${process.env.BACKEND_URL}/api`,
  withCredentials: true,
});
//app/api/api.ts
