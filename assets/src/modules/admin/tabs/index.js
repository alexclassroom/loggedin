/**
 * Tab registry.
 *
 * Each entry maps a stable string key (also used in the URL hash) to:
 *
 *   - `label`     The translated tab title.
 *   - `component` The React component rendered when the tab is active.
 *   - `wide`      Optional — opt the page body into the wide layout
 *                 used for grid-heavy tabs like Addons.
 *
 * Order in this object is the tab order in the nav.
 *
 * Addons inject their own tabs through the `loggedin.admin.tabs`
 * filter — same pattern as `loggedin.settings.panels`. Each filter
 * entry must be `{ key, label, component, wide?, before?, after? }`:
 *
 *   - `key`       Stable string id. Replaces a built-in tab with the
 *                 same key, so addons can override Settings/Addons/
 *                 Support if they really mean to.
 *   - `before`    Optional — insert the new tab immediately before
 *                 the tab with this key. Falls back to append.
 *   - `after`     Optional — insert immediately after. Ignored when
 *                 `before` is set.
 *
 * The filter is applied at import time so the result is stable across
 * renders; addons that need dynamic tabs should still register here
 * and feature-flag inside their component.
 */
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';
import Settings from './settings';
import Addons from './addons';
import Support from './support';

const builtIn = [
	{
		key: 'settings',
		label: __( 'Settings', 'loggedin' ),
		component: Settings,
	},
	{
		key: 'addons',
		label: __( 'Addons', 'loggedin' ),
		component: Addons,
		wide: true,
	},
	{
		key: 'support',
		label: __( 'Support', 'loggedin' ),
		component: Support,
	},
];

const isValid = ( tab ) =>
	tab && typeof tab.key === 'string' && tab.key && tab.component;

const applyOrdering = ( base, extras ) => {
	const list = [ ...base ];

	extras.forEach( ( tab ) => {
		// Replace-by-key: addon entries supersede built-ins that share
		// a key, letting the addon override Settings/Addons/Support
		// outright when that's the intent.
		const existing = list.findIndex( ( t ) => t.key === tab.key );
		if ( existing !== -1 ) {
			list.splice( existing, 1 );
		}

		if ( tab.before ) {
			const idx = list.findIndex( ( t ) => t.key === tab.before );
			if ( idx !== -1 ) {
				list.splice( idx, 0, tab );
				return;
			}
		}

		if ( tab.after ) {
			const idx = list.findIndex( ( t ) => t.key === tab.after );
			if ( idx !== -1 ) {
				list.splice( idx + 1, 0, tab );
				return;
			}
		}

		list.push( tab );
	} );

	return list;
};

/**
 * Resolve the ordered tab registry.
 *
 * Called from `AdminApp` on render — applying the filter at module
 * import time would race against addon bundles that haven't yet had
 * a chance to `addFilter`, so we defer the lookup until React asks
 * for it. Same pattern as `loggedin.settings.panels`.
 *
 * @return {Object} Tabs keyed by `key`, preserving insertion order.
 */
export const resolveTabs = () => {
	const ordered = applyOrdering(
		builtIn,
		applyFilters( 'loggedin.admin.tabs', [] ).filter( isValid )
	);

	// Preserve the legacy `{ key: tab }` shape that `AdminApp` reads —
	// callers iterate `Object.keys()` for the tab order, so keep the
	// insertion order from `ordered`.
	return Object.fromEntries(
		ordered.map( ( { key, ...rest } ) => [ key, rest ] )
	);
};

export default resolveTabs;
