
const objPath = require('path')

const objElectron = require('electron');
const objIPC = objElectron.ipcMain;

const objApplication = objElectron.app;
// Module to create native browser window.
const TBrowserWindow = objElectron.BrowserWindow;
const TTray = objElectron.Tray;
const objMenu = objElectron.Menu;

let objMainWindow = null;
let objTray = null;

function fnCreateTray() {
  objTray = new TTray(
    objPath.join(__dirname,
      objPath.join("images", "icon.png")
    )
  );
}

function fnCreateWindow() {
  objMainWindow = new TBrowserWindow({
		titleBarStyle: 'default',
		title: '',
		width: 700,
		height: 700,
		maximizable: true,
		minimizable: true,
		resizable: true
	});

	objMainWindow.loadURL('file://' + __dirname + '/index.html');

	objMainWindow.on('closed', () =>
  {
		objMainWindow = null;
    objApplication.quit()
	});
}

objApplication.on('ready', () =>
{
  fnCreateTray();
  fnCreateWindow();

  objIPC.on('close-main-window', function () {
      app.quit();
  });

  objIPC.on('save', function() {
    console.log('save');
  })
});

objApplication.on('window-all-closed', function () {
  objApplication.quit()
})

objApplication.on('activate', function () {
  if (objMainWindow === null) {
    fnCreateWindow()
  }
})
