import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { CommentsSection } from './CommentsSection';
import { $api, apiFetch } from '@/lib/api';

const mockMutateAsync = jest.fn();
const mockUseAuth = jest.fn();
const mockNavigate = jest.fn();
const mockInvalidateQueries = jest.fn();

jest.mock('@/auth/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock('@/lib/api', () => ({
  $api: {
    useMutation: jest.fn(() => ({
      mutateAsync: mockMutateAsync,
      isPending: false,
    })),
  },
  apiFetch: jest.fn(),
}));

jest.mock('react-router', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  return {
    Link: ({ children, ...props }: React.ComponentProps<'a'>) => React.createElement('a', props, children),
    useNavigate: () => mockNavigate,
    useParams: () => ({ videoId: 'video-123' }),
  };
});

jest.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    invalidateQueries: mockInvalidateQueries,
  }),
}));

jest.mock('@/components/ui/avatar', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  return {
    Avatar: ({ children, ...props }: React.ComponentProps<'div'>) => React.createElement('div', props, children),
    AvatarFallback: ({ children, ...props }: React.ComponentProps<'span'>) =>
      React.createElement('span', props, children),
    AvatarImage: (props: React.ComponentProps<'img'>) => React.createElement('img', props),
  };
});

jest.mock('@/components/ui/button', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  return {
    Button: ({
      children,
      variant: _variant,
      size: _size,
      ...props
    }: React.ComponentProps<'button'> & {
      variant?: string;
      size?: string;
    }) => React.createElement('button', props, children),
  };
});

jest.mock('@/components/ui/textarea', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  return {
    Textarea: (props: React.ComponentProps<'textarea'>) => React.createElement('textarea', props),
  };
});

const comments = [
  {
    id: '123',
    username: 'Alice',
    avatar: 'avatar.png',
    text: 'Nice video',
    createdAt: '',
    likes: 5,
    likedByCurrentUser: false,
  },
];

beforeEach(() => {
  jest.clearAllMocks();
  mockMutateAsync.mockReset();
  jest.mocked(apiFetch).mockReset();
  mockUseAuth.mockReturnValue({
    user: undefined,
    isAuthenticated: true,
    isLoading: false,
  });
});

