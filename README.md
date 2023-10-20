# Microsoft Graph API PoC

## Description

Development branch for Back-end.

## Technology

* Microsoft Graph API,
* Node.js,
* TypeScript,
* Express server,
* Localtunnel for creating HTTPS endpoint

## Setup Local Development Environment

* Install all dependencies using `npm i`,
* Create a `.env` file with `MICROSOFT_CLIENT_ID="your-microsoft-client-id"`,
* Run the project with `npm run dev`,

## Features

* Microsoft Graph OAuth 2.0 flow authentication [docs](https://learn.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow#refresh-the-access-token),
* Storing user Access Tokens
* Refreshing user Access Tokens
* Sending Outlook Emails as a User
* Creating Outlook Calendar Events as a User

## Microsoft Permissions

offline_access user.read mail.read mail.send calendars.readwrite

## Endpoints

### Microsoft's authorization URL

> Redirects to Slack's authorization page

`https://localhost:{PORT}/microsoft/auth` - API Route

> Example

`http://localhost:3002/microsoft/auth`

### OAuth callback

> Handles the OAuth callback and acquires Access Token

`https://localhost:{PORT}/microsoft/auth/callback` - API Route

> Example

`http://localhost:3002/microsoft/auth/callback`

### OAuth callback refresh

> Handles the OAuth callback and refreshes Access Token

`https://localhost:{PORT}/microsoft/auth/refresh` - API Route

> Example

`http://localhost:3002/microsoft/auth/refresh`

### Sending email

> Sends an email as a user, to the user itself and one more recipient

`https://localhost:{PORT}/microsoft/auth/send-email` - API Route

| Query Parameter | Type   | Description      |
| --------------- | ------ | ---------------- |
| *mess*          | string | Contetn of Email |
| *address*       | string | Email Address    |

> Example

`http://localhost:3002/microsoft/auth/send-email?mess=testing_sending&address=test@test.pl`

### Creating new calendar event

> Creates new event as a user, as attendees adds user and one more person

`https://localhost:{PORT}/microsoft/auth/new-event` - API Route

| Query Parameter | Type   | Description      |
| --------------- | ------ | ---------------- |
| *mess*          | string | Contetn of Email |
| *address*       | string | Email Address    |

> Example

`http://localhost:3002/microsoft/auth/new-event?address=test@test.pl`
