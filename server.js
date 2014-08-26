var 
http = require('http'),
serialport = require('serialport')
SerialPort = serialport.SerialPort,
server = http.createServer(callback),
server.listen(1337, '127.0.0.1'),
console.log('Server On'),
sp = initSerial();

function callback (req, res) {
	console.log('Callback');
	//var out = '';
	/**
	req.setEncoding('binary');
	req.on('data', function(data) {
        console.log('Incoming data');
		out += data;
	});
	req.on('error', console.error);
	req.on('end', function() {
        console.log(out);
        console.log('End incoming data');
	});
	**/
}

var connection = connectSerial();
connection.startConnect();
connection.getData();



function connectSerial() {

	function startConnect() {
		sp.on('open', function () {
			sp.write('b', function(err, results) {
	            if(err != undefined) {
	                console.log('ERR: ' + err);   
	                console.log('Results: ' + results);   
	            }
			});
		});
	}

	function getData() {
		sp.on('data', function(data) {
	        console.log('Incoming data');
			console.log(data);
		});
		sp.on('error', console.error);
	}

	return {
		'startConnect': startConnect,
		'getData': getData
	}

}

function initSerial() {
	return new SerialPort('/dev/tty.usbmodem1411', {
		baudRate: 115200,
		dataBits: 8,
		parity: 'none',
		stopBits: 1,
		flowControl: false,
		parser: serialport.parsers.raw
	});
}

