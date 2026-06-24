<?php
/**
 * Admin module.
 *
 * Wires up the admin menu, the (legacy) settings screen, the force-logout
 * action, and the review-request notice. Settings reads/writes go through
 * {@see \DuckDev\Loggedin\Setup\Settings}.
 *
 * @package DuckDev\Loggedin\Admin
 */

declare( strict_types = 1 );

namespace DuckDev\Loggedin\Admin;

use DuckDev\Loggedin\Contracts\Singleton;
use DuckDev\Loggedin\Plugin;
use DuckDev\Loggedin\Setup\Settings;
use DuckDev\Loggedin\View;
use WP_Session_Tokens;

defined( 'WPINC' ) || die;

final class Admin {

	use Singleton;

	protected function init(): void {
		add_action( 'admin_menu', array( $this, 'register_menu' ) );
		add_action( 'admin_init', array( $this, 'old_options_page' ) );
		add_action( 'admin_init', array( $this, 'force_logout' ) );
		add_action( 'admin_notices', array( $this, 'review_notice' ) );
		add_action( 'admin_init', array( $this, 'review_action' ) );
	}

	/**
	 * Force-logout a user from all devices.
	 */
	public function force_logout(): void {
		if ( ! isset( $_REQUEST['loggedin_logout'], $_REQUEST['loggedin_user'] ) ) {
			return;
		}

		check_admin_referer( 'loggedin-options' );

		$user = get_userdata( (int) $_REQUEST['loggedin_user'] );

		if ( $user ) {
			WP_Session_Tokens::get_instance( $user->ID )->destroy_all();

			add_settings_error(
				'general',
				'settings_updated',
				sprintf(
					// translators: %s User name of the logging out user.
					__( 'The user "%s" was forcefully logged out from all devices.', 'loggedin' ),
					$user->user_login
				),
				'updated'
			);
		} else {
			add_settings_error(
				'general',
				'settings_updated',
				sprintf(
					// translators: %d User ID.
					__( 'Invalid user ID: %d', 'loggedin' ),
					(int) $_REQUEST['loggedin_user']
				)
			);
		}
	}

	public function register_menu(): void {
		add_users_page(
			// translators: %s lock icon.
			sprintf( __( '%s Loggedin Settings', 'loggedin' ), '🔒' ),
			// translators: %s lock icon.
			sprintf( __( '%s Loggedin', 'loggedin' ), '<span class="dashicons dashicons-lock"></span>' ),
			'manage_options',
			Plugin::SLUG,
			array( $this, 'admin_page' )
		);
	}

	public function admin_page(): void {
		$settings = Settings::instance()->all();

		$vars = array(
			'login_maximum' => (int) $settings['maximum'],
			'login_logic'   => (string) $settings['logic'],
			'current_tab'   => $this->get_current_tab(),
			'logics'        => $this->loggedin_logics(),
			'tab_items'     => array(
				'settings' => array(
					'label' => __( 'Settings', 'loggedin' ),
					'icon'  => 'dashicons-admin-settings',
				),
				'addons'   => array(
					'label' => __( 'Addons', 'loggedin' ),
					'icon'  => 'dashicons-screenoptions',
				),
				'support'  => array(
					'label' => __( 'Support', 'loggedin' ),
					'icon'  => 'dashicons-editor-help',
				),
			),
		);

		/**
		 * Filter admin template vars.
		 *
		 * @since 2.0.0
		 *
		 * @param array $vars Variables.
		 */
		$vars = apply_filters( 'loggedin_admin_page_vars', $vars );

		View::render( 'admin', $vars );
	}

	/**
	 * Legacy section on the core Settings → General page pointing to the
	 * new settings location.
	 *
	 * @deprecated 2.0.0
	 */
	public function old_options_page(): void {
		add_settings_section(
			'loggedin_settings',
			// translators: %s lock icon.
			sprintf( __( '%s Loggedin Settings', 'loggedin' ), '<span class="dashicons dashicons-lock"></span>' ),
			array( $this, 'loggedin_old_settings' ),
			'general'
		);
	}

	public function loggedin_old_settings(): void {
		?>
		<p class="description">
			<?php
			printf(
				// translators: %1$s, %2$s anchor tags.
				esc_attr__( 'Loggedin settings have been relocated. %1$sClick here%2$s to access the new settings page.', 'loggedin' ),
				'<a href="' . esc_url( admin_url( 'users.php?page=' . Plugin::SLUG ) ) . '">',
				'</a>'
			);
			?>
		</p>
		<?php
	}

	public function review_notice() {
		$screen = get_current_screen();

		if ( ! isset( $screen->id ) || 'users_page_' . Plugin::SLUG !== $screen->id ) {
			return;
		}

		if ( ! current_user_can( 'manage_options' ) ) {
			return false;
		}

		$notice_time = get_option( 'loggedin_rating_notice' );

		if ( empty( $notice_time ) ) {
			return add_option( 'loggedin_rating_notice', time() + 604800 );
		}

		$current_user = wp_get_current_user();
		$dismissed    = get_user_meta( $current_user->ID, 'loggedin_rating_notice_dismissed', true );

		if ( (int) $notice_time <= time() && ! $dismissed ) {
			View::render(
				'review/notice',
				array( 'current_user' => $current_user ),
			);
		}
	}

	public function review_action(): void {
		if ( ! isset( $_REQUEST['loggedin_rating'] ) ) {
			return;
		}

		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		if ( ! isset( $_REQUEST['_wpnonce'] ) || ! wp_verify_nonce( $_REQUEST['_wpnonce'], 'loggedin_rating' ) ) { // phpcs:ignore
			return;
		}

		switch ( $_REQUEST['loggedin_rating'] ) {
			case 'later':
				update_option( 'loggedin_rating_notice', time() + 1209600 );
				break;
			case 'dismiss':
				update_user_meta( get_current_user_id(), 'loggedin_rating_notice_dismissed', 1 );
				break;
		}
	}

	protected function get_current_tab(): string {
		$tabs = array( 'settings', 'addons', 'support' );
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$tab = isset( $_GET['tab'] ) ? sanitize_text_field( wp_unslash( $_GET['tab'] ) ) : 'settings';

		return in_array( $tab, $tabs, true ) ? $tab : 'settings';
	}

	protected function loggedin_logics(): array {
		$logics = array(
			'logout_oldest' => array(
				'label' => __( 'Logout Oldest', 'loggedin' ),
				'desc'  => esc_html__( 'When the concurrent login limit is reached, a new login will automatically end the single oldest active session. This feature works only with user meta session storage.', 'loggedin' ),
			),
			'allow'         => array(
				'label' => __( 'Logout All', 'loggedin' ),
				'desc'  => esc_html__( 'When the concurrent login limit is reached, a new login will automatically terminate all previously active sessions.', 'loggedin' ),
			),
			'block'         => array(
				'label' => __( 'Block New', 'loggedin' ),
				'desc'  => esc_html__( 'If the concurrent login limit is reached, do not allow new logins. Users must then wait for existing login sessions to expire.', 'loggedin' ),
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
