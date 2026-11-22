import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import type { components } from '@/api-schema';
import { useAuth } from '@/auth/useAuth';
import { $api } from '@/lib/api';
import { LikeButton } from './LikeButton';
import { VideoDetails } from './VideoDetails';

jest.mock('@/auth/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/lib/api', () => ({
  $api: {
    useMutation: jest.fn(),
    useQuery: jest.fn(),
  },
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
    Button: ({ children, variant: _variant, ...props }: React.ComponentProps<'button'> & { variant?: string }) =>
      React.createElement('button', props, children),
  };
});

const video: components['schemas']['VideoInfoDTO'] = {
  videoId: 'video-123',
  title: 'Test video',
  likes: 12,
  author: {
    userName: 'creator',
    displayName: 'Creator',
  },
};

const mutateAsync = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(useAuth).mockReturnValue({ isAuthenticated: true, isLoading: false } as never);
  jest.mocked($api.useQuery).mockReturnValue({ data: undefined } as never);
  jest.mocked($api.useMutation).mockReturnValue({
    mutateAsync,
    isPending: false,
  } as never);
});

describe('VideoDetails likes', () => {
  it('sends one like request and disables the button after success', async () => {
    mutateAsync.mockResolvedValue(true);
    const onLikeAdded = jest.fn();
    render(<VideoDetails video={video} onLikeAdded={onLikeAdded} />);

    fireEvent.click(screen.getByRole('button', { name: 'Like · 12' }));

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledWith({
        params: { path: { id: 'video-123' } },
      });
      expect(screen.getByRole('button', { name: 'Like · 12' })).toBeDisabled();
      expect(onLikeAdded).toHaveBeenCalledTimes(1);
    });

    fireEvent.click(screen.getByRole('button', { name: 'Like · 12' }));
    expect(mutateAsync).toHaveBeenCalledTimes(1);
  });

  it('shows an error and allows retrying when the request fails', async () => {
    mutateAsync.mockResolvedValueOnce(false);
    render(<VideoDetails video={video} />);

    fireEvent.click(screen.getByRole('button', { name: 'Like · 12' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Could not like this video. Please try again.');
    expect(screen.getByRole('button', { name: 'Like · 12' })).toBeEnabled();
  });

  it('shows the like as active when the video DTO says the current user liked it', () => {
    render(<VideoDetails video={{ ...video, likedByCurrentUser: true }} />);

    const likeButton = screen.getByRole('button', { name: 'Like · 12' });
    expect(likeButton).toBeDisabled();
    expect(likeButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('disables the like button for users without an account', () => {
    jest.mocked(useAuth).mockReturnValue({ isAuthenticated: false, isLoading: false } as never);

    render(<LikeButton videoId="video-123" likes={12} likedByCurrentUser={false} />);

    const likeButton = screen.getByRole('button', { name: 'Like · 12' });
    expect(likeButton).toBeDisabled();
    expect(likeButton).toHaveAttribute('title', 'Sign in to like videos');
    fireEvent.click(likeButton);
    expect(mutateAsync).not.toHaveBeenCalled();
  });
});
