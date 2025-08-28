---
title: Developer Docs
---

# Developer Docs

Loggedin offers a robust system of hooks, which allow you to extend the plugin's functionality without modifying its core files. This ensures your custom code remains intact even after a plugin update. There are two primary types of hooks: Actions and Filters.

To use either type of hook, you must first create a callback function. This is a custom function that contains the code you want to execute. You then register this callback with a specific Loggedin hook, telling the plugin exactly when and where to run your code.

## Actions

Actions are a type of hook that allows you to execute a custom function at a specific, predefined point in the Loggedin plugin's execution. They are ideal for adding, updating, or performing a task without altering the data that's being processed.

### 1. `loggedin_settings_bottom`

This action hook allows you to add custom content to the very bottom of the Loggedin plugin's settings page. It is particularly useful for adding new, custom settings fields to the user interface.

Use this hook to extend the Loggedin settings page with your own UI elements. If you register your custom settings fields within the `loggedin` settings group, the plugin will automatically handle the process of saving and updating these settings in the database, simplifying your development process.

#### Example Usage

To use this hook, you would add a line of code to your theme's functions.php file or a custom plugin. The following example demonstrates how to register a callback function to add a settings page.

```php
add_action( 'loggedin_settings_bottom', 'my_custom_settings_function' );

function my_custom_settings_function() {
    // You can add your HTML for custom settings here.
    echo '<h3>Custom Settings Section</h3>';
    echo '<p>This is a new section added via the loggedin_settings_bottom action hook.</p>';
}
```

## Filters

Filters allow you to modify data that is being processed by the plugin. A callback function for a filter will receive a variable, modify it, and then return the modified variable.

### 1. `loggedin_logics`

This filter gives you the ability to modify the list of available login logics. You can use it to add new custom logics or remove existing ones.

If you add a new logic, you are responsible for implementing the code that handles that logic's functionality.

#### Parameters

* `logics`: An array containing the available login logics. Each key in the array represents a logic's ID, and its value is another array with details like `label` and `desc`.

#### Example Usage

```php
add_filter( 'loggedin_logics', 'my_custom_login_logic' );

function my_custom_login_logic( $logics ) {
	$logics['custom_logic'] = array(
		'label' => 'Custom Logic',
		'desc'  => 'Custom logic description',
	);
	
	return $logics;
}
```

### 2. `loggedin_register_addon`

This filter filters the list of registered addons. Addon plugins should use this filter to register with the parent "Loggedin" plugin.

::: warning Important
This filter is only intended for official Loggedin addons because it requires the addons to be registered in Freemius under the Loggedin plugin.
:::

#### Parameters

* `addons`: An array containing the list of addon details. Array item key should the Freemius product ID.

#### Example Usage

```php
add_filter( 'loggedin_register_addon', 'my_custom_addon_register' );

function my_custom_addon_register( $addons ): array {
    // Here 123 is the product id of the addon.
    $addons[ 1234 ] = array(
        'slug'       => 'loggedin-custom-addon',
        'is_premium' => true,
        'main_file'  => __FILE__,
        'public_key' => 'pk_123456abcdef',
    );

    return $addons;
}
```

### 3. `loggedin_admin_page_vars`

This filter modifies or adds new variables to the Loggedin admin template variables. It is used by the loggedin admin page templates. Addon plugins can use this filter to add their custom template variables.

#### Parameters

* `vars`: An array of variables and their values.

#### Sample Usage

```php
add_filter( 'loggedin_admin_page_vars', 'my_custom_admin_vars' );

function my_custom_admin_vars( $vars ): array {
    $vars[ 'custom_var' ] = 'Custom var value';

    return $vars;
}
```

### 4. loggedin_reached_limit

This filter changes the limit condition. You can use it to check additional conditions before a user hits the limit or to dynamically change a user's limit.

::: tip Note
This filter will not be used if the user limit check is already bypassed by using the `loggedin_bypass` filter.
:::

#### Parameters
* `reached`: A boolean. Return `true` or `false` when the limit is reached. 
* `user_id`: The ID of the user whose limit is being checked.
* `count`: The current count of the user's active concurrent sessions.

#### Example Usage

```php
add_filter( 'loggedin_reached_limit', 'my_custom_limit_check', 10, 3 );

function my_custom_limit_check( $reached, $user_id, $count ) {
    // For user 123, hit the limit only when concurrent logins hit 10.
    if ( 123 === $user_id ) {
        return $count > 10;
    }

    return $reached;
}
```

### 5. loggedin_bypass

This filter can be used to bypass the limit check for certain users.

#### Parameters

* `bypass`: Return true to bypass the limit check.
* `user_id`: The ID of the current user.

#### Sample Usage

To bypass specific user IDs, use the following code:

```php
add_filter( 'loggedin_bypass', 'my_custom_bypass_users', 10, 2 );

function my_custom_bypass_users( $bypass, $user_id ) {
    // Add the user IDs you want to bypass to this array.
    $allowed_users = array( 1, 2, 3, 4, 5 );
    
    return in_array( $user_id, $allowed_users );
}
```

To bypass specific user roles, use this code:

```php
add_filter( 'loggedin_bypass', 'loggedin_bypass_roles', 10, 2 );

function loggedin_bypass_roles( $prevent, $user_id ) {
    // Add the roles you want to bypass to this array.
    $allowed_roles = array( 'administrator', 'editor' );
    $user = get_user_by( 'id', $user_id );
    $roles = ! empty( $user->roles ) ? $user->roles : array();
    
    return ! empty( array_intersect( $roles, $allowed_roles ) );
}
```

### 6. loggedin_error_message

This filter hook changes the error message when the limit is reached and the current login request is blocked.

#### Parameters

* `message`: The default error message.

#### Sample Usage

```php
add_filter( 'loggedin_error_message', 'my_custom_error_message');

function my_custom_error_message( $message ) {
   return 'My custom error message';
}
```

## Login Session Duration

The duration of a login session is determined by WordPress's default settings.

* If the "Remember Me" box is checked during login, the session will last for 14 days.
* If the "Remember Me" box is not checked, the session will last for 2 days.

You can customize this duration using the `auth_cookie_expiration` filter. Here's an example of how to set the session to one month:

```php
function custom_auth_cookie_expiration( $expire ) {
    return MONTH_IN_SECONDS; // Sets the session to one month
}

add_filter( 'auth_cookie_expiration', 'custom_auth_cookie_expiration' );
```

::: info Need help?
If you think something is missing or need help extending Loggedin, feel free to [contact us](https://duckdev.com/contact/).
:::