<?php
/**
 * The compatibility class for loggedin.
 *
 * @link       https://duckdev.com/products/loggedin-limit-active-logins/
 * @license    http://www.gnu.org/licenses/ GNU General Public License
 * @package    Loggedin
 * @subpackage Compatibility
 * @author     Joel James <me@joelsays.com>
 */

namespace DuckDev\Loggedin;

// If this file is called directly, abort.
defined( 'WPINC' ) || die;

/**
 * Class Core.
 *
 * @since 1.0.0
 */
class Compatibility {

	/**
	 * Initialize the class and set its properties.
	 *
	 * We register all our common hooks here.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function __construct() {
		// Show Woo notice.
		add_action( 'loggedin_destroy_oldest_session', array( $this, 'show_woocommerce_notice' ) );
		add_action( 'loggedin_destroy_all_sessions', array( $this, 'show_woocommerce_notice' ) );
	}

	/**
	 * Show a notice on the Woo dashboard if old sessions were cleared.
	 *
	 * @since 2.0.0
	 *
	 * @param int $user_id User ID.
	 *
	 * @return void
	 */
	public function show_woocommerce_notice( int $user_id ) {
		// Get current logic.
		$logic = get_option( 'loggedin_logic', 'allow' );
		// Set customer cookie.
		WC()->session->set_customer_session_cookie( true );
		// Show notices.
		if ( 'allow' === $logic ) {
			$notice = __( 'Maximum active login sessions have been exceeded. All your previous login sessions have been terminated.', 'loggedin' );
		} else {
			$notice = __( 'Maximum active login sessions have been exceeded. Your oldest session has been terminated.', 'loggedin' );
		}
		// Add notice.
		wc_add_notice( $notice, 'notice' );
	}
}
