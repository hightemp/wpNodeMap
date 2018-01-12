
const objElectron = require('electron');

const objApplication = objElectron.app;
// Module to create native browser window.
const TBrowserWindow = objElectron.BrowserWindow;
const objMenu = objElectron.Menu;

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
		objMainWindow = null;
    objApplication.quit()
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
