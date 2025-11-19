export interface TravellerInfo {
  _id: string;
  name: string;
  avatarUrl: string;
  articlesAmount: number;
  description: string;
  selectedStories: string[];
}

export interface Story {
  _id: string;
  img: string;
  title: string;
  date: string;
  favoriteCount: number;
}

export interface ApiTravellerResponse {
  status: number;
  message: string;
  data: {
    user: TravellerInfo;
    stories: Story[];
  };
}
