'use strict';

var fs = require('fs');
var path = require('path');
var async = require('async');
var config = require('../config');
var $ = require('./jquery');  


var directoryFiles = [];
var includeVideos = false;

exports.getFiles = function (directories, addVideos, callback) {
		
    if (config.debug && config.debug === true)
    	console.log('getting files...');                				       
	
    includeVideos = addVideos;

    async.each(directories, exports.walkDirectories, function(err) {
    	
      if (err) {
    	  callback(null, err);
    	}
    	else {        
          return callback(directoryFiles);
      }
        
    });      
    
};

exports.walkDirectories = function (directory, callback) {
        

  exports.walk (directory, function (error, results) {
	                        
    if (error)	{
		if (config.debug && config.debug === true)
      		console.log(error);
      callback(error)
    }
    else {
    	if (config.debug && config.debug === true)
      		console.log('adding files: ' +  results);
      directoryFiles.push(results);                
      callback();
    }
  });
         
};


exports.walk = function(dir, done) {
  	
  var results = [];
  
  fs.readdir(dir, function(err, list) {
  
    if (err) {
	  return done(err);  
    }
  
    var pending = list.length;  
    if (!pending) {
	  return done(null, results);
    }

    list.forEach( function(file) {
		
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          exports.walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending){
				done(null, results);
			}
          });

        } else {			
			
          if (exports.includeFile(file)) {
			results.push(file);  
		  }
          
          if (!--pending) {
			done(null, results);  
		  }
        }
      });
	  
    });
	
  });
  
};

exports.includeFile = function(filename) {
	
	for(var i = 0; i < config.supported_extensions.length; i++) {
		if (filename.toLowerCase().endsWith(config.supported_extensions[i])){
			return true;
		}  			  
  	}
  	
  	if (includeVideos) {
  		for(var i = 0; i < config.supported_video.length; i++) {
			if (filename.toLowerCase().endsWith(config.supported_video[i])){
				return true;
			}  			  
	  	}
  	}
  	
  	return false;
}

exports.deleteFile = function(filename) {
    fs.unlink(filename);
};

exports.shuffle = function(array) {
        
  var currentIndex = array.length;
  var temporaryValue;
  var randomIndex;
  
  while (0 !== currentIndex) {
      
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
    
  }
  
  return array;
}
