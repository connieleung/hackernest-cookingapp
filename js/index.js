/*global $:false, jQuery:false, console:false */
$(document).ready(function($) {
	var socket = io.connect('http://build.kiwiwearables.com:8080');

	var detectArrayCounter = 0;
	var dontCheck = 0;

	var motionDetected = function( motionObject, motionName ) {

		if ( detectArrayCounter >= motionObject.bufferSize ) {

			// Tell the user what they did, track it, etc.
			console.log( motionName );
			$('#detect').text( motionName );

			dontCheck = 1;

			setTimeout( function() {
				detectArrayCounter = 0;
				dontCheck = 0;
//					$('#detect').toggleClass("detect-off");
			}, motionObject.timeBetweenMotions );
		}

	};

	socket.on( 'connect', function() {
		socket.emit( 'listen', { device_id: '44', password: '123' } );
	});

	socket.on( 'listen_response', function( data ) {

		var kiwi_data = JSON.parse( data.message );
		var dtw, total, thisMotion;
//		console.log( kiwi_data );

		Object.keys( motionData ).forEach( function( motion ) {

			thisMotion = motionData[ motion ];

			dtw = DTW( kiwi_data, thisMotion.sumA, thisMotion.sumG );
			total = dtw.total;

			if ( thisMotion.greaterThan && dontCheck == 0 ) {
				if ( total >= thisMotion.threshold ) {
					detectArrayCounter++;
					motionDetected( thisMotion );
				}
			}
			else {
				if ( total <= thisMotion.threshold ) {
					detectArrayCounter++;
					motionDetected( thisMotion );
				}
			}

		} );

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
