import { VideoPlayer } from "../video-player/player";

interface VideoPlayerProps {
  poster?: string;
  title: string;
}

export function VideoPlayerCmp({ poster, title }: VideoPlayerProps) {
  return (
    <div aria-label={title} className="w-full overflow-hidden rounded-xl bg-black">
      <div className="relative aspect-video w-full">
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <VideoPlayer
            source={{
              id: "b22dc63d5502450fa80bee5e6659a8f7",
              poster,
              src: "http://localhost:8000/stream/b22dc63d5502450fa80bee5e6659a8f7",
            }}
            layout="fill"
            mediaProps={{ autoPlay: true, playsInline: true }}
            theme="dark"
          />
        </div>
      </div>
    </div>
  );
}
