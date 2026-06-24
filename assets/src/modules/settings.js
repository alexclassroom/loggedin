/**
 * Settings tab — concurrent-login limit and behavior mode.
 */
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import {
	Button,
	Card,
	CardBody,
	__experimentalNumberControl as NumberControl,
	RadioControl,
	Spinner,
} from '@wordpress/components';

const config = window.loggedin || {};
const logics = config.logics || {};

const logicOptions = Object.entries( logics ).map( ( [ value, meta ] ) => ( {
	value,
	label: meta.label,
} ) );

export default function SettingsTab( { notify } ) {
	const [ settings, setSettings ] = useState( null );
	const [ saving, setSaving ] = useState( false );

	useEffect( () => {
		apiFetch( { path: 'settings' } )
			.then( setSettings )
			.catch( () =>
				notify(
					__( 'Failed to load settings.', 'loggedin' ),
					'error'
				)
			);
	}, [] );

	const save = () => {
		setSaving( true );
		apiFetch( {
			path: 'settings',
			method: 'POST',
			data: settings,
		} )
			.then( ( updated ) => {
				setSettings( updated );
				notify( __( 'Settings saved.', 'loggedin' ) );
			} )
			.catch( () =>
				notify(
					__( 'Failed to save settings.', 'loggedin' ),
					'error'
				)
			)
			.finally( () => setSaving( false ) );
	};

	if ( ! settings ) {
		return <Spinner />;
	}

	return (
		<Card>
			<CardBody>
				<h2>{ __( 'General Settings', 'loggedin' ) }</h2>

				<NumberControl
					label={ __( 'Active Logins Limit', 'loggedin' ) }
					help={ __(
						'Maximum number of active logins allowed per user account.',
						'loggedin'
					) }
					min={ 1 }
					value={ settings.maximum }
					onChange={ ( value ) =>
						setSettings( {
							...settings,
							maximum: parseInt( value, 10 ) || 1,
						} )
					}
				/>

				<br />

				<RadioControl
					label={ __( 'Login Logic', 'loggedin' ) }
					help={
						logics[ settings.logic ]
							? logics[ settings.logic ].desc
							: ''
					}
					selected={ settings.logic }
					options={ logicOptions }
					onChange={ ( value ) =>
						setSettings( { ...settings, logic: value } )
					}
				/>

				<br />

				<Button
					variant="primary"
					isBusy={ saving }
					disabled={ saving }
					onClick={ save }
				>
					{ __( 'Save Settings', 'loggedin' ) }
				</Button>
			</CardBody>
		</Card>
	);
}
