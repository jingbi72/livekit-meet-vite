const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('desktopInfo', Object.freeze({
  isElectron: true,
  platform: process.platform,
}));
