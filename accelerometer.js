var events = require("events"),
  util = require("util");

//Sensors data structure
var data = {
}

//Constructor
function Accelerometer(board) {


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