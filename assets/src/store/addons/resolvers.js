/**
 * Resolvers for the addons store.
 *
 * `@wordpress/data` triggers a resolver the first time a selector is
 * called for a given set of arguments. The resolver runs its side
 * effects (a REST fetch), dispatches actions to populate state, and
 * is then never called again unless the cache is invalidated via
 * `invalidateResolution`.
 *
 * We *always* dispatch `setAddons`, even on failure — without this
 * the `hasFinishedResolution` flag also stays false and the React UI
 * is stuck on a spinner. On failure we dispatch empty arrays and an
 * error snackbar so the user understands why the catalogue is empty.
 */
import { dispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';
import { __ } from '@wordpress/i18n';
import { setAddons } from './actions';

/**
 * Resolver paired with `getAddons` — fetches the catalogue + license
 * map on first read.
 */
export function* getAddons() {
	try {
		const data = yield {
			type: 'FETCH',
			request: { path: 'addons' },
		};

		yield setAddons( data?.addons ?? [], data?.licenses ?? {} );
	} catch ( error ) {
		yield setAddons( [], {} );

		dispatch( noticesStore ).createErrorNotice(
			error?.message ||
				__( 'Failed to load addons.', 'loggedin' ),
			{ type: 'snackbar' }
		);
	}
}
