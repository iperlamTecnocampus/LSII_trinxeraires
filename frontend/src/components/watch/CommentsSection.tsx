import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/auth/useAuth';

import { CommentLikeButton } from './CommentLikeButton';
import { formatCount } from './format';
import type { Comment } from './types';

interface CommentsSectionProps {
  comments: Comment[];
  commentCount: number;
  videoId?: string;
  onCommentAdded?: () => void;
  onLikeAdded?: () => void;
}

interface CommentItemProps {
  comment: Comment;
  onLikeAdded?: () => void;
}

function CommentItem({ comment, onLikeAdded }: CommentItemProps) {
  const [showReplies, setShowReplies] = useState(false);

  return (
    <div className="flex gap-3">
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarImage src={comment.avatar} alt={comment.username} />
        <AvatarFallback>{comment.username.charAt(1).toUpperCase()}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold">{comment.username}</span>

          <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
        </div>

        <p className="mt-1 text-sm leading-relaxed">{comment.text}</p>

        <div className="mt-2 flex items-center gap-2">
          <CommentLikeButton
            commentId={comment.id}
            likes={comment.likes}
            likedByCurrentUser={comment.likedByCurrentUser}
            onLikeAdded={onLikeAdded}
          />
        </div>

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="px-2 font-semibold"
              onClick={() => setShowReplies((value) => !value)}
            >
              {showReplies
                ? 'Hide replies'
                : `View ${comment.replies.length} ${comment.replies.length === 1 ? 'reply' : 'replies'}`}
            </Button>

            {showReplies && (
              <div className="mt-3 flex flex-col gap-4 border-l pl-4">
                {comment.replies.map((reply) => (
                  <CommentItem key={reply.id} comment={reply} onLikeAdded={onLikeAdded} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function CommentsSection({
  comments,
  commentCount,
  videoId,
  onCommentAdded,
  onLikeAdded,
}: CommentsSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const routeParams = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  const activeVideoId = videoId ?? routeParams.videoId;
  const queryClient = useQueryClient();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  async function handleSubmitComment() {
    const text = newComment.trim();
    if (!text || !activeVideoId || isSubmitting || !isAuthenticated) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await apiFetch(`/api/videos/${encodeURIComponent(activeVideoId)}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: text,
      });

      if (response.status === 401) {
        navigate('/login');
        return;
      }
      if (!response.ok) {
        throw new Error(`Comment failed (${response.status}).`);
      }

      if ((await response.json()) === true) {
        setNewComment('');
        if (onCommentAdded) {
          onCommentAdded();
        } else {
          queryClient.invalidateQueries({
            queryKey: ['get', '/api/videos/{id}', { params: { path: { id: activeVideoId } } }],
          });
        }
      }
    } catch (error) {
      console.error('Failed to post comment:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to post comment.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold">{formatCount(commentCount)} comments</h2>

      {authLoading ? (
        <div className="mt-5 text-sm text-muted-foreground" role="status">
          Checking your session…
        </div>
      ) : isAuthenticated ? (
        <div className="mt-5 flex gap-3">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarImage src={user?.pictureUrl} alt={user?.displayName || 'Current user'} />
            <AvatarFallback>{(user?.displayName || user?.userName || 'You').slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <Textarea
              value={newComment}
              onChange={(event) => setNewComment(event.target.value)}
              placeholder="Add a comment..."
              className="min-h-20 resize-none"
            />

            {submitError && <p className="mt-2 text-sm text-destructive">{submitError}</p>}

            <div className="mt-2 flex justify-end gap-2">
              {newComment && (
                <Button type="button" variant="ghost" onClick={() => setNewComment('')}>
                  Cancel
                </Button>
              )}

              <Button type="button" disabled={!newComment.trim() || isSubmitting} onClick={handleSubmitComment}>
                {isSubmitting ? 'Posting…' : 'Comment'}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <p className="mt-5 text-sm text-muted-foreground">
          <Link to="/login" className="font-medium text-foreground underline">
            Sign in
          </Link>{' '}
          to leave a comment.
        </p>
      )}

      <div className="mt-8 flex flex-col gap-6">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} onLikeAdded={onLikeAdded} />
        ))}
      </div>
    </section>
  );
}
