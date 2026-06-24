/**
 * Addons tab — lists available addons and manages license keys.
 */
import { useEffect, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Flex,
	FlexItem,
	Spinner,
	TextControl,
} from '@wordpress/components';

const ACTIVATED = 'activated';

export default function AddonsTab( { notify } ) {
	const [ data, setData ] = useState( null );
	const [ pending, setPending ] = useState( {} );
	const [ keys, setKeys ] = useState( {} );

	const load = ( force = false ) => {
		apiFetch( {
			path: force ? 'addons?force=1' : 'addons',
		} )
			.then( setData )
			.catch( () =>
				notify( __( 'Failed to load addons.', 'loggedin' ), 'error' )
			);
	};

	useEffect( load, [] );

	if ( ! data ) {
		return <Spinner />;
	}

	const addons = data.addons || [];
	const licenses = data.licenses || {};

	const runLicense = ( id, action, key ) => {
		setPending( ( p ) => ( { ...p, [ id ]: action } ) );

		apiFetch( {
			path: 'addons/license',
			method: 'POST',
			data: { id, action, key },
		} )
			.then( ( res ) => {
				if ( res && res.licenses ) {
					setData( ( d ) => ( { ...d, licenses: res.licenses } ) );
				}
				notify(
					action === 'activate'
						? __( 'License activated.', 'loggedin' )
						: __( 'License deactivated.', 'loggedin' )
				);
			} )
			.catch( ( err ) =>
				notify(
					err.message ||
						__( 'License request failed.', 'loggedin' ),
					'error'
				)
			)
			.finally( () =>
				setPending( ( p ) => {
					const next = { ...p };
					delete next[ id ];
					return next;
				} )
			);
	};

	return (
		<>
			<Flex justify="flex-end" style={ { marginBottom: 12 } }>
				<Button variant="secondary" onClick={ () => load( true ) }>
					{ __( 'Refresh Addons', 'loggedin' ) }
				</Button>
			</Flex>

			{ addons.length === 0 && (
				<p>{ __( 'No addons available.', 'loggedin' ) }</p>
			) }

			{ addons.map( ( addon ) => {
				const license = licenses[ addon.id ] || {};
				const isActive = license.status === ACTIVATED;
				const inputKey = keys[ addon.id ] ?? license.key ?? '';

				return (
					<Card key={ addon.id } style={ { marginBottom: 12 } }>
						<CardHeader>
							<strong>{ addon.title }</strong>
							{ addon.link && (
								<a
									href={ addon.link }
									target="_blank"
									rel="noopener noreferrer"
								>
									{ __( 'Learn more', 'loggedin' ) }
								</a>
							) }
						</CardHeader>
						<CardBody>
							<Flex align="flex-end" gap={ 3 }>
								<FlexItem style={ { flexGrow: 1 } }>
									<TextControl
										label={ __(
											'License Key',
											'loggedin'
										) }
										value={ inputKey }
										disabled={ isActive }
										onChange={ ( value ) =>
											setKeys( ( k ) => ( {
												...k,
												[ addon.id ]: value,
											} ) )
										}
									/>
								</FlexItem>
								<FlexItem>
									{ isActive ? (
										<Button
											variant="secondary"
											isDestructive
											isBusy={
												pending[ addon.id ] ===
												'deactivate'
											}
											onClick={ () =>
												runLicense(
													addon.id,
													'deactivate',
													''
												)
											}
										>
											{ __( 'Deactivate', 'loggedin' ) }
										</Button>
									) : (
										<Button
											variant="primary"
											isBusy={
												pending[ addon.id ] ===
												'activate'
											}
											disabled={ ! inputKey }
											onClick={ () =>
												runLicense(
													addon.id,
													'activate',
													inputKey
												)
											}
										>
											{ __( 'Activate', 'loggedin' ) }
										</Button>
									) }
								</FlexItem>
							</Flex>
							{ isActive && (
								<p className="description">
									{ sprintf(
										// translators: %s plugin name.
										__(
											'%s is active.',
											'loggedin'
										),
										addon.title
									) }
								</p>
							) }
						</CardBody>
					</Card>
				);
			} ) }
		</>
	);
}
