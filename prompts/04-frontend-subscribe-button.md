# Frontend subscribe button

**Approved on:** 2026-11-21
**Approved by:** User (approved in the implementation session)
**Used for:** Connecting the video-page subscribe button to the backend with an optimistic subscriber count update

## Prompt

Implement the subscribe button on the frontend so it works with the backend, so when you click "subscribe" in the frontend, you get subscribed to the user (with an optimist ui interaction, that changes before the request is completed) and the number of subscribers goes up by one

## Notes

The backend already provides `POST /api/users/subscribe`.
