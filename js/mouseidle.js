const $ = require('jquery');

module.exports = (elem, timeout, className) => {
  const magicNumber = 250;
  const max = (timeout / magicNumber) | 0;
  let overScreen = false;
  let hiding = false;
  let moving = 0;
  let tick = 0;
  let mousedown = false;

  const update = () => {
    if (hiding) {
      $('body').removeClass(className);
      hiding = false;
    }
  };

  $(elem).on('mouseover', () => {
    overScreen = true;
    update();
  });

  $(elem).on('mouseout', () => {
    overScreen = false;
  });

  $(elem).on('mousedown', (e) => {
    mousedown = true;
    moving = tick;
    update();
  });

  $(elem).on('mouseup', (e) => {
    mousedown = false;
    moving = tick;
  });

  $(window).on('mousemove', (e) => {
    moving = tick;
    update();
  });

  setInterval(() => {
    tick++;

    if (!overScreen || tick - moving < max || mousedown) {
      return;
    }

    hiding = true;
    $('body').addClass(className);
  }, magicNumber);

};
