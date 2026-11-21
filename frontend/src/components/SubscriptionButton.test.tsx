import { act, fireEvent, render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';

import { useAuth } from '@/auth/useAuth';
import { $api } from '@/lib/api';
import { SubscriptionButton } from './SubscriptionButton';

jest.mock('@/auth/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/lib/api', () => ({
  $api: {
    useQuery: jest.fn(),
    useMutation: jest.fn(),
  },
}));

jest.mock('react-router', () => ({
  useNavigate: () => jest.fn(),
}));

const authorQueryKey = ['get', '/api/users/{username}', { params: { path: { username: 'creator' } } }] as const;
const currentUserQueryKey = ['get', '/api/users/{username}', { params: { path: { username: 'viewer' } } }] as const;

describe('SubscriptionButton', () => {
  let queryClient: QueryClient;
  let mutationOptions: {
    post: { onSuccess: (subscribed: boolean) => void; onError: (error: Error) => void };
    delete: { onSuccess: () => void; onError: (error: Error) => void };
  };
  let mutate: jest.Mock;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    mutate = jest.fn();
    mutationOptions = {} as typeof mutationOptions;
    jest.mocked(useAuth).mockReturnValue({
      user: { userName: 'viewer' },
      isAuthenticated: true,
      isLoading: false,
      error: null,
      refresh: jest.fn(),
      logout: jest.fn(),
    });

    ($api.useQuery as jest.Mock).mockImplementation((_method, path, query, options) => {
      return useQuery({
        queryKey: ['get', path, query],
        queryFn: async () => ({ userName: 'viewer', subscribedTo: [] }),
        enabled: options.enabled,
      });
    });
    ($api.useMutation as jest.Mock).mockImplementation((method, _path, options) => {
      mutationOptions[method] = options;
      return { mutate, isPending: false };
    });

    queryClient.setQueryData(authorQueryKey, {
      userName: 'creator',
      suscribers: 10,
    });
    queryClient.setQueryData(currentUserQueryKey, {
      userName: 'viewer',
      subscribedTo: [],
    });
  });

  afterEach(() => {
    queryClient.clear();
    jest.clearAllMocks();
  });

  function renderButton() {
    return render(
      <QueryClientProvider client={queryClient}>
        <SubscriptionButton username="creator" />
      </QueryClientProvider>
    );
  }

  function subscriberCount() {
    return queryClient.getQueryData<{ suscribers: number }>(authorQueryKey)?.suscribers;
  }

  it('optimistically updates the button and subscriber count, then confirms the subscription', () => {
    renderButton();

    fireEvent.click(screen.getByRole('button', { name: 'Subscribe' }));

    expect(mutate).toHaveBeenCalledWith({
      params: {
        query: {
          subscribedUsername: 'creator',
        },
      },
    });
    expect(screen.getByRole('button', { name: 'Unsubscribe' })).toBeEnabled();
    expect(subscriberCount()).toBe(11);

    act(() => mutationOptions.post.onSuccess(true));

    expect(screen.getByRole('button', { name: 'Unsubscribe' })).toBeEnabled();
    expect(subscriberCount()).toBe(11);
  });

  it('rolls back the optimistic UI when the request fails', () => {
    renderButton();

    fireEvent.click(screen.getByRole('button', { name: 'Subscribe' }));
    act(() => mutationOptions.post.onError(new Error('Network unavailable')));

    expect(screen.getByRole('button', { name: 'Subscribe' })).toBeEnabled();
    expect(subscriberCount()).toBe(10);
    expect(screen.getByRole('alert')).toHaveTextContent('Network unavailable');
  });

  it('does not increment the count or send a request when already subscribed', () => {
    queryClient.setQueryData(currentUserQueryKey, {
      userName: 'viewer',
      subscribedTo: [{ userName: 'creator' }],
    });

    renderButton();

    expect(screen.getByRole('button', { name: 'Unsubscribe' })).toBeEnabled();
    expect(subscriberCount()).toBe(10);
    expect(mutate).not.toHaveBeenCalled();
  });

  it('optimistically unsubscribes, calls the DELETE endpoint, and updates cached subscription data', () => {
    queryClient.setQueryData(currentUserQueryKey, {
      userName: 'viewer',
      subscribedTo: [{ userName: 'creator' }],
    });

    renderButton();
    fireEvent.click(screen.getByRole('button', { name: 'Unsubscribe' }));

    expect(mutate).toHaveBeenCalledWith({
      params: {
        query: {
          subscribedUsername: 'creator',
        },
      },
    });
    expect(screen.getByRole('button', { name: 'Subscribe' })).toBeEnabled();
    expect(subscriberCount()).toBe(9);

    act(() => mutationOptions.delete.onSuccess());

    expect(screen.getByRole('button', { name: 'Subscribe' })).toBeEnabled();
    expect(subscriberCount()).toBe(9);
    expect(
      queryClient.getQueryData<{ subscribedTo: { userName?: string }[] }>(currentUserQueryKey)?.subscribedTo
    ).toEqual([]);
  });

  it('rolls back the optimistic unsubscribe when the request fails', () => {
    queryClient.setQueryData(currentUserQueryKey, {
      userName: 'viewer',
      subscribedTo: [{ userName: 'creator' }],
    });

    renderButton();
    fireEvent.click(screen.getByRole('button', { name: 'Unsubscribe' }));
    act(() => mutationOptions.delete.onError(new Error('Network unavailable')));

    expect(screen.getByRole('button', { name: 'Unsubscribe' })).toBeEnabled();
    expect(subscriberCount()).toBe(10);
    expect(screen.getByRole('alert')).toHaveTextContent('Network unavailable');
  });
});
