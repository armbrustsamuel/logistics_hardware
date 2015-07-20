var five = require("johnny-five");
var getmac = require('getmac');

var Accelerometer = require("./accelerometer");
var GPS = require("./gps");
var OBD2 = require("./obd2");

//Sensor data collection interval in ms
var sensor_collection_interval = 1000.

//Upload data interval in ms
var upload_data_interval = 10000.

//Devide unique id
var device_id;

//Sensors data structure
var sensors = {
    id: '',
    timeStamp: '',
    accelerometer: {},
    gps: {},
    obd2: {}
}

//Sensors objects
var accelerometer;
var gps;
var obd2;

//Initialize communication with Arduino
var board = new five.Board();
console.log("Initializing commuication with Arduino Board...");

//Gets the computer's mac address to use as unique id
console.log("Requesting board MAC adress...");
getmac.getMac(function(err, macAddress) {
    if (err) throw err
    device_id = macAddress;
    console.log(macAddress);

    //Once haveing the Id, waits for the commuication with Arduino Board
    //gets ready
    console.log("Waiting Arduino board commuication link to get ready...");
    board.on("ready", function() {
        console.log("Communication link with Arduino ready!");
        //Initialize sensors configuration
        initializeSensors(function() {
            //Collect sensors information
            collectSensors();
            //Uploads sensors data to main server
            uploadData();
        });
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
    gps = new GPS(five);
}

function initialize_obd2() {
    console.log("Initializing OBD2...");
    obd2 = new OBD2(five);
}

function collectSensors() {
    console.log("Collecting sensors...");

    //Reads data from sensors
    sensors.id = getId();
    sensors.timeStamp = getTimeStamp();
    sensors.accelerometer = accelerometer.data;
    sensors.gps = gps.data;
    sensors.obd2 = obd2.data;

    console.log(sensors);

    //If sensor data has changed since last collection, append to the cache file
    storeSensorData(sensors, function() {
        //Schedules new collection execution
        setTimeout(collectSensors, sensor_collection_interval);
        console.log("Next sensor collection in", sensor_collection_interval / 1000, "seconds...");
    });
}

function getId() {
    return device_id;
}

function getTimeStamp() {
    return new Date().getTime();
}

function storeSensorData(data) {
    if (has_sensor_data_changed(data)) {
        append_data_to_cache_file(sensors);
    }
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
    console.log("Next uploading in", upload_data_interval / 1000, "seconds...");
}
