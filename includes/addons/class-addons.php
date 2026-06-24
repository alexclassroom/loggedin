<?php
/**
 * Addons module — Freemius wiring.
 *
 * This module is the bridge between the plugin and the
 * `duckdev/freemius-plugin-licensing` SDK. It is responsible for:
 *
 *   - Building Freemius instances for the parent plugin and each
 *     registered addon (lazily — see {@see maybe_init_freemius()}).
 *   - Surfacing the addon catalogue and per-addon license status to
 *     the REST controller that backs the React Addons tab.
 *
 * The actual REST routes live in {@see \DuckDev\Loggedin\Api\Addons};
 * this class just owns the SDK state.
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
	 * Cache of Freemius SDK instances keyed by plugin / addon id.
	 *
	 * @var Freemius[]
	 */
	protected array $freemius = array();

	/**
	 * Register hooks.
	 *
	 * The eager init runs on `admin_init` so the SDK can attach its
	 * own admin-side wiring (notices, settings links). REST requests
	 * (which don't fire `admin_init`) go through the lazy path in
	 * {@see maybe_init_freemius()} instead.
	 *
	 * @since 3.0.0
	 */
	protected function init(): void {
		add_action( 'admin_init', array( $this, 'init_freemius' ) );
	}

	/**
	 * Return the Freemius instance for a given addon id.
	 *
	 * Used by `Api\Addons::manage_license()` to look up the SDK
	 * handle for the addon the request is targeting.
	 *
	 * @since 3.0.0
	 *
	 * @param int $id Addon Freemius id.
	 *
	 * @return Freemius|null
	 */
	public function freemius_for( int $id ): ?Freemius {
		$this->maybe_init_freemius();

		return $this->freemius[ $id ] ?? null;
	}

	/**
	 * Return the addon catalogue from the Freemius API.
	 *
	 * The SDK caches the result for one day by default. Passing
	 * `$force = true` bypasses both the SDK's cache and any HTTP
	 * cache layered above it.
	 *
	 * @since 3.0.0
	 *
	 * @param bool $force Force-refresh the cached catalogue.
	 *
	 * @return array
	 */
	public function get_addons( bool $force = false ): array {
		$this->maybe_init_freemius();

		if ( ! isset( $this->freemius[ Plugin::FREEMIUS_ID ] ) ) {
			return array();
		}

		return $this->freemius[ Plugin::FREEMIUS_ID ]->addon()->get_addons( $force );
	}

	/**
	 * Map of license rows keyed by addon id.
	 *
	 * Shape:
	 *   [
	 *     <addon_id> => [
	 *       'key'    => string,   // raw license key (may be empty)
	 *       'status' => string,   // Activation::STATUS_* constant
	 *       'plugin' => array,    // Freemius plugin metadata
	 *     ],
	 *     ...
	 *   ]
	 *
	 * Returned alongside the catalogue from the addons REST endpoint
	 * so the React UI can render each card's activate/deactivate UI
	 * without a second round trip.
	 *
	 * @since 3.0.0
	 *
	 * @return array<int, array{key: string, status: string, plugin: array}>
	 */
	public function get_license_items(): array {
		$this->maybe_init_freemius();

		$items  = array();
		$addons = $this->get_registered_addons();

		foreach ( $addons as $id => $args ) {
			if ( ! isset( $this->freemius[ $id ] ) ) {
				continue;
			}

			$activation = $this->freemius[ $id ]->license()->get_activation();

			$items[ $id ] = array(
				'key'    => $activation->license_key(),
				'status' => $activation->status(),
				'plugin' => $this->freemius[ $id ]->plugin()->get_data(),
			);
		}

		return $items;
	}

	/**
	 * Lazily build the Freemius instances on first need.
	 *
	 * The `admin_init` path covers wp-admin requests; this method
	 * covers REST + CLI + anywhere else the catalogue is queried.
	 * Both paths share the same cache, so a request that hits both
	 * (rare but possible) only builds the instances once.
	 *
	 * @since 3.0.0
	 *
	 * @return void
	 */
	protected function maybe_init_freemius(): void {
		if ( isset( $this->freemius[ Plugin::FREEMIUS_ID ] ) ) {
			return;
		}

		$this->init_freemius();
	}

	/**
	 * Build Freemius instances for the parent plugin + every addon.
	 *
	 * @since 3.0.0
	 *
	 * @return void
	 */
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

	/**
	 * List of addons registered by other plugins.
	 *
	 * @since 3.0.0
	 *
	 * @return array<int, array> Addons keyed by Freemius id.
	 */
	protected function get_registered_addons(): array {
		/**
		 * Filter the list of registered addons.
		 *
		 * Addon plugins should hook here and append themselves so
		 * the parent plugin can build a Freemius instance for them.
		 *
		 * @since 2.0.0
		 *
		 * @param array $addons Addons keyed by Freemius id.
		 */
		return apply_filters( 'loggedin_register_addon', array() );
	}
}
