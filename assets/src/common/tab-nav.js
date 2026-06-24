/**
 * Tab navigation rendered inside the page header.
 *
 * Tabs are simple anchors with `href="#key"` so the browser preserves
 * the active tab in the URL hash — refreshing the page lands the user
 * back on the same tab. Click handling is intercepted to keep the
 * navigation client-side (no real fragment scroll).
 *
 * @param {Object}                props
 * @param {string}                props.current  Currently-active tab key.
 * @param {Object<string,string>} props.navs     Map of `key => label`.
 * @param {Function}              props.onChange Called with the new key.
 */
const TabNav = ( { current, navs, onChange } ) => {
	const handleClick = ( event, key ) => {
		event.preventDefault();
		onChange( key );
	};

	return (
		<nav className="loggedin-tabs" aria-label="Plugin tabs">
			{ Object.entries( navs ).map( ( [ key, label ] ) => (
				<a
					key={ key }
					href={ `#${ key }` }
					className={
						'loggedin-tab' +
						( key === current ? ' active' : '' )
					}
					aria-current={ key === current ? 'page' : undefined }
					onClick={ ( event ) => handleClick( event, key ) }
				>
					{ label }
				</a>
			) ) }
		</nav>
	);
};

export default TabNav;
