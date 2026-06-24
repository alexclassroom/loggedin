/**
 * Single addon card.
 *
 * Card chrome comes from the `@wordpress/components` `Card`
 * primitives. The body is the flex-grower so the footer stays a
 * fixed height regardless of description length.
 *
 * License management lives in a sibling modal — clicking "Manage
 * license" fires the parent's `onManageLicense(addon)` callback so
 * the modal can be hoisted to the tab root (keeps focus management
 * + ARIA announcements clean).
 *
 * @param {Object}   props
 * @param {Object}   props.addon            Decorated addon row from REST.
 * @param {Function} props.onManageLicense  `(addon) => void`.
 */
import { __ } from '@wordpress/i18n';
import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Flex,
	FlexItem,
} from '@wordpress/components';

const AddonCard = ( { addon, onManageLicense } ) => {
	// Purchase CTA — shown when the addon isn't installed locally.
	const purchaseCta = (
		<Button
			__next40pxDefaultSize
			variant={ addon.is_premium ? 'primary' : 'secondary' }
			href={ addon.link || addon.homepage || undefined }
			target="_blank"
			rel="noopener noreferrer"
		>
			{ addon.is_premium
				? __( 'Buy Now', 'loggedin' )
				: __( 'Get it', 'loggedin' ) }
		</Button>
	);

	return (
		<Card className="loggedin-addon-card" isRounded size="small">
			<CardHeader>
				<strong>{ addon.title }</strong>
				{ addon.is_active && (
					<span className="loggedin-addon-status">
						{ __( 'Active', 'loggedin' ) }
					</span>
				) }
			</CardHeader>

			<CardBody className="loggedin-addon-description">
				{ addon.description && <p>{ addon.description }</p> }
			</CardBody>

			<CardFooter>
				<Flex justify="space-between" align="center">
					<FlexItem>
						{ addon.homepage && (
							<a
								href={ addon.homepage }
								target="_blank"
								rel="noopener noreferrer"
							>
								{ __( 'Learn more', 'loggedin' ) }
							</a>
						) }
					</FlexItem>
					<FlexItem>
						{ addon.is_active ? (
							<Button
								__next40pxDefaultSize
								variant="secondary"
								onClick={ () => onManageLicense( addon ) }
							>
								{ addon.is_license_active
									? __(
											'Manage license',
											'loggedin'
									  )
									: __(
											'Activate license',
											'loggedin'
									  ) }
							</Button>
						) : (
							purchaseCta
						) }
					</FlexItem>
				</Flex>
			</CardFooter>
		</Card>
	);
};

export default AddonCard;
