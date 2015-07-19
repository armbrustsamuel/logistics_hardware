var five = require("johnny-five");
var log = require('single-line-log').stdout;
var Accelerometer = require("./accelerometer");

//Sensor data collection interval in ms
var sensor_collection_interval = 1000.

//Upload data interval in ms
var upload_data_interval = 10000.

//Sensors data structure
var sensors = {
    accelerometer: {},
    gps: {},
    obd2: {}
}

//Sensors objects
var accelerometer;

//Initialize communication with Arduino
var board = new five.Board();

//When communication is ready
board.on("ready", function() {

    //Initialize sensors configuration
    initializeSensors(function() {
        //Collect sensors information
        collectSensors();
        //Uploads sensors data to main server
        uploadData();
    });

});


function initializeSensors(callback) {
    console.log("Initializing sensors...");
    initialize_accelerometer();
    initialize_gps();
    initialize_obd2();
    callback();
}

function initialize_accelerometer() {
    console.log("Initializing Accelerometer...");
    accelerometer = new Accelerometer(five);
}

function initialize_gps() {
    console.log("Initializing GPS...");
}

function initialize_obd2() {
    console.log("Initializing OBD2...");
}

function collectSensors() {
    console.log("Collecting sensors...");

    //Reads data from sensors
    sensors.accelerometer = accelerometer.data;

    console.log(sensors);

    //If sensor data has changed since last collection, append to the cache file
    if (has_sensor_data_changed(sensors))
        append_data_to_cache_file(sensors);

    //Schedules new collection execution
    setTimeout(collectSensors, sensor_collection_interval);
}

function has_sensor_data_changed(data) {
    //TODO
    return true;
}

function append_data_to_cache_file(data) {
    //TODO    
}

function uploadData() {
    console.log("Uploading data...");
    //TODO

    //Schedules new uploading execution
    setTimeout(uploadData, upload_data_interval);
}
