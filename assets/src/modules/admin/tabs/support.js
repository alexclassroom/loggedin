/**
 * Support tab body.
 *
 * Two `PanelBody` blocks: one with channels for getting help, one with
 * the author's links. Each is rendered as a row of secondary buttons
 * via the local `LinkRow` helper.
 */
import { __ } from '@wordpress/i18n';
import { Button, Flex, FlexItem, PanelBody } from '@wordpress/components';

const SUPPORT_LINKS = [
	{
		href: 'https://wordpress.org/support/plugin/loggedin/',
		icon: 'groups',
		label: __( 'Support Forums', 'loggedin' ),
	},
	{
		href: 'https://duckdev.com/products/loggedin-limit-active-logins/',
		icon: 'admin-page',
		label: __( 'Product Page', 'loggedin' ),
	},
	{
		href: 'https://github.com/Joel-James/loggedin/issues',
		icon: 'editor-help',
		label: __( 'Report an Issue', 'loggedin' ),
	},
];

const AUTHOR_LINKS = [
	{
		href: 'https://duckdev.com/about/',
		icon: 'admin-site',
		label: __( 'About Us', 'loggedin' ),
	},
	{
		href: 'https://profiles.wordpress.org/joelcj91/',
		icon: 'wordpress',
		label: __( 'WP.org Profile', 'loggedin' ),
	},
];

const LinkRow = ( { links } ) => (
	<Flex className="loggedin-link-row" gap={ 2 } justify="flex-start" wrap>
		{ links.map( ( link ) => (
			<FlexItem key={ link.href }>
				<Button
					__next40pxDefaultSize
					variant="secondary"
					target="_blank"
					rel="noopener noreferrer"
					icon={ link.icon }
					href={ link.href }
				>
					{ link.label }
				</Button>
			</FlexItem>
		) ) }
	</Flex>
);

const Support = () => (
	<>
		<PanelBody
			title={ __( 'Support Information', 'loggedin' ) }
			initialOpen
		>
			<p>
				{ __(
					'Need help with the plugin? Reach out through any of the channels below.',
					'loggedin'
				) }
			</p>
			<LinkRow links={ SUPPORT_LINKS } />
		</PanelBody>

		<PanelBody
			title={ __( 'About the Author', 'loggedin' ) }
			initialOpen
		>
			<p>
				{ __(
					"Hey, I'm Joel James — the developer behind Loggedin. Find more of my work below.",
					'loggedin'
				) }
			</p>
			<LinkRow links={ AUTHOR_LINKS } />
		</PanelBody>
	</>
);

export default Support;
