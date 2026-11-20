# Authentication implementation tasks

## Task 1 — Backend authentication

- Add Spring Security and Google OAuth2 login configured through `GOOGLE_OAUTH_ID` and `GOOGLE_OAUTH_SECRET`.
- Create or resolve a ProTube user after successful Google login and use the server-side session to identify the current user.
- Keep public read endpoints public and require authentication for write endpoints.
- Derive the acting user from the authenticated session instead of caller-supplied usernames; enforce ownership for edits and deletions.
- Add current-session and logout endpoints, with an approximately one-day session cookie.
- Do not change the CORS policy, frontend, FileAPI, or other microservices.

## Task 2 — Frontend authentication and navigation

- Add `useAuth()` to expose current-user and authentication-loading state.
- Connect the Google sign-in button to the backend OAuth flow and add guards for authenticated routes.
- Send the backend session cookie with backend API requests; do not change FileAPI requests.
- Show a **Sign in** button in the top-right header when unauthenticated, otherwise show the user's profile picture and dropdown.
- Hide the subscriptions section/list, **Liked videos**, and **Your videos** sidebar entries when unauthenticated.

## Task 3 — Authentication testing

- Test backend public/protected endpoint behavior, OAuth user resolution, session-derived identity, logout, and ownership checks.
- Test frontend auth state, route guards, sign-in behavior, cookie-enabled backend requests, and authenticated/unauthenticated header and sidebar states.
- Run backend verification and frontend build, lint, and tests.

## Progress

- [x] Task 1 — Backend authentication
- [ ] Task 2 — Frontend authentication and navigation
- [ ] Task 3 — Authentication testing

Task 1's main sources compile. Existing backend test sources currently fail test compilation because their API/model expectations do not match the current code; updating and running the authentication test suite is reserved for Task 3.
