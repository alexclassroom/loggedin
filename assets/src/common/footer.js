/**
 * Sticky footer with the Save button.
 *
 * Rendered only on the Settings tab. Reads the unsaved-changes flag
 * from {@see useSettings} so the button is disabled when there is
 * nothing to save, and shows a busy spinner while the REST request
 * is in flight.
 */
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import useSettings from '../hooks/use-settings';

const Footer = () => {
	const { isSaving, isDirty, saveSettings } = useSettings();

	return (
		<div className="loggedin-footer">
			<Button
				variant="primary"
				icon={ isSaving ? null : 'yes' }
				isBusy={ isSaving }
				disabled={ isSaving || ! isDirty }
				onClick={ saveSettings }
			>
				{ isSaving
					? __( 'Saving…', 'loggedin' )
					: __( 'Save Changes', 'loggedin' ) }
			</Button>
		</div>
	);
};

export default Footer;
