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
	if (config.debug && config.debug === true)
		console.log ("next");	
		
	ipc.send('get-next');
}

function prevImage(e) {
	// Show previous image
	if (config.debug && config.debug === true)
		console.log ("prev");	
		
	ipc.send('get-prev');
}

ipc.on('update-display-image', function (e, image) {         
	if (config.debug && config.debug === true)
    	console.log('update-display-image');
    	
    $('#display-div').removeClass('hidden');
    $('#splash-div').addClass('hidden');                 
    
    var adjusted_path = encodeURI(image.replace(/\\/g, '/'));    
    
	$('#display-div').css('background-image', 'url(file://' + adjusted_path + ')');  
});

ipc.on('get-files', function (e, opened_directories) {
	if (config.debug && config.debug === true)
    	console.log('get-files');	
    	
	utils.getFiles(opened_directories, false, function(files){
		if (config.debug && config.debug === true)
      		console.log(files);
      		
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

