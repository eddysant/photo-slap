'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const dialog = require('dialog');
const ipc = require('electron').ipcMain;
const shell = require('shell');
const utils = require('./js/utilities');
const config = require('./config');


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let main_win;

function createWindow() {

  let file_list;
  let current_image;

  current_image = 0;
  main_win = new BrowserWindow({ width: 1024, height: 768, icon: '/resources/image.ico' });
  main_win.loadURL('file://' + __dirname + '/html/index.html');

  // Open the DevTools.
  if (config.debug && config.debug === true) {
    main_win.webContents.openDevTools();
  }
    

  // ipc functions

  ipc.on('open-directories-dialog', function(e) {
    var opened_directories = dialog.showOpenDialog({ properties: ['openDirectory', 'multiSelections'] })
    if (opened_directories != null) {
      main_win.send('get-files', opened_directories);
    }
  });

  ipc.on('get-next', function(e) {


    if (file_list != null && file_list.length > 0) {
      current_image++;
      if (current_image >= file_list.length) {
        current_image = 0;
      }

      utils.debugLog('get-next: ' + current_image + " | " + file_list[current_image]);
      main_win.send('update-display-image', file_list[current_image]);
    }
  });

  ipc.on('get-prev', function(e) {

    if (file_list != null && file_list.length > 0) {
      current_image--;

      if (current_image < 0) {
        current_image = file_list.length - 1;
      }

      utils.debugLog('get-prev: ' + current_image + " | " + file_list[current_image]);
      main_win.send('update-display-image', file_list[current_image]);
    }
  });

  ipc.on('delete-file', function(e) {
    
    if (utils.deleteFile(file_list[current_image])){
      file_list.splice(current_image, current_image);
      main_win.send('update-display-image', file_list[current_image]);
    } else {
      alert('error deleting file');
    }
    
  });

  ipc.on('clear-images', function(event) {
    utils.debugLog('clear-images');
    file_list = [];
    current_image = 0;

  });

  ipc.on('load-files', function(e, files) {
    file_list = [];

    utils.debugLog('load-files');
    if (files != null && files.length > 0) {
      current_image = 0;
      file_list = files;

      main_win.send('update-display-image', file_list[current_image]);
    }

  });

  ipc.on('shuffle-files', function(e) {
    utils.debugLog('shuffle-files');
    if (file_list == null || file_list.length == 0) {
      return;
    }

    main_win.send('reset-display');
    file_list = utils.shuffle(file_list);
    current_image = 0;
    main_win.send('update-display-image', file_list[current_image]);
  });

  ipc.on('open-url-in-external', function(e, url) {
    shell.openExternal(url)
  });

  ipc.on('close', function(e) {
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
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (main_win === null) {
    createWindow();
  }
});
