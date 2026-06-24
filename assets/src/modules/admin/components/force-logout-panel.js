/**
 * Force-logout panel.
 *
 * Renders on the Settings tab below the General Settings panel.
 * Accepts a single identifier — user id, email, or username — and
 * fires `POST /loggedin/v1/sessions/destroy`. The server resolves
 * the identifier and destroys every active session for that user
 * (same effect as the legacy `?loggedin_logout=1` admin link).
 *
 * Success and failure both surface through the global snackbar
 * stack so the UX matches the rest of the admin app. A successful
 * call also clears the input so the panel is ready for the next
 * lookup without further interaction.
 */
import { useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import {
	Button,
	PanelBody,
	PanelRow,
	TextControl,
} from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';

const ForceLogoutPanel = () => {
	// Local input state. Plain `useState` — the panel doesn't need
	// to share its value with anything else in the React tree.
	const [ identifier, setIdentifier ] = useState( '' );

	// Gates double-clicks and drives the button's busy spinner.
	const [ isWorking, setIsWorking ] = useState( false );

	const { createSuccessNotice, createErrorNotice } =
		useDispatch( noticesStore );

	/**
	 * Submit handler — POST the identifier and dispatch a snackbar
	 * reflecting the result.
	 */
	const handleSubmit = async () => {
		const value = identifier.trim();

		if ( ! value || isWorking ) {
			return;
		}

		setIsWorking( true );

		try {
			const result = await apiFetch( {
				path: '/loggedin/v1/sessions/destroy',
				method: 'POST',
				data: { user: value },
			} );

			createSuccessNotice(
				sprintf(
					// translators: %s user login of the destroyed user.
					__(
						'All sessions destroyed for "%s".',
						'loggedin'
					),
					result?.user?.login || value
				),
				{ type: 'snackbar' }
			);

			setIdentifier( '' );
		} catch ( error ) {
			createErrorNotice(
				error?.message ||
					__(
						'Could not destroy sessions. Please try again.',
						'loggedin'
					),
				{ type: 'snackbar' }
			);
		} finally {
			setIsWorking( false );
		}
	};

	return (
		<PanelBody
			title={ __( 'Force Logout', 'loggedin' ) }
			initialOpen
		>
			<PanelRow>
				<TextControl
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					label={ __( 'User', 'loggedin' ) }
					help={ __(
						'Enter a user id, email address, or username. All active sessions for that user will be destroyed.',
						'loggedin'
					) }
					value={ identifier }
					disabled={ isWorking }
					onChange={ setIdentifier }
				/>
			</PanelRow>

			<PanelRow>
				<Button
					__next40pxDefaultSize
					variant="secondary"
					isDestructive
					isBusy={ isWorking }
					disabled={ isWorking || ! identifier.trim() }
					onClick={ handleSubmit }
				>
					{ isWorking
						? __( 'Logging out…', 'loggedin' )
						: __( 'Force Logout', 'loggedin' ) }
				</Button>
			</PanelRow>
		</PanelBody>
	);
};

export default ForceLogoutPanel;
