/*global $:false, jQuery:false, console:false */
var isis = isis || {};
$( document ).ready( function( $ ) {
	var socket = io.connect( 'http://build.kiwiwearables.com:8080' );
	var checkMotion = true;
    var thisMotion;

	var motionDetected = function( motion ) {
		if ( motion.detectArrayCounter >= motion.bufferSize ) {
			console.log( motion.name );
			motion.domCount.val(parseInt( motion.domCount.val() ) + 1);
            motion.domCount.parents('article.panel').find('.start').hide();
            motion.domCount.parents('article.panel').find('.error').hide();
            isis.stoppedAt = 0;

            if (motion.domCount.attr('data-max') && parseInt(motion.domCount.val()) > parseInt(motion.domCount.attr('data-max'))) {
                isis.donePanel = true;
                motion.domCount.trigger('configure', {'bgColor': '#95b13c'}).trigger('configure', {'fgColor': '#95b13c'});
            }

            motion.domCount.trigger('change');

			checkMotion = false;

			setTimeout( function() {
				motion.detectArrayCounter = 0;
				checkMotion = true;
			}, motion.timeBetweenMotions );
		}
	};

    $.each(motionData, function(index, motion) {
        motion.domThreshold = $( '#' + motion.name + ' .threshold');
        motion.domBuffer = $( '#' + motion.name + ' .buffer');
        motion.domScore = $( '#' + motion.name + ' .score');
        motion.domCount = $( 'article.panel-' + motion.name + ' .knob');

        motion.domBuffer.text( motion.bufferSize );
        motion.domThreshold.text( motion.threshold );
    });

	socket.on( 'connect', function() {
		socket.emit( 'listen', { device_id: '44', password: '123' } );
	} );

	socket.on( 'listen_response', function( data ) {
		var kiwi_data = JSON.parse( data.message );
		var dtw, total, thisMotion;

        thisMotion = false;
        $.each(motionData, function(index, motion) {
            if (isis.donePanel) {
                if (motion.name == 'tap') {
                    thisMotion = motion;
                }
            } else {
                if (motion.name == isis.activePanel) {
                    thisMotion = motion;
                    return;
                }
            }
        });

        if (!thisMotion)
            return;

        dtw = DTW( kiwi_data, thisMotion );
        total = dtw.total;
        thisMotion.domScore.text( total );

        if ( thisMotion.greaterThan ) {
            if ( total >= thisMotion.threshold && checkMotion ) {
                thisMotion.detectArrayCounter++;
                motionDetected( thisMotion );
            } else if ( isis.stoppedAt == 0 && thisMotion.domCount.parents('article.panel').find('.start').css('display') == 'none' && total < thisMotion.threshold ) {
                isis.stoppedAt = new Date().getTime();
            } else if ( isis.stoppedAt > 0 && ( isis.stoppedAt + isis.stoppedAtShowErrorDelay ) < new Date().getTime() ) {
                thisMotion.domCount.parents('article.panel').find('.error').show();
            }
        }
        else {
            if ( total <= thisMotion.threshold && checkMotion ) {
                thisMotion.detectArrayCounter++;
                motionDetected( thisMotion );
            } else if ( isis.stoppedAt == 0 && thisMotion.domCount.parents('article.panel').find('.start').css('display') == 'none' && total > thisMotion.threshold ) {
                isis.stoppedAt = new Date().getTime();
            } else if ( isis.stoppedAt > 0 && ( isis.stoppedAt + isis.stoppedAtShowErrorDelay ) < new Date().getTime() ) {
                thisMotion.domCount.parents('article.panel').find('.error').show();
            }
        }
	} );

} );
