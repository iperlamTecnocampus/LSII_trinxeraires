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
  it('toggles a comment like on and off', async () => {
    mutateAsync.mockResolvedValue(true);
    const onLikeChanged = jest.fn();

    render(<CommentLikeButton commentId="42" likes={7} onLikeChanged={onLikeChanged} />);
    fireEvent.click(screen.getByRole('button', { name: 'Like · 7' }));

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledWith({
        params: { path: { id: 42 } },
      });
      expect(onLikeChanged).toHaveBeenCalledTimes(1);
      expect(screen.getByRole('button', { name: 'Like · 8' })).toBeEnabled();
      expect(screen.getByRole('button', { name: 'Like · 8' })).toHaveAttribute('aria-pressed', 'true');
    });

    fireEvent.click(screen.getByRole('button', { name: 'Like · 8' }));

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledTimes(2);
      expect($api.useMutation).toHaveBeenCalledWith('delete', '/api/comments/{id}/likes');
      expect(screen.getByRole('button', { name: 'Like · 7' })).toHaveAttribute('aria-pressed', 'false');
      expect(onLikeChanged).toHaveBeenCalledTimes(2);
    });
  });

  it('allows unliking when the comment DTO says the user already liked', () => {
    render(<CommentLikeButton commentId="42" likes={7} likedByCurrentUser />);

    const likeButton = screen.getByRole('button', { name: 'Like · 7' });
    expect(likeButton).toBeEnabled();
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
