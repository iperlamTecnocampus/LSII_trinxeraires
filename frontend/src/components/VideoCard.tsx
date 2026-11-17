import { Link } from 'react-router';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { timeAgo } from '../utils/format';
import { formatCount } from './watch/format';

import type { components } from '@/api-schema.d.ts';
type VideoInfoDTO = components['schemas']['VideoInfoDTO'];

export interface VideoCardProps {
  video?: VideoInfoDTO;
  title?: string;
  channelName?: string;
  views?: string;
  uploadedAt?: string;
  thumbnail?: string;
  avatar?: string;
  to?: string;
  variant?: 'grid' | 'compact';
}

export function VideoCard({
  video,
  title = video?.title ?? 'Good video title without clickbait',
  channelName = video?.author?.displayName || video?.author?.userName || 'Username',
  views = video?.views !== undefined ? `${formatCount(video.views)} views` : '5k',
  uploadedAt = video?.uploadedAt ? timeAgo(video.uploadedAt) : '12h ago',
  thumbnail = video?.thumbnailFid || 'https://picsum.photos/640/360',
  avatar = video?.author?.pictureFid || 'https://picsum.photos/256',
  to = video?.videoId ? `/watch/${video.videoId}` : '/',
  variant = 'grid',
}: VideoCardProps) {
  return (
    <Link
      className={
        variant === 'compact'
          ? 'flex w-full gap-2 rounded-md p-2 transition-colors hover:bg-accent'
          : 'flex w-full flex-col gap-2 rounded-md p-2 transition-colors hover:bg-accent sm:w-[40%] lg:w-[30%] xl:w-[24%]'
      }
      to={to}
    >
      <AspectRatio ratio={16 / 9} className={variant === 'compact' ? 'w-40 shrink-0' : 'w-full'}>
        <img className="h-full w-full rounded-md object-cover" src={thumbnail} alt={title} loading="lazy" />
      </AspectRatio>

      <div className="flex min-w-0 flex-row gap-2">
        {variant === 'grid' && (
          <Avatar>
            <AvatarImage src={avatar} alt={channelName} />
            <AvatarFallback>US</AvatarFallback>
          </Avatar>
        )}

        <div className="min-w-0">
          <h3 className="line-clamp-2 font-medium">{title}</h3>

          <div className="mt-1 flex flex-col text-sm text-muted-foreground">
            <span>{channelName}</span>

            <span>
              {views} · {uploadedAt}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
