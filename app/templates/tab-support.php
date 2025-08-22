<?php
/**
 * Info page template.
 *
 * @since      2.0.0
 *
 * @var array $addons            Addon list.
 * @var array $registered_addons Registered addons.
 *
 * @link       https://duckdev.com/products/loggedin-limit-active-logins/
 * @author     Joel James <me@joelsays.com>
 * @license    http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 * @copyright  Copyright (c) 2025, Joel James
 * @package    View
 */

?>
<br/>
<div id="dashboard-widgets">
	<div class="postbox-container">
		<div class="meta-box-sortables">
			<div class="postbox">
				<div class="inside">
					<p><strong><?php esc_attr_e( 'Do you need help?', 'loggedin' ); ?></strong></p>
					<p><?php esc_attr_e( 'Here are some available options to help solve your problems.', 'loggedin' ); ?></p>
					<ol>
						<li><a href="https://wordpress.org/plugins/loggedin/#faq-header" target="_blank"><?php esc_attr_e( 'FAQ', 'loggedin' ); ?></a></li>
						<li><a href="https://wordpress.org/support/plugin/loggedin/" target="_blank"><?php esc_attr_e( 'Support Forums', 'loggedin' ); ?></a></li>
						<li><a href="https://loggedin.duckdev.com/" target="_blank"><?php esc_attr_e( 'Documentation', 'loggedin' ); ?></a></li>
						<li><a href="https://duckdev.com/contact/" target="_blank"><?php esc_attr_e( 'Premium Support', 'loggedin' ); ?></a></li>
					</ol>
				</div>
			</div>
		</div>
	</div>
	<div class="postbox-container">
		<div class="meta-box-sortables">
			<div class="postbox">
				<div class="inside">
					<p><strong><?php esc_attr_e( 'About the Author', 'loggedin' ); ?></strong></p>
					<p><?php esc_attr_e( 'I am Joel, a seasoned software engineer with over a decade of experience.', 'loggedin' ); ?></p>
					<p><?php esc_attr_e( 'You can find more about me at these links', 'loggedin' ); ?>:</p>
					<ol>
						<li><a href="https://duckdev.com/" target="_blank"><?php esc_attr_e( 'Personal Website', 'loggedin' ); ?></a>
						<li><a href="https://github.com/joel-james/" target="_blank"><?php esc_attr_e( 'Github Profile', 'loggedin' ); ?></a>
						<li><a href="https://profiles.wordpress.org/joelcj91/" target="_blank"><?php esc_attr_e( 'WordPress.org', 'loggedin' ); ?></a>
					</ol>
				</div>
			</div>
		</div>
	</div>
</div>
