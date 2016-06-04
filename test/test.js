'use strict';

const assert = require('assert');
const utilities = require('../js/utilities');

describe('utilities - isVideo', function() {
  it('should return true', function() {
    assert(utilities.isVideo('file.mp4'));
  });
  
  it('should return false', function() {
    assert(false === utilities.isVideo('file.jpg'));
  });
  
});