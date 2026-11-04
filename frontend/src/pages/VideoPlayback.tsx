import { useParams } from 'react-router';
import { CommentsSection } from '@/components/watch/CommentsSection';
import { RelatedVideos } from '@/components/watch/RelatedVideos';
import { VideoDescription } from '@/components/watch/VideoDescription';
import { VideoDetails } from '@/components/watch/VideoDetails';
import { VideoPlayer } from '@/components/watch/VideoPlayer';
import { $api } from '../lib/api';

export function VideoPlayback() {
  const { videoId } = useParams<{ videoId: string }>();

  const { data: video, error, isLoading } = $api.useQuery(
    'get',
    '/api/videos/{id}',
    {
      params: {
        path: {
          id: videoId ?? '',
        },
      },
    },
    {
      enabled: Boolean(videoId),
    }
  );

  const { data: allVideos } = $api.useQuery('get', '/api/videos/');
  const relatedVideos = (allVideos ?? []).filter((v) => v.videoId !== videoId);

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6">
        <div>Loading...</div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6">
        <div>{error ? `An error occurred: ${error.message}` : 'Video not found'}</div>
      </div>
    );
  }

  const comments = (video.comments ?? []).map((c) => ({
    id: String(c.id ?? ''),
    username: c.author?.displayName || c.author?.userName || 'Anonymous',
    avatar: c.author?.pictureFid || 'https://picsum.photos/256',
    text: c.comment ?? '',
    createdAt: '',
    likes: 0,
  }));

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">
        <main className="min-w-0">
          <VideoPlayer
            poster={video.thumbnailFid || 'https://picsum.photos/640/360'}
            title={video.title ?? ''}
          />

          <VideoDetails video={video} />

          <VideoDescription video={video} />

          <CommentsSection comments={comments} commentCount={comments.length} />
        </main>

        <div className="min-w-0">
          <RelatedVideos videos={relatedVideos} />
        </div>
      </div>
    </div>
  );
}
