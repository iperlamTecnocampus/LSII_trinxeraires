import { render, screen } from '@testing-library/react';
import { useSearchParams } from 'react-router';
import type { ReactNode } from 'react';

import { $api } from '../../lib/api';
import { SearchResults } from '../SearchResults';

jest.mock('react-router', () => ({
  useSearchParams: jest.fn(),
  Link: ({ to, children }: { to: string; children: ReactNode }) => <a href={to}>{children}</a>,
}));

jest.mock('../../lib/api', () => ({
  $api: {
    useQuery: jest.fn(),
  },
}));

const useQueryMock = $api.useQuery as jest.Mock;
const useSearchParamsMock = useSearchParams as jest.Mock;

describe('SearchResults page', () => {
  beforeEach(() => {
    useQueryMock.mockReset();
    useSearchParamsMock.mockReturnValue([new URLSearchParams('query=react')]);
  });

  it('requests and displays videos returned by the search endpoint', () => {
    useQueryMock.mockImplementation((_method, path) =>
      path === '/api/videos/search/{name}'
        ? {
            data: [
              {
                videoId: 'video-123',
                title: 'React search result',
                uploadedAt: '2026-10-14T00:00:00.000Z',
                views: 12,
                author: { userName: 'ana', displayName: 'Ana' },
              },
            ],
            error: undefined,
            isLoading: false,
          }
        : { data: [], error: undefined, isLoading: false }
    );

    render(<SearchResults />);

    expect(useQueryMock).toHaveBeenCalledWith(
      'get',
      '/api/videos/search/{name}',
      { params: { path: { name: 'react' } } },
      { enabled: true }
    );
    expect(screen.getByRole('link', { name: /react search result/i })).toHaveAttribute('href', '/watch/video-123');
  });

  it('shows an empty state when the search endpoint returns no videos', () => {
    useSearchParamsMock.mockReturnValue([new URLSearchParams('query=missing')]);
    useQueryMock.mockReturnValue({ data: [], error: undefined, isLoading: false });

    render(<SearchResults />);

    expect(screen.getByText('No videos found for “missing”.')).toBeInTheDocument();
  });
});
