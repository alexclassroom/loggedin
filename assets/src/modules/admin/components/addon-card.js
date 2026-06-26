/**
 * Single addon card.
 *
 * Card chrome comes from the `@wordpress/components` `Card`
 * primitives. The card has, in order:
 *
 *   1. An optional banner image (`CardMedia`). When the addon is
 *      installed + active we also paint an "Active" pill in the
 *      top-right corner of the banner.
 *   2. A header carrying the addon title (and the "Active" pill as
 *      a fallback when there's no banner to overlay it on).
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
	/*
	 * Purchase CTA — shown only when the addon isn't installed
	 * locally. Variant flips on `is_premium` so the paid items get
	 * the high-emphasis primary button while the free ones use the
	 * lower-key secondary button.
	 *
	 * Link priority: the catalogue's marketing URL (`link`) first,
	 * then the project homepage (`homepage`) as a fallback for
	 * rows that ship without a dedicated buy URL.
	 */
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
						<span className="loggedin-addon-status">
							{ __( 'Active', 'loggedin' ) }
						</span>
					) }
				</CardMedia>
			) }

			<CardHeader>
				<strong>{ addon.title }</strong>
				{ /*
				 * Right-side badge cluster. Premium/Free always
				 * shown; Licensed/Unlicensed only for installed
				 * addons. When there's no banner the "Active" pill
				 * falls back here too — otherwise it lives overlaid
				 * on the banner above.
				 */ }
				<span className="loggedin-addon-header-badges">
					{ ! addon.banner && addon.is_active && (
						<span className="loggedin-addon-status">
							{ __( 'Active', 'loggedin' ) }
						</span>
					) }
					<span
						className={ `loggedin-addon-badge loggedin-addon-badge--${
							addon.is_premium ? 'premium' : 'free'
						}` }
					>
						{ addon.is_premium
							? __( 'Premium', 'loggedin' )
							: __( 'Free', 'loggedin' ) }
					</span>
					{ addon.is_active && (
						<span
							className={ `loggedin-addon-badge loggedin-addon-badge--${
								addon.is_license_active
									? 'licensed'
									: 'unlicensed'
							}` }
						>
							{ addon.is_license_active
								? __( 'Licensed', 'loggedin' )
								: __( 'Unlicensed', 'loggedin' ) }
						</span>
					) }
				</span>
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
						{ /*
						 * Footer CTA — single slot, two states:
						 *   - Installed: license management button.
						 *     Label changes between "Activate" and
						 *     "Manage" depending on the stored
						 *     license state, but both open the
						 *     same modal.
						 *   - Not installed: the purchase CTA
						 *     declared above.
						 */ }
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
