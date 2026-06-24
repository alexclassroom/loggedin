<?php
/**
 * Plugin upgrader.
 *
 * Handles version bumps and one-shot data migrations between versions.
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

	protected function init(): void {
		add_action( 'plugins_loaded', array( $this, 'maybe_upgrade' ), 5 );
	}

	public function maybe_upgrade(): void {
		$stored = (string) get_option( Plugin::VERSION_KEY, '' );

		if ( $stored === Plugin::VERSION ) {
			return;
		}

		// First upgrade run: migrate legacy single-key options into the
		// new structured `loggedin_settings` option.
		$this->migrate_legacy_options();

		update_option( Plugin::VERSION_KEY, Plugin::VERSION );
	}

	/**
	 * Move `loggedin_maximum` and `loggedin_logic` into `loggedin_settings`.
	 *
	 * Only runs if the new option has not yet been written, so user-set
	 * values in the new option are never overwritten.
	 */
	protected function migrate_legacy_options(): void {
		$existing = get_option( Plugin::OPTION_KEY, null );
		if ( is_array( $existing ) && ! empty( $existing ) ) {
			return;
		}

		$legacy_max   = get_option( 'loggedin_maximum', null );
		$legacy_logic = get_option( 'loggedin_logic', null );

		if ( null === $legacy_max && null === $legacy_logic ) {
			return;
		}

		$settings = Settings::instance()->defaults();

		if ( null !== $legacy_max ) {
			$settings['maximum'] = max( 1, (int) $legacy_max );
		}

		if ( null !== $legacy_logic && in_array( $legacy_logic, array( 'allow', 'logout_oldest', 'block' ), true ) ) {
			$settings['logic'] = (string) $legacy_logic;
		}

		update_option( Plugin::OPTION_KEY, $settings );
	}
}
