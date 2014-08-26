var serialport = require('serialport');
var binary = require('binary');
var http = require('http');

// port = '/dev/tty.usbmodem1411';
port = '/dev/ttyACM0';

var SerialPort = serialport.SerialPort;
var serialport = new SerialPort(port, {
    baudRate: 115200,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false,
    parser: serialport.parsers.raw    
});

var raw_data = new Array(8);
for (var i=0; i<raw_data.length; i++) {
    raw_data[i] = new Array();
}

prev_data = new Buffer(0);

function formatData() {
    var out = new Array(8);
    for(var i=0; i<8; i++) {
        var name = '' + (i+1);
        out[i] = {
            "start": 10000,
            "end": 20000,
            "step": 1/250.0,
            "names": [name],
            "values": [ raw_data[i] ]
        };
    }
    return out;
}

function callback(req, res) {
    req.pipe(formatData()).pipe(res);
}

function addPacket(packet) {
    
    console.log(packet);
    var vars = binary.parse(packet)
        .word8lu('start')
        .word8lu('n_bytes')
        .word32lu('sample_index')
        .word32ls('channel_1')
        .word32ls('channel_2')
        .word32ls('channel_3')
        .word32ls('channel_4')
        .word32ls('channel_5')
        .word32ls('channel_6')
        .word32ls('channel_7')
        .word32ls('channel_8')
        .word8lu('end')
        .vars

    if(vars.start == 0xA0 && vars.end == 0xC0) {
        for(var i=1; i<=8; i++) {
            raw_data[i-1].push(vars['channel_' + i] / Math.pow(2, 23))
            vars['channel_' + i] /= Math.pow(2, 23)
        }
        console.log(vars);
    }
}

function parseData(data) {
    if(data.length < 39) {
        prev_data = data;
        return;
    }
    
    var i = 0;
    while(i+39 < data.length) {
        if(data[i] == 0xA0) {
            var packet = data.slice(i, i+39);
            addPacket(packet);
            data = data.slice(i+39);
            i = 0;
        } else {
            i++;
        }
    }
    prev_data = data;
}

serialport.on('open', function(){
    console.log('Serial Port Opend');
    serialport.on('data', function(data){
        // console.log(prev_data);
        // console.log(data);
        
        data = Buffer.concat([prev_data, data]);
        // console.log(data);
        parseData(data);
    });
    
    setTimeout(function() {
        serialport.write('b');
    }, 5000);
});
