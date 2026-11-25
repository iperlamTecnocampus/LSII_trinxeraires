import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { $api } from '@/lib/api';
import { SubscriptionButton } from '@/components/SubscriptionButton';

import { formatCount } from './format';
import { getImageUrl } from '@/lib/fileApi';
import { LikeButton } from './LikeButton';

import type { components } from '@/api-schema.d.ts';
type VideoInfoDTO = components['schemas']['VideoInfoDTO'];

interface VideoDetailsProps {
  video: VideoInfoDTO;
  onLikeChanged?: () => void;
}

export function VideoDetails({ video, onLikeChanged }: VideoDetailsProps) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const videoId = video.videoId ?? '';

  const authorUsername = video.author?.userName;
  const authorQuery = {
    params: {
      path: {
        username: authorUsername ?? '',
      },
    },
  };
  const { data: authorData, isLoading: isAuthorLoading } = $api.useQuery('get', '/api/users/{username}', authorQuery, {
    enabled: Boolean(authorUsername),
  });
  const channelName = video.author?.displayName || video.author?.userName || 'Unknown Channel';
  const avatarUrl = getImageUrl(video.author?.pictureFid) || 'https://picsum.photos/256';
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

          {authorUsername && <SubscriptionButton username={authorUsername} disabled={isAuthorLoading} />}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <LikeButton
            videoId={videoId}
            likes={baseLikes}
            likedByCurrentUser={Boolean(video.likedByCurrentUser)}
            onLikeChanged={onLikeChanged}
          />

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
