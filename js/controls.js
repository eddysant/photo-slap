'use strict';

const electron = require('electron');
const ipc = electron.ipcRenderer;
const $ = require('jquery');
const config = require('../config');
const utils = require('../js/utilities');

let slideshow_toggle = null;

exports.nextImage = function(e) {
  // Show next image

  utils.debugLog('next.');
  ipc.send('get-next');
};

exports.prevImage = function(e) {
  // Show previous image

  utils.debugLog('previous.');
  ipc.send('get-prev');
};

exports.deleteImage = function(e) {
  utils.debugLog('delete');
  
  const yes_no = confirm('Are you sure you want to delete the image?');
  if (yes_no === true) {
    ipc.send('delete-file');
  }
  
};

exports.toggleSlideShow = function(e) {
  utils.debugLog("toggle slide show");

  if (slideshow_toggle !== null) {
    window.clearInterval(slideshow_toggle);
    slideshow_toggle = null;
  } else {
    slideshow_toggle = window.setInterval(exports.nextImage, config.slide_show_timer_in_milliseconds);
  }
};

exports.chooseSplash = function(e) {
  
  const random = Math.floor((Math.random() * config.number_of_splash_imgs) + 1);
  utils.debugLog('update-splash-image: ' + random);
  $('#splash-div').css('background-image', 'url(./images/splash-' + random + '.jpg)');
};

exports.pauseSlideShowforVideo = function(e) {

  if (slideshow_toggle !== null && config.slide_show_pause_for_video) {
    window.clearInterval(slideshow_toggle);
    document.getElementById('video-player').addEventListener('ended', function() {
      slideshow_toggle = window.setInterval(exports.nextImage, config.slide_show_timer_in_milliseconds);
    }, false);
  }

};