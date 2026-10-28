import { Link } from 'react-router';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';

interface VideoCardProps {
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
  title = 'Good video title without clickbait',
  channelName = 'Username',
  views = '5k',
  uploadedAt = '12h ago',
  thumbnail = 'https://picsum.photos/640/360',
  avatar = 'https://picsum.photos/256',
  to = '/',
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
      <AspectRatio
        ratio={16 / 9}
        className={
          variant === 'compact'
            ? 'w-40 shrink-0'
            : 'w-full'
        }
      >
        <img
          className="h-full w-full rounded-md object-cover"
          src={thumbnail}
          alt={title}
          loading="lazy"
        />
      </AspectRatio>

      <div className="flex min-w-0 flex-row gap-2">
        {variant === 'grid' && (
          <Avatar>
            <AvatarImage
              src={avatar}
              alt={channelName}
            />
            <AvatarFallback>US</AvatarFallback>
          </Avatar>
        )}

        <div className="min-w-0">
          <h3 className="line-clamp-2 font-medium">
            {title}
          </h3>

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