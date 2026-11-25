import { useState } from 'react';

import { useAuth } from '@/auth/useAuth';
import { Button } from '@/components/ui/button';
import { $api } from '@/lib/api';

import { formatCount } from './format';

interface LikeButtonProps {
  videoId: string;
  likes: number;
  likedByCurrentUser: boolean;
  onLikeChanged?: () => void;
}

export function LikeButton({ videoId, likes, likedByCurrentUser, onLikeChanged }: LikeButtonProps) {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [localLikeState, setLocalLikeState] = useState<{ videoId: string; liked: boolean } | null>(null);
  const [likeError, setLikeError] = useState<string | null>(null);
  const likeMutation = $api.useMutation('post', '/api/videos/{id}/likes');
  const unlikeMutation = $api.useMutation('delete', '/api/videos/{id}/likes');
  const serverLikeState = Boolean(likedByCurrentUser);
  const isLiked = localLikeState?.videoId === videoId ? localLikeState.liked : serverLikeState;
  const displayedLikes = likes + (isLiked === serverLikeState ? 0 : isLiked ? 1 : -1);
  const isPending = likeMutation.isPending || unlikeMutation.isPending;
  const isDisabled = !videoId || isAuthLoading || !isAuthenticated || isPending;

  async function handleToggleLike() {
    if (isDisabled) return;

    setLikeError(null);
    try {
      const mutation = isLiked ? unlikeMutation : likeMutation;
      const result = await mutation.mutateAsync({
        params: {
          path: {
            id: videoId,
          },
        },
      });

      if (!result) {
        throw new Error(
          isLiked
            ? 'Could not remove the like from this video. Please try again.'
            : 'Could not like this video. Please try again.'
        );
      }

      setLocalLikeState({ videoId, liked: !isLiked });
      onLikeChanged?.();
    } catch (error) {
      setLikeError(
        error instanceof Error
          ? error.message
          : isLiked
            ? 'Could not remove the like from this video. Please try again.'
            : 'Could not like this video. Please try again.'
      );
    }
  }

  return (
    <>
      <Button
        type="button"
        variant={isLiked ? 'default' : 'secondary'}
        className="rounded-full"
        onClick={handleToggleLike}
        disabled={isDisabled}
        aria-pressed={isLiked}
        title={!isAuthLoading && !isAuthenticated ? 'Sign in to like videos' : undefined}
      >
        Like · {formatCount(displayedLikes)}
      </Button>
      {likeError && (
        <p className="mt-2 text-sm text-destructive" role="alert">
          {likeError}
        </p>
      )}
    </>
  );
}
