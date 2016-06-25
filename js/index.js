'use strict';

const electron = require('electron');
const ipc = electron.ipcRenderer;
const remote = electron.remote;
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;
const fs = require('fs');
const utils = require('../js/utilities');
const config = require('../config');
const $ = require('jquery');

let load_videos = false;
let shuffle_files = false;
let slideshow_toggle = null;

$(document).ready(function() {
  chooseSplash();
});

$('#add_directories').on('click', function(e) {
  ipc.send('open-directories-dialog');
});

$(document).on('keydown', function(e) {
  const back_arrow = 37;
  const forward_arrow = 39;
  const delete_key = 46;
  const space_key = 32;
  
  if (e.keyCode === back_arrow) {
    return prevImage(e);
  }
  if (e.keyCode === forward_arrow) {
    return nextImage(e);
  }
  if (e.keyCode === delete_key) {
    return deleteImage(e);
  }
  if (e.keyCode === space_key) {
    return toggleSlideShow(e);
  }
  
  return null;
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
  
  const yes_no = confirm('Are you sure you want to delete the image?');
  if (yes_no === true) {
    ipc.send('delete-file');
  }
  
}

function toggleSlideShow(e) {
  utils.debugLog("toggle slide show");

  if (slideshow_toggle !== null) {
    window.clearInterval(slideshow_toggle);
    slideshow_toggle = null;
  } else {
    slideshow_toggle = window.setInterval(nextImage, config.slide_show_timer_in_milliseconds);
  }
}


function chooseSplash(e) {
  
  const random = Math.floor((Math.random() * config.number_of_splash_imgs) + 1);
  utils.debugLog('update-splash-image: ' + random);
  $('#splash-div').css('background-image', 'url(./images/splash-' + random + '.jpg)');
}

function pauseSlideShowforVideo() {

  if (slideshow_toggle !== null && config.slide_show_pause_for_video) {
    window.clearInterval(slideshow_toggle);
    $('#video-player').addEventListener('ended', function() {
      slideshow_toggle = window.setInterval(nextImage, config.slide_show_timer_in_milliseconds);
      nextImage();
    }, false);
  }

}

ipc.on('update-display-image', function(e, filename) {

  const adjusted_path = encodeURI(filename.replace(/\\/g, '/')).replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/'/g, '\\\'').replace(/#/g, '%23');
  utils.debugLog('update-display-image: ' + adjusted_path);
  
  $('#splash-div').addClass('hidden');
  $('#splash-div').css('background-image', 'none');
  
  $('#video-div').addClass('hidden');
  $('#video-player').attr('src', '');
      
  $('#display-div').remove();
  $('#loading-div').after('<div id="display-div" class="display-image"></div>');
  
  if (utils.isVideo(filename)) {
    $('#video-div').removeClass('hidden');
    $('#video-player').attr('src', adjusted_path);
    pauseSlideShowForVideo();
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
  shuffle_files = $('#shuffle_files').is(':checked');

  utils.getFiles(opened_directories, load_videos, function(files) {

    $('#loading-div').addClass('hidden');

    if (shuffle_files) {
      utils.shuffle(files);
    }

    utils.debugLog(files);
    ipc.send('load-files', files);

  });
});


const appmenu_template = [
  {
    label: 'photo-slap',
    submenu: [
      {
        label: 'add directories',
        accelerator: 'Command+O',
        click: function() {
          ipc.send('open-directories-dialog');
        }
      },
      {
        label: 'shuffle',
        accelerator: 'Command+R',
        click: function() {
          ipc.send('shuffle-files');
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'quit',
        accelerator: 'Command+Q',
        click: function() {
          ipc.send('close');
        }
      }
    ]
  },
  {
    label: 'help',
    submenu: [
      {
        label: 'about photo-slap',
        click: function() {
          ipc.send('open-url-in-external', 'https://github.com/eddysant/photo-slap');
        }
      },
      {
        label: 'report issue',
        click: function() {
          ipc.send('open-url-in-external', 'https://github.com/eddysant/photo-slap/issues');
        }
      }
    ]
  }
];

const appmenu = Menu.buildFromTemplate(appmenu_template);
Menu.setApplicationMenu(appmenu);

