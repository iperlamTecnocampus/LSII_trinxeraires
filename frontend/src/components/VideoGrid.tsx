import { VideoCard } from './VideoCard';

export function VideoGrid() {
  return (
    <div className="flex w-full flex-row flex-wrap justify-center-safe gap-2">
      {Array.from({ length: 8 }, (_, i) => (
        <VideoCard
          key={i}
          to={`/watch/${i + 1}`}
        />
      ))}
    </div>
  );
}