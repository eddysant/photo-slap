'use strict';

$('#add_directories').on('click', (e) => {
  ipc.send('open-directories-dialog');
});

$('#trash-button').on('click', (e) => {
  return controls.deleteImage(e);
});

$('#back-button').on('click', (e) => {
  return controls.prevImage(e);
});

$('#play-button').on('click', (e) => {
  return controls.toggleSlideShow(e);
});

$('#forward-button').on('click', (e) => {
  return controls.nextImage(e);
});

$('#expand-button').on('click', (e) => {
  return controls.toggleExpand(e);
});

$('#auto-shuffle-button').on('click', (e) => {
  const val = !options.getAutoShuffle();
  setOptionStyle('#auto-shuffle-button', val);
  options.setAutoShuffle(val);
});

$('#include-videos-button').on('click', (e) => {
  const val = !options.getIncludeVideos();
  setOptionStyle('#include-videos-button', val);
  options.setIncludeVideos(val);
});

$('#transitions-button').on('click', (e) => {
  const val = !options.getUseTransitions();
  setOptionStyle('#transitions-button', val);
  options.setUseTransitions(val);
});

$('#background-button').on('click', (e) => {
  const val = !options.getBlackBackground();
  setOptionStyle('#background-button', val);
  options.setBlackBackground(val);
});

$('#seconds-between-images').on('blur', (e) => {
  const msg = options.setSlideShowTimer($('#seconds-between-images').val());
  if (msg !== 'success') {
    alert(msg);
    $('#seconds-between-images').val(options.getSlideShowTimer());
  }
});

function setOptionStyle (elem, val) {
  if (val) {
    $(elem).find('#expand-icon').removeClass('fa-times');
    $(elem).find('#expand-icon').addClass('fa-check');
  } else {
    $(elem).find('#expand-icon').removeClass('fa-check');
    $(elem).find('#expand-icon').addClass('fa-times');
  }
}


$(document).on('keydown', (e) => {
  const back_arrow = 37;
  const forward_arrow = 39;
  const delete_key = 46;
  const space_key = 32;
  
  if (e.keyCode === back_arrow) {
    return controls.prevImage(e);
  }
  if (e.keyCode === forward_arrow) {
    return controls.nextImage(e);
  }
  if (e.keyCode === delete_key) {
    return controls.deleteImage(e);
  }
  if (e.keyCode === space_key) {
    return controls.toggleSlideShow(e);
  }
  
  return null;
});