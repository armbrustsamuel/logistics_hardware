var events = require("events"),
  util = require("util");

//Sensors data structure
var data = {
  x: '',
  y: '',
  z: '',
}

//Constructor
function Accelerometer(board) {

  //Initialize analogic channels as sensors
  var accel_x = new board.Sensor({
    pin: "A0",
    freq: 250,
    threshold: 5
  });
  var accel_y = new board.Sensor({
    pin: "A1",
    freq: 250,
    threshold: 5
  });
  var accel_z = new board.Sensor({
    pin: "A2",
    freq: 250,
    threshold: 5
  });

  //Store value changes in cache
  accel_x.on("change", function() {
    data.x = this.value;
  });
  accel_y.on("change", function() {
    data.y = this.value;
  });
  accel_z.on("change", function() {
    data.z = this.value;
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