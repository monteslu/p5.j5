process.hrtime = require('browser-process-hrtime');
const j5 = require('johnny-five');

j5.usbSerial = require('webusb-serial');
j5.firmata = require('firmata');
j5.nodeLed = require('node-led');
j5.nodePixel = require('node-pixel');
j5.oledJS = require('oled-js');

const { EventEmitter } = require('events');
j5.events = new EventEmitter();

j5.handleElementInit = function(btn) {
  navigator.usb.getDevices().then(function(devices){
    if(devices.length){
      const device = devices[0];
      btn.style.display = 'none';
      const serial = new p5.j5.usbSerial({device});
      j5.events.emit('serial', serial);
    }
  })
  .catch((err) => {
    console.log('err', err);
  });

  btn.addEventListener("click", function( event ) {
    // display the current click count inside the clicked div
    console.log(event);
    const device = new p5.j5.usbSerial();
    console.log('serial device', device);
    j5.events.emit('serial', device);
    btn.style.display = 'none';
  }, false);

  j5.events.once('boardReady', () => {
    console.log('board ready');
  });

}


if(global.p5) {
  const p5 = global.p5;
  p5.j5 = j5;
  p5.five = j5;
  p5.prototype.registerPreloadMethod('loadBoard', p5.prototype);
  p5.prototype.loadBoard = function (options = {}, callback, onerror) {
    console.log('loading board', options);
    let clickElement;
    if(options.element) {
      clickElement = document.getElementById("authBtn");
    } else {
      clickElement = document.createElement('button');
      clickElement.innerText = 'Authorize USB Device';
      document.body.appendChild(clickElement);
    }
    j5.handleElementInit(clickElement);

    // Create an object which will clone data from async function and return it.
    // We will need to update that object below, not overwrite/reassign it.
    // It is crucial for the preload() to keep the original pointer/reference.
    // Declaring variables with const assures they won't be reassigned by mistake.
    const ret = {};
    const self = this;

    console.log('loadBoard starting', Date.now(), ret, options, callback, onerror);
  
    j5.events.once('serial', (port) => {
      console.log('port once', port);

      const io = new j5.firmata.Board(port);
      const board = new j5.Board({io, repl: false, timeout: 15000});
      board.on('ready', () => {
        ret.board = board;
        // Check whether callback is indeed a function.
        if (typeof callback == 'function') {
          callback({}); // do the callback.
        }
        if (typeof self._decrementPreload === 'function') {
          self._decrementPreload();
        }
        j5.events.emit('boardReady');
        j5.io = io;
        j5.board = board;

      });

    });

  
    // Return the object which has been filled with the data above.
    return ret;
  };

}

module.exports = j5;