var events = require("events"),
  util = require("util");

//Sensors data structure
var data = {
}

//Constructor
function OBD2(board) {
  //Exposes sesnor data as properties
  Object.defineProperties(this, {
    data: {
      get: function() {
        return data;
      }
    }
  });
}

util.inherits(OBD2, events.EventEmitter);
module.exports = OBD2;