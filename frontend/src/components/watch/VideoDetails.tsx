import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { components } from '@/api-schema.d.ts';
import { $api } from '@/lib/api';

import { formatCount } from './format';

type VideoInfoDTO = components['schemas']['VideoInfoDTO'];

interface VideoDetailsProps {
  video: VideoInfoDTO;
}

export function VideoDetails({ video }: VideoDetailsProps) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const authorUsername = video.author?.userName;
  const { data: authorData } = $api.useQuery(
    'get',
    '/api/users/{username}',
    {
      params: {
        path: {
          username: authorUsername ?? '',
        },
      },
    },
    {
      enabled: Boolean(authorUsername),
    }
  );

  const channelName = video.author?.displayName || video.author?.userName || 'Unknown Channel';
  const avatarUrl = video.author?.pictureFid || 'https://picsum.photos/256';
  const avatarFallback = channelName.charAt(0).toUpperCase();
  const subscriberCount = authorData?.suscribers ?? 0;
  const baseLikes = video.likes ?? 0;

  return (
    <section className="mt-4">
      <h1 className="text-xl font-semibold leading-tight">{video.title}</h1>

      <div className="mt-4 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={avatarUrl} alt={channelName} />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <p className="truncate font-semibold">{channelName}</p>

            <p className="text-sm text-muted-foreground">{formatCount(subscriberCount)} subscribers</p>
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
            Like · {formatCount(baseLikes + (isLiked ? 1 : 0))}
          </Button>

          <Button type="button" variant="secondary" className="rounded-full">
            Share
          </Button>

          <Button type="button" variant="secondary" className="rounded-full">
            Save
          </Button>

          <Button type="button" variant="secondary" className="rounded-full">
            •••
          </Button>
        </div>
      </div>
    </section>
  );
}
