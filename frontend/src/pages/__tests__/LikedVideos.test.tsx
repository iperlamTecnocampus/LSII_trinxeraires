import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';

import { $api } from '../../lib/api';
import { LikedVideos } from '../LikedVideos';

jest.mock('react-router', () => ({
  Link: ({ to, children }: { to: string; children: ReactNode }) => <a href={to}>{children}</a>,
}));

jest.mock('../../lib/api', () => ({
  $api: {
    useQuery: jest.fn(),
  },
}));

const useQueryMock = $api.useQuery as jest.Mock;

describe('LikedVideos page', () => {
  beforeEach(() => {
    useQueryMock.mockReset();
  });

  it('shows an empty state when the user has no liked videos', () => {
    useQueryMock.mockReturnValue({
      data: [],
      error: undefined,
      isLoading: false,
    });

    render(<LikedVideos />);

    expect(useQueryMock).toHaveBeenCalledWith('get', '/api/videos/liked');
    expect(screen.getByText('Liked videos')).toBeInTheDocument();
    expect(screen.getByText('No liked videos yet')).toBeInTheDocument();
  });

  it('displays liked videos returned by the API', () => {
    useQueryMock.mockReturnValue({
      data: [
        {
          videoId: 'video-123',
          title: 'My liked video',
          uploadedAt: '2026-11-22T00:00:00.000Z',
          views: 10,
          author: {
            userName: 'ana',
            displayName: 'Ana',
          },
        },
      ],
      error: undefined,
      isLoading: false,
    });

    render(<LikedVideos />);

    expect(screen.getByRole('link', { name: /my liked video/i })).toHaveAttribute('href', '/watch/video-123');
  });

  it('shows loading state while liked videos are loading', () => {
    useQueryMock.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
    });

    render(<LikedVideos />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows an error message when the request fails', () => {
    useQueryMock.mockReturnValue({
      data: undefined,
      error: new Error('Request failed'),
      isLoading: false,
    });

    render(<LikedVideos />);

    expect(screen.getByText('An error occurred.')).toBeInTheDocument();
  });
});
