import { VideoCard } from '@/components/VideoCard';

import { formatCount } from './format';
import type { RelatedVideo } from './types';

interface RelatedVideosProps {
  videos: RelatedVideo[];
}

export function RelatedVideos({
  videos,
}: RelatedVideosProps) {
  return (
    <aside>
      <h2 className="mb-3 text-lg font-semibold">
        Related videos
      </h2>

      <div className="flex flex-col gap-1">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            variant="compact"
            title={video.title}
            channelName={video.channelName}
            views={`${formatCount(video.views)} views`}
            uploadedAt={video.uploadedAt}
            thumbnail={video.thumbnail}
            to={`/watch/${video.id}`}
          />
        ))}
      </div>
    </aside>
  );
}