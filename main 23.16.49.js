const { app, BrowserWindow } = require('electron');
const path = require('path');

if (process.env.NODE_ENV === 'development') {
  require('electron-reload')(__dirname, {
    // electron'un binary'si node_modules/.bin/electron (genellikle çalışır)
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
  });
}

app.whenReady().then(() => {
    const mainWindow = new BrowserWindow({
        width: 400,
        height: 475,
        icon: path.join(__dirname, 'assets', 'app-icon.icns'),
        resizable: false,
        frame: true,
        alwaysOnTop: false,
        webPreferences: {
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false
        }
    });

    mainWindow.on('ready-to-show', () => {
        mainWindow.show();
        mainWindow.setOpacity(0);
        mainWindow.setOpacity(1, { duration: 200 });
    });

    mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));
});
