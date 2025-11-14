// types/user.ts
export interface User {
  id: string;
  _id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  articlesAmount?: number;
}
