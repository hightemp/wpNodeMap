
const electron = require('electron');

const objApplication = electron.app
// Module to create native browser window.
const TBrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')


let objMainWindow = null;

function fnCreateWindow() {
  objMainWindow = new TBrowserWindow({
		titleBarStyle: 'hidden',
		title: '',
		width: 1000,
		height: 700,
		maximizable: true,
		minimizable: true,
		resizable: true
	});

	objMainWindow.loadURL('file://' + __dirname + '/index.html');

	objMainWindow.on('closed', () =>
  {
		mainWindow = null;
	});
}

objApplication.on('ready', () =>
{
  fnCreateWindow();
});

objApplication.on('window-all-closed', function () {
  objApplication.quit()
})

objApplication.on('activate', function () {
  if (objMainWindow === null) {
    fnCreateWindow()
  }
})
