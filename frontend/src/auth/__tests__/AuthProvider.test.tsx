import { fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';

import { AuthProvider } from '../AuthProvider';
import { useAuth } from '../useAuth';
import { apiFetch, resetCsrfToken } from '@/lib/api';

function AuthState() {
  const { user, isLoading, isAuthenticated, error, logout } = useAuth();

  return (
    <div>
      <p data-testid="auth-state">
        {isLoading ? 'loading' : isAuthenticated ? `signed-in:${user?.userName}` : 'signed-out'}
      </p>
      <p data-testid="auth-error">{error}</p>
      <button type="button" onClick={() => void logout()}>
        Log out
      </button>
    </div>
  );
}

describe('AuthProvider and apiFetch', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    resetCsrfToken();
  });

  it('loads the current user with credentials on provider startup', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        userName: 'alice',
        displayName: 'Alice',
        email: 'alice@example.com',
        pictureUrl: 'https://example.com/alice.png',
      })
    );

    render(
      <AuthProvider>
        <AuthState />
      </AuthProvider>
    );

    expect(await screen.findByText('signed-in:alice')).toBeInTheDocument();
    expect(fetchMock.mock.calls[0][0]).toBe('/api/auth/me');
    expect(fetchMock.mock.calls[0][1]).toEqual(
      expect.objectContaining({
        credentials: 'include',
        headers: { Accept: 'application/json' },
      })
    );
  });

  it('treats an expired or missing backend session as unauthenticated', async () => {
    fetchMock.mockResponseOnce('', { status: 401 });

    render(
      <AuthProvider>
        <AuthState />
      </AuthProvider>
    );

    expect(await screen.findByText('signed-out')).toBeInTheDocument();
  });

  it('exposes session lookup failures without treating the visitor as authenticated', async () => {
    fetchMock.mockRejectOnce(new Error('Backend unavailable'));

    render(
      <AuthProvider>
        <AuthState />
      </AuthProvider>
    );

    expect(await screen.findByText('signed-out')).toBeInTheDocument();
    expect(screen.getByTestId('auth-error')).toHaveTextContent('Backend unavailable');
  });

  it('throws when useAuth is rendered without its provider', () => {
    expect(() => renderHook(() => useAuth())).toThrow('useAuth must be used within an AuthProvider.');
  });

  it('sends credentials and the backend CSRF header on unsafe requests', async () => {
    fetchMock
      .mockResponseOnce(JSON.stringify({ token: 'csrf-value', headerName: 'X-CSRF-TOKEN' }))
      .mockResponseOnce('true');

    const response = await apiFetch('/api/videos/123/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: 'Hello',
    });

    expect(response.ok).toBe(true);
    expect(fetchMock.mock.calls[0][0]).toBe('/api/auth/csrf');
    expect(fetchMock.mock.calls[0][1]).toEqual(expect.objectContaining({ credentials: 'include' }));

    const request = fetchMock.mock.calls[1][0] as Request;
    expect(request.method).toBe('POST');
    expect(fetchMock.mock.calls[1][1]).toEqual(expect.objectContaining({ credentials: 'include' }));
    expect(request.headers.get('X-CSRF-TOKEN')).toBe('csrf-value');
    expect(await request.text()).toBe('Hello');
  });

  it('fails safely when the CSRF endpoint cannot provide a token', async () => {
    fetchMock.mockResponseOnce('', { status: 403 });

    await expect(apiFetch('/api/videos/123/likes', { method: 'POST' })).rejects.toThrow(
      'Could not get a CSRF token (403).'
    );
  });

  it('posts logout with the session cookie and clears the auth state', async () => {
    fetchMock
      .mockResponseOnce(JSON.stringify({ userName: 'alice', email: 'alice@example.com' }))
      .mockResponseOnce(JSON.stringify({ token: 'logout-csrf', headerName: 'X-CSRF-TOKEN' }))
      .mockResponseOnce('', { status: 204 });

    render(
      <AuthProvider>
        <AuthState />
      </AuthProvider>
    );

    await screen.findByText('signed-in:alice');
    fireEvent.click(screen.getByRole('button', { name: 'Log out' }));

    await waitFor(() => expect(screen.getByText('signed-out')).toBeInTheDocument());

    const logoutRequest = fetchMock.mock.calls[2][0] as Request;
    expect(logoutRequest.url).toContain('/api/auth/logout');
    expect(logoutRequest.method).toBe('POST');
    expect(fetchMock.mock.calls[2][1]).toEqual(expect.objectContaining({ credentials: 'include' }));
    expect(logoutRequest.headers.get('X-CSRF-TOKEN')).toBe('logout-csrf');
  });
});
