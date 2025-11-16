import { Story } from '@/types/story';

type TravelersStoriesItemProps = {
  story: Story;
};

export default function TravelersStoriesItem({
  story,
}: TravelersStoriesItemProps) {
  return (
    <div className="story-item">
      <div>
        {story.img}, {story._id}
      </div>
      <h3>{story.title}</h3>
      <p>{story.article}</p>
      <p>{story.favoriteCount}</p>
    </div>
  );
}
