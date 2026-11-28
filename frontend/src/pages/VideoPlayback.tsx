import { useParams } from 'react-router';
import { CommentsSection } from '@/components/watch/CommentsSection';
import { RelatedVideos } from '@/components/watch/RelatedVideos';
import { VideoDescription } from '@/components/watch/VideoDescription';
import { VideoDetails } from '@/components/watch/VideoDetails';
import { VideoPlayerCmp } from '@/components/watch/VideoPlayerCmp';
import type { Comment } from '@/components/watch/types';
import type { components } from '@/api-schema';

import { $api } from '../lib/api';

type ApiComment = NonNullable<components['schemas']['VideoInfoDTO']['comments']>[number] & {
  replies?: ApiComment[];
};

export function VideoPlayback() {
  const { videoId } = useParams<{ videoId: string }>();

  const {
    data: video,
    error,
    isLoading,
    refetch,
  } = $api.useQuery(
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

  const mapComment: (comment: ApiComment) => Comment = (comment) => ({
    id: String(comment.id ?? ''),
    username: comment.author?.displayName || comment.author?.userName || 'Anonymous',
    avatar: comment.author?.pictureFid || 'https://picsum.photos/256',
    text: comment.comment ?? '',
    createdAt: '',
    likes: comment.likes ?? 0,
    likedByCurrentUser: Boolean(comment.likedByCurrentUser),
    replies: (comment.replies ?? []).map(mapComment),
  });
  const comments = ((video.comments ?? []) as ApiComment[]).map(mapComment);
  const commentCount = comments.reduce((count, comment) => count + 1 + (comment.replies?.length ?? 0), 0);

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">
        <main className="min-w-0">
          <VideoPlayerCmp
            poster={video.thumbnailFid || 'https://picsum.photos/640/360'}
            title={video.title ?? ''}
            fid={video.videoFid}
          />

          <VideoDetails
            video={video}
            onLikeChanged={() => {
              void refetch();
            }}
          />

          <VideoDescription video={video} />

          <CommentsSection
            comments={comments}
            commentCount={commentCount}
            videoId={videoId}
            onCommentAdded={() => {
              refetch();
            }}
            onLikeChanged={() => {
              refetch();
            }}
          />
        </main>

        <div className="min-w-0">
          <RelatedVideos videos={relatedVideos} />
        </div>
      </div>
    </div>
  );
}
