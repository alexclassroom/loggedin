<?php
/**
 * Settings form template.
 *
 * @since      2.0.0
 *
 * @var int    $login_maximum Maximum logins allowed.
 * @var string $login_logic   Login logic.
 *
 * @link       https://duckdev.com/products/loggedin-limit-active-logins/
 * @author     Joel James <me@joelsays.com>
 * @license    http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 * @copyright  Copyright (c) 2025, Joel James
 * @package    View
 */

?>
<table class="form-table">
	<tbody>
	<tr>
		<th scope="row">
			<label for="loggedin_maximum"><?php esc_attr_e( 'Active Logins Limit', 'loggedin' ); ?></label>
		</th>
		<td>
			<p>
				<input
					type="number"
					name="loggedin_maximum"
					id="loggedin_maximum"
					min="1"
					value="<?php echo intval( $login_maximum ); ?>"
					placeholder="<?php esc_html_e( 'Enter the limit in number', 'loggedin' ); ?>"
				/>
			</p>
			<p class="description"><?php esc_html_e( 'Set the maximum number of active logins allowed per user account.', 'loggedin' ); ?></p>
			<p class="description"><?php esc_html_e( 'If this limit is reached, subsequent login attempts will fail until the user logs out from one of their existing sessions.', 'loggedin' ); ?></p>
			<p class="description"><strong><?php esc_html_e( 'Note: ', 'loggedin' ); ?></strong><?php esc_html_e( 'Closing a browser may not terminate a login session.', 'loggedin' ); ?></p>
		</td>
	</tr>

	<tr>
		<th scope="row">
			<label for="loggedin_logic"><?php esc_attr_e( 'Login Logic', 'loggedin' ); ?></label>
		</th>
		<td>
			<p>
				<input
					type="radio"
					name="loggedin_logic"
					id="loggedin_logic"
					value="allow" <?php checked( $login_logic, 'allow' ); ?>
				/> <?php esc_html_e( 'Allow', 'loggedin' ); ?>
			</p>
			<p class="description"><?php esc_html_e( 'Allow a new login by automatically terminating all existing older sessions when the concurrent login limit is reached.', 'loggedin' ); ?></p>
			<p>
				<input
					type="radio"
					name="loggedin_logic"
					id="loggedin_logic"
					value="block" <?php checked( $login_logic, 'block' ); ?>
				/> <?php esc_html_e( 'Block', 'loggedin' ); ?>
			</p>
			<p class="description"><?php esc_html_e( 'If the concurrent login limit is reached, do not allow new logins. Users must then wait for existing login sessions to expire.', 'loggedin' ); ?></p>
		</td>
	</tr>
	</tbody>
</table>
