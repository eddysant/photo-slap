'use strict';

const default_config = require('../config');
const Config = require('electron-config');
const config = new Config();

const min_reasonable_time = 0.1;
const max_reasonable_time = 1000;
 
exports.getAutoShuffle = () => {
  if (config.has('auto_shuffle')) {
    return config.get('auto_shuffle');
  }
  return default_config.default_auto_shuffle;
};

exports.setAutoShuffle = (value) => {
  config.set('auto_shuffle', value);
};

exports.getIncludeVideos = () => {
  if (config.has('include_video')) {
    return config.get('include_video');
  }
  return default_config.default_include_video;
};

exports.setIncludeVideos = (value) => {
  config.set('include_video', value);
};

exports.getUseTransitions = () => {
  if (config.has('use_transitions')) {
    return config.get('use_transitions');
  }
  return default_config.default_use_tranistions;
};

exports.setUseTransitions = (value) => {
  config.set('use_transitions', value);
};

exports.getBlackBackground = () => {
  if (config.has('black_background')) {
    return config.get('black_background');
  }
  return default_config.default_black_background;
};

exports.setBlackBackground = (value) => {
  config.set('black_background', value);
};

exports.getSlideShowTimer = () => {
  if (config.has('slide_show_timer')) {
    return config.get('slide_show_timer');
  }
  
  return default_config.default_slide_show_timer;
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

