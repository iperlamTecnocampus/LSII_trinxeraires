import createFetchClient from 'openapi-fetch';
import createClient from 'openapi-react-query';
import type { components, paths } from '../api-schema';

interface CsrfTokenResponse {
  token: string;
  headerName: string;
}

let csrfTokenRequest: Promise<CsrfTokenResponse> | null = null;

async function getCsrfToken(): Promise<CsrfTokenResponse> {
  if (!csrfTokenRequest) {
    csrfTokenRequest = fetch('/api/auth/csrf', {
      credentials: 'include',
      headers: { Accept: 'application/json' },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Could not get a CSRF token (${response.status}).`);
        }

        return (await response.json()) as CsrfTokenResponse;
      })
      .catch((error: unknown) => {
        csrfTokenRequest = null;
        throw error;
      });
  }

  return csrfTokenRequest;
}

export function resetCsrfToken() {
  csrfTokenRequest = null;
}

export const apiFetch: typeof fetch = async (input, init) => {
  const request = new Request(input, init);
  const headers = new Headers(request.headers);
  const method = request.method.toUpperCase();
  const isUnsafeMethod = !['GET', 'HEAD', 'OPTIONS', 'TRACE'].includes(method);

  if (isUnsafeMethod) {
    const csrfToken = await getCsrfToken();
    headers.set(csrfToken.headerName || 'X-CSRF-TOKEN', csrfToken.token);
  }

  return fetch(new Request(request, { headers }), { credentials: 'include' });
};

const fetchClient = createFetchClient<paths>({
  // Use same-origin URLs so the session cookie works with the wildcard CORS policy.
  baseUrl: '',
  headers: { 'Content-Type': 'application/json' },
  fetch: apiFetch,
});

export const $api = createClient(fetchClient);

export type CurrentUser = components['schemas']['CurrentUserDTO'];
export { fetchClient };
