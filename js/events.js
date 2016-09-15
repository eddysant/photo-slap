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
  return controls.deleteImage(e);
});

$('#include-videos-button').on('click', (e) => {
  return controls.deleteImage(e);
});

$('#transitions-button').on('click', (e) => {
  return controls.deleteImage(e);
});

$('#background-button').on('click', (e) => {
  return controls.deleteImage(e);
});

$('#seconds-between-images').on('blur', (e) => {
  return controls.deleteImage(e);
});


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