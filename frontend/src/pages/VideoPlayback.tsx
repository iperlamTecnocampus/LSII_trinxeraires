import { CommentsSection } from '@/components/watch/CommentsSection';
import { RelatedVideos } from '@/components/watch/RelatedVideos';
import { VideoDescription } from '@/components/watch/VideoDescription';
import { VideoDetails } from '@/components/watch/VideoDetails';
import { VideoPlayer } from '@/components/watch/VideoPlayer';

import {
  mockCommentCount,
  mockComments,
  mockRelatedVideos,
  mockVideo,
} from '@/components/watch/mock-video-data';

export function VideoPlayback() {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">
        <main className="min-w-0">
          <VideoPlayer
            poster={mockVideo.thumbnail}
            title={mockVideo.title}
          />

          <VideoDetails video={mockVideo} />

          <VideoDescription video={mockVideo} />

          <CommentsSection
            comments={mockComments}
            commentCount={mockCommentCount}
          />
        </main>

        <div className="min-w-0">
          <RelatedVideos videos={mockRelatedVideos} />
        </div>
      </div>
    </div>
  );
}