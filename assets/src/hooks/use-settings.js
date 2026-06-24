/**
 * Settings hook — read/write the `loggedin_settings` site option.
 *
 * We bind to the WordPress core-data entity for site settings via
 * `useEntityProp`. This gives us a few things for free:
 *
 *   - Caching: the first read fetches `/wp/v2/settings`, subsequent
 *     reads come from the core-data store.
 *   - Edit tracking: writes go to an "edits" buffer (not the server)
 *     so we can show an "unsaved changes" state and only POST when
 *     the user clicks Save.
 *   - Persistence: `saveEditedEntityRecord('root', 'site')` flushes
 *     the buffer in one REST call.
 *
 * The option must be registered with `show_in_rest` on the PHP side
 * (see `Setup\Settings::register()`) for this to work.
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import { useEntityProp } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';

const OPTION_KEY = 'loggedin_settings';

const DEFAULTS = {
	maximum: 1,
	logic: 'allow',
};

const useSettings = () => {
	const [ stored, setOption ] = useEntityProp( 'root', 'site', OPTION_KEY );

	// `useEntityProp` returns `undefined` until the first fetch lands.
	// Normalise to the defaults object so consumers don't need to
	// null-check on every render.
	const settings = stored ?? DEFAULTS;

	const { saveEditedEntityRecord } = useDispatch( coreStore );
	const { createSuccessNotice, createErrorNotice, removeAllNotices } =
		useDispatch( noticesStore );

	const { hasLoaded, isSaving, isDirty } = useSelect( ( select ) => {
		const core = select( coreStore );

		return {
			isSaving: core.isSavingEntityRecord( 'root', 'site' ),
			isDirty: core.hasEditsForEntityRecord( 'root', 'site' ),
			hasLoaded: core.hasFinishedResolution( 'getEntityRecord', [
				'root',
				'site',
			] ),
		};
	}, [] );

	/**
	 * Get a single setting value with a default fallback.
	 */
	const getSetting = ( key, fallback = DEFAULTS[ key ] ) =>
		settings[ key ] === undefined ? fallback : settings[ key ];

	/**
	 * Buffer a write to a single setting key.
	 *
	 * Spreads the rest of the current settings object so we never drop
	 * keys we don't recognise (e.g. addon-added settings).
	 */
	const setSetting = ( key, value ) => {
		setOption( { ...settings, [ key ]: value } );
	};

	/**
	 * Flush the buffered edits via `/wp/v2/settings`.
	 */
	const saveSettings = async () => {
		removeAllNotices();

		const saved = await saveEditedEntityRecord( 'root', 'site' );

		if ( saved ) {
			createSuccessNotice( __( 'Settings saved.', 'loggedin' ), {
				type: 'snackbar',
			} );
		} else {
			createErrorNotice(
				__( 'Could not save settings.', 'loggedin' ),
				{ type: 'snackbar' }
			);
		}
	};

	return {
		settings,
		hasLoaded,
		isSaving,
		isDirty,
		getSetting,
		setSetting,
		saveSettings,
	};
};

export default useSettings;
