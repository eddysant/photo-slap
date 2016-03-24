'use strict';

var ipc = require('electron').ipcRenderer;
var remote = require('remote');
var Menu = remote.require('menu');
var MenuItem = remote.require('menu-item');
var fs = require('fs');
var utils = require('../js/utilities')
var config = require('../config');
var $ = require('../js/jquery');

let load_videos = false;

$(document).ready(function() {
  chooseSplash();    
});

$(document).on('keydown', function(e) {

  if (e.keyCode === 37) return prevImage(e)
  if (e.keyCode === 39) return nextImage(e)
  if (e.keyCode === 46) return deleteImage(e)
  
});

function nextImage(e) {
  // Show next image

  utils.debugLog('next.');
  ipc.send('get-next');
}

function prevImage(e) {
  // Show previous image

  utils.debugLog('previous.');
  ipc.send('get-prev');
}

function deleteImage(e) {
  utils.debugLog('delete');
  
  var yes_no = confirm('Are you sure you want to delete the image?');
  if (yes_no === true) {
    ipc.send('delete-file');
  }
  
}

function chooseSplash(e) {  
  
  var random = Math.floor((Math.random() * config.number_of_splash_imgs) + 1);
  utils.debugLog('update-splash-image: ' + random);  
  $('#splash-div').css('background-image', 'url(./images/splash-' + random + '.jpg)');
}

ipc.on('update-display-image', function(e, filename) {

  var adjusted_path = encodeURI(filename.replace(/\\/g, '/')).replace('(', '\\(').replace(')', '\\)');
  utils.debugLog('update-display-image: ' + adjusted_path);  
  
  $('#splash-div').addClass('hidden');
  $('#video-div').addClass('hidden');
  $('#display-div').addClass('hidden');  
  $('#video-player').attr('src', '');
  
  if ( utils.isVideo(filename) ) {
    $('#video-div').removeClass('hidden');
    $('#video-player').attr('src', adjusted_path);    
  } else {          
    $('#display-div').removeClass('hidden');    
    $('#display-div').css('background-image', 'url(file://' + adjusted_path + ')');
  }

});


ipc.on('get-files', function(e, opened_directories) {
  utils.debugLog('get-files');

  $('#loading-div').removeClass('hidden');
  $('#splash-div').addClass('hidden');
  $('#display-div').addClass('hidden');

  load_videos = $('#include_video').is(':checked');

  utils.getFiles(opened_directories, load_videos, function(files) {

    $('#loading-div').addClass('hidden');

    utils.debugLog(files);
   	ipc.send('load-files', files);

  });
});


var appmenu_template = [
  {
    label: 'photo-slap',
    submenu: [
      {
        label: 'add directories',
        accelerator: 'Command+O',
        click: function() { ipc.send('open-directories-dialog'); }
      },
      {
        label: 'shuffle',
        accelerator: 'Command+R',
        click: function() { ipc.send('shuffle-files'); }
      },
      {
        type: 'separator'
      },
      {
        label: 'quit',
        accelerator: 'Command+Q',
        click: function() { ipc.send('close'); }
      }
    ]
  },
  {
    label: 'help',
    submenu: [
      {
        label: 'about photo-slap',
        click: function() { ipc.send('open-url-in-external', 'https://github.com/eddysant/photo-slap'); }
      },
      {
        label: 'report issue',
        click: function() { ipc.send('open-url-in-external', 'https://github.com/eddysant/photo-slap/issues'); }
      }
    ]
  }
];

var appmenu = Menu.buildFromTemplate(appmenu_template);
Menu.setApplicationMenu(appmenu);

