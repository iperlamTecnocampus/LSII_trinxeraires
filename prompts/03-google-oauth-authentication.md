# Google OAuth authentication

**Approved on:** 2026-11-20
**Approved by:** Team leader (explicit authorization in the OpenCode session)
**Used for:** Implementing the backend portion of Google OAuth authentication for ProTube

## Prompt

Implement Google OAuth authentication for ProTube using Spring Security. Configure the Google OAuth client ID and secret from `GOOGLE_OAUTH_ID` and `GOOGLE_OAUTH_SECRET`. Use a server-side session with an approximately one-day session cookie. Keep public read endpoints public, require authentication for non-public operations, and derive the acting username from the authenticated session instead of request-supplied actor usernames. Add current-session and logout endpoints. Do not change the CORS policy, frontend, FileAPI, or other microservices. Do not implement frontend authentication or authentication tests in this task.

## Notes

This prompt was approved by the team leader's explicit instruction to proceed with this task in the current session. Frontend implementation and authentication testing are separate follow-up tasks.
