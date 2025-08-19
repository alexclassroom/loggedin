---
title: Available Hooks
---

# Available Hooks

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

1. `logics`: An array containing the available login logics. Each key in the array represents a logic's ID, and its value is another array with details like `label` and `desc`.

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