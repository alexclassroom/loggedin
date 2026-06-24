/**
 * Addons tab body.
 *
 * Lists the addon catalogue in a responsive grid of `AddonCard`s. The
 * catalogue and license map come from the `loggedin/addons` data
 * store via {@see useAddons}; the first render triggers the resolver
 * that fetches both from the REST API.
 *
 * The "Refresh" button bypasses the resolver cache and re-fetches
 * with `force=1`, which also busts the server-side Freemius cache.
 */
import { __ } from '@wordpress/i18n';
import { Button, Flex, Spinner } from '@wordpress/components';
import useAddons from '../../../hooks/use-addons';
import AddonCard from '../components/addon-card';

const Addons = () => {
	const { addons, licenses, hasLoaded, refreshAddons } = useAddons();

	if ( ! hasLoaded ) {
		return (
			<div className="loggedin-page-loader">
				<Spinner />
			</div>
		);
	}

	return (
		<>
			<Flex
				className="loggedin-addons-toolbar"
				justify="flex-end"
			>
				<Button
					__next40pxDefaultSize
					variant="secondary"
					icon="update"
					onClick={ refreshAddons }
				>
					{ __( 'Refresh Addons', 'loggedin' ) }
				</Button>
			</Flex>

			{ addons.length === 0 ? (
				<p>{ __( 'No addons available.', 'loggedin' ) }</p>
			) : (
				<div className="loggedin-addons-grid">
					{ addons.map( ( addon ) => (
						<AddonCard
							key={ addon.id }
							addon={ addon }
							license={ licenses[ addon.id ] || {} }
						/>
					) ) }
				</div>
			) }
		</>
	);
};

export default Addons;
