import { useState } from 'react';

import { useAuth } from '@/auth/useAuth';
import { Button } from '@/components/ui/button';
import { $api } from '@/lib/api';

import { formatCount } from './format';

interface CommentLikeButtonProps {
  commentId: string;
  likes: number;
  likedByCurrentUser?: boolean;
  onLikeChanged?: () => void;
}

export function CommentLikeButton({
  commentId,
  likes,
  likedByCurrentUser = false,
  onLikeChanged,
}: CommentLikeButtonProps) {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [localLikeState, setLocalLikeState] = useState<{ commentId: string; liked: boolean } | null>(null);
  const [likeError, setLikeError] = useState<string | null>(null);
  const likeMutation = $api.useMutation('post', '/api/comments/{id}/likes');
  const unlikeMutation = $api.useMutation('delete', '/api/comments/{id}/likes');
  const serverLikeState = Boolean(likedByCurrentUser);
  const isLiked = localLikeState?.commentId === commentId ? localLikeState.liked : serverLikeState;
  const displayedLikes = likes + (isLiked === serverLikeState ? 0 : isLiked ? 1 : -1);
  const numericCommentId = Number(commentId);
  const isValidCommentId = Number.isSafeInteger(numericCommentId) && numericCommentId > 0;
  const isPending = likeMutation.isPending || unlikeMutation.isPending;
  const isDisabled = !isValidCommentId || isAuthLoading || !isAuthenticated || isPending;

  async function handleToggleLike() {
    if (isDisabled) return;

    setLikeError(null);
    try {
      const mutation = isLiked ? unlikeMutation : likeMutation;
      const result = await mutation.mutateAsync({
        params: {
          path: {
            id: numericCommentId,
          },
        },
      });

      if (!result) {
        throw new Error(
          isLiked
            ? 'Could not remove the like from this comment. Please try again.'
            : 'Could not like this comment. Please try again.'
        );
      }

      setLocalLikeState({ commentId, liked: !isLiked });
      onLikeChanged?.();
    } catch (error) {
      setLikeError(
        error instanceof Error
          ? error.message
          : isLiked
            ? 'Could not remove the like from this comment. Please try again.'
            : 'Could not like this comment. Please try again.'
      );
    }
  }

  return (
    <div className="flex flex-col items-start">
      <Button
        type="button"
        size="sm"
        className="h-8 px-2"
        variant={isLiked ? 'default' : 'ghost'}
        onClick={handleToggleLike}
        disabled={isDisabled}
        aria-pressed={isLiked}
        title={!isAuthLoading && !isAuthenticated ? 'Sign in to like comments' : undefined}
      >
        Like · {formatCount(displayedLikes)}
      </Button>
      {likeError && (
        <p className="mt-1 text-sm text-destructive" role="alert">
          {likeError}
        </p>
      )}
    </div>
  );
}
