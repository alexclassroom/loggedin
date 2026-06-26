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
 */
import { __ } from '@wordpress/i18n';
import Settings from './settings';
import Addons from './addons';
import Support from './support';

const tabs = {
	settings: {
		label: __( 'Settings', 'loggedin' ),
		component: Settings,
	},
	addons: {
		label: __( 'Addons', 'loggedin' ),
		component: Addons,
		wide: true,
	},
	support: {
		label: __( 'Support', 'loggedin' ),
		component: Support,
	},
};

export default tabs;
