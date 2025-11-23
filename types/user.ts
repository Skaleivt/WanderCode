export interface User {
  _id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  selectedStories?: string[];
}

export interface UserResponse {
  data: User;
}
