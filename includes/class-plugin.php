<?php
/**
 * Static plugin metadata container.
 *
 * @package DuckDev\Loggedin
 */

declare( strict_types = 1 );

namespace DuckDev\Loggedin;

defined( 'WPINC' ) || die;

final class Plugin {

	public const VERSION      = '2.0.4';
	public const SLUG         = 'loggedin';
	public const TEXT_DOMAIN  = 'loggedin';
	public const FREEMIUS_ID  = 19328;
	public const OPTION_KEY   = 'loggedin_settings';
	public const VERSION_KEY  = 'loggedin_version';
	public const REST_NAMESPACE = 'loggedin/v1';

	public static function file(): string {
		return LOGGEDIN_FILE;
	}

	public static function dir(): string {
		return LOGGEDIN_DIR;
	}

	public static function url(): string {
		return plugin_dir_url( self::file() );
	}

	public static function basename(): string {
		return plugin_basename( self::file() );
	}
}
