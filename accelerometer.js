var events = require("events"),
  util = require("util");

//Sensors data structure
var data = {}

//Constructor
function Accelerometer(board) {

  var accelerometer = new board.Accelerometer({
    pins: ["A0", "A1", "A2"],
    autoCalibrate: true,
    sensitivity: 96 // mV/degree/seconds
      //zeroV: 478           // volts in ADC
  });

  // Reports X, Y, Z whenever any of them changes
  accelerometer.on("data", function(acc_data) {
    data = acc_data;
  });

  //Exposes sesnor data as properties
  Object.defineProperties(this, {
    data: {
      get: function() {
        return data;
      }
    }
  });
}

util.inherits(Accelerometer, events.EventEmitter);
module.exports = Accelerometer;