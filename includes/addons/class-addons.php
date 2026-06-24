<?php
/**
 * Addons module — Freemius wiring + license management.
 *
 * @package DuckDev\Loggedin\Addons
 */

declare( strict_types = 1 );

namespace DuckDev\Loggedin\Addons;

use DuckDev\Freemius\Freemius;
use DuckDev\Loggedin\Contracts\Singleton;
use DuckDev\Loggedin\Plugin;

defined( 'WPINC' ) || die;

final class Addons {

	use Singleton;

	/**
	 * Freemius instances keyed by addon id.
	 *
	 * @var Freemius[]
	 */
	protected array $freemius = array();

	protected function init(): void {
		add_action( 'admin_init', array( $this, 'init_freemius' ) );
		add_action( 'admin_init', array( $this, 'process_license' ) );
		add_action( 'admin_init', array( $this, 'process_addons_refresh' ) );
		add_filter( 'loggedin_admin_page_vars', array( $this, 'admin_page_vars' ) );
	}

	public function get_addons( bool $force = false ): array {
		if ( ! isset( $this->freemius[ Plugin::FREEMIUS_ID ] ) ) {
			return array();
		}

		return $this->freemius[ Plugin::FREEMIUS_ID ]->addon()->get_addons( $force );
	}

	public function get_license_items(): array {
		$items  = array();
		$addons = $this->get_registered_addons();

		foreach ( $addons as $id => $args ) {
			if ( isset( $this->freemius[ $id ] ) ) {
				$activation   = $this->freemius[ $id ]->license()->get_activation();
				$items[ $id ] = array(
					'key'    => $activation->license_key(),
					'status' => $activation->status(),
					'plugin' => $this->freemius[ $id ]->plugin()->get_data(),
				);
			}
		}

		return $items;
	}

	public function admin_page_vars( array $vars ): array {
		$addons = $this->get_addons();

		if ( empty( $addons ) ) {
			unset( $vars['tab_items']['addons'] );
			$vars['current_tab'] = 'settings';
		}

		$vars['addons']            = $addons;
		$vars['license_items']     = $this->get_license_items();
		$vars['registered_addons'] = $this->get_registered_addons();

		return $vars;
	}

	public function process_license(): void {
		// phpcs:ignore WordPress.Security.NonceVerification.Missing
		$data = wp_unslash( $_POST['loggedin_licenses'] ?? '' );

		if ( ! isset( $data['nonce'], $data['action'], $data['key'], $data['id'] ) ) {
			return;
		}

		if ( ! wp_verify_nonce( $data['nonce'], 'loggedin_licenses[nonce]' ) ) {
			add_settings_error( 'loggedin_licenses', 'nonce_check_failed', __( 'Nonce check failed.', 'loggedin' ) );

			return;
		}

		if ( ! current_user_can( 'manage_options' ) ) {
			add_settings_error( 'loggedin_licenses', 'permission_check_failed', __( 'You do not have the permission to do this.', 'loggedin' ) );

			return;
		}

		$id     = (int) $data['id'];
		$key    = sanitize_text_field( $data['key'] );
		$action = 'activate' === $data['action'] ? 'activate' : 'deactivate';

		if ( ! isset( $this->freemius[ $id ] ) ) {
			add_settings_error( 'loggedin_licenses', 'addon_not_initialized', __( 'Addon not initialized.', 'loggedin' ) );

			return;
		}

		$response = 'activate' === $action
			? $this->freemius[ $id ]->license()->activate( $key )
			: $this->freemius[ $id ]->license()->deactivate();

		if ( is_wp_error( $response ) ) {
			add_settings_error( 'loggedin_licenses', $response->get_error_code(), $response->get_error_message() );
		} else {
			add_settings_error(
				'loggedin_licenses',
				$action,
				'activate' === $action
					? __( 'Your license key has been activated successfully.', 'loggedin' )
					: __( 'Your license key has been deactivated.', 'loggedin' ),
				'updated'
			);
		}
	}

	public function process_addons_refresh(): void {
		if ( ! isset( $_REQUEST['_wpnonce'], $_REQUEST['loggedin-addons-refresh'] ) ) {
			return;
		}

		if ( ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_REQUEST['_wpnonce'] ) ), 'loggedin-addons-refresh' ) ) {
			return;
		}

		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		$this->get_addons( true );
	}

	public function init_freemius(): void {
		$this->freemius[ Plugin::FREEMIUS_ID ] = Freemius::get_instance(
			Plugin::FREEMIUS_ID,
			array(
				'slug'       => Plugin::SLUG,
				'is_premium' => false,
				'main_file'  => Plugin::file(),
				'public_key' => 'pk_4c8df806d035c90805a97eae5fba5',
				'has_addons' => true,
			)
		);

		foreach ( $this->get_registered_addons() as $id => $args ) {
			$this->freemius[ $id ] = Freemius::get_instance( $id, $args );
		}
	}

	protected function get_registered_addons(): array {
		/**
		 * Filter the list of registered addons.
		 *
		 * Addon plugins should hook into this to register themselves.
		 *
		 * @since 2.0.0
		 *
		 * @param array $addons Addon list keyed by Freemius id.
		 */
		return apply_filters( 'loggedin_register_addon', array() );
	}
}
