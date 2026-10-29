interface VideoPlayerProps {
  poster?: string;
  title: string;
}

export function VideoPlayer({
  poster,
  title,
}: VideoPlayerProps) {
  return (
    <div className="w-full overflow-hidden rounded-xl bg-black">
      <div className="relative aspect-video w-full">
        {poster ? (
          <img
            src={poster}
            alt={title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-muted" />
        )}

        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <span className="rounded-md bg-black/70 px-4 py-2 text-sm font-medium text-white">
            Video player
          </span>
        </div>
      </div>
    </div>
  );
}