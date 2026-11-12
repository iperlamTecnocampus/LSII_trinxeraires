import { VideoCard } from './VideoCard';

import type { components } from '@/api-schema.d.ts';
type VideoInfoDTO = components['schemas']['VideoInfoDTO'];

export interface VideoGridProps {
  videos?: VideoInfoDTO[];
}

export function VideoGrid({ videos }: VideoGridProps = {}) {
  return (
    <div className="flex w-full flex-row flex-wrap justify-center-safe gap-2">
      {videos
        ? videos.map((video) => <VideoCard key={video.videoId} video={video} />)
        : Array.from({ length: 8 }, (_, i) => <VideoCard key={i} to={`/watch/${i + 1}`} />)}
    </div>
  );
}
