/**
 * Initialise `@wordpress/api-fetch` with the REST root + nonce that
 * `Admin\Assets` localised into the page.
 */
import apiFetch from '@wordpress/api-fetch';

const config = window.loggedin || {};

if ( config.restRoot ) {
	apiFetch.use( apiFetch.createRootURLMiddleware( config.restRoot ) );
}

if ( config.restNonce ) {
	apiFetch.use( apiFetch.createNonceMiddleware( config.restNonce ) );
}
