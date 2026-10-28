interface VideoPlayerProps {
  videoUrl?: string;
  poster?: string;
  title: string;
}

export function VideoPlayer({
  videoUrl,
  poster,
  title,
}: VideoPlayerProps) {
  return (
    <div className="w-full overflow-hidden rounded-xl bg-black">
      <div className="aspect-video w-full">
        <video
          className="h-full w-full object-contain"
          controls
          poster={poster}
          aria-label={title}
        >
          {videoUrl && <source src={videoUrl} type="video/mp4" />}

          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}