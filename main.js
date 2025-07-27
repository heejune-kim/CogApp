const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');

let pyProc = null;

function createWindow() {
  const win = new BrowserWindow({ /* 옵션 */ });

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:3000');
  } else {
    win.loadFile(path.join(__dirname, 'dist/renderer/index.html'));
  }
}

function startPython() {
  const isDev = !app.isPackaged;
  //const script = path.join(__dirname, 'python', 'src/python/server.py');

  //const script = path.join(__dirname, 'src/python/server.py');
  //pyProc = spawn('python', [script]);

  const exePath = isDev
    ? path.join(__dirname, 'dist', 'server.exe')
    : path.join(process.resourcesPath, 'server.exe');

  pyProc = spawn(exePath);

  pyProc.stdout.on('data', (data) => {
    console.log(`[Python]: ${data}`);
  });

  pyProc.stderr.on('data', (data) => {
    console.error(`[Python ERROR]: ${data}`);
  });
}

/*
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // 보안 이슈로 권장 X, 개발 테스트엔 편함
    },
  });

  win.loadFile('index.html');
}
*/

app.whenReady().then(() => {
  startPython();
  createWindow();
});

app.on('window-all-closed', () => {
  if (pyProc) {
    pyProc.kill();
  }
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
