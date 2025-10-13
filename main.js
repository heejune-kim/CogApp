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

/**
 * Python 인터프리터를 사용하여 server.py를 실행하는 함수
 * assets/py311/python.exe를 사용하여 assets/py311/server/server.py를 실행
 */
function launchPython() {
  const isDev = !app.isPackaged;

  // 경로 설정
  const basePath = isDev
    ? path.join(__dirname, 'assets')
    : path.join(process.resourcesPath, 'assets');

  const pythonExe = path.join(basePath, 'py311', 'python.exe');
  const serverScript = path.join(basePath, 'py311', 'server', 'server.py');
  const serverDir = path.join(basePath, 'py311', 'server');

  console.log('=== Python Launch Info ===');
  console.log('Base Path:', basePath);
  console.log('Python Exe:', pythonExe);
  console.log('Server Script:', serverScript);
  console.log('Server Dir:', serverDir);

  // 파일 존재 확인
  if (!fs.existsSync(pythonExe)) {
    console.error(`❌ Python executable not found: ${pythonExe}`);
    return;
  }

  if (!fs.existsSync(serverScript)) {
    console.error(`❌ Server script not found: ${serverScript}`);
    return;
  }

  // Python 프로세스 시작
  // cwd를 server 디렉토리로 설정하여 상대 import가 제대로 작동하도록 함
  pyProc = spawn(pythonExe, [serverScript], {
    cwd: serverDir,  // 작업 디렉토리를 server 폴더로 설정
    env: {
      ...process.env,
      PYTHONPATH: serverDir,  // Python 모듈 검색 경로에 server 디렉토리 추가
      PYTHONIOENCODING: 'utf-8',  // 한글 출력 깨짐 방지
    }
  });

  console.log('✅ Python process started with PID:', pyProc.pid);

  pyProc.stdout.on('data', (data) => {
    console.log(`[Python]: ${data.toString().trim()}`);
  });

  pyProc.stderr.on('data', (data) => {
    console.error(`[Python ERROR]: ${data.toString().trim()}`);
  });

  pyProc.on('error', (err) => {
    console.error('❌ Failed to start Python process:', err);
  });

  pyProc.on('exit', (code, signal) => {
    console.log(`Python process exited with code ${code} and signal ${signal}`);
    pyProc = null;
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

  // ✅ 창 드래그 핸들러 추가
  ipcMain.on("start-window-drag", (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (window) {
      window.setBounds({ ...window.getBounds() }); // 창 이동 활성화
    }
  });

  //startPython();
  launchPython();  // Python 인터프리터로 server.py 실행
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

