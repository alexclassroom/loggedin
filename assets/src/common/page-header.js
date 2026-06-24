/* global loggedin */

/**
 * Page header with title, version badge and slot for tab navigation.
 *
 * Rendered at the top of every admin page. The version is read from
 * the `loggedin` global localised by `Admin\Assets`.
 *
 * @param {Object} props
 * @param {string} props.title    Title shown next to the lock icon.
 * @param {Object} props.children Optional content rendered under the
 *                                title — usually a `<TabNav />`.
 */
const PageHeader = ( { title, children } ) => {
	const version =
		typeof loggedin !== 'undefined' && loggedin.version
			? loggedin.version
			: '';

	return (
		<header className="loggedin-page-header">
			<div className="loggedin-page-title">
				<h1>{ title }</h1>
				{ version && (
					<span className="loggedin-version">{ version }</span>
				) }
			</div>
			{ children }
		</header>
	);
};

export default PageHeader;
