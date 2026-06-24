/**
 * Action creators for the addons store.
 *
 * Public actions returned to component code are `setAddons`,
 * `setLicenses`, and the async `refreshAddons` / `manageLicense`
 * generators (which yield through the `FETCH` control to perform
 * `apiFetch` calls).
 */
import { dispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';
import { __ } from '@wordpress/i18n';

/**
 * Replace the cached addon catalogue + license map.
 *
 * @param {Array}  addons   Addon list returned from the REST endpoint.
 * @param {Object} licenses License entries keyed by addon id.
 */
export function setAddons( addons, licenses ) {
	return {
		type: 'SET_ADDONS',
		addons,
		licenses,
	};
}

/**
 * Replace just the license map (after an activate / deactivate call).
 *
 * @param {Object} licenses License entries keyed by addon id.
 */
export function setLicenses( licenses ) {
	return {
		type: 'SET_LICENSES',
		licenses,
	};
}

/**
 * Control-yielding generator: fetch the catalogue from the REST API,
 * passing `force=1` to bust the server-side Freemius cache.
 */
export function* refreshAddons() {
	const data = yield {
		type: 'FETCH',
		request: { path: 'addons?force=1' },
	};

	yield setAddons( data.addons ?? [], data.licenses ?? {} );

	dispatch( noticesStore ).createSuccessNotice(
		__( 'Addons refreshed.', 'loggedin' ),
		{ type: 'snackbar' }
	);
}

/**
 * Activate or deactivate a license key for an addon.
 *
 * Resolves to `true` on success, `false` on failure — the caller can
 * use the result to clear a form field on activate, for example.
 *
 * @param {number} id     Addon Freemius id.
 * @param {string} action `'activate'` or `'deactivate'`.
 * @param {string} key    License key (empty when deactivating).
 */
export function* manageLicense( id, action, key ) {
	try {
		const res = yield {
			type: 'FETCH',
			request: {
				path: 'addons/license',
				method: 'POST',
				data: { id, action, key },
			},
		};

		if ( res?.licenses ) {
			yield setLicenses( res.licenses );
		}

		yield dispatch( noticesStore ).createSuccessNotice(
			action === 'activate'
				? __( 'License activated.', 'loggedin' )
				: __( 'License deactivated.', 'loggedin' ),
			{ type: 'snackbar' }
		);

		return true;
	} catch ( error ) {
		yield dispatch( noticesStore ).createErrorNotice(
			error?.message || __( 'License request failed.', 'loggedin' ),
			{ type: 'snackbar' }
		);

		return false;
	}
}
