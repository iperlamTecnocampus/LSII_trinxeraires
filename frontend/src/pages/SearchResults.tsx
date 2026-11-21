import { useSearchParams } from 'react-router';

import { VideoGrid } from '../components/VideoGrid';
import { $api } from '../lib/api';

export function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query')?.trim() ?? '';
  const { data, error, isLoading } = $api.useQuery(
    'get',
    '/api/videos/search/{name}',
    { params: { path: { name: query } } },
    { enabled: Boolean(query) }
  );

  return (
    <section>
      <h1 className="mb-4 text-xl font-semibold">{query ? `Search results for “${query}”` : 'Search videos'}</h1>
      {!query ? (
        <p>Enter a search term to find videos.</p>
      ) : error ? (
        <p role="alert">Could not search videos: {error.message}</p>
      ) : isLoading ? (
        <p role="status">Searching videos…</p>
      ) : data?.length === 0 ? (
        <p>No videos found for “{query}”.</p>
      ) : (
        <VideoGrid videos={data ?? []} />
      )}
    </section>
  );
}
