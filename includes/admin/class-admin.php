<?php
/**
 * Admin module.
 *
 * Registers the admin menu, the (legacy) deep-link section, the
 * force-logout request handler, and the review-request notice. The
 * settings page itself is now a React mount point — its UI lives in
 * `assets/src/` and is enqueued by {@see Assets}.
 *
 * @package DuckDev\Loggedin\Admin
 */

declare( strict_types = 1 );

namespace DuckDev\Loggedin\Admin;

use DuckDev\Loggedin\Contracts\Singleton;
use DuckDev\Loggedin\Plugin;
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
			array( $this, 'render_page' )
		);
	}

	/**
	 * Render the React mount-point.
	 */
	public function render_page(): void {
		echo '<div class="wrap"><div id="loggedin-admin"></div></div>';
	}

	/**
	 * Legacy pointer on the core Settings → General screen.
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
			$this->render_review_notice( $current_user );
		}
	}

	private function render_review_notice( \WP_User $current_user ): void {
		$dismiss = wp_nonce_url( add_query_arg( 'loggedin_rating', 'dismiss' ), 'loggedin_rating' );
		$later   = wp_nonce_url( add_query_arg( 'loggedin_rating', 'later' ), 'loggedin_rating' );
		$rate    = 'https://wordpress.org/support/plugin/loggedin/reviews/?rate=5#new-post';
		?>
		<div class="notice notice-info is-dismissible">
			<p>
				<?php
				printf(
					// translators: %s display name.
					esc_html__( 'Hi %s, are you enjoying Loggedin? Could you leave a quick rating on WordPress.org?', 'loggedin' ),
					esc_html( $current_user->display_name )
				);
				?>
			</p>
			<p>
				<a class="button button-primary" href="<?php echo esc_url( $rate ); ?>" target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'Rate now', 'loggedin' ); ?></a>
				&nbsp;
				<a class="button" href="<?php echo esc_url( $later ); ?>"><?php esc_html_e( 'Maybe later', 'loggedin' ); ?></a>
				&nbsp;
				<a href="<?php echo esc_url( $dismiss ); ?>"><?php esc_html_e( 'No thanks', 'loggedin' ); ?></a>
			</p>
		</div>
		<?php
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
}
