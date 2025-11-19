export interface User {
  _id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  selectedStories?: [];
}

export interface UserResponse {
  data: User;
}
