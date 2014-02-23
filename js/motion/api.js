/*global $:false, jQuery:false, console:false */
$( document ).ready( function() {

	$( '#missing-ingredients-button' ).on( 'click', function() {
		navigator.geolocation.getCurrentPosition( function( position ) {
			$( '#yellowpages-results' ).html( 'Retrieving grocery stores nearby...' );
			$.ajax( {
				type: 'GET',
				url: 'http://api.sandbox.yellowapi.com/FindBusiness/',
				data: {
					what: 'grocery stores',
					where: 'cZ' + position.coords.longitude + ',' + position.coords.latitude,
					UID: 'isis',
					fmt: 'JSON',
					lang: 'en',
					apikey: '7584x2qs9a8pk938sbayt3wa'
				},
				success: function( data ) {
					var html = '';
					data.listings.forEach( function( listing ) {
						html += '<h3>' + listing.name + '</h3>';
						html += '<p>' + listing.address.street + '<br>' + listing.address.city + '</p>';
					} );
					$( '#yellowpages-modal h2' ).html( 'Grocery stores near you:' );
					$( '#yellowpages-results' ).html( html );
				}
			} );
		} );
	} );

} );