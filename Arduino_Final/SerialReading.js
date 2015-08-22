var serialport = require("serialport");
var fs = require("fs");
var moment = require("moment");
var file_name = require("string");

var SerialPort = serialport.SerialPort;

var serialPort = new SerialPort("COM4", {
  baudrate: 38400,
  parser: serialport.parsers.readline("\n")
});

var now = moment();
var formatted = now.format( 'YYYY_MM_DD_HH_mm_ss' );

   file_name = "";
   file_name += formatted;
   file_name += '.txt';

var log_file = fs.createWriteStream( file_name,'w' );

serialPort.on("open", function () {
  console.log('open');

  serialPort.on('data', function(data) {
    console.log(data);
    log_file.write(data);
  });
});
