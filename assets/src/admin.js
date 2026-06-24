/**
 * Admin app entry — mounts the Loggedin React UI on its admin page.
 */
import './styles/admin.scss';
import './utils/api-init';
import domReady from '@wordpress/dom-ready';
import { createRoot } from '@wordpress/element';
import App from './modules/app';

domReady( () => {
	const el = document.getElementById( 'loggedin-admin' );

	if ( el ) {
		createRoot( el ).render( <App /> );
	}
} );
