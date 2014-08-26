var serialport = require('serialport'); 
var SerialPort = serialport.SerialPort;
// port = '/dev/tty.usbmodem1411';
port = '/dev/tty.usbmodem1411';
var serialport = new SerialPort(port, {
    baudRate: 115200,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false,
    parser: serialport.parsers.raw    
});

serialport.on('open', function(){
    console.log('Serial Port Opend');
    serialport.on('data', function(data){
        console.log(data);
    });
    
    setTimeout(function() {
        serialport.write('b');
    }, 5000);
});
