/**
 * Snackbar notice list rendered at the bottom-left of the screen.
 *
 * Pulls notices from `@wordpress/notices` and filters down to the
 * snackbar variety — the store also holds "static" admin-notice-style
 * entries that we never want to render here. Returns `null` when
 * there are no snackbars to avoid emitting an empty container.
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';
import { SnackbarList } from '@wordpress/components';

const Notices = () => {
	const notices = useSelect(
		( select ) =>
			select( noticesStore )
				.getNotices()
				.filter( ( notice ) => notice.type === 'snackbar' ),
		[]
	);

	const { removeNotice } = useDispatch( noticesStore );

	if ( ! notices.length ) {
		return null;
	}

	return (
		<SnackbarList
			className="loggedin-notices"
			notices={ notices }
			onRemove={ removeNotice }
		/>
	);
};

export default Notices;
