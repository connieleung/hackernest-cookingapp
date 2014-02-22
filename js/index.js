
var socket = io.connect('http://build.kiwiwearables.com:8080')

socket.on('connect', function() {
	socket.emit('listen', {device_id: '44', password: '123'});
});

socket.on('listen_response', function(data) {

	var kiwi_data = JSON.parse(data.message);
	console.log(kiwi_data); // Kiwi sensor data is a JSON object

	var packet_type = kiwi_data.packet_type;

// Capture accelerometer and gyroscope data, or tap motion events
// 00 = raw sensor data
// 03 = motion events

	var acceleration_x = kiwi_data.ax;
	var acceleration_y = kiwi_data.ay;
	var acceleration_z = kiwi_data.az;
});