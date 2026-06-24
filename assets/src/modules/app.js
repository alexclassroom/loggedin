/**
 * Top-level admin app — page header + tab nav + active tab content.
 */
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { TabPanel, SnackbarList } from '@wordpress/components';
import SettingsTab from './settings';
import AddonsTab from './addons';
import SupportTab from './support';

const config = window.loggedin || {};

export default function App() {
	const [ notices, setNotices ] = useState( [] );

	const notify = ( message, status = 'success' ) => {
		const id = Date.now() + Math.random();
		setNotices( ( current ) => [
			...current,
			{ id, content: message, status },
		] );
	};

	const dismiss = ( id ) => {
		setNotices( ( current ) => current.filter( ( n ) => n.id !== id ) );
	};

	const tabs = [
		{
			name: 'settings',
			title: __( 'Settings', 'loggedin' ),
			content: <SettingsTab notify={ notify } />,
		},
	];

	if ( config.hasAddons ) {
		tabs.push( {
			name: 'addons',
			title: __( 'Addons', 'loggedin' ),
			content: <AddonsTab notify={ notify } />,
		} );
	}

	tabs.push( {
		name: 'support',
		title: __( 'Support', 'loggedin' ),
		content: <SupportTab />,
	} );

	return (
		<div className="loggedin-app">
			<header className="loggedin-app__header">
				<h1>
					{ '🔒 ' }
					{ __(
						'Loggedin – Limit Concurrent Sessions',
						'loggedin'
					) }
				</h1>
			</header>

			<TabPanel
				className="loggedin-app__tabs"
				activeClass="is-active"
				tabs={ tabs }
			>
				{ ( tab ) => (
					<div className="loggedin-app__panel">{ tab.content }</div>
				) }
			</TabPanel>

			<SnackbarList notices={ notices } onRemove={ dismiss } />
		</div>
	);
}
