<?php
/**
 * Settings access for the plugin.
 *
 * Reads/writes a single structured option (`loggedin_settings`) and
 * registers it with WordPress so it can be exposed via REST.
 *
 * @package DuckDev\Loggedin\Setup
 */

declare( strict_types = 1 );

namespace DuckDev\Loggedin\Setup;

use DuckDev\Loggedin\Contracts\Singleton;
use DuckDev\Loggedin\Plugin;

defined( 'WPINC' ) || die;

final class Settings {

	use Singleton;

	protected function init(): void {
		add_action( 'init', array( $this, 'register' ) );
	}

	/**
	 * Default settings values.
	 */
	public function defaults(): array {
		/**
		 * Filter the default settings.
		 *
		 * @since 3.0.0
		 *
		 * @param array $defaults Defaults.
		 */
		return apply_filters(
			'loggedin_settings_defaults',
			array(
				'maximum' => 1,
				'logic'   => 'allow',
			)
		);
	}

	/**
	 * Get the full settings array (merged with defaults).
	 */
	public function all(): array {
		$stored = get_option( Plugin::OPTION_KEY, array() );
		if ( ! is_array( $stored ) ) {
			$stored = array();
		}

		return array_merge( $this->defaults(), $stored );
	}

	/**
	 * Get a single setting value.
	 *
	 * @param string $key     Setting key.
	 * @param mixed  $default Fallback if key missing.
	 *
	 * @return mixed
	 */
	public function get( string $key, $default = null ) {
		$all = $this->all();

		return $all[ $key ] ?? $default;
	}

	/**
	 * Replace the full settings array.
	 */
	public function update( array $values ): bool {
		$sanitized = $this->sanitize( $values );

		return update_option( Plugin::OPTION_KEY, $sanitized );
	}

	/**
	 * Register the option with WordPress (REST-exposed).
	 */
	public function register(): void {
		register_setting(
			'loggedin',
			Plugin::OPTION_KEY,
			array(
				'type'              => 'object',
				'default'           => $this->defaults(),
				'sanitize_callback' => array( $this, 'sanitize' ),
				'show_in_rest'      => array(
					'schema' => array(
						'type'                 => 'object',
						'additionalProperties' => false,
						'properties'           => array(
							'maximum' => array(
								'type'    => 'integer',
								'minimum' => 1,
							),
							'logic'   => array(
								'type' => 'string',
								'enum' => array( 'allow', 'logout_oldest', 'block' ),
							),
						),
					),
				),
			)
		);
	}

	/**
	 * Sanitize a settings payload.
	 *
	 * @param mixed $input Raw input.
	 */
	public function sanitize( $input ): array {
		$defaults = $this->defaults();

		if ( ! is_array( $input ) ) {
			return $defaults;
		}

		$out = $defaults;

		if ( isset( $input['maximum'] ) ) {
			$out['maximum'] = max( 1, (int) $input['maximum'] );
		}

		if ( isset( $input['logic'] ) ) {
			$logic         = (string) $input['logic'];
			$allowed       = array( 'allow', 'logout_oldest', 'block' );
			$out['logic']  = in_array( $logic, $allowed, true ) ? $logic : $defaults['logic'];
		}

		return $out;
	}
}
