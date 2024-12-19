const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url'); // URL 모듈 추가

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, 'react-app/build/index.html'),
      protocol: 'file:',
      slashes: true,
    })
  );
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit(); // macOS에서 앱 종료 처리
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow(); // macOS에서 앱 재실행 처리
});
