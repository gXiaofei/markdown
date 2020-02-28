const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 680,
        webPreferences: {
            // 在渲染进程也可以写node代码
            nodeIntegration: true
        }
    });

    // and load the index.html of the app.
    // mainWindow.loadFile('index.html');

    const urlLocation = isDev ? 'http://localhost:3000' : 'dummyurl';
    mainWindow.loadURL(urlLocation);

    // Open the DevTools.
    mainWindow.webContents.openDevTools();
}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function() {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
