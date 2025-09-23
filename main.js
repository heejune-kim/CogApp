const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');

let pyProc = null;

const resolvePreloadPath = () => {
  const candidates = [
    //path.join(__dirname, 'preload.ts'),
    path.join(__dirname, 'dist', 'preload.js'),
    path.join(__dirname, 'preload.js'),
    //path.join(process.resourcesPath ?? __dirname, 'preload.js'),
    //path.join(process.resourcesPath ?? __dirname, 'preload.js'),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      console.log(`Using preload script at: ${p}`);
      return p;
    }
  }
  throw new Error(`preload.js not found\n${candidates.join('\n')}`);
};

function killPython(proc) {
  if (proc && proc.pid) {
    try {
      console.log("Killing Python process:", proc.pid);
      proc.kill('SIGKILL');
      proc.kill('SIGKILL');
      exec(`taskkill /pid ${proc.pid} /T /F`, (err) => {
        if (err) {
          console.error("Failed to kill Python process:", err);
        } else {
          console.log("✅ Python process killed");
        }
      });
    } catch (err) {
      console.error("Error:", err);
    }
  }
}

function createWindow() {
  const win = new BrowserWindow(
    {
      webPreferences: {
        preload: resolvePreloadPath(),
        contextIsolation: true,
        nodeIntegration: false,
        zoomFactor: 1.0,
        sandbox: true,
      },
      /* 옵션 */
      width: 1024,
      height: 880,
      menu: null, // remove entire menubar
      frame: false, // 창 테두리 제거
      titleBarStyle: 'hidden', // 타이틀 바 숨김
    }
  );
  win.setMenuBarVisibility(false);

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:3000');
    win.webContents.openDevTools({ mode: 'detach' });
  } else {
    win.loadFile(path.join(__dirname, 'dist/renderer/index.html'));
  }
  win.on('closed', () => {
    console.log('Window closed');
    if (pyProc) {
      killPython(pyProc);
      console.log('Window closed - A');
      pyProc = null;
    }
    console.log('Window closed - B');
    app.quit();
    app.exit(0);
    console.log('Window closed - end');
  });

  // 파일 드랍 시 페이지 네비게이션 되는 기본 동작 방지(보안/UX)
  win.webContents.on('will-navigate', (e) => e.preventDefault());
  win.webContents.on('drag-over', (e) => e.preventDefault());
  win.webContents.on('drop', (e) => e.preventDefault());

  // 창 크기 변경 이벤트
  /*
  win.on("resized", () => {
    const [width, height] = win.getSize();
    console.log(`Window resized: ${width}x${height}`);
    win.webContents.send("window-resized", { width, height });
  });
  */
}

function startPython() {
  const isDev = !app.isPackaged;
  //const script = path.join(__dirname, 'python', 'src/python/server.py');

  //const script = path.join(__dirname, 'src/python/server.py');
  //pyProc = spawn('python', [script]);

  const exePath = isDev
    ? path.join(__dirname, 'dist', 'server.exe')
    : path.join(process.resourcesPath, 'server.exe');

  console.log('Starting Python process:', exePath);
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
  ipcMain.on("preload-log", (_, msg) => {
    console.log(`[Preload] ${msg}`);
  });
  // ✅ 파일 다이얼로그 핸들러
  ipcMain.handle('show-open-dialog', async (_e, options) => {
    const win = BrowserWindow.getFocusedWindow() ?? undefined;
    return dialog.showOpenDialog(win, options);
  });

  ipcMain.on("window-control", (event, action) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (!window) return;

    switch (action) {
      case "minimize":
        window.minimize();
        break;
      case "maximize":
        if (window.isMaximized()) {
          window.unmaximize();
        } else {
          window.maximize();
        }
        break;
      case "close":
        window.close();
        break;
    }
  });

  //startPython();
  createWindow();
});

app.on('window-all-closed', () => {
  console.log('Window-all-closed closed');
  if (pyProc) {
    killPython(pyProc);
    pyProc = null;
  }
  app.quit();
  app.exit(0);
  console.log('Window-all-closed closed - end');
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

