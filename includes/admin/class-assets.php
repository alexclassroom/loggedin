<?php
/**
 * Admin asset enqueue.
 *
 * Loads the React admin bundle on the plugin's settings screen,
 * reading the dependency manifest produced by `wp-scripts build`.
 *
 * @package DuckDev\Loggedin\Admin
 */

declare( strict_types = 1 );

namespace DuckDev\Loggedin\Admin;

use DuckDev\Loggedin\Contracts\Singleton;
use DuckDev\Loggedin\Plugin;
use DuckDev\Loggedin\Setup\Settings;

defined( 'WPINC' ) || die;

final class Assets {

	use Singleton;

	private const ENTRY  = 'admin';
	private const HANDLE = 'loggedin-admin';

	/**
	 * The screen hook for the plugin's admin page.
	 */
	private const SCREEN = 'users_page_loggedin';

	protected function init(): void {
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue' ) );
	}

	public function enqueue( string $hook ): void {
		if ( self::SCREEN !== $hook ) {
			return;
		}

		$build_dir = Plugin::dir() . 'build/';
		$build_url = Plugin::url() . 'build/';
		$asset     = $this->manifest( $build_dir . self::ENTRY . '.asset.php' );

		wp_enqueue_script(
			self::HANDLE,
			$build_url . self::ENTRY . '.js',
			$asset['dependencies'],
			$asset['version'],
			true
		);

		wp_set_script_translations( self::HANDLE, Plugin::TEXT_DOMAIN, Plugin::dir() . 'languages' );

		wp_localize_script( self::HANDLE, 'loggedin', $this->script_vars() );

		$css_path = $build_dir . self::ENTRY . '.css';
		if ( is_readable( $css_path ) ) {
			wp_enqueue_style(
				self::HANDLE,
				$build_url . self::ENTRY . '.css',
				array( 'wp-components' ),
				$asset['version']
			);
		}
	}

	/**
	 * Read a build/*.asset.php manifest with a safe fallback.
	 */
	private function manifest( string $path ): array {
		if ( is_readable( $path ) ) {
			$manifest = include $path;

			if ( is_array( $manifest ) ) {
				return array(
					'dependencies' => $manifest['dependencies'] ?? array(),
					'version'      => $manifest['version'] ?? Plugin::VERSION,
				);
			}
		}

		return array(
			'dependencies' => array( 'wp-element', 'wp-components', 'wp-i18n', 'wp-api-fetch', 'wp-dom-ready' ),
			'version'      => Plugin::VERSION,
		);
	}

	private function script_vars(): array {
		$settings = Settings::instance();

		$logics = array();
		foreach ( $this->logics_catalogue() as $key => $meta ) {
			$logics[ $key ] = array(
				'label' => (string) $meta['label'],
				'desc'  => (string) $meta['desc'],
			);
		}

		$vars = array(
			'restRoot'  => esc_url_raw( rest_url( Plugin::REST_NAMESPACE . '/' ) ),
			'restNonce' => wp_create_nonce( 'wp_rest' ),
			'version'   => Plugin::VERSION,
			'logics'    => $logics,
			'hasAddons' => true,
		);

		/**
		 * Filter the localised script vars for the admin app.
		 *
		 * @since 3.0.0
		 *
		 * @param array $vars Vars.
		 */
		return (array) apply_filters( 'loggedin_admin_script_vars', $vars );
	}

	private function logics_catalogue(): array {
		$logics = array(
			'logout_oldest' => array(
				'label' => __( 'Logout Oldest', 'loggedin' ),
				'desc'  => __( 'When the concurrent login limit is reached, a new login will automatically end the single oldest active session. This feature works only with user meta session storage.', 'loggedin' ),
			),
			'allow'         => array(
				'label' => __( 'Logout All', 'loggedin' ),
				'desc'  => __( 'When the concurrent login limit is reached, a new login will automatically terminate all previously active sessions.', 'loggedin' ),
			),
			'block'         => array(
				'label' => __( 'Block New', 'loggedin' ),
				'desc'  => __( 'If the concurrent login limit is reached, do not allow new logins. Users must then wait for existing login sessions to expire.', 'loggedin' ),
			),
		);

		/**
		 * Filter the list of available login logics.
		 *
		 * @since 2.0.0
		 *
		 * @param array $logics Logics.
		 */
		return apply_filters( 'loggedin_logics', $logics );
	}
}
