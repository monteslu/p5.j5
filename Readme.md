# p5.j5

The full [Johnny-Five](http://johnny-five.io/) nodebots library for p5.js!

Works directly in a web page via webUSB. No servers required.

## getting started

include p5 and p5.j5 in your web page:

```html
<head>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.2/p5.min.js"></script>
  <script src="https://unpkg.com/p5.j5@1.0.0/dist/p5.j5.min.js"></script>
</head>
```

add some javascript:

```javascript
let sensorVal = 0;

function preload() {
  loadBoard();
}

function setup() { 
  const sensor = new five.Sensor('A0');
  sensor.on('change', () => {
    sensorVal = sensor.scaleTo(0, 300);
  });
  createCanvas(400, 400);
} 

function draw() { 
  background('blue');
  rect(50, 150, sensorVal, 100);
}

```


## supported hardware

Currently p5.j5 supports [webUSB capable boards](https://github.com/webusb/arduino#compatible-hardware)

You'll need the [webUSB firmata sketch](https://github.com/monteslu/webusb-serial/tree/master/example) loaded onto your board.

## Bonus features

Johnny-Five related libraries bundled in:

* p5.j5.[nodeLed](https://github.com/louiemontes/node-led)

* p5.j5.[nodePixel](https://github.com/ajfisher/node-pixel)

* p5.j5.[oledJS](https://github.com/noopkat/oled-js)

## TODO

Currently webUSB is working great, but would be nice to have web bluetooth support via [ble-io](https://github.com/monteslu/ble-io)