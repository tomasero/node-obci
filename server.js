var SerialPort  = require('serialport').SerialPort;
var arduinoPort = '/dev/tty.usbmodem1411';

// setting up the serial connection

var connectArd = function() {
  var arduinoSerial = new SerialPort(arduinoPort, {
    baudRate: 115200,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false
  });

  arduinoSerial.write('b', function(err, results) {
  	console.log('err: ' + err);
  	console.log('results: ' + results);
  });

  // do something with incoming data
  arduinoSerial.on('data', function (data) {
  	console.log(data.toString());
  });

  arduinoSerial.on('close', function(){
    console.log('ARDUINO PORT CLOSED');
    reconnectArd();
  });

  arduinoSerial.on('error', function (err) {
    console.error("error", err);
    reconnectArd();
  });

}

connectArd();

// check for connection errors or drops and reconnect
var reconnectArd = function () {
  console.log('INITIATING RECONNECT');
  setTimeout(function(){
    console.log('RECONNECTING TO ARDUINO');
    connectArd();
  }, 2000);
};

