import { useState } from 'react';

import { useAuth } from '@/auth/useAuth';
import { Button } from '@/components/ui/button';
import { $api } from '@/lib/api';

import { formatCount } from './format';

interface LikeButtonProps {
  videoId: string;
  likes: number;
  likedByCurrentUser: boolean;
  onLikeAdded?: () => void;
}

export function LikeButton({ videoId, likes, likedByCurrentUser, onLikeAdded }: LikeButtonProps) {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [likedVideoId, setLikedVideoId] = useState<string | null>(null);
  const [likeError, setLikeError] = useState<string | null>(null);
  const likeMutation = $api.useMutation('post', '/api/videos/{id}/likes');
  const isLiked = likedByCurrentUser || (likedVideoId === videoId && Boolean(videoId));
  const isDisabled = !videoId || isAuthLoading || !isAuthenticated || isLiked || likeMutation.isPending;

  async function handleLike() {
    if (isDisabled) return;

    setLikeError(null);
    try {
      const liked = await likeMutation.mutateAsync({
        params: {
          path: {
            id: videoId,
          },
        },
      });

      if (!liked) {
        throw new Error('Could not like this video. Please try again.');
      }

      setLikedVideoId(videoId);
      onLikeAdded?.();
    } catch (error) {
      setLikeError(error instanceof Error ? error.message : 'Could not like this video. Please try again.');
    }
  }

  return (
    <>
      <Button
        type="button"
        variant={isLiked ? 'default' : 'secondary'}
        className="rounded-full"
        onClick={handleLike}
        disabled={isDisabled}
        aria-pressed={isLiked}
        title={!isAuthLoading && !isAuthenticated ? 'Sign in to like videos' : undefined}
      >
        Like · {formatCount(likes)}
      </Button>
      {likeError && (
        <p className="mt-2 text-sm text-destructive" role="alert">
          {likeError}
        </p>
      )}
    </>
  );
}
