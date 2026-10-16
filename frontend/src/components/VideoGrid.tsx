import { VideoCard } from './VideoCard';

export function VideoGrid() {
  return (
    <div className="flex flex-row flex-wrap w-full gap-2 justify-center-safe">
      {Array.from({ length: 8 }, (_, i) => (
        <VideoCard />
      ))}
    </div>
  );
}
