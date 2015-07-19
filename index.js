// Call the console.log function.
console.log("Hello Acceleration");

var five = require("johnny-five"),
  board, av2r;

board = new five.Board();

board.on("ready", function() {

  // Create a new analog `Accelerometer` hardware instance.
  //
  // five.Accelerometer([ x, y[, z] ]);
  //
  // five.Accelerometer({
  //   pins: [ x, y[, z] ]
  //   freq: ms
  // });
  //

  av2r = new five.Accelerometer({
    pins: ["A3", "A4", "A5"],
    autoCalibrate: true,
    // Adjust the following our device
    // These are the default values (LIS344AL)
    sensitivity: 96        // mV/degree/seconds
    //zeroV: 478           // volts in ADC
  });

  /* 
   * Accelerometer Event API :)
   */

  // Reports X, Y, Z whenever any of them changes
  av2r.on("data", function(data) {
    logAcceleration ("data", data);
  });

  // Reports the acceleration every N ms
  // Defaults N = 500ms
  av2r.on("acceleration", function(data) {
    logAcceleration("acceleration", data);
  });

  // Reports when there is a change in any axys
  av2r.on("change", function(data) {
    logAcceleration("change", data);
  });
});

// @TODO create function to write log on file

function logAcceleration (event, data) {
   console.log(event, data); 
}