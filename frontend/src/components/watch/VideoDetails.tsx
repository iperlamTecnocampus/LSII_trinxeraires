import { useState } from 'react';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

import { formatCount } from './format';
import type { Video } from './types';

interface VideoDetailsProps {
  video: Video;
}

export function VideoDetails({ video }: VideoDetailsProps) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <section className="mt-4">
      <h1 className="text-xl font-semibold leading-tight">
        {video.title}
      </h1>

      <div className="mt-4 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={video.channel.avatar}
              alt={video.channel.name}
            />
            <AvatarFallback>
              {video.channel.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <p className="truncate font-semibold">
              {video.channel.name}
            </p>

            <p className="text-sm text-muted-foreground">
              {formatCount(video.channel.subscribers)} subscribers
            </p>
          </div>

          <Button
            type="button"
            variant={isSubscribed ? 'secondary' : 'default'}
            className="ml-2 rounded-full"
            onClick={() => setIsSubscribed((value) => !value)}
          >
            {isSubscribed ? 'Subscribed' : 'Subscribe'}
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant={isLiked ? 'default' : 'secondary'}
            className="rounded-full"
            onClick={() => setIsLiked((value) => !value)}
          >
            Like · {formatCount(video.likes + (isLiked ? 1 : 0))}
          </Button>

          <Button
            type="button"
            variant="secondary"
            className="rounded-full"
          >
            Share
          </Button>

          <Button
            type="button"
            variant="secondary"
            className="rounded-full"
          >
            Save
          </Button>

          <Button
            type="button"
            variant="secondary"
            className="rounded-full"
          >
            •••
          </Button>
        </div>
      </div>
    </section>
  );
}