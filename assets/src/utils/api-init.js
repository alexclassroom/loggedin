/* global loggedin */

/**
 * Configure `@wordpress/api-fetch` for the plugin's REST surface.
 *
 * The PHP side (`Admin\Assets::script_vars()`) localises a `loggedin`
 * global containing the REST nonce and the site's admin URL. We use
 * those to:
 *
 *   1. Attach `X-WP-Nonce` to every outgoing request via the nonce
 *      middleware, so REST permission callbacks see an authenticated
 *      user.
 *
 *   2. Rewrite relative paths like `'settings'` to absolute URLs
 *      rooted at the site's `/wp-json/loggedin/v1/` namespace. That
 *      lets each module call `apiFetch({ path: 'settings' })` without
 *      hard-coding the namespace.
 *
 * The function is a no-op when the `loggedin` global is missing — for
 * example, when the bundle is loaded in a unit-test context.
 */
import apiFetch from '@wordpress/api-fetch';

const initApi = () => {
	if ( typeof loggedin === 'undefined' ) {
		return;
	}

	if ( loggedin.restNonce ) {
		apiFetch.use( apiFetch.createNonceMiddleware( loggedin.restNonce ) );
	}

	if ( loggedin.restUrl ) {
		// `loggedin.restUrl` already includes the namespace
		// (`…/wp-json/loggedin/v1/`), so module code can call
		// `apiFetch({ path: 'settings' })` and the middleware resolves
		// it against that root.
		apiFetch.use( apiFetch.createRootURLMiddleware( loggedin.restUrl ) );
	}
};

initApi();
