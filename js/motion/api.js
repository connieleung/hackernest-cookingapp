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
					var html = '<h3>Results courtesy of the amazing, incredible YellowAPI&trade;</h3>';
					data.listings.forEach( function( listing ) {
                        html += '<div class="api-result">';
						html += '<h5>' + listing.name + '</h5>';
						html += '<p><a target="_blank" href="http://maps.google.ca/?saddr=' + position.coords.latitude + ',' + position.coords.longitude + '&daddr=' + encodeURIComponent(listing.address.street + ', ' + listing.address.city + ', ON') + '">' + listing.address.street + '<br>' + listing.address.city + '</a></p>';
                        html += '</div>';
					} );
					$( '#yellowpages-modal h2' ).html( 'Grocery stores near you:' );
					$( '#yellowpages-results' ).html( html );
				}
			} );
		} );
	} );

} );