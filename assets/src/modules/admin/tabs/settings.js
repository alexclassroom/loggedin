/* global loggedin */

/**
 * Settings tab body.
 *
 * Renders the concurrent-login limit (number) and the behavior-mode
 * radio group inside a single `PanelBody`. Edits flow through
 * `useSettings` into the core-data edit buffer; the visible Save
 * button lives in the sticky `Footer` rendered by `AdminApp`.
 *
 * The list of behavior modes (`logics`) is provided by the PHP side
 * via the `loggedin` global so that addons hooking the
 * `loggedin_logics` filter on the server contribute new options
 * without any JS changes.
 */
import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	PanelRow,
	RadioControl,
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import useSettings from '../../../hooks/use-settings';

const logics =
	typeof loggedin !== 'undefined' && loggedin.logics ? loggedin.logics : {};

const logicOptions = Object.entries( logics ).map( ( [ value, meta ] ) => ( {
	value,
	label: meta.label,
} ) );

const Settings = () => {
	const { getSetting, setSetting } = useSettings();

	const maximum = Number( getSetting( 'maximum', 1 ) );
	const logic = String( getSetting( 'logic', 'allow' ) );
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
