/**
 * Addons tab body.
 *
 * Renders the responsive grid of addon cards plus a single hoisted
 * License Modal. Hoisting the modal here (rather than per-card) keeps
 * focus management clean and means there's only ever one modal in
 * the DOM at a time.
 *
 * Data flow: `useAddons` → store → REST. The first render triggers
 * the store's `getItems` resolver which fetches
 * `/loggedin/v1/addons` and populates the catalogue.
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { Button, Flex, FlexItem, Spinner } from '@wordpress/components';
import useAddons from '../../../hooks/use-addons';
import AddonCard from '../components/addon-card';
import LicenseModal from '../components/license-modal';

const Addons = () => {
	const {
		items,
		isLoading,
		isRefreshing,
		refresh,
		activateLicense,
		deactivateLicense,
	} = useAddons();

	// Currently-managed addon id, or `null` when the modal is
	// closed. We re-derive the live row from `items` on each render
	// so a successful (de)activation patches the modal title /
	// button label without forcing it to re-open.
	const [ managingId, setManagingId ] = useState( null );
	const managingAddon =
		managingId !== null
			? items.find(
					( addon ) => Number( addon.id ) === Number( managingId )
			  )
			: null;

	if ( isLoading ) {
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
				align="center"
			>
				<FlexItem>
					<Button
						__next40pxDefaultSize
						variant="secondary"
						icon="update"
						onClick={ refresh }
						isBusy={ isRefreshing }
						disabled={ isRefreshing }
					>
						{ isRefreshing
							? __( 'Refreshing…', 'loggedin' )
							: __( 'Refresh Addons', 'loggedin' ) }
					</Button>
				</FlexItem>
			</Flex>

			{ items.length === 0 ? (
				<p>{ __( 'No addons available.', 'loggedin' ) }</p>
			) : (
				<div className="loggedin-addons-grid">
					{ items.map( ( addon ) => (
						<AddonCard
							key={ addon.id }
							addon={ addon }
							onManageLicense={ ( a ) =>
								setManagingId( a.id )
							}
						/>
					) ) }
				</div>
			) }

			{ managingAddon && (
				<LicenseModal
					addon={ managingAddon }
					onActivate={ activateLicense }
					onDeactivate={ deactivateLicense }
					onClose={ () => setManagingId( null ) }
				/>
			) }
		</>
	);
};

export default Addons;
