'use strict';

var ipc = require('electron').ipcRenderer;
var remote = require('remote');
var Menu = remote.require('menu');
var MenuItem = remote.require('menu-item');
var fs = require('fs');
var utils = require('../js/utilities')
var $ = require('../js/jquery');

$(document).on('keydown', function (e) {
	
  if (e.keyCode === 37 ) return prevImage(e)
  if (e.keyCode === 39 ) return nextImage(e)
	 
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

ipc.on('update-display-image', function (e, image) {         
	
  utils.debugLog('update-display-image');      	
  $('#display-div').removeClass('hidden');
  $('#splash-div').addClass('hidden');                         
  
  var adjusted_path = encodeURI(image.replace(/\\/g, '/'));        
	$('#display-div').css('background-image', 'url(file://' + adjusted_path + ')');
    
});

ipc.on('get-files', function (e, opened_directories) {
	utils.debugLog('get-files');

  $('#loading-div').removeClass('hidden');
  $('#splash-div').addClass('hidden');
  $('#display-div').addClass('hidden');                       
      	
	utils.getFiles(opened_directories, false, function(files){
    
    $('#loading-div').addClass('hidden');
    
    utils.debugLog(files);          		
   	ipc.send ('load-files', files);
                 
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
        click: function() { ipc.send('open-url-in-external','https://github.com/eddysant/photo-slap/issues'); }
      }
    ]
  }
];

var appmenu = Menu.buildFromTemplate(appmenu_template);
Menu.setApplicationMenu(appmenu);

