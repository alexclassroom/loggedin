/**
 * Action creators for the addons store.
 *
 * Plain actions (`setAddons`, `setLicenses`) and the async
 * generators (`refreshAddons`, `manageLicense`) that fetch through
 * the `FETCH` control and dispatch results.
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
 * Bust the server-side Freemius cache and re-fetch the catalogue.
 *
 * Wrapped in try/catch so a failed refresh shows an error snackbar
 * instead of throwing into the console.
 */
export function* refreshAddons() {
	try {
		const data = yield {
			type: 'FETCH',
			request: { path: 'addons?force=1' },
		};

		yield setAddons( data?.addons ?? [], data?.licenses ?? {} );

		dispatch( noticesStore ).createSuccessNotice(
			__( 'Addons refreshed.', 'loggedin' ),
			{ type: 'snackbar' }
		);
	} catch ( error ) {
		dispatch( noticesStore ).createErrorNotice(
			error?.message ||
				__( 'Failed to refresh addons.', 'loggedin' ),
			{ type: 'snackbar' }
		);
	}
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

		dispatch( noticesStore ).createSuccessNotice(
			action === 'activate'
				? __( 'License activated.', 'loggedin' )
				: __( 'License deactivated.', 'loggedin' ),
			{ type: 'snackbar' }
		);

		return true;
	} catch ( error ) {
		dispatch( noticesStore ).createErrorNotice(
			error?.message ||
				__( 'License request failed.', 'loggedin' ),
			{ type: 'snackbar' }
		);

		return false;
	}
}
