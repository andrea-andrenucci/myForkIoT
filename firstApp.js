const sensorLib = require('node-dht-sensor'); // include existing module called ‘node-dht-sensor’
const http = require('node:http');

// Setup sensor, exit if failed
var sensorType = 11; // 11 for DHT11, 22 for DHT22 and AM2302
var sensorPin = 4; // The GPIO pin number for sensor signal
if (!sensorLib.initialize(sensorType, sensorPin)) {
	//print a warning message in the console
	console.warn('Failed to initialize sensor');
	process.exit(1);
}

// Automatically update sensor value every 2 seconds
//we use a nested function (function inside another function)
setInterval(function () {
	var readout = sensorLib.read();

	console.log('Temperature:', readout.temperature.toFixed(1) + 'C');
	console.log('Humidity: ', readout.humidity.toFixed(1) + '%');
	// var temperature = readout.temperature.toFixed(1);
	var temperature = Math.random();

	const postData = JSON.stringify({
		'sensor': 'ID1',
		'timestamp': 12345678,
		'temperature': temperature
	})
	const options = {
		hostname: 'localhost',
		// hostname: '192.168.137.1',
		port: 3000,
		path: '/temperature',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': Buffer.byteLength(postData),
		},
	};

	const req = http.request(options, (res) => {
		res.setEncoding('utf8');
		res.on('data', (chunk) => {
			console.log(`BODY: ${chunk}`);
		});
		res.on('end', () => {
			console.log('No more data in response.');
		});
	});

	req.on('error', (e) => {
		console.error(`problem with request: ${e.message}`);
	});

	// Write data to request body
	req.write(postData);
	req.end();
}, 2000);
