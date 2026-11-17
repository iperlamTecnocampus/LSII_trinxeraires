import { render, screen } from '@testing-library/react';

import type { ReactNode } from 'react';

import { VideoGrid } from '../VideoGrid';
import { VideoCard } from '../VideoCard';
import type { components } from '@/api-schema.d.ts';

jest.mock('react-router', () => ({
  Link: ({ children, to }: { children: ReactNode; to: string }) => <a href={to}>{children}</a>,
}));

describe('VideoGrid', () => {
  it('renders placeholder cards when no video list is provided', () => {
    render(<VideoGrid />);

    expect(screen.getAllByRole('link')).toHaveLength(8);
    expect(screen.getAllByRole('link')[0]).toHaveAttribute('href', '/watch/1');
  });

  it('renders no cards for an empty video list', () => {
    const { container } = render(<VideoGrid videos={[]} />);

    expect(container.querySelectorAll('a')).toHaveLength(0);
  });

  it('renders video details and links to the selected video', () => {
    const videos: components['schemas']['VideoInfoDTO'][] = [
      {
        videoId: 'video-123',
        title: 'Testing React',
        uploadedAt: '2026-10-14T00:00:00.000Z',
        views: 1250,
        author: { userName: 'ana', displayName: 'Ana' },
      },
    ];

    render(<VideoGrid videos={videos} />);

    expect(screen.getByRole('link', { name: /testing react/i })).toHaveAttribute('href', '/watch/video-123');
    expect(screen.getByText('Ana')).toBeInTheDocument();
    expect(screen.getByText(/1\.3K views/)).toBeInTheDocument();
  });
});

describe('VideoCard', () => {
  it('uses a compact layout without an avatar', () => {
    render(
      <VideoCard
        variant="compact"
        title="Recommended video"
        channelName="Creator"
        views="42 views"
        uploadedAt="today"
        thumbnail="/thumbnail.jpg"
        to="/watch/recommended"
      />
    );

    expect(screen.getByRole('link', { name: /recommended video/i })).toHaveAttribute('href', '/watch/recommended');
    expect(screen.getByRole('img', { name: 'Recommended video' })).toHaveAttribute('src', '/thumbnail.jpg');
    expect(screen.queryByText('US')).not.toBeInTheDocument();
    expect(screen.getByText('Creator')).toBeInTheDocument();
    expect(screen.getByText('42 views · today')).toBeInTheDocument();
  });
});
