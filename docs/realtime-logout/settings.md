---
outline: deep
---

# Configuring Real-time Logout

The **Real-time Logout** add-on is designed to detect logouts and immediately block access to a page by forcing a refresh. This ensures that a user's session is terminated across all open browser tabs as soon as they log out.

::: info Note
It's important to note that despite its name, this plugin doesn't perform a true real-time check. Instead, it checks for logouts at a specified time interval by making an HTTP request to your backend. This approach avoids the need for complex, third-party real-time setups.
:::

[![Real-time Logout Settings](/realtime-logout/settings.png)](/realtime-logout/settings.png)

## Real-time Refresh Interval

This setting controls how often the plugin checks for a logout. It is a text field that only accepts a number greater than 1.

The value you enter here represents the refresh interval in seconds. To prevent your server from being overloaded with excessive HTTP requests, it's recommended to set this value to at least 60 seconds (1 minute) or higher. Each check requires a dedicated request to the backend, so a higher value will help minimize the load on your server while still providing a timely check for a user's session status.