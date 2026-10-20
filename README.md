# LiveKit Meet — Vite + React

A frontend-only Vite + React video meeting client inspired by [livekit-examples/meet](https://github.com/livekit-examples/meet). It uses the official LiveKit React Components and client SDK.

## Features

- Responsive meeting join page
- LiveKit room video conference UI, participant tiles, audio/video controls and chat provided by LiveKit Components
- Connect directly to any LiveKit Cloud or self-hosted server
- Room name generation and shareable invite URL
- No Express server, API route, or token endpoint
- TypeScript and production Vite build

## Requirements

- Node.js 18+
- A LiveKit server URL, such as `wss://your-project.livekit.cloud`
- A participant JWT that grants access to the desired room

## Run locally

```bash
npm install
cp .env.example .env.local
# Optional: set VITE_LIVEKIT_URL in .env.local
npm run dev
```

Open the Vite URL shown in the terminal. Enter your display name, room name, LiveKit server URL, and participant token.

On Windows PowerShell, use `Copy-Item .env.example .env.local` instead of `cp`.

## Build

```bash
npm run build
npm run preview
```

The static production output is written to `dist/`. Host it on any static web server with HTTPS. The app needs a network connection to your LiveKit server for meetings.

## Security notes

**This project intentionally has no token endpoint.** The participant token is pasted into the UI and passed to the LiveKit browser SDK. Tokens grant the permissions embedded in them; use short-lived, room-scoped tokens and share them only with intended participants. Never put your LiveKit API secret in `VITE_*` variables or frontend source code. For a production application with user accounts, generate tokens in a separate trusted backend and provide the short-lived participant token to the client.

The invite URL contains the room name and server URL, not the token. Recipients still need their own valid participant token.

## Reference and license

Inspired by [LiveKit Meet](https://github.com/livekit-examples/meet) and uses [LiveKit Components React](https://github.com/livekit/components-js). The reference project is Apache-2.0 licensed. This Vite implementation is provided under Apache-2.0; see `LICENSE`.