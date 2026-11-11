import { VideoCard } from './VideoCard';

import type { components } from '@/api-schema.d.ts';
type VideoInfoDTO = components['schemas']['VideoInfoDTO'];

export function VideoGrid({ videos }: { videos: VideoInfoDTO[] }) {
  return (
    <div className="flex flex-row flex-wrap w-full gap-2 justify-center-safe">
      {videos.map((video) => (
        <VideoCard video={video} />
      ))}
    </div>
  );
}
