<?php
/**
 * Fired when the plugin is uninstalled.
 *
 * @package Loggedin
 */

defined( 'WP_UNINSTALL_PLUGIN' ) || exit;

// Plugin options.
delete_option( 'loggedin_settings' );
delete_option( 'loggedin_version' );
delete_option( 'loggedin_maximum' );    // Legacy.
delete_option( 'loggedin_logic' );      // Legacy.
delete_option( 'loggedin_rating_notice' );

global $wpdb;

$wpdb->delete( // phpcs:ignore WordPress.DB
	$wpdb->usermeta,
	array(
		'meta_key' => 'loggedin_rating_notice_dismissed', // phpcs:ignore WordPress.DB.SlowDBQuery
	)
);
