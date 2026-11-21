import { act, fireEvent, render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';

import { useAuth } from '@/auth/useAuth';
import { $api } from '@/lib/api';
import { VideoDetails } from './VideoDetails';

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

const video = {
  title: 'Test video',
  likes: 0,
  author: {
    userName: 'creator',
    displayName: 'Creator',
  },
} as NonNullable<Parameters<typeof VideoDetails>[0]['video']>;

describe('VideoDetails subscribe button', () => {
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
      const username = query.params.path.username;
      return useQuery({
        queryKey: ['get', path, query],
        queryFn: async () =>
          username === 'viewer' ? { userName: 'viewer', subscribedTo: [] } : { userName: 'creator', suscribers: 10 },
        enabled: options.enabled,
      });
    });
    ($api.useMutation as jest.Mock).mockImplementation((method, _path, options) => {
      mutationOptions[method] = options;
      return { mutate, isPending: false };
    });

    queryClient.setQueryData(['get', '/api/users/{username}', { params: { path: { username: 'creator' } } }], {
      userName: 'creator',
      suscribers: 10,
    });
    queryClient.setQueryData(['get', '/api/users/{username}', { params: { path: { username: 'viewer' } } }], {
      userName: 'viewer',
      subscribedTo: [],
    });
  });

  afterEach(() => {
    queryClient.clear();
    jest.clearAllMocks();
  });

  function renderDetails() {
    return render(
      <QueryClientProvider client={queryClient}>
        <VideoDetails video={video} />
      </QueryClientProvider>
    );
  }

  it('optimistically updates the button and subscriber count, then confirms the subscription', () => {
    renderDetails();

    fireEvent.click(screen.getByRole('button', { name: 'Subscribe' }));

    expect(mutate).toHaveBeenCalledWith({
      params: {
        query: {
          subscribedUsername: 'creator',
        },
      },
    });
    expect(screen.getByRole('button', { name: 'Unsubscribe' })).toBeEnabled();
    expect(screen.getByText('11 subscribers')).toBeInTheDocument();

    act(() => mutationOptions.post.onSuccess(true));

    expect(screen.getByRole('button', { name: 'Unsubscribe' })).toBeEnabled();
    expect(screen.getByText('11 subscribers')).toBeInTheDocument();
    expect(
      queryClient.getQueryData<{ suscribers: number }>([
        'get',
        '/api/users/{username}',
        { params: { path: { username: 'creator' } } },
      ])?.suscribers
    ).toBe(11);
  });

  it('rolls back the optimistic UI when the request fails', () => {
    renderDetails();

    fireEvent.click(screen.getByRole('button', { name: 'Subscribe' }));
    act(() => mutationOptions.post.onError(new Error('Network unavailable')));

    expect(screen.getByRole('button', { name: 'Subscribe' })).toBeEnabled();
    expect(screen.getByText('10 subscribers')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Network unavailable');
  });

  it('does not increment the count or send a request when already subscribed', () => {
    queryClient.setQueryData(['get', '/api/users/{username}', { params: { path: { username: 'viewer' } } }], {
      userName: 'viewer',
      subscribedTo: [{ userName: 'creator' }],
    });

    renderDetails();

    expect(screen.getByRole('button', { name: 'Unsubscribe' })).toBeEnabled();
    expect(screen.getByText('10 subscribers')).toBeInTheDocument();
    expect(mutate).not.toHaveBeenCalled();
  });

  it('optimistically unsubscribes, calls the DELETE endpoint, and updates cached subscription data', () => {
    queryClient.setQueryData(['get', '/api/users/{username}', { params: { path: { username: 'viewer' } } }], {
      userName: 'viewer',
      subscribedTo: [{ userName: 'creator' }],
    });

    renderDetails();
    fireEvent.click(screen.getByRole('button', { name: 'Unsubscribe' }));

    expect(mutate).toHaveBeenCalledWith({
      params: {
        query: {
          subscribedUsername: 'creator',
        },
      },
    });
    expect(screen.getByRole('button', { name: 'Subscribe' })).toBeEnabled();
    expect(screen.getByText('9 subscribers')).toBeInTheDocument();

    act(() => mutationOptions.delete.onSuccess());

    expect(screen.getByRole('button', { name: 'Subscribe' })).toBeEnabled();
    expect(screen.getByText('9 subscribers')).toBeInTheDocument();
    expect(
      queryClient.getQueryData<{ suscribers: number }>([
        'get',
        '/api/users/{username}',
        { params: { path: { username: 'creator' } } },
      ])?.suscribers
    ).toBe(9);
    expect(
      queryClient.getQueryData<{ subscribedTo: { userName?: string }[] }>([
        'get',
        '/api/users/{username}',
        { params: { path: { username: 'viewer' } } },
      ])?.subscribedTo
    ).toEqual([]);
  });

  it('rolls back the optimistic unsubscribe when the request fails', () => {
    queryClient.setQueryData(['get', '/api/users/{username}', { params: { path: { username: 'viewer' } } }], {
      userName: 'viewer',
      subscribedTo: [{ userName: 'creator' }],
    });

    renderDetails();
    fireEvent.click(screen.getByRole('button', { name: 'Unsubscribe' }));
    act(() => mutationOptions.delete.onError(new Error('Network unavailable')));

    expect(screen.getByRole('button', { name: 'Unsubscribe' })).toBeEnabled();
    expect(screen.getByText('10 subscribers')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Network unavailable');
  });
});
