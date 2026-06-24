<?php
/**
 * Main plugin header.
 *
 * @package LoggedIn
 *
 * Plugin Name:         Loggedin - Limit Concurrent Sessions
 * Plugin URI:          https://duckdev.com/products/loggedin-limit-active-logins/
 * Description:         Limit an account to a specific number of simultaneous logins across all devices.
 * Version:             2.0.4
 * Author:              Joel James
 * Author URI:          https://duckdev.com/
 * Donate link:         https://paypal.me/JoelCJ
 * License:             GPL-2.0+
 * License URI:         http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:         loggedin
 * Domain Path:         /languages
 * Requires PHP:        7.4
 * Requires at least:   5.0
 */

namespace DuckDev\Loggedin;

defined( 'WPINC' ) || die;

define( 'LOGGEDIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'LOGGEDIN_FILE', __FILE__ );

if ( ! function_exists( __NAMESPACE__ . '\\init' ) ) {
	/**
	 * Bootstrap the plugin.
	 */
	function init(): void {
		load_plugin_textdomain( 'loggedin', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );

		require __DIR__ . '/vendor/autoload.php';

		Core::instance();
	}
}

add_action( 'plugins_loaded', __NAMESPACE__ . '\\init' );
