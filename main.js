const url = require('url');
const path = require('path');
const {app, BrowserWindow} = require('electron');

let mainWindow;

function singleInstance(){
	if(process.mas) return false;

	return app.makeSingleInstance(function(){
		if(mainWindow) {
			if(mainWindow.isMinimized()) mainWindow.restore();
			mainWindow.focus()
		}
	})
}

function createWindow(){
	mainWindow = new BrowserWindow({
		width: 600,
		height: 870,
		resizable: false,
		autoHideMenuBar: true,
	});

	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:'
	}));

	mainWindow.on('closed', function(){
		mainWindow = null;
	})
}

function initialize(){
	if(singleInstance()) return app.quit();

	app.on('ready', createWindow);

	app.on('window-all-closed', function(){
		if(process.platform !== 'darwin') {
			app.quit();
		}
	});

	app.on('activate', function(){
		if(mainWindow === null) {
			createWindow();
		}
	});
}

require('./main-process/imagemin.js');

initialize();