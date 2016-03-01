'use strict';

var fs = require('fs');
var path = require('path');
var async = require('async');
var config = require('../config');
var $ = require('./jquery');  


var directoryFiles = [];

exports.getFiles = function (directories, callback) {
		
    console.log('getting files...');                				       

    async.each(directories, exports.walkDirectories, function(err) {
        console.log("all done");
        callback(directoryFiles);
    });      
};

exports.walkDirectories = function (directory, callback) {
        
  exports.walk (directory, function (error, results) {
	                        
    if (error)	{
      console.log(error);				
    }
    else {
      console.log('adding files: ' +  results);
      directoryFiles.push(results);                
      callback();
    }
  }) 
         
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
		
		  var isImage = false;
		  for(var i = 0; i < config.supported_extensions.length; i++) {
		    if (file.toLowerCase().endsWith(config.supported_extensions[i])){
				isImage = true;
				break;
			}  			  
		  }
		  
          if (isImage) {
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
