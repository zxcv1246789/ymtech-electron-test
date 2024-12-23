const { app, BrowserWindow, ipcMain, ipcRenderer } = require('electron');
const { autoUpdater } = require("electron-updater");
const path = require('path');
const url = require('url'); // URL 모듈 추가

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadURL(
    url.format({
      pathname: path.join(__dirname, 'react-app/build/index.html'),
      protocol: 'file:',
      slashes: true,
    })
  );
}


app.whenReady().then(() => {
	createWindow();
	
  	// 업데이트 사항을 체크하고 알려주는 메서드
	autoUpdater.checkForUpdatesAndNotify();
});

ipcMain.on("app_version", (event) => {
  	// app_version 채널로 현재 version을 보내는 코드
	event.sender.send("app_version", { version: app.getVersion() });
});

autoUpdater.on("update-available", () => {
	win.webContents.send("update_available");
});

autoUpdater.on("update-downloaded", () => {
	win.webContents.send("update_downloaded");
});

ipcMain.on("restart_app", () => {
  	// restart_app 채널로 수신 받았을 때
  	// autoUpdater의 함수를 사용하여
  	// 일렉트론 앱 종료 후 최신 버전으로 다시 설치
	autoUpdater.quitAndInstall();
});


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit(); // macOS에서 앱 종료 처리
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow(); // macOS에서 앱 재실행 처리
});
