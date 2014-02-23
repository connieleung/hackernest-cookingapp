/*global $:false, jQuery:false, console:false */
var isis = isis || {};
$( document ).ready( function( $ ) {
	var socket = io.connect( 'http://build.kiwiwearables.com:8080' );
	var checkMotion = true;

	var motionDetected = function( motion ) {
		if ( motion.detectArrayCounter >= motion.bufferSize ) {
			console.log( motion.name );
            if ( motion.name == isis.nextMotion ) {
                $('#panel-' + isis.activePanel + ' .next').trigger('click');
            } else if ( motion.name == isis.errorMotion ) {
                $('.error-' + motion.name).show();
            } else {
                motion.domCount.val(parseInt( motion.domCount.val() ) + 1).trigger('change');
                motion.domCount.parents('article.panel').find('.start').hide();
                motion.domCount.parents('article.panel').find('.error').hide();
                if (typeof motion.errorAction != 'undefined')
                    motion.domCount.parents('article.panel').find('.error-' + motion.errorAction).hide();
                if (motion.domCount.attr('data-max') && parseInt(motion.domCount.val()) >= parseInt(motion.domCount.attr('data-max'))) {
                    isis.donePanel = true;
                    motion.domCount.trigger('configure', {'bgColor': '#95b13c'}).trigger('configure', {'fgColor': '#95b13c'});
                }
                motion.domCount.trigger('change');
            }
            isis.stoppedAt = 0;
            checkMotion = false;
            setTimeout( function() {
                motion.detectArrayCounter = 0;
                checkMotion = true;
            }, motion.timeBetweenMotions + (isis.donePanel ? 3000 : 0) );
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
		var dtw, total;
        var thisMotion = false;
        var errorMotion = false;

        $.each(motionData, function(index, motion) {
            if (isis.donePanel) {
                if (motion.name == isis.nextMotion) {
                    thisMotion = motion;
                }
            } else {
                if (motion.name == isis.activePanel) {
                    thisMotion = motion;
                    if (typeof motion.errorAction != 'undefined') {
                        $.each(motionData, function(index, m) {
                            if (m.name == motion.errorAction) {
                                errorMotion = m;
                                isis.errorMotion = m.name;
                            }
                        });
                    }
                    return;
                }
            }
        });

        if (!thisMotion)
            return;

        dtw = DTW( kiwi_data, thisMotion );
        total = dtw.total;

        if ( total >= thisMotion.threshold && checkMotion ) {
            thisMotion.detectArrayCounter++;
            motionDetected( thisMotion );
        } else if ( isis.stoppedAt == 0 && thisMotion.domCount.parents('article.panel').find('.start').css('display') == 'none' && total < thisMotion.threshold ) {
            isis.stoppedAt = new Date().getTime();
        } else if ( isis.stoppedAt > 0 && ( isis.stoppedAt + isis.stoppedAtShowErrorDelay ) < new Date().getTime() ) {
            thisMotion.domCount.parents('article.panel').find('.error').show();
        }

        if (errorMotion) {
            dtw = DTW( kiwi_data, errorMotion );
            total = dtw.total;

            if ( total >= errorMotion.threshold && checkMotion ) {
                errorMotion.detectArrayCounter++;
                motionDetected( errorMotion );
            }
        }
	} );

} );
