'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const dialog = require('dialog');
const ipc = require('electron').ipcMain;
const shell = require('shell');
const utils = require('./js/utilities');


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let main_win;
let file_list;
let current_image;
let opened_directories;

function createWindow () {

  main_win = new BrowserWindow({width: 1024, height: 768});
  main_win.loadURL('file://' + __dirname + '/html/index.html'); 
  
  // Open the DevTools.
  main_win.webContents.openDevTools();
  
  // ipc functions
  
  ipc.on('open-directories-dialog', function () {    
    opened_directories = dialog.showOpenDialog({ properties: [ 'openDirectory', 'multiSelections' ]})	
	if (opened_directories != null) {
	   main_win.send('get-files');	
	}	    
  });
  

  ipc.on('shuffle-files', function (event, url) {
    main_win.send('reset-display');
    file_list = utils.shuffle(file_list);
	current_image = 0;
    main_win.send('update-display-image');
  });  

  
  ipc.on('open-url-in-external', function (event, url) {
    shell.openExternal(url)
  });
      
      
  ipc.on('close', function () {
    app.quit()
  });
  

  // Emitted when the window is closed.
  main_win.on('closed', function() {
    main_win = null;
  });
  
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (main_win === null) {
    createWindow();
  }
});
