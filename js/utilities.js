'use strict';

var fs = require('fs');
var path = require('path');
var config = require('../config');
var $ = require('./jquery');  

exports.getFiles = function (directories, callback) {
		
	var directoryWalks = [];		
	var files = [];
    
    directories.forEach( function (dir) {		
		directoryWalks.push( exports.walk (dir, function (error, results) {
			if (error)	{
				console.log(error);				
			}
			else {
				files.push(results);
			}
		}));		
	});	

	$.when.apply($,directoryWalks).done( function() { 	
		callback(files);;	
	});	
}

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