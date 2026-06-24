<?php
/**
 * Addons REST controller.
 *
 * Two routes:
 *
 *   GET  /loggedin/v1/addons              List catalogue + license map.
 *   POST /loggedin/v1/addons/license      Activate / deactivate a license.
 *
 * Both are backed by {@see \DuckDev\Loggedin\Addons\Addons}. The
 * controller is a thin transport layer — request validation here,
 * everything else delegated to the Addons module.
 *
 * @package DuckDev\Loggedin\Api
 */

declare( strict_types = 1 );

namespace DuckDev\Loggedin\Api;

use DuckDev\Loggedin\Addons\Addons as Addons_Module;
use DuckDev\Loggedin\Contracts\Singleton;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

defined( 'WPINC' ) || die;

final class Addons extends Endpoint {

	use Singleton;

	/**
	 * Register hooks.
	 *
	 * @since 3.0.0
	 */
	protected function init(): void {
		$this->hook();
	}

	/**
	 * Register the two `/addons` routes.
	 *
	 * @since 3.0.0
	 *
	 * @return void
	 */
	public function register_routes(): void {
		register_rest_route(
			$this->namespace,
			'/addons',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'list_addons' ),
				'permission_callback' => array( $this, 'permission_check' ),
				'args'                => array(
					'force' => array(
						'type'    => 'boolean',
						'default' => false,
					),
				),
			)
		);

		register_rest_route(
			$this->namespace,
			'/addons/license',
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'manage_license' ),
				'permission_callback' => array( $this, 'permission_check' ),
				'args'                => array(
					'id'     => array(
						'type'     => 'integer',
						'required' => true,
					),
					'action' => array(
						'type'     => 'string',
						'enum'     => array( 'activate', 'deactivate' ),
						'required' => true,
					),
					'key'    => array(
						'type'    => 'string',
						'default' => '',
					),
				),
			)
		);
	}

	/**
	 * GET handler — catalogue + license map.
	 *
	 * The `force` query parameter bypasses the SDK's day-long cache
	 * and bumps to a live API hit. Used by the React refresh button.
	 *
	 * @since 3.0.0
	 *
	 * @param WP_REST_Request $request Incoming request.
	 *
	 * @return WP_REST_Response
	 */
	public function list_addons( WP_REST_Request $request ): WP_REST_Response {
		$addons = Addons_Module::instance();
		$force  = (bool) $request->get_param( 'force' );

		return new WP_REST_Response(
			array(
				'addons'   => $addons->get_addons( $force ),
				'licenses' => $addons->get_license_items(),
			),
			200
		);
	}

	/**
	 * POST handler — activate / deactivate an addon license.
	 *
	 * Returns the refreshed license map on success so the React UI
	 * can re-render in one round trip; returns a 4xx `WP_Error` on
	 * any failure (missing key on activate, unknown addon id, SDK
	 * rejection).
	 *
	 * @since 3.0.0
	 *
	 * @param WP_REST_Request $request Incoming request.
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function manage_license( WP_REST_Request $request ) {
		$id     = (int) $request->get_param( 'id' );
		$action = (string) $request->get_param( 'action' );
		$key    = sanitize_text_field( (string) $request->get_param( 'key' ) );

		if ( 'activate' === $action && '' === $key ) {
			return new WP_Error(
				'missing_license_key',
				__( 'License key is required to activate.', 'loggedin' ),
				array( 'status' => 400 )
			);
		}

		$addons   = Addons_Module::instance();
		$freemius = $addons->freemius_for( $id );

		if ( null === $freemius ) {
			return new WP_Error(
				'addon_not_initialized',
				__( 'Addon not initialized.', 'loggedin' ),
				array( 'status' => 404 )
			);
		}

		$response = 'activate' === $action
			? $freemius->license()->activate( $key )
			: $freemius->license()->deactivate();

		if ( is_wp_error( $response ) ) {
			// Surface the SDK's error code / message verbatim and
			// annotate with a 4xx status so the JS layer can branch
			// on the response.
			$response->add_data( array( 'status' => 400 ) );

			return $response;
		}

		return new WP_REST_Response(
			array(
				'success'  => true,
				'licenses' => $addons->get_license_items(),
			),
			200
		);
	}
}
