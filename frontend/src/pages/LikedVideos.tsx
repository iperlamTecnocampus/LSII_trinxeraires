import { VideoGrid } from '../components/VideoGrid';
import { $api } from '../lib/api';

export function LikedVideos() {
  const { data, error, isLoading } = $api.useQuery('get', '/api/videos/liked');

  if (error) return <div>An error occurred.</div>;

  if (isLoading) return <div>Loading...</div>;

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Liked videos</h1>
        <p>No liked videos yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Liked videos</h1>
      <VideoGrid videos={data} />
    </div>
  );
}
