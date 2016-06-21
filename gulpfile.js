'use strict';
 
var gulp = require('gulp'),
	eslint = require('gulp-eslint'),
	eslintThreshold = require('gulp-eslint-threshold');
 
gulp.task('eslint', function() {
	var thresholdWarnings = 3;
 
	return gulp.src(['**/*.js', '!node_modules/**', '!bower_components/**'])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslintThreshold.afterWarnings(thresholdWarnings, function (numberOfWarnings) {
			throw new Error('ESLint warnings (' + numberOfWarnings + ') equal to or greater than the threshold (' + thresholdWarnings + ')');
		}));
});
 
gulp.task('default', ['eslint']);
