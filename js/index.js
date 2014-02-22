/*global $:false, jQuery:false, console:false */
$(document).ready(function($) {
	var socket = io.connect('http://build.kiwiwearables.com:8080');

	var threshold = 3;
	var detectArrayCounter = 0;
	var isDetect = 0;
	var dontCheck = 0;
	var bufferSize = 10;
	var start;


	socket.on('connect', function() {
		socket.emit('listen', {device_id: '44', password: '123'});
	});

	socket.on('listen_response', function(data) {

		var kiwi_data = JSON.parse(data.message);

		// //DTW detection system
		var dtw = DTW(kiwi_data);
		var total = dtw.total;
		console.log( total );

		if ((total <= threshold) && (dontCheck == 0)) {
			detectArrayCounter++;

			//only count a motion if 10 predictions are counted
			if(detectArrayCounter >= bufferSize){
				isDetect++;
				start = new Date().getTime();
				$('#detect').text( parseInt( $( '#detect' ).text() ) + 1 );
				dontCheck = 1;

				setTimeout(function(){
					detectArrayCounter = 0;
					dontCheck = 0;
//					$('#detect').toggleClass("detect-off");
				},1500);
			}
		}

//		console.log(kiwi_data); // Kiwi sensor data is a JSON object

		var packet_type = kiwi_data.packet_type;

	// Capture accelerometer and gyroscope data, or tap motion events
	// 00 = raw sensor data
	// 03 = motion events

		var acceleration_x = kiwi_data.ax;
		var acceleration_y = kiwi_data.ay;
		var acceleration_z = kiwi_data.az;
	});

});
