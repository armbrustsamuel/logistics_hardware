var five = require("johnny-five");
var getmac = require('getmac');
var endOfLine = require('os').EOL;


var Accelerometer = require("./accelerometer");
var GPS = require("./gps");
var OBD2 = require("./obd2");

var backend_host = 'requestb.in';
var backend_path = '/1de4md11';

//Flag to indicate if cache file is being sent
var isUploading = false;

//Cache file path
var cacheFilePath = './cache.tmp';

//Sensor data collection interval in ms
var sensor_collection_interval = 1000.

//Cache file path
var cachedData = [];

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
    //Store new data on cache
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

function storeSensorData(sensors, callback) {
    //If value changed
    if (has_sensor_data_changed(sensors)) {
        //Append to add it to memory cache
        cachedData.push(sensors);
        //tries to persist the cache in file
        append_data_cache_file(callback);
    }
    else callback();
}

function has_sensor_data_changed(data) {
    if (data != null)
        return true;
}

function append_data_cache_file(callback) {
    console.log('Storing data to file...');
    //Persists the cached data in file if not sending it
    if (!isUploading) {
        console.log('Saving in file...');

        var json = JSON.stringify(cachedData);
        //Append the new line at the end of file followed by ',' to later encapusulate it as JSON array
        json = json.substring(1, json.length - 1) + ',\n';
        var fs = require('fs');
        fs.appendFileSync(cacheFilePath, json);

        //Clears the persisted cache
        cachedData = [];

        //Returns
        callback();
    }
    else {
        //If uploading file cache, maintain only on memory
        console.log('Caching...');
        callback();
    }
}

function uploadData() {
    console.log("Uploading data...");
    //Flags it's sending data and new adds to the cache file
    //must be delayed
    isUploading = true;

    var fs = require("fs");
    //If file of cache exists
    if (fs.existsSync(cacheFilePath)) {
        //Loads the content
        var file = fs.readFileSync(cacheFilePath, 'utf-8');
        //Removes the last end of line and , chars encapsulating it as array
        var json = '[' + file.substring(0, file.length - 2) + ']';
        //Parse it to JSON array
        json = JSON.parse(json);
    }

    //Sends the data
    send_data(json, function() {
        //Clean up the cache file
        fs.unlinkSync(cacheFilePath);
        //Schedules new uploading execution
        isUploading = false;
        setTimeout(uploadData, upload_data_interval);
        console.log("Next uploading in", upload_data_interval / 1000, "seconds...");
    });
}

function send_data(data, callback) {
    //Converts the data to be sent to string
    data = JSON.stringify(data);
    console.log("Sending", data.length, 'bytes...');

    //Set the sending options
    var post_options = {
        host: backend_host,
        port: '80',
        path: backend_path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    // Set the request
    var http = require("http");
    var post_req = http.request(post_options, function(res) {
        console.log('Status: ' + res.statusCode);
        res.on('data', function(body) {
            console.log('Upload done :' + body);
            callback();
        });
        post_req.on('error', function(e) {
            console.log('Upload failed: ' + e.message);
            callback();
        }); 
    });

    //Post the data
    post_req.write(data);
    post_req.end();
}