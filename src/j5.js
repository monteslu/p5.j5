const j5 = require('johnny-five');

j5.usbSerial = require('webusb-serial');
j5.bleSerial = require('ble-serial');
j5.firmata = require('firmata');
j5.bleIO = require('ble-io');
j5.nodeLed = require('node-led');
j5.nodePixel = require('node-pixel');
j5.oledJS = require('oled-js');

module.exports = j5;