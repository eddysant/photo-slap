'use strict';

const fs = require('fs');
const path = require('path');
const async = require('async');
const config = require('../config');

const bytes_to_mega = 1000000;

let directoryFiles = [];
let includeVideos = false;

exports.getFiles = function(directories, addVideos, callback) {

  exports.debugLog('getting files...');
  includeVideos = addVideos;

  async.each(directories, exports.walkDirectories, function(err) {
    if (err) {
      return callback(null, err);
    } else {
      return callback(directoryFiles);
    }
  });
};

exports.walkDirectories = function(directory, callback) {


  exports.walk(directory, function(error, results) {

    if (error) {
      exports.debugLog(error);
      return callback(error);
    } else {
      exports.debugLog('adding files: ' + results);
      directoryFiles = directoryFiles.concat(results);
      return callback();
    }
  });

};


exports.walk = function(dir, done) {

  let results = [];

  fs.readdir(dir, function(err, list) {

    if (err) {
      return done(err);
    }

    let pending = list.length;
    if (!pending) {
      return done(null, results);
    }

    list.forEach(function(file) {

      const resolved_file = path.resolve(dir, file);
      fs.stat(resolved_file, function(err, stat) {
          
        if (stat && stat.isDirectory()) {
          exports.walk(resolved_file, function(err, res) {
            results = results.concat(res);
            if (!--pending) {
              return done(null, results);
            }
            
            return null;
          });

        } else {
          
          if (exports.includeFile(resolved_file, stat)) {
            results.push(resolved_file);
          }

          if (!--pending) {
            return done(null, results);
          }
        }
            
        return null;
      });
    });
    
    return null;
  });
};

exports.includeFile = function(filename, stat) {

  for (let i = 0; i < config.supported_extensions.length; i++) {
    if (filename.toLowerCase().endsWith(config.supported_extensions[i])) {
      
      if ((stat.size / bytes_to_mega) > config.max_image_size_in_mb) {
        if (config.debug && config.debug === true) {
          console.log('file to large, skipping | size: ' + stat.size / bytes_to_mega + ' | name: ' + filename);
        }
        return false;
      } else {
        return true;
      }
    }
  }

  if (includeVideos) {
    return exports.isVideo(filename);
  }

  return false;
};

exports.deleteFile = function(filename) {
  try {
    fs.unlink(filename);
    return true;
  } catch (ex) {
    return false;
  }
};

exports.shuffle = function(array) {

  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

  while (0 !== currentIndex) {

    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;

  }

  return array;
};

exports.isVideo = function(filename) {
  for (let i = 0; i < config.supported_video.length; i++) {
    if (filename.toLowerCase().endsWith(config.supported_video[i])) {
      return true;
    }
  }

  return false;
};

exports.debugLog = function(message) {
  if (config.debug && config.debug === true) {
    console.log(message);
  }

  return;
};