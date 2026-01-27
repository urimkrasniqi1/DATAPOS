const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let backendProcess;

// Determine if we're in development or production
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    title: 'MobilshopurimiPOS',
    icon: path.join(__dirname, 'public/favicon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    autoHideMenuBar: true,
  });

  // Remove menu bar for cleaner look
  Menu.setApplicationMenu(null);

  if (isDev) {
    // In development, load from React dev server
    mainWindow.loadURL('http://localhost:3000');
    // mainWindow.webContents.openDevTools();
  } else {
    // In production, load the built React app
    mainWindow.loadFile(path.join(__dirname, 'build/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Maximize on start for POS usage
  mainWindow.maximize();
}

// Silent printing handler
ipcMain.handle('silent-print', async (event, options) => {
  try {
    const win = BrowserWindow.getFocusedWindow();
    if (!win) {
      return { success: false, error: 'No window found' };
    }

    // Get available printers
    const printers = await win.webContents.getPrintersAsync();
    
    // Find the default printer or specified printer
    let targetPrinter = printers.find(p => p.isDefault);
    if (options.printerName) {
      const specificPrinter = printers.find(p => p.name === options.printerName);
      if (specificPrinter) {
        targetPrinter = specificPrinter;
      }
    }

    if (!targetPrinter) {
      return { success: false, error: 'No printer available' };
    }

    // Print silently
    await win.webContents.print({
      silent: true,
      printBackground: true,
      deviceName: targetPrinter.name,
      margins: {
        marginType: 'none'
      },
      pageSize: options.pageSize || 'A4',
      ...options.printOptions
    });

    return { success: true, printer: targetPrinter.name };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Get available printers
ipcMain.handle('get-printers', async () => {
  try {
    const win = BrowserWindow.getFocusedWindow();
    if (!win) {
      return [];
    }
    const printers = await win.webContents.getPrintersAsync();
    return printers.map(p => ({
      name: p.name,
      displayName: p.displayName,
      isDefault: p.isDefault,
      status: p.status
    }));
  } catch (error) {
    console.error('Error getting printers:', error);
    return [];
  }
});

// Print to PDF (for preview)
ipcMain.handle('print-to-pdf', async (event, options) => {
  try {
    const win = BrowserWindow.getFocusedWindow();
    if (!win) {
      return { success: false, error: 'No window found' };
    }

    const pdfData = await win.webContents.printToPDF({
      printBackground: true,
      margins: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      },
      pageSize: options.pageSize || 'A4',
    });

    return { success: true, data: pdfData.toString('base64') };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

function startBackend() {
  if (isDev) {
    console.log('Development mode - backend should be started separately');
    return;
  }

  // In production, start the backend server
  const backendPath = path.join(process.resourcesPath, 'backend');
  const pythonPath = process.platform === 'win32' ? 'python' : 'python3';
  
  backendProcess = spawn(pythonPath, ['-m', 'uvicorn', 'server:app', '--host', '127.0.0.1', '--port', '8001'], {
    cwd: backendPath,
    env: {
      ...process.env,
      MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017',
      DB_NAME: process.env.DB_NAME || 't3next_pos',
    },
  });

  backendProcess.stdout.on('data', (data) => {
    console.log(`Backend: ${data}`);
  });

  backendProcess.stderr.on('data', (data) => {
    console.error(`Backend Error: ${data}`);
  });
}

app.whenReady().then(() => {
  startBackend();
  
  // Wait a bit for backend to start, then create window
  setTimeout(createWindow, isDev ? 0 : 2000);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // Kill backend process
  if (backendProcess) {
    backendProcess.kill();
  }
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});
