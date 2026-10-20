const { app, BrowserWindow, session, shell } = require('electron');
const path = require('node:path');

const isDev = !app.isPackaged;
const devServerUrl = process.env.VITE_DEV_SERVER_URL || 'http://127.0.0.1:5173';

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 960,
    minHeight: 640,
    title: 'LiveKit Meet',
    backgroundColor: '#111113',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
    },
  });

  // Keep the app in its own window; open external links in the user's browser.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://') || url.startsWith('http://')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  win.webContents.on('will-navigate', (event, url) => {
    const allowed = isDev
      ? url.startsWith(devServerUrl)
      : url.startsWith('file://');
    if (!allowed) event.preventDefault();
  });

  if (isDev) {
    win.loadURL(devServerUrl);
  } else {
    win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }

  return win;
}

app.whenReady().then(() => {
  // Permit the renderer's normal browser permission flow for camera and microphone.
  // No Node.js integration is enabled in the renderer.
  session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback, details) => {
    if (permission === 'media') {
      const requested = details.mediaTypes || [];
      callback(requested.includes('audio') || requested.includes('video'));
      return;
    }
    callback(false);
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
