/**
 * Per-addon license management modal.
 *
 * Triggered by the "Manage license" button on each addon card. Hosts
 * a single license input + an action button that toggles between
 * Activate and Deactivate based on the row's `is_license_active`
 * flag. Closing the modal (cancel button or backdrop click) calls
 * `onClose` without sending anything to the server.
 *
 * All server calls go through the `onActivate` / `onDeactivate` props
 * which are bound at the page level by {@see useAddons}. The result
 * of the call decides whether the modal closes (success) or stays
 * open with an inline error notice (failure).
 *
 * @param {Object}   props
 * @param {Object}   props.addon         Decorated addon row.
 * @param {Function} props.onActivate    `(id, key) => Promise<{success, error?}>`.
 * @param {Function} props.onDeactivate  `(id)     => Promise<{success, error?}>`.
 * @param {Function} props.onClose       Close handler.
 */
import { __, sprintf } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import {
	Button,
	Flex,
	FlexItem,
	Modal,
	Notice,
	TextControl,
	__experimentalVStack as VStack,
} from '@wordpress/components';

const LicenseModal = ( {
	addon,
	onActivate,
	onDeactivate,
	onClose,
} ) => {
	const [ key, setKey ] = useState( addon.license_key || '' );
	const [ isWorking, setIsWorking ] = useState( false );
	const [ error, setError ] = useState( '' );

	// Keep the local input in sync if the parent re-renders the
	// modal with a different stored value (e.g. after a successful
	// activation patches the catalogue row).
	useEffect( () => {
		setKey( addon.license_key || '' );
	}, [ addon.license_key ] );

	/**
	 * Single button handler — read `is_license_active` each click so
	 * the action / label never drift.
	 */
	const handleSubmit = async () => {
		if ( isWorking ) {
			return;
		}

		// Guard the empty-key activate path up front so we don't
		// waste a round-trip.
		if ( ! addon.is_license_active && ! key.trim() ) {
			setError( __( 'Enter a license key first.', 'loggedin' ) );
			return;
		}

		setIsWorking( true );
		setError( '' );

		const result = addon.is_license_active
			? await onDeactivate( addon.id )
			: await onActivate( addon.id, key.trim() );

		setIsWorking( false );

		if ( result?.success ) {
			onClose();
			return;
		}

		setError(
			result?.error ||
				__( 'Something went wrong. Please try again.', 'loggedin' )
		);
	};

	return (
		<Modal
			title={ sprintf(
				/* translators: %s addon title. */
				__( 'Manage license — %s', 'loggedin' ),
				addon.title || ''
			) }
			onRequestClose={ onClose }
			className="loggedin-license-modal"
			size="medium"
		>
			<VStack spacing={ 4 }>
				{ error && (
					<Notice status="error" isDismissible={ false }>
						{ error }
					</Notice>
				) }

				<TextControl
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					label={ __( 'License Key', 'loggedin' ) }
					value={ key }
					disabled={ addon.is_license_active || isWorking }
					onChange={ setKey }
				/>

				<Flex justify="flex-end" gap={ 2 }>
					<FlexItem>
						<Button
							__next40pxDefaultSize
							variant="tertiary"
							onClick={ onClose }
							disabled={ isWorking }
						>
							{ __( 'Cancel', 'loggedin' ) }
						</Button>
					</FlexItem>
					<FlexItem>
						<Button
							__next40pxDefaultSize
							variant={
								addon.is_license_active
									? 'secondary'
									: 'primary'
							}
							isDestructive={ addon.is_license_active }
							isBusy={ isWorking }
							onClick={ handleSubmit }
						>
							{ addon.is_license_active
								? __( 'Deactivate', 'loggedin' )
								: __( 'Activate', 'loggedin' ) }
						</Button>
					</FlexItem>
				</Flex>
			</VStack>
		</Modal>
	);
};

export default LicenseModal;
