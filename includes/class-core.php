<?php
/**
 * Plugin bootstrap.
 *
 * Wires up the plugin in phased order so each module's dependencies are
 * in place before its hooks fire.
 *
 * @package DuckDev\Loggedin
 */

declare( strict_types = 1 );

namespace DuckDev\Loggedin;

use DuckDev\Loggedin\Addons\Addons;
use DuckDev\Loggedin\Admin\Admin;
use DuckDev\Loggedin\Contracts\Singleton;
use DuckDev\Loggedin\Front\Session_Guard;
use DuckDev\Loggedin\Setup\Settings;
use DuckDev\Loggedin\Setup\Upgrader;

defined( 'WPINC' ) || die;

final class Core {

	use Singleton;

	protected function init(): void {
		$this->common();
		$this->front();
		$this->admin();
		$this->addons();

		/**
		 * Fires after the plugin has finished booting all modules.
		 *
		 * Addons should hook here to register themselves.
		 *
		 * @since 1.3.1
		 */
		do_action( 'loggedin_init', $this );
	}

	private function common(): void {
		Settings::instance();
		Upgrader::instance();
	}

	private function front(): void {
		Session_Guard::instance();
	}

	private function admin(): void {
		if ( is_admin() ) {
			Admin::instance();
		}
	}

	private function addons(): void {
		if ( is_admin() ) {
			Addons::instance();
		}
	}
}
