/* global loggedin */

/**
 * Settings tab body.
 *
 * Renders the concurrent-login limit (number) and the behavior-mode
 * radio group inside a single `PanelBody`. Edits flow through
 * {@see useSettings} into the core-data edit buffer; the visible
 * Save button lives in the sticky `Footer` rendered by `AdminApp`.
 *
 * The list of behavior modes (`logics`) is provided by the PHP side
 * via the `loggedin` global so addons hooking the `loggedin_logics`
 * filter on the server contribute new options without any JS
 * changes.
 */
import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	PanelRow,
	RadioControl,
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import useSettings from '../../../hooks/use-settings';

/**
 * Logic catalogue keyed by mode id — `{ label, desc }` per entry.
 *
 * Coming from the localised `loggedin` global. Falls back to an
 * empty object if the bundle is loaded outside the plugin admin
 * page (e.g. by a test runner) so the module never crashes on
 * import.
 *
 * @type {Object<string, { label: string, desc: string }>}
 */
const logics =
	typeof loggedin !== 'undefined' && loggedin.logics
		? loggedin.logics
		: {};

/**
 * Pre-computed `RadioControl` option list — derived once at module
 * load instead of on every render.
 *
 * @type {Array<{ value: string, label: string }>}
 */
const logicOptions = Object.entries( logics ).map( ( [ value, meta ] ) => ( {
	value,
	label: meta.label,
} ) );

const Settings = () => {
	const { getSetting, setSetting } = useSettings();

	// Coerce both reads — `useSettings` may briefly return raw
	// values from core-data that haven't been through our sanitizer
	// (e.g. immediately after a manual `update_option` from outside
	// the plugin). The coercion keeps the controls' types stable.
	const maximum = Number( getSetting( 'maximum', 1 ) );
	const logic = String( getSetting( 'logic', 'allow' ) );

	// Show the mode-specific description as the radio group's
	// `help` text. Switching modes updates this in-place so the
	// user sees what their choice means before they save.
	const logicHelp = logics[ logic ] ? logics[ logic ].desc : '';

	return (
		<PanelBody
			title={ __( 'General Settings', 'loggedin' ) }
			initialOpen
		>
			<PanelRow>
				<NumberControl
					__next40pxDefaultSize
					label={ __( 'Active Logins Limit', 'loggedin' ) }
					help={ __(
						'Maximum number of simultaneous logins allowed per user account.',
						'loggedin'
					) }
					min={ 1 }
					value={ maximum }
					onChange={ ( value ) =>
						// `NumberControl` emits strings (and the
						// browser permits typing nonsense like an
						// empty string). Clamp to 1 so a stray
						// empty / negative value never makes it
						// into the edit buffer.
						setSetting(
							'maximum',
							Math.max( 1, parseInt( value, 10 ) || 1 )
						)
					}
				/>
			</PanelRow>

			<PanelRow>
				<RadioControl
					label={ __( 'Login Logic', 'loggedin' ) }
					help={ logicHelp }
					selected={ logic }
					options={ logicOptions }
					onChange={ ( value ) => setSetting( 'logic', value ) }
				/>
			</PanelRow>
		</PanelBody>
	);
};

export default Settings;
