'use strict';

const electron = require('electron');
const ipc = electron.ipcRenderer;
const remote = electron.remote;
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;
const fs = require('fs');
const utils = require('../js/utilities');
const controls = require('../js/controls');
const options = require('../js/options');
const config = require('../config');
const $ = require('jquery');

$(document).ready(() => {
  $('[data-toggle="tooltip"]').tooltip();
  controls.chooseSplash();

  setOptionStyle('#auto-shuffle-button', options.getAutoShuffle());
  setOptionStyle('#include-videos-button', options.getIncludeVideos());
  setOptionStyle('#transitions-button', options.getUseTransitions());
  setOptionStyle('#background-button', options.getBlackBackground());
  $('#seconds-between-images').val(options.getSlideShowTimer());
  
});


ipc.on('update-display-image', (e, filename) => {

  const switching_from_video = $('#video-div').is(":visible") === true;

  $('#splash-div').addClass('hidden');
  $('#splash-div').css('background-image', 'none');
  
  $('#video-div').addClass('hidden');
  $('#video-player').attr('src', '');


  let element = $('#display-div');
  if (!options.getBlackBackground()) {
    element = $('#full-display-div');
  }

  if (options.getUseTransitions() && !switching_from_video) {
    element.fadeOut(() => {
      removeAndReplace(filename);
    });
  } else {
    removeAndReplace(filename);
  }
});

function removeAndReplace(filename) {

  $('#full-display-div').remove();
  $('#display-div').remove();
  if (!options.getBlackBackground() && !utils.isVideo(filename)) { 
    $('#loading-div').after('<div id="full-display-div" class="full-display hidden"><div id="display-div" class="display-image"></div><div id="blurred-div" class="blurred-image"></div></div>');
  } else {
    $('#loading-div').after('<div id="display-div" class="display-image hidden"></div>');
  }
  
  if (utils.isVideo(filename)) {

    const adjusted_path = encodeURI(filename.replace(/\\/g, '/')).replace(/#/g, '%23');
    utils.debugLog('update-display-image: ' + adjusted_path);
    $('#video-div').removeClass('hidden');
    $('#video-player').attr('src', adjusted_path);
    controls.pauseSlideShowforVideo(e);

  } else {
      
    const adjusted_path = encodeURI(filename.replace(/\\/g, '/')).replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/'/g, '\\\'').replace(/#/g, '%23');
    utils.debugLog('update-display-image: ' + adjusted_path);
    
    let element = $('#display-div');
    if (!options.getBlackBackground()) {
      $('#blurred-div').css('background-image', 'url(file://' + adjusted_path + ')');
      element = $('#full-display-div');
    }

    $('#display-div').css('background-image', 'url(file://' + adjusted_path + ')');
    
    if (options.getUseTransitions()) {
      element.fadeIn('slow').removeClass('hidden');
    } else {
      element.removeClass('hidden');
    }

  }

}

ipc.on('get-files', (e, opened_directories) => {
  utils.debugLog('get-files');

  $('#loading-div').removeClass('hidden');
  $('#splash-div').addClass('hidden');
  $('#display-div').addClass('hidden');

  $('#controls-div').fadeOut();

  utils.getFiles(opened_directories, (files) => {

    $('#loading-div').addClass('hidden');

    if (options.getAutoShuffle()) {
      utils.debugLog('suffling files');
      utils.shuffle(files);
    }

    $('#controls-div').fadeIn();
    $('#controls-div').bind('mouseleave', () => {
      $('#controls-div').fadeTo(config.milliseconds_to_fade, 0);
    });
    $('#controls-div').bind('mouseenter', () => {
      $('#controls-div').fadeTo(config.milliseconds_to_fade, config.max_opacity);
    });

    utils.debugLog(files);
    ipc.send('load-files', files);

  });
});


const appmenu_template = [
  {
    label: 'photo-slap',
    submenu: [
      {
        label: 'open directories',
        click: () => {
          ipc.send('open-directories-dialog');
        }
      },
      {
        label: 'shuffle',
        click: () => {
          ipc.send('shuffle-files');
        }
      },
      {
        label: 'options',
        click: () => {
          $('#optionsModal').modal('show');
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'quit',
        click: () => {
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
        click: () => {
          ipc.send('open-url-in-external', 'https://github.com/eddysant/photo-slap');
        }
      },
      {
        label: 'report issue',
        click: () => {
          ipc.send('open-url-in-external', 'https://github.com/eddysant/photo-slap/issues');
        }
      }
    ]
  }
];

const appmenu = Menu.buildFromTemplate(appmenu_template);
Menu.setApplicationMenu(appmenu);

