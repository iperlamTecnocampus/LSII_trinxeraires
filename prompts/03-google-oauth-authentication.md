# Google OAuth authentication

**Approved on:** 2026-11-20
**Approved by:** Team leader (explicit authorization in the OpenCode session)
**Used for:** Implementing the backend portion of Google OAuth authentication for ProTube

## Prompt

Implement Google OAuth authentication for this app using SpringSecurity.

The authentication only has to take place in the frontend and the backend, do NOT touch the FileAPI or other microservices.

These are your tasks:

1. Implement the OAuth in the backend using Spring security, the oauth private keys will be in an environment variable called GOOGLE_OAUTH_ID, GOOGLE_OAUTH_SECRET. Only restrict the endpoints to authenticated users that are not meant to be used by the public. Per example, listing videos and the GET for a user are public endpoints, but uploading a video, creating a comment, etc are only for authenticated users and you will have to replace the username in the current DTOs with the current session. So authenticated users won't have to pass their username in the request, but only their session cookie and the backed will infer what user they are. DO NOT TOUCH THE FRONTEND YET.

2. Now implement the authentication in the frontend, using whatever library you find appropiate. I want to be able to get the current session's user using a useAuth() function. Integrate the google oauth with the pages/LoginPage.tsx, and on routes that require authentication, check it on page load. Handle the required cookie and make sure it is sent to the backend on each request.

Sessions must be saved using an auth cookie, i think Spring security provides that, the cookie duration must be approx one day.

Now, analyze the architecture and structure of the backend and frontend, and then create a plan to complete these tasks first, after that, when told to do so, you will start programming. 

### Instruction changes
Alright, make some changes to the plan and re-send it.

1. Make testing a third task, you don't have to implement it now, add a third task for backend and frontend auth testing.
2. Do not touch the CORS policy, I want to keep it as * (asterisk)
3. When the user is not logged in, in the frontend, it won't be able to show their profile picture on the navbar / menu on the top right. I want you to change that profile picture and dropdown with a "Sign in" button when the user is not authenticated. Also disable (hide) the subscription list, liked videos tab, and "Your videos" tab on the left side menu too. 

## Notes

This prompt was approved by the team leader's explicit instruction to proceed with this task in the current session. Frontend implementation and authentication testing are separate follow-up tasks.
