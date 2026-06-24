/**
 * Selectors for the addons store.
 */

/**
 * Return the cached addon catalogue.
 *
 * The first invocation triggers the `getAddons` resolver, which
 * fetches the catalogue from the REST API and dispatches
 * `setAddons`. Subsequent reads return the cached array.
 *
 * @param {Object} state Store state.
 */
export function getAddons( state ) {
	return state.addons;
}

/**
 * Return the license map keyed by addon id.
 *
 * @param {Object} state Store state.
 */
export function getLicenses( state ) {
	return state.licenses;
}
