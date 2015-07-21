var events = require("events"),
  util = require("util");

//Sensors data structure
var data = {
}

//Constructor
function GPS(board) {
  //Exposes sesnor data as properties
  Object.defineProperties(this, {
    data: {
      get: function() {
        return data;
      }
    }
  });
}

util.inherits(GPS, events.EventEmitter);
module.exports = GPS;