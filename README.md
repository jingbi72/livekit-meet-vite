# LiveKit Meet — Vite + React

A frontend-only Vite + React video meeting client inspired by [livekit-examples/meet](https://github.com/livekit-examples/meet). It uses the official LiveKit React Components and client SDK.

## Features

- Responsive meeting join page
- LiveKit room video conference UI, participant tiles, audio/video controls and chat provided by LiveKit Components
- Connect directly to any LiveKit Cloud or self-hosted server
- Room name generation and shareable invite URL
- Generates a room-scoped participant JWT in the browser using the configured API key and secret
- No Express server, API route, or token endpoint

## Requirements

- Node.js 18+
- A LiveKit server URL, API key, and API secret

## Run locally

```bash
npm install
cp .env.example .env.local
```

Edit `.env.local`:

```dotenv
VITE_LIVEKIT_URL=wss://your-project.livekit.cloud
VITE_LIVEKIT_API_KEY=your-livekit-api-key
VITE_LIVEKIT_API_SECRET=your-livekit-api-secret
```

Then start Vite:

```bash
npm run dev
```

On Windows PowerShell, use `Copy-Item .env.example .env.local` instead of `cp`.

Enter your display name and room name. The app generates a six-hour JWT scoped to that room with join, publish, subscribe, and data permissions.

## Build

```bash
npm run build
npm run preview
```

The static production output is written to `dist/`. Host it on a static web server with HTTPS. The app needs a network connection to your LiveKit server for meetings.

## Security note — prototype only

**This implementation signs participant JWTs in the browser.** Every `VITE_*` variable is public and is bundled into client-side JavaScript. Anyone who can access the app can extract the API secret and mint tokens with the permissions available to that key. Use only a disposable/test LiveKit project; rotate credentials if exposed. Do not deploy this configuration with production credentials. For production, generate short-lived participant tokens in a trusted backend.

The invite URL contains the room name and server URL, not the participant token. Recipients generate their own token using the app's configured credentials.

## Reference and license

Inspired by [LiveKit Meet](https://github.com/livekit-examples/meet) and uses [LiveKit Components React](https://github.com/livekit/components-js). The reference project is Apache-2.0 licensed. This Vite implementation is provided under Apache-2.0; see `LICENSE`.
