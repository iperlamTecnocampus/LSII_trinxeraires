import { useState } from 'react';
import { useParams } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { $api } from '@/lib/api';

import { formatCount } from './format';
import type { Comment } from './types';

interface CommentsSectionProps {
  comments: Comment[];
  commentCount: number;
  videoId?: string;
  userName?: string;
  onCommentAdded?: () => void;
}

interface CommentItemProps {
  comment: Comment;
}

function CommentItem({ comment }: CommentItemProps) {
  const [isLiked, setIsLiked] = useState(false);
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
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={() => setIsLiked((value) => !value)}
          >
            Like · {formatCount(comment.likes + (isLiked ? 1 : 0))}
          </Button>

          <Button type="button" variant="ghost" size="sm" className="h-8 px-2">
            Reply
          </Button>
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
                  <CommentItem key={reply.id} comment={reply} />
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
  userName = 'ana',
  onCommentAdded,
}: CommentsSectionProps) {
  const [newComment, setNewComment] = useState('');
  const routeParams = useParams<{ videoId: string }>();
  const activeVideoId = videoId ?? routeParams.videoId;
  const queryClient = useQueryClient();

  const commentMutation = $api.useMutation('post', '/api/videos/{id}/comments');

  async function handleSubmitComment() {
    const text = newComment.trim();
    if (!text || !activeVideoId || commentMutation.isPending) {
      return;
    }

    try {
      const response = await commentMutation.mutateAsync({
        params: {
          path: { id: activeVideoId },
          query: { userName },
        },
        body: text,
        headers: {
          'Content-Type': 'text/plain',
        },
        bodySerializer: (body: unknown) => (typeof body === 'string' ? body : JSON.stringify(body)),
      } as any);

      if (response) {
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
    }
  }

  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold">{formatCount(commentCount)} comments</h2>

      <div className="mt-5 flex gap-3">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage src="https://i.pravatar.cc/80?img=68" alt="Current user" />
          <AvatarFallback>YO</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <Textarea
            value={newComment}
            onChange={(event) => setNewComment(event.target.value)}
            placeholder="Add a comment..."
            className="min-h-20 resize-none"
          />

          <div className="mt-2 flex justify-end gap-2">
            {newComment && (
              <Button type="button" variant="ghost" onClick={() => setNewComment('')}>
                Cancel
              </Button>
            )}

            <Button
              type="button"
              disabled={!newComment.trim() || commentMutation.isPending}
              onClick={handleSubmitComment}
            >
              Comment
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-6">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </section>
  );
}
