/*global $:false, jQuery:false, console:false */
$( document ).ready( function( $ ) {
	var socket = io.connect( 'http://build.kiwiwearables.com:8080' );

	var detectArrayCounter = 0;
//	var dontCheck = 0;
	var checkMotion = true;

	var motionDetected = function( motion ) {

		if ( detectArrayCounter >= motion.bufferSize ) {

			// Tell the user what they did, track it, etc.
			console.log( motion.name );
			$('#detect').text( motion.name );

//			dontCheck = 1;
			checkMotion = false;
			setTimeout( function() {
				detectArrayCounter = 0;
//				dontCheck = 0;
				checkMotion = true;
//					$('#detect').toggleClass("detect-off");
			}, motion.timeBetweenMotions );
		}

	};

	socket.on( 'connect', function() {
		socket.emit( 'listen', { device_id: '44', password: '123' } );
	} );

	socket.on( 'listen_response', function( data ) {

		var kiwi_data = JSON.parse( data.message );
		var dtw, total, thisMotion;
//		console.log( kiwi_data );

		for ( var i = 0; i < motionData.length; i++ ) {

			thisMotion = motionData[i];

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

		}

//		console.log(kiwi_data); // Kiwi sensor data is a JSON object

//		var packet_type = kiwi_data.packet_type;

	// Capture accelerometer and gyroscope data, or tap motion events
	// 00 = raw sensor data
	// 03 = motion events

	} );

} );
