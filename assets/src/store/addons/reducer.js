/**
 * Reducer for the addons store.
 *
 * State shape:
 *   {
 *     addons:   Array<{ id, title, link, ... }>   // catalogue
 *     licenses: Record<addonId, { key, status }>  // license rows
 *   }
 *
 * We deliberately don't track a `loaded` flag here — `@wordpress/data`
 * already exposes per-selector resolution state via
 * `hasFinishedResolution()`, so duplicating it in the reducer is
 * error-prone (it's easy to forget to flip the flag on the failure
 * path and end up with a spinner that never resolves).
 */
const DEFAULT_STATE = {
	addons: [],
	licenses: {},
};

const reducer = ( state = DEFAULT_STATE, action ) => {
	switch ( action.type ) {
		case 'SET_ADDONS':
			return {
				...state,
				addons: action.addons,
				licenses: action.licenses,
			};

		case 'SET_LICENSES':
			return {
				...state,
				licenses: action.licenses,
			};

		default:
			return state;
	}
};

export default reducer;
