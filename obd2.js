var events = require("events"),
  util = require("util");

var currentDate = new Date();
var interval = 3000;

//Initializing OBD
var OBDReader = require('bluetooth-obd');
var btOBDReader = new OBDReader();

//Sensors data structure
var data = {
	id: '',
	engineRPM: '',
	speed: '',
	fuelLevel: '',
	temp: ''
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

//Constructor (second option)
btOBDReader.on('connected', function () {
	this.addPoller("vss");
	this.addPoller("rpm");
	this.addPoller("temp");
	this.startPolling(interval);
});

//Error handling
btOBDReader.on('error', function (error) {
	console.log(error);
});

//Data received
btOBDReader.on('dataReceived', function (dataR){
	
	console.log(currentDate.getTime());

	if(this.requestValueByName("rpm") != null) {
		data.engineRPM = dataR;
	}

	if(this.requestValueByName("vss") != null) {
		data.speed = dataR;
	}

	if(this.requestValueByName("temp") != null) {
		data.temp = dataR;
	}

	if(this.requestValueByName("fuelsys") != null) {
		data.fuelLevel = dataR;
	}
	console.log(dataR);
	//console.log("Data received");
	//data = dataR;
});

btOBDReader.autoconnect('obd');

util.inherits(OBD2, events.EventEmitter);
module.exports = OBD2;