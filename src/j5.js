process.hrtime = require('browser-process-hrtime');
const j5 = require('johnny-five');

j5.usbSerial = require('webusb-serial');
j5.firmata = require("firmata-io").Firmata;
j5.nodeLed = require('node-led');
j5.nodePixel = require('node-pixel');
j5.oledJS = require('oled-js');
j5.oledJS.oledFont5x7 = require('oled-font-5x7');
// j5.serial = require('avrgirl-arduino/lib/browser-serialport');
j5.serial = require('./browser-serialport');

const { EventEmitter } = require('events');
j5.events = new EventEmitter();

j5.handleElementInit = function(btn, options = {}) {
  navigator.usb.getDevices().then(function(devices){
    if(devices.length){
      const device = devices[0];
      btn.style.display = 'none';
      const serial = new p5.j5.usbSerial({device, options});
      j5.events.emit('serial', serial);
    }
  })
  .catch((err) => {
    console.log('err', err);
  });

  btn.addEventListener("click", function( event ) {
    console.log('usb btn click', event);
    const device = new p5.j5.usbSerial();
    console.log('usb device', device);
    j5.events.emit('serial', device);
  }, false);
}

j5.handleSerialElementInit = function(btn, options = {}) {
  
  btn.addEventListener("click", function( event ) {
    console.log(event);
    const serial = new p5.j5.serial(options);
    serial.isSerial = true;
    j5.events.emit('serial', serial);
    
  }, false);

}

if(global.p5) {
  const p5 = global.p5;
  p5.j5 = j5;
  global.five = j5;
  p5.prototype.registerPreloadMethod('loadBoard', p5.prototype);
  p5.prototype.loadBoard = function (options = {}, callback, onerror) {
    
    let serialClickElement;
    if(options.serialElement) {
      serialClickElement = options.serialElement;
    } else {
      serialClickElement = document.createElement('button');
      serialClickElement.innerText = 'Authorize Serial Device';
      serialClickElement.style.margin = '25px';
      document.body.appendChild(serialClickElement);
    }
    j5.handleSerialElementInit(serialClickElement);

    let clickElement;
    if(options.element) {
      clickElement = options.element;
    } else {
      clickElement = document.createElement('button');
      clickElement.innerText = 'Authorize USB Device';
      clickElement.style.margin = '25px';
      document.body.appendChild(clickElement);
    }
    j5.handleElementInit(clickElement);


    // Create an object which will clone data from async function and return it.
    // We will need to update that object below, not overwrite/reassign it.
    // It is crucial for the preload() to keep the original pointer/reference.
    // Declaring variables with const assures they won't be reassigned by mistake.
    const ret = {};
    const self = this;

    // console.log('loadBoard starting', Date.now(), ret, options, callback, onerror);
  
    j5.events.once('serial', (port) => {
      serialClickElement.style.display = 'none';
      clickElement.style.display = 'none';
      let io, board; 
      if(port.isSerial) {
        port.open((err) => {
          if(err) {
            j5.events.emit('error', err);
            return;
          } else {
            //this kind of sucks, but firmata-io wants to write to the port before its ready
            io = new j5.firmata(port, {reportVersionTimeout: 1});
            board = new j5.Board({io, repl: false, timeout: 15000});
            port.emit('open', port);
            setupBoard(board, ret, io);
          }
        });
        
      } else {
        io = new j5.firmata(port, {reportVersionTimeout: 1});
        board = new j5.Board({io, repl: false, timeout: 15000});
        setupBoard(board, ret, io);
      }
      
    });

    function setupBoard(board, ret, io) {
      board.on('ready', () => {
        ret.board = board;
        // Check whether callback is indeed a function.
        if (typeof callback == 'function') {
          callback({}); // do the callback.
        }
        if (typeof self._decrementPreload === 'function') {
          self._decrementPreload();
        }
        j5.io = io;
        j5.board = board;
        console.log('johnny-five board ready. p5.j5.board is the global for devtools:', board);
        j5.events.emit('boardReady');
      });
    }


  
    // Return the object which has been filled with the data above.
    return ret;
  };

}

module.exports = j5;