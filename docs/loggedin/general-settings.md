---
title: General Settings
---

# General Settings

The General Settings section allows you to manage the core functionalities of the Loggedin plugin.

[![General Settings](/loggedin/general-settings.png)](/loggedin/general-settings.png)

## Active Logins Limit

Use this setting to define the maximum number of concurrent active logins a single user account can have. When a user reaches this limit, any new login attempts will be handled according to the **Login Logic** setting.

This is a text input field that accepts a numerical value. The minimum allowed value is 1.

::: info Note
Closing a browser window does not automatically end an active login session. The session will remain active until the user explicitly logs out or the session expires.
:::

## Login Logic

This setting provides three options to define how the plugin should react when a user attempts to log in but has already reached their Active Logins Limit.

This is a radio button input, allowing you to select only one option.

### Logout Oldest
A new login will automatically terminate the single oldest active session. This means a user can always log in, but it will log them out of their oldest active device or browser.

Note: This feature requires the user meta session storage method.

### Logout All
If the concurrent login limit is met, a new successful login will automatically end all previously active sessions for that user, effectively making the new login the only active one.

### Block New
When the login limit is reached, all new login attempts will be blocked. The user must either log out of an existing session or wait for a session to expire before they can log in again.

::: tip Extensibility
Third-party plugins or custom code can introduce additional login logic options by utilizing the available WordPress filter hooks. Developers can refer to [the plugin's documentation](./actions-and-filters) for details on extending this functionality.
:::