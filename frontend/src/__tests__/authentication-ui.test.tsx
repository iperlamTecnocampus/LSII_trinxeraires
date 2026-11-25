import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ComponentProps, ReactNode } from 'react';

import { AuthContext, type AuthContextValue } from '@/auth/AuthContext';
import { RequireAuth } from '@/auth/RequireAuth';
import { AppSidebar } from '@/components/AppSidebar';
import { Header } from '@/components/Header';
import { LoginPage } from '@/pages/LoginPage';

const mockNavigate = jest.fn();

jest.mock('react-router', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  return {
    Link: ({ children, to, ...props }: { children: ReactNode; to: string }) =>
      React.createElement('a', { href: to, ...props }, children),
    Navigate: ({ to }: { to: string }) => React.createElement('div', { 'data-testid': 'redirect', 'data-to': to }),
    useLocation: () => ({ pathname: '/upload' }),
    useNavigate: () => mockNavigate,
  };
});

jest.mock('@/lib/api', () => ({
  $api: {
    useQuery: jest.fn(() => ({
      data: {
        subscribedTo: [
          {
            userName: 'bob',
            displayName: 'Bob',
            pictureFid: 'bob-profile-picture',
          },
          {
            displayName: 'User without username',
          },
        ],
      },
      isLoading: false,
      error: null,
    })),
  },
}));

jest.mock('@/lib/fileApi', () => ({
  getImageUrl: (fid?: string | null) => (fid ? `/api/files/${fid}` : undefined),
}));

jest.mock('@/components/ui/avatar', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  return {
    Avatar: ({ children, ...props }: ComponentProps<'div'>) => React.createElement('div', props, children),
    AvatarImage: (props: ComponentProps<'img'>) => React.createElement('img', props),
    AvatarFallback: ({ children, ...props }: ComponentProps<'span'>) => React.createElement('span', props, children),
  };
});

jest.mock('@/components/ui/button', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  return {
    Button: ({
      children,
      nativeButton,
      render,
      ...props
    }: ComponentProps<'button'> & {
      nativeButton?: boolean;
      render?: React.ReactElement;
    }) =>
      render ? React.cloneElement(render, { ...props }, children) : React.createElement('button', props, children),
  };
});

jest.mock('@/components/ui/card', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const wrapper = ({ children, ...props }: ComponentProps<'div'>) => React.createElement('div', props, children);
  return {
    Card: wrapper,
    CardContent: wrapper,
    CardDescription: wrapper,
    CardHeader: wrapper,
    CardTitle: wrapper,
  };
});

jest.mock('@/components/ui/dropdown-menu', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const wrapper = ({ children, render, ...props }: ComponentProps<'div'> & { render?: React.ReactElement }) =>
    render ? React.cloneElement(render, props, children) : React.createElement('div', props, children);
  return {
    DropdownMenu: wrapper,
    DropdownMenuContent: wrapper,
    DropdownMenuGroup: wrapper,
    DropdownMenuItem: ({ children, onClick, render }: ComponentProps<'button'> & { render?: React.ReactElement }) =>
      render
        ? React.cloneElement(render, { onClick }, children)
        : React.createElement('button', { onClick, type: 'button' }, children),
    DropdownMenuSeparator: () => React.createElement('hr'),
    DropdownMenuTrigger: ({ children, ...props }: ComponentProps<'button'>) =>
      React.createElement('button', { type: 'button', ...props }, children),
  };
});

jest.mock('@/components/ui/separator', () => ({
  Separator: () => null,
}));

jest.mock('@/components/ui/sidebar', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const wrapper = ({
    children,
    isActive,
    render,
    ...props
  }: ComponentProps<'div'> & { isActive?: boolean; render?: React.ReactElement }) =>
    render ? React.cloneElement(render, props, children) : React.createElement('div', props, children);
  return {
    Sidebar: wrapper,
    SidebarContent: wrapper,
    SidebarFooter: wrapper,
    SidebarGroup: wrapper,
    SidebarHeader: wrapper,
    SidebarMenu: wrapper,
    SidebarMenuButton: wrapper,
    SidebarMenuItem: wrapper,
    SidebarProvider: wrapper,
    SidebarTrigger: ({ children, ...props }: ComponentProps<'button'>) =>
      React.createElement('button', { type: 'button', ...props }, children),
  };
});

