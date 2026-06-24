/**
 * Main page-body container.
 *
 * Provides the centered, width-constrained column the tab content
 * lives inside. `wide` flips the layout to a wider responsive column
 * for screens that hold tables or grids (e.g. the Addons tab).
 *
 * @param {Object}  props
 * @param {Object}  props.children Tab body content.
 * @param {boolean} [props.wide]   Use the wide layout modifier.
 */
const PageBody = ( { children, wide = false } ) => (
	<div
		className={
			'loggedin-page-body' +
			( wide ? ' loggedin-page-body--wide' : '' )
		}
	>
		{ children }
	</div>
);

export default PageBody;
