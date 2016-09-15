'use strict';

const config = require('../config');
const EConfig = require('electron-config');
const econfig = new EConfig();

const min_reasonable_time = 0.1;
const max_reasonable_time = 1000;
const second_multiplier = 1000;
 
exports.getAutoShuffle = () => {
  if (econfig.has('auto_shuffle')) {
    return config.get('auto_shuffle');
  }
  return config.default_auto_shuffle;
};

exports.setAutoShuffle = (value) => {
  config.set('auto_shuffle', value);
};

exports.getIncludeVideos = () => {
  if (econfig.has('include_video')) {
    return config.get('include_video');
  }
  return config.default_include_video;
};

exports.setIncludeVideos = (value) => {
  config.set('include_video', value);
};

exports.getUseTransitions = () => {
  if (econfig.has('use_transitions')) {
    return config.get('use_transitions');
  }
  return config.default_use_tranistions;
};

exports.setUseTransitions = (value) => {
  config.set('use_transitions', value);
};

exports.getBlackBackground = () => {
  if (econfig.has('black_background')) {
    return config.get('black_background');
  }
  return config.default_black_background;
};

exports.setBlackBackground = (value) => {
  config.set('black_background', value);
};

exports.getSlideShowTimer = () => {
  if (econfig.has('slide_show_timer')) {
    return config.get('slide_show_timer');
  }
  
  return config.default_slide_show_timer * second_multiplier;
};

exports.setSlideShowTimer = (timer) => {
  if (isNaN(timer)) {
    return 'please enter a number';
  } else if (timer === '') {
    return 'please enter a value';
  } else if (timer < min_reasonable_time || timer > max_reasonable_time) {
    return 'please enter a more realistic value';
  }

  config.set('slide_show_timer', timer);
  return 'success';
};

