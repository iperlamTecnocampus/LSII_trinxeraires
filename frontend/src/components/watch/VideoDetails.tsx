import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { components } from '@/api-schema.d.ts';
import { $api } from '@/lib/api';
import { useAuth } from '@/auth/useAuth';

import { formatCount } from './format';

type VideoInfoDTO = components['schemas']['VideoInfoDTO'];
type UserDTO = components['schemas']['UserDTO'];

interface VideoDetailsProps {
  video: VideoInfoDTO;
}

export function VideoDetails({ video }: VideoDetailsProps) {
  const [optimisticSubscription, setOptimisticSubscription] = useState<{
    username: string;
    isPending: boolean;
  } | null>(null);
  const [subscribeError, setSubscribeError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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
  const isOwnChannel = Boolean(user?.userName && user.userName === authorUsername);
  const currentUserQuery = {
    params: {
      path: {
        username: user?.userName ?? '',
      },
    },
  };
  const { data: currentUserData, isLoading: isCurrentUserProfileLoading } = $api.useQuery(
    'get',
    '/api/users/{username}',
    currentUserQuery,
    {
      enabled: Boolean(isAuthenticated && user?.userName && authorUsername && !isOwnChannel),
    }
  );

  const isAlreadySubscribed = Boolean(
    currentUserData?.subscribedTo?.some((subscription) => subscription.userName === authorUsername)
  );
  const isOptimisticallySubscribed = optimisticSubscription?.username === authorUsername;
  const isSubscribed = isOptimisticallySubscribed || isAlreadySubscribed;

  const subscribeMutation = $api.useMutation('post', '/api/users/subscribe', {
    onSuccess: (subscribed) => {
      if (!subscribed || !authorUsername) {
        setOptimisticSubscription(null);
        setSubscribeError('Could not subscribe to this channel.');
        return;
      }

      const authorQueryKey = ['get', '/api/users/{username}', authorQuery] as const;
      queryClient.setQueryData<UserDTO>(authorQueryKey, (currentAuthor) =>
        currentAuthor
          ? {
              ...currentAuthor,
              suscribers: (currentAuthor.suscribers ?? 0) + 1,
            }
          : currentAuthor
      );
      if (user?.userName && currentUserData) {
        const currentUserQueryKey = ['get', '/api/users/{username}', currentUserQuery] as const;
        queryClient.setQueryData<UserDTO>(currentUserQueryKey, {
          ...currentUserData,
          subscribedTo: [...(currentUserData.subscribedTo ?? []), { userName: authorUsername }],
        });
      }
      setOptimisticSubscription({ username: authorUsername, isPending: false });
    },
    onError: (error) => {
      setOptimisticSubscription(null);
      setSubscribeError(error instanceof Error ? error.message : 'Could not subscribe to this channel.');
    },
  });

  const channelName = video.author?.displayName || video.author?.userName || 'Unknown Channel';
  const avatarUrl = video.author?.pictureFid || 'https://picsum.photos/256';
  const avatarFallback = channelName.charAt(0).toUpperCase();
  const subscriberCount =
    (authorData?.suscribers ?? 0) +
    (optimisticSubscription?.username === authorUsername && optimisticSubscription.isPending ? 1 : 0);
  const baseLikes = video.likes ?? 0;

  function handleSubscribe() {
    if (!authorUsername || subscribeMutation.isPending || isSubscribed) {
      return;
    }

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setSubscribeError(null);
    setOptimisticSubscription({ username: authorUsername, isPending: true });
    subscribeMutation.mutate({
      params: {
        query: {
          subscribedUsername: authorUsername,
        },
      },
    });
  }

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
            onClick={handleSubscribe}
            disabled={
              isAuthLoading ||
              isAuthorLoading ||
              subscribeMutation.isPending ||
              isSubscribed ||
              isOwnChannel ||
              (isAuthenticated && isCurrentUserProfileLoading)
            }
          >
            {isSubscribed ? 'Subscribed' : 'Subscribe'}
          </Button>
        </div>

        {subscribeError && (
          <p className="text-sm text-destructive" role="alert">
            {subscribeError}
          </p>
        )}

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
