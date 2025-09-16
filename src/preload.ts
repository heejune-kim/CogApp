// preload.js
const { contextBridge, ipcRenderer, webUtils } = require('electron');


function logToMain(message: string) {
  ipcRenderer.send("preload-log", message);
}

const origLog = console.log;
console.log = (...args) => {
  origLog(...args);
  ipcRenderer.send("preload-log", args.join(" "));
};

console.log("Preload started!");  // DevTools 콘솔
//logToMain("Preload started!");    // 터미널에도 찍히게

console.log('Preload script loaded');
//contextBridge.exposeInMainWorld('api', {
contextBridge.exposeInMainWorld('electronAPI', {
  ping: () => ipcRenderer.invoke('ping'),
  send: (channel: string, data?: unknown) => ipcRenderer.send(channel, data),
  invoke: (channel: string, data?: unknown) => ipcRenderer.invoke(channel, data),
  /*
  on: (channel: string, listener: (...args: unknown[]) => void) =>
    ipcRenderer.on(channel, (_event, ...args) => listener(...args)),
  once: (channel: string, listener: (...args: unknown[]) => void) =>
    ipcRenderer.once(channel, (_event, ...args) => listener(...args)),
  */
  removeAll: (channel: string) => ipcRenderer.removeAllListeners(channel),
  openFileDialog: (options: Electron.OpenDialogOptions) =>
    ipcRenderer.invoke('show-open-dialog', options),
  getPathForFile: (file: File) => webUtils.getPathForFile(file),
});
