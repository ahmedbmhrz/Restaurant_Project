import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    // Optional: add a custom icon here later
    // icon: path.join(__dirname, 'icon.png')
  });

  // Remove the standard menu bar for a cleaner app feel
  win.setMenuBarVisibility(false);

  if (isDev) {
    // In development, load the Vite dev server. 
    // We append the hash route to jump straight to the locked login screen.
    win.loadURL('http://localhost:5173/#/branch-login');
    // Open DevTools automatically in dev mode
    // win.webContents.openDevTools();
  } else {
    // In production, load the built index.html file
    win.loadFile(path.join(__dirname, '../dist/index.html'), { hash: 'branch-login' });
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
