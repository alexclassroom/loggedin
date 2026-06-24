/**
 * Admin app entry — boots the React UI on the plugin admin page.
 *
 * Boot order matters: SCSS first (so styles are in the DOM before the
 * first paint), then `api-init` (so any data hook that runs during the
 * initial render has the REST nonce + root URL configured), then the
 * `@wordpress/data` store registrations, and finally the React mount.
 *
 * The DOM mount node is emitted by `Admin\Admin::render_page()` as a
 * single `<div id="loggedin-admin" class="loggedin-wrap"></div>`. We
 * silently no-op if it's missing — for example, when this bundle is
 * loaded by mistake on a different admin screen.
 */
import './styles/admin.scss';
import './utils/api-init';
import './store';
import domReady from '@wordpress/dom-ready';
import { createRoot } from '@wordpress/element';
import { AppShell } from './common';
import AdminApp from './modules/admin';

domReady( () => {
	const el = document.getElementById( 'loggedin-admin' );

	if ( ! el ) {
		return;
	}

	createRoot( el ).render(
		<AppShell>
			<AdminApp />
		</AppShell>
	);
} );
