/**
 * Per-addon license management modal.
 *
 * Triggered by the "Manage license" button on each addon card. Hosts
 * a single license input + an action button that toggles between
 * Activate and Deactivate based on the row's `is_license_active`
 * flag. Closing the modal (cancel button or backdrop click) calls
 * `onClose` without sending anything to the server.
 *
 * All server calls go through the `onActivate` / `onDeactivate`
 * props which are bound at the page level by {@see useAddons}. The
 * result decides whether the modal closes (success) or stays open
 * with an inline error notice (failure).
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
	// Local input value. Seeded from the stored license key so the
	// field round-trips an existing value cleanly (and shows the
	// stored key — masked by the disabled state — on a deactivate
	// flow).
	const [ key, setKey ] = useState( addon.license_key || '' );

	// In-flight flag for the primary button — gates double-clicks
	// and drives the busy spinner.
	const [ isWorking, setIsWorking ] = useState( false );

	// Inline error rendered above the input. Cleared on each new
	// submit attempt so stale messages don't linger after the user
	// fixes the issue.
	const [ error, setError ] = useState( '' );

	// Keep the local input in sync if the parent re-renders the
	// modal with a different stored value — for example, after a
	// successful activation patches the catalogue row from
	// elsewhere in the React tree.
	useEffect( () => {
		setKey( addon.license_key || '' );
	}, [ addon.license_key ] );

	/**
	 * Primary-button click handler.
	 *
	 * Reads `addon.is_license_active` afresh on every click so the
	 * action / label never drift when the addon row updates
	 * between renders. Returns early on any of three guards:
	 *
	 *   1. A previous click is still in flight.
	 *   2. We're about to activate with an empty key.
	 *   3. (implicit) The dispatched action resolves with `success`,
	 *      in which case we close instead of falling through to the
	 *      error branch.
	 */
	const handleSubmit = async () => {
		if ( isWorking ) {
			return;
		}

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

		// Failure path — surface whatever message the dispatched
		// action returned, with a generic fallback when none came
		// through.
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
					// Read-only once a license is active — deactivate
					// first to change the key.
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
							// Deactivate is the destructive action.
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
