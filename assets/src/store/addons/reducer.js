/**
 * Reducer for the addons store.
 *
 * State shape:
 *   {
 *     addons:   Array<{ id, title, link, ... }>   // catalogue
 *     licenses: Record<addonId, { key, status }>  // license state
 *     loaded:   boolean                           // first fetch complete
 *   }
 */
const DEFAULT_STATE = {
	addons: [],
	licenses: {},
	loaded: false,
};

const reducer = ( state = DEFAULT_STATE, action ) => {
	switch ( action.type ) {
		case 'SET_ADDONS':
			return {
				...state,
				addons: action.addons,
				licenses: action.licenses,
				loaded: true,
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
