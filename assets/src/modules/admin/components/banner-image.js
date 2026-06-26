/**
 * Addon banner image with a load-state spinner.
 *
 * Banner assets come from Freemius and can be slow on flaky
 * connections, so we keep the card layout stable with a fixed
 * aspect-ratio container (see SCSS) and overlay a `<Spinner />`
 * until the browser fires `load` (or `error`).
 *
 * The banner sits in a fixed ~3:1 card slot. `src` is the smaller
 * `card_banner_url` returned by Freemius; `srcLarge` is the higher-
 * resolution `banner_url` — when both are present we feed them to
 * the browser as a 1x/2x density `srcset` so the banner stays crisp
 * on high-DPI screens without doubling the bytes on regular ones.
 *
 * @param {Object} props
 * @param {string} props.src        Standard-resolution image URL.
 * @param {string} [props.srcLarge] High-resolution image URL.
 * @param {string} props.alt        Alternative text (usually the addon title).
 */
import { useState } from '@wordpress/element';
import { Spinner } from '@wordpress/components';

const BannerImage = ( { src, srcLarge, alt } ) => {
	const [ isLoaded, setIsLoaded ] = useState( false );

	const srcSet =
		srcLarge && srcLarge !== src
			? `${ src } 1x, ${ srcLarge } 2x`
			: undefined;

	return (
		<>
			{ ! isLoaded && (
				<span
					className="loggedin-addon-banner__spinner"
					aria-hidden="true"
				>
					<Spinner />
				</span>
			) }
			<img
				src={ src }
				srcSet={ srcSet }
				alt={ alt }
				loading="lazy"
				className="loggedin-addon-banner__img"
				onLoad={ () => setIsLoaded( true ) }
				onError={ () => setIsLoaded( true ) }
			/>
		</>
	);
};

export default BannerImage;
