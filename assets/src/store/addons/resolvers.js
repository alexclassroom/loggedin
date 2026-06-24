/**
 * Resolvers for the addons store.
 *
 * `@wordpress/data` triggers a resolver the first time a selector is
 * called for a given set of arguments. The resolver runs the side-
 * effect (a REST fetch), dispatches actions to populate state, and is
 * then never called again for those arguments unless the cache is
 * invalidated via `invalidateResolution`.
 */
import { setAddons } from './actions';

/**
 * Resolver paired with `getAddons` — fetches the catalogue + license
 * map on first read.
 */
export function* getAddons() {
	const data = yield {
		type: 'FETCH',
		request: { path: 'addons' },
	};

	yield setAddons( data.addons ?? [], data.licenses ?? {} );
}
