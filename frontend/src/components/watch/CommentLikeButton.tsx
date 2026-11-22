import { useState } from 'react';

import { useAuth } from '@/auth/useAuth';
import { Button } from '@/components/ui/button';
import { $api } from '@/lib/api';

import { formatCount } from './format';

interface CommentLikeButtonProps {
  commentId: string;
  likes: number;
  likedByCurrentUser?: boolean;
  onLikeAdded?: () => void;
}

export function CommentLikeButton({
  commentId,
  likes,
  likedByCurrentUser = false,
  onLikeAdded,
}: CommentLikeButtonProps) {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [hasNewLike, setHasNewLike] = useState(false);
  const [likeError, setLikeError] = useState<string | null>(null);
  const likeMutation = $api.useMutation('post', '/api/comments/{id}/likes');
  const isLiked = likedByCurrentUser || hasNewLike;
  const numericCommentId = Number(commentId);
  const isValidCommentId = Number.isSafeInteger(numericCommentId) && numericCommentId > 0;
  const isDisabled = !isValidCommentId || isAuthLoading || !isAuthenticated || isLiked || likeMutation.isPending;

  async function handleLike() {
    if (isDisabled) return;

    setLikeError(null);
    try {
      const liked = await likeMutation.mutateAsync({
        params: {
          path: {
            id: numericCommentId,
          },
        },
      });

      if (!liked) {
        throw new Error('Could not like this comment. Please try again.');
      }

      setHasNewLike(true);
      onLikeAdded?.();
    } catch (error) {
      setLikeError(error instanceof Error ? error.message : 'Could not like this comment. Please try again.');
    }
  }

  return (
    <div className="flex flex-col items-start">
      <Button
        type="button"
        size="sm"
        className="h-8 px-2"
        variant={isLiked ? 'default' : 'ghost'}
        onClick={handleLike}
        disabled={isDisabled}
        aria-pressed={isLiked}
        title={!isAuthLoading && !isAuthenticated ? 'Sign in to like comments' : undefined}
      >
        Like · {formatCount(likes + (hasNewLike && !likedByCurrentUser ? 1 : 0))}
      </Button>
      {likeError && (
        <p className="mt-1 text-sm text-destructive" role="alert">
          {likeError}
        </p>
      )}
    </div>
  );
}
