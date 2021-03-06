'use strict';
 
const gulp = require('gulp');
const	eslint = require('gulp-eslint');
const	eslintThreshold = require('gulp-eslint-threshold');
 
gulp.task('eslint', function() {
	
  const thresholdWarnings = 3;
 
  return gulp.src(['**/*.js', '!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslintThreshold.afterWarnings(thresholdWarnings, (numberOfWarnings) => {
      throw new Error('ESLint warnings (' + numberOfWarnings + ') equal to or greater than the threshold (' + thresholdWarnings + ')');
    }));
		
});
 
gulp.task('default', ['eslint']);
