/*global $:false, jQuery:false, console:false */
$( document ).ready( function() {
	navigator.geolocation.getCurrentPosition( function( position ) {
		console.log( position );
		$.ajax( {
			type: 'GET',
			url: 'http://api.sandbox.yellowapi.com/FindBusiness/',
			data: {
				what: 'grocery',
				where: 'cZ' + position.coords.longitude + ',' + position.coords.latitude,
				UID: 'isis',
				fmt: 'JSON',
				lang: 'en',
				apikey: '7584x2qs9a8pk938sbayt3wa'
			},
			success: function( data ) {
				console.log( data );
			}
		} );
	} );
} );