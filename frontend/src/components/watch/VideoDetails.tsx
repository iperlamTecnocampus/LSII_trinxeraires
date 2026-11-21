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
    isSubscribed: boolean;
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
  const hasOptimisticSubscription = optimisticSubscription?.username === authorUsername;
  const isSubscribed = hasOptimisticSubscription ? optimisticSubscription.isSubscribed : isAlreadySubscribed;

  function updateSubscriptionCache(isSubscribing: boolean) {
    if (!authorUsername) {
      return;
    }

    const authorQueryKey = ['get', '/api/users/{username}', authorQuery] as const;
    queryClient.setQueryData<UserDTO>(authorQueryKey, (currentAuthor) =>
      currentAuthor
        ? {
            ...currentAuthor,
            suscribers: Math.max(0, (currentAuthor.suscribers ?? 0) + (isSubscribing ? 1 : -1)),
          }
        : currentAuthor
    );
    if (user?.userName && currentUserData) {
      const currentUserQueryKey = ['get', '/api/users/{username}', currentUserQuery] as const;
      queryClient.setQueryData<UserDTO>(currentUserQueryKey, {
        ...currentUserData,
        subscribedTo: isSubscribing
          ? [...(currentUserData.subscribedTo ?? []), { userName: authorUsername }]
          : (currentUserData.subscribedTo ?? []).filter((subscription) => subscription.userName !== authorUsername),
      });
    }
    setOptimisticSubscription({ username: authorUsername, isSubscribed: isSubscribing, isPending: false });
  }

  function handleMutationError(error: unknown) {
    setOptimisticSubscription(null);
    setSubscribeError(error instanceof Error ? error.message : 'Could not update this subscription.');
  }

  const subscribeMutation = $api.useMutation('post', '/api/users/subscribe', {
    onSuccess: (subscribed) => {
      if (!subscribed) {
        setOptimisticSubscription(null);
        setSubscribeError('Could not subscribe to this channel.');
        return;
      }

      updateSubscriptionCache(true);
    },
    onError: handleMutationError,
  });
  const unsubscribeMutation = $api.useMutation('delete', '/api/users/subscribe', {
    onSuccess: () => updateSubscriptionCache(false),
    onError: handleMutationError,
  });

  const channelName = video.author?.displayName || video.author?.userName || 'Unknown Channel';
  const avatarUrl = video.author?.pictureFid || 'https://picsum.photos/256';
  const avatarFallback = channelName.charAt(0).toUpperCase();
  const subscriberCount =
    (authorData?.suscribers ?? 0) +
    (hasOptimisticSubscription && optimisticSubscription.isPending
      ? optimisticSubscription.isSubscribed
        ? 1
        : -1
      : 0);
  const baseLikes = video.likes ?? 0;

  function handleSubscriptionToggle() {
    if (!authorUsername || subscribeMutation.isPending || unsubscribeMutation.isPending) {
      return;
    }

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setSubscribeError(null);
    const nextIsSubscribed = !isSubscribed;
    setOptimisticSubscription({ username: authorUsername, isSubscribed: nextIsSubscribed, isPending: true });
    const mutationOptions = {
      params: {
        query: {
          subscribedUsername: authorUsername,
        },
      },
    };

    if (nextIsSubscribed) {
      subscribeMutation.mutate(mutationOptions);
    } else {
      unsubscribeMutation.mutate(mutationOptions);
    }
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
            onClick={handleSubscriptionToggle}
            disabled={
              isAuthLoading ||
              isAuthorLoading ||
              subscribeMutation.isPending ||
              unsubscribeMutation.isPending ||
              isOwnChannel ||
              (isAuthenticated && isCurrentUserProfileLoading)
            }
          >
            {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
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
