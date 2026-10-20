# LiveKit Meet — Vite + React + Electron

A Vite + React video meeting client inspired by [livekit-examples/meet](https://github.com/livekit-examples/meet), with an optional Electron desktop build for Windows. It uses the official LiveKit React Components and client SDK.

## Features

- Responsive meeting join page
- LiveKit room video conference UI, participant tiles, audio/video controls and chat
- Connect directly to LiveKit Cloud or a self-hosted LiveKit server
- Room name generation and shareable invite URL
- Browser-side room-scoped participant JWT generation for local prototype use
- Electron desktop window with camera/microphone permissions and a native screen/window share chooser
- Windows NSIS `Setup.exe` installer
- No Express server or separate token endpoint

## Requirements

- Node.js 20 LTS recommended
- npm
- A LiveKit server URL, API key, and API secret

## Configure local environment

Copy the example file and edit `.env.local`:

```bash
cp .env.example .env.local
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Set the values:

```dotenv
VITE_LIVEKIT_URL=wss://your-project.livekit.cloud
VITE_LIVEKIT_API_KEY=your-livekit-api-key
VITE_LIVEKIT_API_SECRET=your-livekit-api-secret
```

Vite reads these variables when the dev server starts or when the production bundle is built. Restart Vite after changing `.env.local`.

## Run the web app

```bash
npm install
npm run dev
```

## Run the Electron desktop app in development

Install dependencies, then run:

```bash
npm install
npm run electron:dev
```

This starts Vite on `127.0.0.1:5173` and opens the Electron window. Close the window or stop the terminal process to exit.

## Build the Windows installer

Run these commands on a Windows build machine:

```bash
npm install
npm run electron:build
```

The Windows NSIS installer will be written to the `release/` directory, with a name similar to `LiveKit Meet-Setup-1.1.0.exe`. The installer supports choosing the installation directory and creating Start Menu and desktop shortcuts. The target is Windows x64.

To create an unpacked Windows application directory instead of an installer:

```bash
npm run electron:dir
```

The packaged app includes Electron and the compiled frontend; end users do not need to install Node.js. Build-time dependencies and the Electron binary must be downloaded on the build machine. The installed app still needs network access to reach the configured LiveKit server.

## Web build

The original web build remains available:

```bash
npm run build
npm run preview
```

The static web output is written to `dist/`.

## Security note — prototype configuration

**This prototype signs participant JWTs in the browser.** Every `VITE_*` variable is bundled into renderer JavaScript, including `VITE_LIVEKIT_API_SECRET`. Anyone who can access the app can extract the secret and mint tokens using that API key. Use only a disposable/test LiveKit project and rotate credentials if exposed. Do not distribute this build with production credentials. For production, generate short-lived participant tokens in a trusted backend.

Electron is configured with context isolation enabled and Node integration disabled in the renderer. The screen-share chooser lets the user select a screen or window before sharing. Test camera, microphone, screen sharing, and audio behavior on the target Windows machines before distributing the installer.

## Reference and license

Inspired by [LiveKit Meet](https://github.com/livekit-examples/meet) and uses [LiveKit Components React](https://github.com/livekit/components-js). The reference project is Apache-2.0 licensed. This Vite implementation is provided under Apache-2.0; see `LICENSE`.
