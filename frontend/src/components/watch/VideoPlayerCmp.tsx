import { VideoPlayer } from "../video-player/player";
import { getEnv } from '@/utils/Env';

interface VideoPlayerProps {
  poster?: string;
  title: string;
  fid: string;
}

export function VideoPlayerCmp({ poster, title, fid }: VideoPlayerProps) {
  return (
    <div aria-label={title} className="w-full overflow-hidden rounded-xl bg-black">
      <div className="relative aspect-video w-full">
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <VideoPlayer
            source={{
              id: fid,
              poster,
              src: getEnv().FILE_API_BASE_URL + "/stream/" + fid,
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
