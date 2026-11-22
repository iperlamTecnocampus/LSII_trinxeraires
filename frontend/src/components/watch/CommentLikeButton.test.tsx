import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { useAuth } from '@/auth/useAuth';
import { $api } from '@/lib/api';
import { CommentLikeButton } from './CommentLikeButton';

jest.mock('@/auth/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/lib/api', () => ({
  $api: {
    useMutation: jest.fn(),
  },
}));

jest.mock('@/components/ui/button', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  return {
    Button: ({ children, variant: _variant, ...props }: React.ComponentProps<'button'> & { variant?: string }) =>
      React.createElement('button', props, children),
  };
});

const mutateAsync = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  mutateAsync.mockReset();
  jest.mocked(useAuth).mockReturnValue({ isAuthenticated: true, isLoading: false } as never);
  jest.mocked($api.useMutation).mockReturnValue({
    mutateAsync,
    isPending: false,
  } as never);
});

describe('CommentLikeButton', () => {
  it('posts the comment ID, updates the count, and prevents duplicate likes', async () => {
    mutateAsync.mockResolvedValue(true);
    const onLikeAdded = jest.fn();

    render(<CommentLikeButton commentId="42" likes={7} onLikeAdded={onLikeAdded} />);
    fireEvent.click(screen.getByRole('button', { name: 'Like · 7' }));

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledWith({
        params: { path: { id: 42 } },
      });
      expect(onLikeAdded).toHaveBeenCalledTimes(1);
      expect(screen.getByRole('button', { name: 'Like · 8' })).toBeDisabled();
    });
  });

  it('disables the button when the user already liked the comment', () => {
    render(<CommentLikeButton commentId="42" likes={7} likedByCurrentUser />);

    const likeButton = screen.getByRole('button', { name: 'Like · 7' });
    expect(likeButton).toBeDisabled();
    expect(likeButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('disables the button for unauthenticated users', () => {
    jest.mocked(useAuth).mockReturnValue({ isAuthenticated: false, isLoading: false } as never);

    render(<CommentLikeButton commentId="42" likes={7} />);

    const likeButton = screen.getByRole('button', { name: 'Like · 7' });
    expect(likeButton).toBeDisabled();
    expect(likeButton).toHaveAttribute('title', 'Sign in to like comments');
  });

  it('shows an error when the like request fails', async () => {
    mutateAsync.mockRejectedValue(new Error('Request failed'));

    render(<CommentLikeButton commentId="42" likes={7} />);
    fireEvent.click(screen.getByRole('button', { name: 'Like · 7' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Request failed');
    expect(screen.getByRole('button', { name: 'Like · 7' })).toBeEnabled();
  });
});
