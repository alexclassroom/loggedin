/**
 * Addons hook — thin wrapper over the `loggedin/addons` data store.
 *
 * Exposes the catalogue, license map, and resolution state as a
 * single value, plus bound action dispatchers for refresh + license
 * management. Keeps the component code free of `useSelect`
 * boilerplate.
 *
 * `hasLoaded` is read from `@wordpress/data`'s resolution tracker
 * (`hasFinishedResolution`), not from a flag in our reducer — the
 * core tracker flips to `true` whether the resolver succeeded or
 * failed, so a failed REST call never leaves the UI stuck on a
 * spinner.
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { STORE_KEY } from '../store/addons';

const useAddons = () => {
	const { addons, licenses, hasLoaded } = useSelect( ( select ) => {
		const store = select( STORE_KEY );

		return {
			addons: store.getAddons(),
			licenses: store.getLicenses(),
			hasLoaded: store.hasFinishedResolution( 'getAddons', [] ),
		};
	}, [] );

	const { refreshAddons, manageLicense } = useDispatch( STORE_KEY );

	return {
		addons,
		licenses,
		hasLoaded,
		refreshAddons,
		manageLicense,
	};
};

export default useAddons;
