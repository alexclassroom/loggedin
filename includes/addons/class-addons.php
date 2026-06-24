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
	}

	/**
	 * Get the Freemius instance for an addon, or null when not initialized.
	 */
	public function freemius_for( int $id ): ?Freemius {
		$this->maybe_init_freemius();

		return $this->freemius[ $id ] ?? null;
	}

	public function get_addons( bool $force = false ): array {
		$this->maybe_init_freemius();

		if ( ! isset( $this->freemius[ Plugin::FREEMIUS_ID ] ) ) {
			return array();
		}

		return $this->freemius[ Plugin::FREEMIUS_ID ]->addon()->get_addons( $force );
	}

	public function get_license_items(): array {
		$this->maybe_init_freemius();

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

	/**
	 * Lazily build the Freemius instances on first need.
	 *
	 * `admin_init` still triggers the eager path on admin requests; REST
	 * requests (which don't fire admin_init) come through this fallback.
	 */
	protected function maybe_init_freemius(): void {
		if ( isset( $this->freemius[ Plugin::FREEMIUS_ID ] ) ) {
			return;
		}

		$this->init_freemius();
	}

	public function init_freemius(): void {
		if ( isset( $this->freemius[ Plugin::FREEMIUS_ID ] ) ) {
			return;
		}

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
