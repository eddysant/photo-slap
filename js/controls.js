'use strict';

const electron = require('electron');
const ipc = electron.ipcRenderer;
const $ = require('jquery');
const config = require('../config');
const utils = require('../js/utilities');
const options = require('../js/options');

let slideshow_toggle = null;
let expand_toggle = false;
const second_multiplier = 1000;
const fade_time = 600;

exports.nextImageAuto = (e) => {
  exports.nextImage(e, false);
};

exports.addFadeTime = () => {
  if (options.getUseTransitions()) {
    return fade_time;
  }
  return 0;
};

exports.nextImage = (e, manualPress = true) => {
  // Show next image
  utils.debugLog('next | manual: ' + manualPress);

  if (manualPress) {
    exports.resetSlideShowTimer();
  }
  
  ipc.send('get-next');
};

exports.prevImage = (e) => {
  // Show previous image
  utils.debugLog('previous');

  exports.resetSlideShowTimer();
  
  ipc.send('get-prev');
};

exports.deleteImage = (e) => {
  utils.debugLog('delete');
  
  const yes_no = confirm('Are you sure you want to delete the image?');
  if (yes_no === true) {
    ipc.send('delete-file');
  }
  
};

exports.toggleExpand = (e) => {
  if (expand_toggle) {
    $('#expand-icon').removeClass('fa-compress');
    $('#expand-icon').addClass('fa-expand');
    
  } else {
    $('#expand-icon').removeClass('fa-expand');
    $('#expand-icon').addClass('fa-compress');
  }
  expand_toggle = !expand_toggle;
  utils.debugLog('expand');
  ipc.send('expand-adjust');

};

exports.resetSlideShowTimer = (e) => {
  
  if (slideshow_toggle !== null) {
    utils.debugLog('resetting slideshow timer');
    window.clearInterval(slideshow_toggle);
    slideshow_toggle = window.setInterval(exports.nextImageAuto, (second_multiplier * options.getSlideShowTimer()) + exports.addFadeTime());
  }
};

exports.toggleSlideShow = (e) => {

  utils.debugLog("toggle slide show");

  if (slideshow_toggle !== null) {
    window.clearInterval(slideshow_toggle);
    slideshow_toggle = null;
    $('#play-icon').removeClass('fa-pause');
    $('#play-icon').addClass('fa-play');

  } else {
    $('#play-icon').removeClass('fa-pause');
    $('#play-icon').addClass('fa-pause');
    slideshow_toggle = window.setInterval(exports.nextImageAuto, (second_multiplier * options.getSlideShowTimer()) + exports.addFadeTime());
  }
};


exports.chooseSplash = (e) => {
  
  const random = Math.floor((Math.random() * config.number_of_splash_imgs) + 1);
  utils.debugLog('update-splash-image: ' + random);
  $('#splash-div').css('background-image', 'url(./images/splash-' + random + '.jpg)');
};

exports.pauseSlideShowforVideo = (e) => {

  if (slideshow_toggle !== null && config.slide_show_pause_for_video) {
    window.clearInterval(slideshow_toggle);
    document.getElementById('video-player').addEventListener('ended', () => {
      slideshow_toggle = window.setInterval(exports.nextImageAuto, (second_multiplier * options.getSlideShowTimer()) + exports.addFadeTime());
    }, false);
  }

};