'use strict';

var ipc = require('electron').ipcRenderer;
var remote = require('remote');
var Menu = remote.require('menu');
var MenuItem = remote.require('menu-item');
var fs = require('fs');
var utils = require('../js/utilities')
var $ = require('../js/jquery');

let file_list;
let current_image;
let opened_directories;

$(document).on('keydown', function (e) {
	
  if (e.keyCode === 37 ) return prevImage(e)
  if (e.keyCode === 39 ) return nextImage(e)
	 
});

function nextImage(e) {
	// Show next image
	console.log ("next");
	current_image++;
	ipc.send('update-display-image');
}

function prevImage(e) {
	// Show previous image
	console.log ("prev");
	current_image--;
	ipc.send('update-display-image');
}

ipc.on('update-display-image', function () {
  if (file_list !=null && file_list.length > 0) {
	
	if (current_image >= file_list.length)
		current_image = 0;
	else if (current_image < 0)
		current_image = file_list.length - 1;
	
	$('.display-image').css('background-image','url(' + file_list[current_image] + ')');
  }
});


ipc.on('reset-display', function () {
	$('.display-image').removeClass('.hidden');
	$('.splash-image').addClass('.hidden');
	file_list = [];
});

ipc.on('get-files', function () {

    ipc.send('reset-display');
	
	utils.getFiles(opened_directories, function(files){
      console.log(files);
      file_list = files;	  
	  current_image = 0;
      ipc.send('update-display-image');
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

