/**
 * Support tab — static links to docs / wp.org support / GitHub.
 */
import { __ } from '@wordpress/i18n';
import { Card, CardBody } from '@wordpress/components';

const links = [
	{
		href: 'https://wordpress.org/support/plugin/loggedin/',
		label: __( 'WordPress.org Support', 'loggedin' ),
	},
	{
		href: 'https://duckdev.com/products/loggedin-limit-active-logins/',
		label: __( 'Product Page', 'loggedin' ),
	},
	{
		href: 'https://github.com/Joel-James/loggedin/issues',
		label: __( 'Report an Issue', 'loggedin' ),
	},
];

export default function SupportTab() {
	return (
		<Card>
			<CardBody>
				<h2>{ __( 'Need help?', 'loggedin' ) }</h2>
				<p>
					{ __(
						'Reach out through any of the channels below.',
						'loggedin'
					) }
				</p>
				<ul>
					{ links.map( ( link ) => (
						<li key={ link.href }>
							<a
								href={ link.href }
								target="_blank"
								rel="noopener noreferrer"
							>
								{ link.label }
							</a>
						</li>
					) ) }
				</ul>
			</CardBody>
		</Card>
	);
}
