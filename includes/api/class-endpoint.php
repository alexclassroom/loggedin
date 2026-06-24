<?php
/**
 * Base REST endpoint.
 *
 * Shared scaffolding for the plugin's REST controllers: namespace
 * constant, permission helper, and a `register_routes()` contract.
 *
 * @package DuckDev\Loggedin\Api
 */

declare( strict_types = 1 );

namespace DuckDev\Loggedin\Api;

use DuckDev\Loggedin\Plugin;
use WP_REST_Request;

defined( 'WPINC' ) || die;

abstract class Endpoint {

	/**
	 * REST namespace shared by all plugin endpoints.
	 */
	protected string $namespace = Plugin::REST_NAMESPACE;

	/**
	 * Wire up `rest_api_init` once per subclass.
	 */
	public function hook(): void {
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	/**
	 * Subclasses register their REST routes here.
	 */
	abstract public function register_routes(): void;

	/**
	 * Default permission callback — `manage_options`.
	 *
	 * @param WP_REST_Request $request Unused.
	 */
	public function permission_check( WP_REST_Request $request ): bool {
		unset( $request );

		return current_user_can( 'manage_options' );
	}
}
