/**
 * Single addon card.
 *
 * Card chrome comes from the `@wordpress/components` `Card`
 * primitives. The card has, in order:
 *
 *   1. An optional banner image (`CardMedia`). When the addon is
 *      installed + active we also paint an "Active" pill in the
 *      top-right corner of the banner.
 *   2. A header carrying the addon title.
 *   3. A description body — this is the flex grower so the footer
 *      stays at a fixed height regardless of description length.
 *   4. A footer carrying the primary CTA (Manage license / Get it /
 *      Buy now) and a "Learn more" link.
 *
 * License management lives in a sibling modal — clicking
 * "Manage license" fires `onManageLicense(addon)` so the modal can
 * be hoisted to the tab root (keeps focus management + ARIA
 * announcements clean).
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
	CardMedia,
	Flex,
	FlexItem,
} from '@wordpress/components';
import BannerImage from './banner-image';

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
			{ addon.banner && (
				<CardMedia className="loggedin-addon-banner">
					<BannerImage
						src={ addon.banner }
						srcLarge={ addon.banner_large }
						alt={ addon.title }
					/>
					{ addon.is_active && (
						<span
							className="loggedin-addon-status"
							aria-label={ __( 'Active', 'loggedin' ) }
						>
							{ __( 'Active', 'loggedin' ) }
						</span>
					) }
				</CardMedia>
			) }

			<CardHeader>
				<strong>{ addon.title }</strong>
				{ /*
				 * When there is no banner, the "Active" pill has
				 * nowhere to live, so we fall back to surfacing it
				 * in the header instead.
				 */ }
				{ ! addon.banner && addon.is_active && (
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
