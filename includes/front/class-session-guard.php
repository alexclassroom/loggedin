<?php
/**
 * Session guard.
 *
 * Hooks into WordPress authentication to enforce the concurrent-session
 * limit according to the configured logic (block / logout_oldest / allow).
 *
 * @package DuckDev\Loggedin\Front
 */

declare( strict_types = 1 );

namespace DuckDev\Loggedin\Front;

use DuckDev\Loggedin\Contracts\Singleton;
use DuckDev\Loggedin\Setup\Settings;
use WP_Error;
use WP_Session_Tokens;

defined( 'WPINC' ) || die;

final class Session_Guard {

	use Singleton;

	protected function init(): void {
		add_filter( 'wp_authenticate_user', array( $this, 'validate_block_logic' ) );
		add_filter( 'check_password', array( $this, 'validate_allow_logic' ), 10, 4 );
	}

	/**
	 * Enforce `allow` and `logout_oldest` modes after password check.
	 *
	 * @param bool   $check    Existing check state.
	 * @param string $password Plaintext password.
	 * @param string $hash     Password hash.
	 * @param int    $user_id  User ID.
	 */
	public function validate_allow_logic( $check, $password, $hash, $user_id ): bool {
		if ( ! $check ) {
			return false;
		}

		$logic = (string) Settings::instance()->get( 'logic', 'allow' );

		if ( in_array( $logic, array( 'allow', 'logout_oldest' ), true ) && $this->has_limit_reached( (int) $user_id ) ) {
			if ( 'allow' === $logic ) {
				$this->destroy_all_sessions( (int) $user_id );
			} else {
				$this->destroy_oldest_session( (int) $user_id );
			}
		}

		return true;
	}

	/**
	 * Enforce `block` mode before authentication completes.
	 *
	 * @param mixed $user WP_User or WP_Error.
	 *
	 * @return mixed
	 */
	public function validate_block_logic( $user ) {
		if ( is_wp_error( $user ) ) {
			return $user;
		}

		$logic = (string) Settings::instance()->get( 'logic', 'allow' );

		if ( 'block' === $logic && $this->has_limit_reached( (int) $user->ID ) ) {
			/**
			 * Fires when a login is blocked by the concurrent-session limit.
			 *
			 * @since 2.0.0
			 *
			 * @param int $user_id User ID.
			 */
			do_action( 'loggedin_login_blocked', $user->ID );

			return new WP_Error( 'login_limit_reached', $this->limit_error_message() );
		}

		return $user;
	}

	protected function destroy_all_sessions( int $user_id ): void {
		WP_Session_Tokens::get_instance( $user_id )->destroy_all();

		/**
		 * Fires after every session is destroyed for a user.
		 *
		 * @since 2.0.0
		 *
		 * @param int $user_id User ID.
		 */
		do_action( 'loggedin_destroy_all_sessions', $user_id );
	}

	protected function destroy_oldest_session( int $user_id ): void {
		$sessions = get_user_meta( $user_id, 'session_tokens', true );
		if ( ! is_array( $sessions ) || empty( $sessions ) ) {
			return;
		}

		$oldest_token = '';
		$oldest_time  = time();

		foreach ( $sessions as $token => $session ) {
			if ( isset( $session['login'] ) && $session['login'] < $oldest_time ) {
				$oldest_time  = $session['login'];
				$oldest_token = $token;
			}
		}

		if ( '' !== $oldest_token ) {
			unset( $sessions[ $oldest_token ] );
			update_user_meta( $user_id, 'session_tokens', $sessions );

			/**
			 * Fires after the oldest session is destroyed for a user.
			 *
			 * @since 2.0.0
			 *
			 * @param int $user_id User ID.
			 */
			do_action( 'loggedin_destroy_oldest_session', $user_id );
		}
	}

	protected function has_limit_reached( int $user_id ): bool {
		if ( empty( $user_id ) || $this->is_bypassed( $user_id ) ) {
			return false;
		}

		$maximum = (int) Settings::instance()->get( 'maximum', 1 );
		$count   = count( WP_Session_Tokens::get_instance( $user_id )->get_all() );
		$reached = $count >= $maximum;

		/**
		 * Filter the limit-reached result.
		 *
		 * @since 1.3.0
		 * @since 1.3.1 Added count param.
		 *
		 * @param bool $reached Reached.
		 * @param int  $user_id User ID.
		 * @param int  $count   Active session count.
		 */
		return (bool) apply_filters( 'loggedin_reached_limit', $reached, $user_id, $count );
	}

	protected function is_bypassed( int $user_id ): bool {
		/**
		 * Filter to bypass the concurrent-session check for a user.
		 *
		 * @since 1.0.0
		 *
		 * @param bool $bypass  Default false.
		 * @param int  $user_id User ID.
		 */
		return (bool) apply_filters( 'loggedin_bypass', false, $user_id );
	}

	protected function limit_error_message(): string {
		$message = __( "You've reached the maximum number of active logins for this account. Please log out from another device to continue.", 'loggedin' );

		/**
		 * Filter the login-blocked error message.
		 *
		 * @since 1.0.0
		 *
		 * @param string $message Message.
		 */
		return (string) apply_filters( 'loggedin_error_message', $message );
	}
}
