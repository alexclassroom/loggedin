/**
 * Admin app root.
 *
 * Mounts the page header (with the tab nav), the active tab body, the
 * sticky footer (only on Settings), and the snackbar notice list.
 *
 * Tab state is plain `useState` — the React tree is small enough that
 * a context or store would be overkill. Switching tabs unmounts the
 * previous one, so each tab's data hooks and resolvers are scoped to
 * the time it's on screen.
 */
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Spinner } from '@wordpress/components';
import { Footer, Notices, PageBody, PageHeader, TabNav } from '../../common';
import useSettings from '../../hooks/use-settings';
import tabs from './tabs';

const AdminApp = () => {
	const { hasLoaded } = useSettings();

	const tabKeys = Object.keys( tabs );
	const [ current, setCurrent ] = useState( tabKeys[ 0 ] );

	const navs = Object.fromEntries(
		Object.entries( tabs ).map( ( [ key, tab ] ) => [ key, tab.label ] )
	);

	const ActiveTab = ( tabs[ current ] || tabs[ tabKeys[ 0 ] ] ).component;
	const isWide = !! tabs[ current ]?.wide;

	return (
		<>
			<PageHeader
				title={ __(
					'Loggedin – Limit Concurrent Sessions',
					'loggedin'
				) }
			>
				<TabNav
					current={ current }
					navs={ navs }
					onChange={ setCurrent }
				/>
			</PageHeader>

			<PageBody wide={ isWide }>
				{ ! hasLoaded ? (
					<div className="loggedin-page-loader">
						<Spinner />
					</div>
				) : (
					<>
						<ActiveTab />
						{ current === 'settings' && <Footer /> }
					</>
				) }
			</PageBody>

			<Notices />
		</>
	);
};

export default AdminApp;