jest.mock('@/components/Searchbar', () => ({
  Searchbar: () => null,
}));

const signedOutAuth: AuthContextValue = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
  refresh: jest.fn(),
  logout: jest.fn().mockResolvedValue(undefined),
};

const signedInAuth: AuthContextValue = {
  user: {
    userName: 'alice',
    displayName: 'Alice',
    email: 'alice@example.com',
    pictureUrl: 'https://example.com/alice.png',
  },
  isLoading: false,
  isAuthenticated: true,
  error: null,
  refresh: jest.fn(),
  logout: jest.fn().mockResolvedValue(undefined),
};

function renderNavigation(auth: AuthContextValue) {
  return render(
    <AuthContext.Provider value={auth}>
      <Header />
      <AppSidebar />
    </AuthContext.Provider>
  );
}

describe('authentication navigation', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((media: string) => ({
        matches: false,
        media,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  it('shows Sign in and hides private sidebar entries while logged out', () => {
    renderNavigation(signedOutAuth);

    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
    expect(screen.queryByText('Liked videos')).not.toBeInTheDocument();
    expect(screen.queryByText('Your videos')).not.toBeInTheDocument();
    expect(screen.queryByText('Subscriptions')).not.toBeInTheDocument();
    expect(screen.queryByRole('img', { name: 'Alice' })).not.toBeInTheDocument();
  });

  it('shows a disabled session-check button while authentication is loading', () => {
    renderNavigation({ ...signedOutAuth, isLoading: true });

    expect(screen.getByRole('button', { name: 'Checking session…' })).toBeDisabled();
  });

  it('does not use the OAuth profile URL, and shows the dropdown and private sidebar entries while logged in', async () => {
    renderNavigation(signedInAuth);

    expect(screen.getByRole('img', { name: 'Alice' })).not.toHaveAttribute('src');
    expect(screen.getByText('Liked videos')).toBeInTheDocument();
    expect(screen.getByText('Your videos')).toBeInTheDocument();
    expect(screen.getByText('Subscriptions')).toBeInTheDocument();

    expect(screen.getByText('Bob')).toBeInTheDocument();

    expect(screen.getByRole('img', { name: '@bob' })).toHaveAttribute('src', '/api/files/bob-profile-picture');

    fireEvent.click(screen.getByRole('img', { name: 'Alice' }));
    expect(await screen.findByText('Your channel')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Log out' }));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'));
    expect(signedInAuth.logout).toHaveBeenCalled();
  });

  it('links Google sign-in to the backend Spring OAuth authorization endpoint', () => {
    render(
      <AuthContext.Provider value={signedOutAuth}>
        <LoginPage />
      </AuthContext.Provider>
    );

    expect(screen.getByRole('link', { name: /continue with google/i })).toHaveAttribute(
      'href',
      '/oauth2/authorization/google'
    );
  });

  it('redirects unauthenticated users and waits for session loading on protected routes', async () => {
    render(
      <AuthContext.Provider value={signedOutAuth}>
        <RequireAuth>
          <p>Private upload route</p>
        </RequireAuth>
      </AuthContext.Provider>
    );

    expect(screen.queryByText('Private upload route')).not.toBeInTheDocument();
    expect(screen.getByTestId('redirect')).toHaveAttribute('data-to', '/login');
  });

  it('shows a loading state and renders protected content for an authenticated user', () => {
    const { rerender } = render(
      <AuthContext.Provider value={{ ...signedOutAuth, isLoading: true }}>
        <RequireAuth>
          <p>Private upload route</p>
        </RequireAuth>
      </AuthContext.Provider>
    );

    expect(screen.getByRole('status')).toHaveTextContent('Checking your session');
    expect(screen.queryByTestId('redirect')).not.toBeInTheDocument();

    rerender(
      <AuthContext.Provider value={signedInAuth}>
        <RequireAuth>
          <p>Private upload route</p>
        </RequireAuth>
      </AuthContext.Provider>
    );

    expect(screen.getByText('Private upload route')).toBeInTheDocument();
  });

  it('redirects an already authenticated visitor away from the login screen', () => {
    render(
      <AuthContext.Provider value={signedInAuth}>
        <LoginPage />
      </AuthContext.Provider>
    );

    expect(screen.getByTestId('redirect')).toHaveAttribute('data-to', '/');
  });
});
