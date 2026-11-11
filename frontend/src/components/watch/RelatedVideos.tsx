import { VideoCard } from '@/components/VideoCard';


import type { components } from "@/api-schema.d.ts";

type VideoInfoDTO = components["schemas"]["VideoInfoDTO"];


export function RelatedVideos({ videos }: { videos: VideoInfoDTO[] }) {
  return (
    <aside>
      <h2 className="mb-3 text-lg font-semibold">Related videos</h2>

      <div className="flex flex-col gap-1">
        {videos.map((video) => (
          <VideoCard
            key={video.videoId}
            video={video}
            variant="compact"
          />
        ))}
      </div>
    </aside>
  );
}
