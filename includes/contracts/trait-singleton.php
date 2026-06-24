<?php
/**
 * Singleton trait.
 *
 * @package DuckDev\Loggedin
 */

declare( strict_types = 1 );

namespace DuckDev\Loggedin\Contracts;

defined( 'WPINC' ) || die;

trait Singleton {

	/**
	 * Shared instance.
	 *
	 * @var static|null
	 */
	private static $instance = null;

	/**
	 * Get the shared instance, instantiating on first call.
	 */
	final public static function instance(): self {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Singletons construct themselves.
	 */
	private function __construct() {
		$this->init();
	}

	/**
	 * Subclasses implement their wiring here.
	 */
	abstract protected function init(): void;

	private function __clone() {}

	final public function __wakeup(): void {
		throw new \RuntimeException( 'Cannot unserialize singleton.' );
	}
}
