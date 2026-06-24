/**
 * Single addon card with its license-key form.
 *
 * Activate / deactivate are dispatched through the addons data store
 * so the catalogue stays in sync after every change.
 *
 * @param {Object} props
 * @param {Object} props.addon   Catalogue entry (id, title, link, …).
 * @param {Object} props.license License row for this addon (key, status).
 */
import { useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Flex,
	FlexItem,
	TextControl,
} from '@wordpress/components';
import useAddons from '../../../hooks/use-addons';

const ACTIVATED = 'activated';

const AddonCard = ( { addon, license } ) => {
	const { manageLicense } = useAddons();

	const isActive = license.status === ACTIVATED;
	const [ inputKey, setInputKey ] = useState( license.key || '' );
	const [ pending, setPending ] = useState( null );

	const run = async ( action ) => {
		setPending( action );

		const ok = await manageLicense(
			addon.id,
			action,
			action === 'activate' ? inputKey : ''
		);

		if ( ok && action === 'deactivate' ) {
			setInputKey( '' );
		}

		setPending( null );
	};

	return (
		<Card className="loggedin-addon-card">
			<CardHeader>
				<strong>{ addon.title }</strong>
				{ addon.link && (
					<a
						href={ addon.link }
						target="_blank"
						rel="noopener noreferrer"
					>
						{ __( 'Learn more', 'loggedin' ) }
					</a>
				) }
			</CardHeader>

			<CardBody className="loggedin-addon-description">
				<TextControl
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					label={ __( 'License Key', 'loggedin' ) }
					value={ inputKey }
					disabled={ isActive }
					onChange={ setInputKey }
				/>

				{ isActive && (
					<p className="description">
						{ sprintf(
							// translators: %s addon name.
							__( '%s is active on this site.', 'loggedin' ),
							addon.title
						) }
					</p>
				) }
			</CardBody>

			<CardFooter>
				<Flex justify="flex-end">
					<FlexItem>
						{ isActive ? (
							<Button
								__next40pxDefaultSize
								variant="secondary"
								isDestructive
								isBusy={ pending === 'deactivate' }
								onClick={ () => run( 'deactivate' ) }
							>
								{ __( 'Deactivate', 'loggedin' ) }
							</Button>
						) : (
							<Button
								__next40pxDefaultSize
								variant="primary"
								isBusy={ pending === 'activate' }
								disabled={ ! inputKey }
								onClick={ () => run( 'activate' ) }
							>
								{ __( 'Activate', 'loggedin' ) }
							</Button>
						) }
					</FlexItem>
				</Flex>
			</CardFooter>
		</Card>
	);
};

export default AddonCard;