describe('CommentsSection comment likes', () => {
  it('posts a like once, updates the count, and removes the Reply button', async () => {
    mockMutateAsync.mockResolvedValue(true);
    const onLikeChanged = jest.fn();

    render(<CommentsSection comments={comments} commentCount={1} videoId="video-123" onLikeChanged={onLikeChanged} />);

    const likeButton = screen.getByRole('button', { name: 'Like · 5' });
    expect(screen.queryByRole('button', { name: 'Reply' })).not.toBeInTheDocument();
    fireEvent.click(likeButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        params: { path: { id: 123 } },
      });
      expect(onLikeChanged).toHaveBeenCalledTimes(1);
      expect(screen.getByRole('button', { name: 'Like · 6' })).toBeEnabled();
      expect(screen.getByRole('button', { name: 'Like · 6' })).toHaveAttribute('aria-pressed', 'true');
    });

    fireEvent.click(screen.getByRole('button', { name: 'Like · 6' }));

    await waitFor(() => {
      expect($api.useMutation).toHaveBeenCalledWith('delete', '/api/comments/{id}/likes');
      expect(screen.getByRole('button', { name: 'Like · 5' })).toHaveAttribute('aria-pressed', 'false');
      expect(onLikeChanged).toHaveBeenCalledTimes(2);
    });
  });

  it('shows an error and leaves the comment available for retry', async () => {
    mockMutateAsync.mockRejectedValue(new Error('Request failed'));

    render(<CommentsSection comments={comments} commentCount={1} videoId="video-123" />);

    fireEvent.click(screen.getByRole('button', { name: 'Like · 5' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Request failed');
    expect(screen.getByRole('button', { name: 'Like · 5' })).toBeEnabled();
  });

  it('disables likes for unauthenticated visitors', () => {
    mockUseAuth.mockReturnValue({
      user: undefined,
      isAuthenticated: false,
      isLoading: false,
    });

    render(<CommentsSection comments={comments} commentCount={1} videoId="video-123" />);

    const likeButton = screen.getByRole('button', { name: 'Like · 5' });
    expect(likeButton).toBeDisabled();
    expect(likeButton).toHaveAttribute('title', 'Sign in to like comments');
  });

  it('allows unliking when the backend reports that this user already liked', () => {
    render(
      <CommentsSection comments={[{ ...comments[0], likedByCurrentUser: true }]} commentCount={1} videoId="video-123" />
    );

    const likeButton = screen.getByRole('button', { name: 'Like · 5' });
    expect(likeButton).toBeEnabled();
    expect(likeButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('reports a false like response as an error', async () => {
    mockMutateAsync.mockResolvedValue(false);

    render(<CommentsSection comments={comments} commentCount={1} videoId="video-123" />);

    fireEvent.click(screen.getByRole('button', { name: 'Like · 5' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Could not like this comment. Please try again.');
  });

  it('submits a comment and calls the supplied callback', async () => {
    jest.mocked(apiFetch).mockResolvedValue({
      status: 200,
      ok: true,
      json: async () => true,
    } as Response);
    const onCommentAdded = jest.fn();

    render(
      <CommentsSection comments={comments} commentCount={1} videoId="video-123" onCommentAdded={onCommentAdded} />
    );

    fireEvent.change(screen.getByPlaceholderText('Add a comment...'), { target: { value: '  New comment  ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Comment' }));

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledWith('/api/videos/video-123/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: 'New comment',
      });
      expect(onCommentAdded).toHaveBeenCalledTimes(1);
      expect(screen.getByPlaceholderText('Add a comment...')).toHaveValue('');
    });
  });

  it('invalidates the video query when no comment callback is provided', async () => {
    jest.mocked(apiFetch).mockResolvedValue({
      status: 200,
      ok: true,
      json: async () => true,
    } as Response);

    render(<CommentsSection comments={comments} commentCount={1} videoId="video-123" />);

    fireEvent.change(screen.getByPlaceholderText('Add a comment...'), { target: { value: 'New comment' } });
    fireEvent.click(screen.getByRole('button', { name: 'Comment' }));

    await waitFor(() => {
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: ['get', '/api/videos/{id}', { params: { path: { id: 'video-123' } } }],
      });
    });
  });

  it('redirects to sign in when the comment request returns 401', async () => {
    jest.mocked(apiFetch).mockResolvedValue({ status: 401, ok: false } as Response);

    render(<CommentsSection comments={comments} commentCount={1} videoId="video-123" />);

    fireEvent.change(screen.getByPlaceholderText('Add a comment...'), { target: { value: 'New comment' } });
    fireEvent.click(screen.getByRole('button', { name: 'Comment' }));

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/login'));
  });

  it('displays an error when posting a comment fails', async () => {
    jest.mocked(apiFetch).mockResolvedValue({ status: 500, ok: false } as Response);

    render(<CommentsSection comments={comments} commentCount={1} videoId="video-123" />);

    fireEvent.change(screen.getByPlaceholderText('Add a comment...'), { target: { value: 'New comment' } });
    fireEvent.click(screen.getByRole('button', { name: 'Comment' }));

    expect(await screen.findByText('Comment failed (500).')).toBeInTheDocument();
  });

  it('shows the session check while authentication is loading', () => {
    mockUseAuth.mockReturnValue({
      user: undefined,
      isAuthenticated: false,
      isLoading: true,
    });

    render(<CommentsSection comments={comments} commentCount={1} videoId="video-123" />);

    expect(screen.getByRole('status')).toHaveTextContent('Checking your session…');
  });

  it('can expand and collapse existing replies without rendering a Reply action', () => {
    render(
      <CommentsSection
        comments={[
          {
            ...comments[0],
            replies: [{ ...comments[0], id: '456', username: 'Bob', text: 'Thanks!' }],
          },
        ]}
        commentCount={1}
        videoId="video-123"
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'View 1 reply' }));
    expect(screen.getByText('Thanks!')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Reply' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Hide replies' }));
    expect(screen.queryByText('Thanks!')).not.toBeInTheDocument();
  });
});
