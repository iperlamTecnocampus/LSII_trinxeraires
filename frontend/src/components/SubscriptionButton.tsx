import { useRef, useState } from 'react';
import { useQueryClient, type QueryKey } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

import { useAuth } from '@/auth/useAuth';
import { Button } from '@/components/ui/button';
import type { components } from '@/api-schema';
import { $api } from '@/lib/api';

type UserDTO = components['schemas']['UserDTO'];

interface SubscriptionButtonProps {
  username: string;
  disabled?: boolean;
}

interface SubscriptionSnapshot {
  authorKey: QueryKey;
  author: UserDTO | undefined;
  currentUserKey: QueryKey;
  currentUser: UserDTO | undefined;
}

export function SubscriptionButton({ username, disabled = false }: SubscriptionButtonProps) {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [optimisticSubscription, setOptimisticSubscription] = useState<{
    username: string;
    isSubscribed: boolean;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const snapshot = useRef<SubscriptionSnapshot | null>(null);

  const currentUserQuery = {
    params: {
      path: {
        username: user?.userName ?? '',
      },
    },
  };
  const currentUserKey = ['get', '/api/users/{username}', currentUserQuery] as const;
  const { data: currentUserData, isLoading: isCurrentUserLoading } = $api.useQuery(
    'get',
    '/api/users/{username}',
    currentUserQuery,
    {
      enabled: Boolean(isAuthenticated && user?.userName && user.userName !== username),
    }
  );
  const isOwnChannel = Boolean(user?.userName && user.userName === username);
  const isAlreadySubscribed = Boolean(
    currentUserData?.subscribedTo?.some((subscription) => subscription.userName === username)
  );
  const isSubscribed =
    optimisticSubscription?.username === username ? optimisticSubscription.isSubscribed : isAlreadySubscribed;

  const authorQuery = {
    params: {
      path: {
        username,
      },
    },
  };
  const authorKey = ['get', '/api/users/{username}', authorQuery] as const;

  function rollback() {
    if (snapshot.current) {
      queryClient.setQueryData(snapshot.current.authorKey, snapshot.current.author);
      queryClient.setQueryData(snapshot.current.currentUserKey, snapshot.current.currentUser);
    }
    snapshot.current = null;
    setOptimisticSubscription(null);
  }

  function handleMutationError(mutationError: unknown) {
    rollback();
    setError(mutationError instanceof Error ? mutationError.message : 'Could not update this subscription.');
  }

  const subscribeMutation = $api.useMutation('post', '/api/users/subscribe', {
    onSuccess: (subscribed) => {
      if (!subscribed) {
        rollback();
        setError('Could not subscribe to this channel.');
        return;
      }
      snapshot.current = null;
    },
    onError: handleMutationError,
  });
  const unsubscribeMutation = $api.useMutation('delete', '/api/users/subscribe', {
    onSuccess: () => {
      snapshot.current = null;
    },
    onError: handleMutationError,
  });
  const isMutationPending = subscribeMutation.isPending || unsubscribeMutation.isPending;

  function handleToggle() {
    if (isMutationPending) {
      return;
    }

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const nextIsSubscribed = !isSubscribed;
    const cachedCurrentUser = queryClient.getQueryData<UserDTO>(currentUserKey) ?? currentUserData;
    snapshot.current = {
      authorKey,
      author: queryClient.getQueryData<UserDTO>(authorKey),
      currentUserKey,
      currentUser: cachedCurrentUser,
    };

    queryClient.setQueryData<UserDTO>(authorKey, (currentAuthor) =>
      currentAuthor
        ? {
            ...currentAuthor,
            suscribers: Math.max(0, (currentAuthor.suscribers ?? 0) + (nextIsSubscribed ? 1 : -1)),
          }
        : currentAuthor
    );
    if (cachedCurrentUser) {
      const subscriptions = cachedCurrentUser.subscribedTo ?? [];
      queryClient.setQueryData<UserDTO>(currentUserKey, {
        ...cachedCurrentUser,
        subscribedTo: nextIsSubscribed
          ? subscriptions.some((subscription) => subscription.userName === username)
            ? subscriptions
            : [...subscriptions, { userName: username }]
          : subscriptions.filter((subscription) => subscription.userName !== username),
      });
    }

    setError(null);
    setOptimisticSubscription({ username, isSubscribed: nextIsSubscribed });
    const mutationOptions = {
      params: {
        query: {
          subscribedUsername: username,
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
    <>
      <Button
        type="button"
        variant={isSubscribed ? 'secondary' : 'default'}
        className="ml-2 rounded-full"
        onClick={handleToggle}
        disabled={isAuthLoading || isCurrentUserLoading || disabled || isMutationPending || isOwnChannel || !username}
      >
        {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
      </Button>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </>
  );
}
