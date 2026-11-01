import { Link } from 'react-router';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import type { components } from "@/api-schema.d.ts";
type VideoInfoDTO = components["schemas"]["VideoInfoDTO"];

export function VideoCard({video}: {video: VideoInfoDTO}) {
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
      <div className="flex flex-row gap-2">
        <Avatar>
          <AvatarImage src="https://picsum.photos/256" alt="@username" />
          <AvatarFallback>US</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h3>{video.title}</h3>
          <div className="flex flex-row gap-2 col text-gray-600 dark:text-gray-300 text-sm">
            <span>{video.author.displayName}</span>
            <span>5k</span>
            <span>12h ago</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
