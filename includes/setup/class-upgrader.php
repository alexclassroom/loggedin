<?php
/**
 * Plugin upgrader.
 *
 * Runs once per version bump on the next request after an update,
 * performing any data migrations needed to keep stored state in sync
 * with the current schema. Today there's one migration — the move
 * from the pre-3.0 single-key options to the unified
 * `loggedin_settings` array — but new versions can append their own
 * branches inside `maybe_upgrade()` without touching anything else.
 *
 * The version stamp lives in its own option (`loggedin_version`) so
 * we don't have to dig through the main settings array to detect a
 * version change.
 *
 * @package DuckDev\Loggedin\Setup
 */

declare( strict_types = 1 );

namespace DuckDev\Loggedin\Setup;

use DuckDev\Loggedin\Contracts\Singleton;
use DuckDev\Loggedin\Plugin;

defined( 'WPINC' ) || die;

final class Upgrader {

	use Singleton;

	/**
	 * Register hooks.
	 *
	 * Priority 5 puts us ahead of any other code hooked into
	 * `plugins_loaded` at the default priority — by the time
	 * downstream modules run their `init()`, the new schema is
	 * guaranteed to be in place.
	 *
	 * @since 3.0.0
	 */
	protected function init(): void {
		add_action( 'plugins_loaded', array( $this, 'maybe_upgrade' ), 5 );
	}

	/**
	 * Run any pending migrations and stamp the new version.
	 *
	 * Short-circuits when the stored version already matches the
	 * running version, so steady-state requests pay nothing beyond a
	 * single `get_option()` call.
	 *
	 * @since 3.0.0
	 *
	 * @return void
	 */
	public function maybe_upgrade(): void {
		$stored = (string) get_option( Plugin::VERSION_KEY, '' );

		if ( $stored === Plugin::VERSION ) {
			return;
		}

		// On a *first* upgrade to the unified-settings schema, pull
		// the legacy single-key values into the new option.
		$this->migrate_legacy_options();

		update_option( Plugin::VERSION_KEY, Plugin::VERSION );
	}

	/**
	 * Migrate `loggedin_maximum` + `loggedin_logic` → `loggedin_settings`.
	 *
	 * Only runs when the new option has not yet been written —
	 * otherwise a user who has already saved settings on the new
	 * schema (perhaps from a hotfix release) would have their values
	 * silently overwritten by stale legacy keys.
	 *
	 * The legacy keys are intentionally NOT deleted here: an addon
	 * may still read them. The uninstall handler removes them when
	 * the user actually deletes the plugin.
	 *
	 * @since 3.0.0
	 *
	 * @return void
	 */
	protected function migrate_legacy_options(): void {
		$existing = get_option( Plugin::OPTION_KEY, null );
		if ( is_array( $existing ) && ! empty( $existing ) ) {
			return;
		}

		$legacy_max   = get_option( 'loggedin_maximum', null );
		$legacy_logic = get_option( 'loggedin_logic', null );

		// Nothing to migrate — fresh install or an upgrade from
		// a version that never wrote either legacy key.
		if ( null === $legacy_max && null === $legacy_logic ) {
			return;
		}

		$settings = Settings::instance()->defaults();

		if ( null !== $legacy_max ) {
			$settings['maximum'] = max( 1, (int) $legacy_max );
		}

		if (
			null !== $legacy_logic &&
			in_array( $legacy_logic, array( 'allow', 'logout_oldest', 'block' ), true )
		) {
			$settings['logic'] = (string) $legacy_logic;
		}

		update_option( Plugin::OPTION_KEY, $settings );
	}
}
