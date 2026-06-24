/**
 * Addons hook — thin wrapper over the `loggedin/addons` data store.
 *
 * Exposes the catalogue, license map, and loading flag as a single
 * value, plus bound action dispatchers for refresh + license
 * management. Keeps the component code free of `useSelect` boilerplate.
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { STORE_KEY } from '../store/addons';

const useAddons = () => {
	const { addons, licenses, hasLoaded, isResolving } = useSelect(
		( select ) => {
			const store = select( STORE_KEY );

			return {
				addons: store.getAddons(),
				licenses: store.getLicenses(),
				hasLoaded: store.hasLoaded(),
				isResolving: select( 'core/data' ).isResolving(
					STORE_KEY,
					'getAddons',
					[]
				),
			};
		},
		[]
	);

	const { refreshAddons, manageLicense } = useDispatch( STORE_KEY );

	return {
		addons,
		licenses,
		hasLoaded,
		isResolving,
		refreshAddons,
		manageLicense,
	};
};

export default useAddons;
