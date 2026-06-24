<?php
/**
 * Settings REST endpoint.
 *
 * GET/POST `/loggedin/v1/settings` — read and update the unified
 * `loggedin_settings` option. Backs the React Settings screen.
 *
 * @package DuckDev\Loggedin\Api
 */

declare( strict_types = 1 );

namespace DuckDev\Loggedin\Api;

use DuckDev\Loggedin\Contracts\Singleton;
use DuckDev\Loggedin\Setup\Settings as Settings_Store;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

defined( 'WPINC' ) || die;

final class Settings extends Endpoint {

	use Singleton;

	protected function init(): void {
		$this->hook();
	}

	public function register_routes(): void {
		register_rest_route(
			$this->namespace,
			'/settings',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_settings' ),
					'permission_callback' => array( $this, 'permission_check' ),
				),
				array(
					'methods'             => WP_REST_Server::EDITABLE,
					'callback'            => array( $this, 'update_settings' ),
					'permission_callback' => array( $this, 'permission_check' ),
					'args'                => array(
						'maximum' => array(
							'type'    => 'integer',
							'minimum' => 1,
						),
						'logic'   => array(
							'type' => 'string',
							'enum' => array( 'allow', 'logout_oldest', 'block' ),
						),
					),
				),
			)
		);
	}

	public function get_settings( WP_REST_Request $request ): WP_REST_Response {
		unset( $request );

		return new WP_REST_Response( Settings_Store::instance()->all(), 200 );
	}

	public function update_settings( WP_REST_Request $request ): WP_REST_Response {
		$store   = Settings_Store::instance();
		$current = $store->all();

		$payload = array(
			'maximum' => $request->offsetExists( 'maximum' ) ? (int) $request->get_param( 'maximum' ) : $current['maximum'],
			'logic'   => $request->offsetExists( 'logic' ) ? (string) $request->get_param( 'logic' ) : $current['logic'],
		);

		$store->update( $payload );

		return new WP_REST_Response( $store->all(), 200 );
	}
}
