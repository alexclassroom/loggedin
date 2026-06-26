=== Loggedin - Limit Concurrent Sessions ===
Contributors: joelcj91,duckdev
Tags: concurrent login, login limit, prevent account sharing, user sessions, force logout
Donate link: https://paypal.me/JoelCJ
Requires at least: 5.0
Tested up to: 6.9
Stable tag: 2.0.4
Requires PHP: 7.4
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Limit concurrent user logins in WordPress, stop account sharing, force logout active sessions, and pick what happens when the cap is hit.

== Description ==

**Loggedin** caps the number of simultaneous WordPress sessions a user account is allowed to hold. When the cap is reached, you choose what happens next — log out the oldest device, log out every other device, or block the new login outright. It's the lightweight, no-bloat way to stop account sharing on membership sites, LMS courses, paid communities, and any WordPress install where one paid account shouldn't be open on five devices at once.

The plugin hooks straight into WordPress's standard authentication pipeline and uses the native `WP_Session_Tokens` API, so it works on every host, with every theme, and alongside every login plugin you might already run. No cron jobs, no background polling, no third-party services.

### How it works

A "session" in WordPress is the authenticated token created the moment a user logs in — one per browser, per device. Two browsers on the same laptop count as two sessions; a phone and a desktop count as two. Closing a tab does **not** end a session — the token lives server-side until the user explicitly signs out or another login displaces it.

Loggedin watches every login attempt:

1. Counts the user's current active sessions.
2. Compares that count to the limit you've configured.
3. Applies the rule you've picked — silently make room for the new login, or reject the new login with an error on wp-login.

There's a one-click **Force Logout** panel in the admin to clear every session for a specific user when someone's locked out by the cap and can't reach their other devices. Identify the user by ID, email, or username — all three work.

### Who it's for

* **Membership sites** — MemberPress, Paid Memberships Pro, Restrict Content Pro, WooCommerce Memberships, etc. Stop one paid account from being shared across a household, a classroom, or a Discord server.
* **Online courses & LMS** — LearnDash, LifterLMS, TutorLMS, Sensei. Make sure the seat someone paid for is actually used by that someone.
* **Subscription stores** — WooCommerce Subscriptions, Easy Digital Downloads recurring. Keep subscriber counts honest.
* **Corporate intranets & client portals** — Enforce a one-device-at-a-time policy for staff or client accounts.
* **BuddyPress / BuddyBoss communities** — Reduce ban-evasion and duplicate-account abuse.
* **Compliance-driven sites** — Healthcare, finance, education installs where audit policy requires a per-account session cap.

### Features

* **Global concurrent-login limit** — Pick any number from 1 upwards as the per-user cap.
* **Three built-in modes** — Logout Oldest (kick the user's oldest device, keep the rest), Logout All (the new login becomes the only active session), or Block New (reject the login and show an error on wp-login).
* **Admin Force Logout** — Type a user ID, email, or username and clear every active session for that user in one click.
* **Works with any session storage** — Uses the standard `WP_Session_Tokens` API. Stock WordPress, Redis, Memcached — all supported (the Logout Oldest mode needs the default user-meta storage; the other modes work everywhere).
* **Customizable error message** — Override the message shown when a login is blocked, via a single filter.
* **Built for developers** — Every decision passes through documented PHP hooks and filters. Override the cap per user / role / capability, exempt service accounts, audit force-logouts, or splice the plugin into your own auth pipeline. Full hook reference in the [developer docs](https://docs.duckdev.com/loggedin/developer-docs).
* **Lightweight** — No cron, no background polling, no remote calls. The whole plugin runs at the moment a login happens.
* **Translation-ready** — Loaded with the WordPress i18n APIs; contribute translations on WordPress.org.

### 📦 Add-ons

Extend Loggedin with these official [add-ons](https://duckdev.com/addons/loggedin/):

* **[Limit Per User](https://duckdev.com/addon/limit-per-user/)** — Override the global session cap for an individual user account directly from their WordPress profile. Perfect for tiered access or trusted-staff exemptions.
* **[Limit Per Role](https://duckdev.com/addon/limit-per-role/)** — Set a different concurrent-session cap per WordPress role. Give administrators more headroom while keeping subscribers tight, or vice versa.
* **[Real-time Logout](https://duckdev.com/addon/real-time-logout/)** — Detect logouts in near-real-time. When Loggedin terminates a session, the user's other open tabs reload to wp-login automatically — no waiting for the next page click.

### 📚 Documentation

* [Getting started](https://docs.duckdev.com/loggedin/getting-started)
* [General settings](https://docs.duckdev.com/loggedin/general-settings)
* [Force Logout (Manage Sessions)](https://docs.duckdev.com/loggedin/manage-sessions)
* [Add-ons overview](https://docs.duckdev.com/loggedin/addons/)
* [Developer docs — hooks, filters, REST](https://docs.duckdev.com/loggedin/developer-docs)

### 🐛 Bug reports

Found a bug? File it on the [Loggedin GitHub repository](https://github.com/Joel-James/loggedin/issues).

_GitHub is for bug reports and development-related issues only. For end-user support, please use the WordPress.org [support forums](https://wordpress.org/support/plugin/loggedin/)._

== Installation ==

1. Install Loggedin from the WordPress.org plugin directory (**Plugins → Add New → search "Loggedin"**) or upload the ZIP under **Plugins → Add New → Upload Plugin**. Full instructions: [how to install a plugin](https://docs.duckdev.com/general/installing-plugin).
2. Activate the plugin.
3. Go to **Users → Loggedin** to configure the concurrent-login limit and pick the rule applied when the limit is reached.

That's it. The default — limit of `1`, **Logout All** mode — already prevents account sharing on a fresh install.

== Frequently Asked Questions ==

= Will this stop users from sharing their WordPress password? =

It stops *simultaneous* sharing — two people can't be signed in to the same account on different devices at the same time once the cap is set to `1`. They can still take turns logging in if you don't want to block the new login outright. Pick **Block New** mode to refuse the second login entirely and force the password-sharer to also log out the first device, which most people won't do.

= Does this work with WooCommerce, MemberPress, LearnDash, BuddyPress, etc.? =

Yes. Loggedin hooks into the standard WordPress authentication pipeline (`wp_authenticate_user` and `check_password`), so any plugin that logs users in through the normal WordPress flow — which is essentially every membership, LMS, e-commerce, and community plugin — is covered automatically. No integration code required.

= Can I set different limits for administrators and subscribers? =

Yes, with the official [Limit Per Role add-on](https://duckdev.com/addon/limit-per-role/). It adds a per-role panel to the settings page where you can give each WordPress role its own cap (e.g. administrators: 5, editors: 3, subscribers: 1). Users with multiple roles get the highest configured limit.

= Can I set a different limit for one specific user? =

Yes, with the official [Limit Per User add-on](https://duckdev.com/addon/limit-per-user/). It adds a field to the WordPress profile screen so you can override the global cap on a per-user basis — useful for shared editorial accounts, executive users, or anyone who legitimately needs more sessions than your default.

= Will current users be logged out when I install or change the limit? =

No. Loggedin only acts when a *new* login happens. Existing sessions stay active until they expire, the user logs out, or a future login displaces them under the rule you've configured.

= Where can I find the settings for Loggedin? =

In the WordPress admin, go to **Users → Loggedin**. You'll see two tabs — **Settings** for the cap and login logic, and **Add-ons** for installing and licensing first-party extensions.

= What are the available login logic options? =

The plugin offers three built-in modes:

* **Logout Oldest** — When the limit is reached, the user's single oldest active session is terminated to make room for the new login. Closest match to consumer "remember me" UX.
* **Logout All** — When the limit is reached, every other active session for the user is terminated and the new login becomes the only active session.
* **Block New** — When the limit is reached, the new login attempt is rejected with an error on wp-login.

Additional modes can be added via the `loggedin_logics` filter. See the [General Settings docs](https://docs.duckdev.com/loggedin/general-settings#login-logic) for details.

= How long does a login session last? =

The duration of a WordPress login session is controlled by WordPress, not Loggedin.

* "Remember Me" checked at login → session lasts **14 days**.
* "Remember Me" not checked → session lasts **2 days**.

Customize the duration with the standard `auth_cookie_expiration` filter:

<pre lang="php">
function custom_auth_cookie_expiration( $expire ) {
    return MONTH_IN_SECONDS; // 30 days for every login.
}

add_filter( 'auth_cookie_expiration', 'custom_auth_cookie_expiration' );
</pre>

= What if a user has reached the limit but doesn't know which devices are active? =

Administrators can force-logout every session for the user from the dashboard:

1. Go to **Users → Loggedin** in the WordPress admin.
2. Scroll to the **Force Logout** panel at the bottom of the Settings tab.
3. Enter the user's ID, email address, or username and click **Force Logout**. All active sessions for that user are terminated immediately.

= Does Loggedin work with Redis / Memcached / external session storage? =

Yes for the **Logout All** and **Block New** modes — both go through the standard `WP_Session_Tokens` API, which respects whatever storage backend WordPress is configured to use. The **Logout Oldest** mode needs the default user-meta storage because the WP API doesn't expose a "drop the oldest" primitive; pick Logout All instead if your sessions live elsewhere.

= Is Loggedin GDPR-compliant? =

Loggedin stores no personal data itself. It only counts and manipulates WordPress session tokens that already exist in your database via the standard `WP_Session_Tokens` API. No external services are called, no telemetry is sent.

= Does Loggedin slow down logins? =

No. The work Loggedin does on each login is one query for the user's existing session tokens and an in-memory count — measured in microseconds. No HTTP calls, no cron jobs, no background polling.

= Can I customize the error message shown when a login is blocked? =

Yes, via the `loggedin_error_message` filter:

<pre lang="php">
add_filter( 'loggedin_error_message', function ( $message ) {
    return 'Your account is already signed in elsewhere. Sign out from another device to continue.';
} );
</pre>

See the [developer docs](https://docs.duckdev.com/loggedin/developer-docs) for every filter and action the plugin exposes.

== Screenshots ==

1. **Settings** — concurrent-login limit and login logic.
2. **Manage Sessions** — admin Force Logout panel.

== Changelog ==

= 2.0.4 (02/01/2026) =

**👌 Improvements**

* Review notice check.

**🐛 Bug Fixes**

* Invalid nonce action prevents notices from being dismissed.

= 2.0.3 (09/12/2025) =

**👌 Improvements**

* Remove debug code.

= 2.0.2 (11/11/2025) =

**🐛 Bug Fixes**

* Nonce verification for Force Logout.
* Uninstall cleanup.

= 2.0.1 (11/11/2025) =

**🐛 Bug Fixes**

* Fatal errors.
* Empty addons page.

= 2.0.0 (10/11/2025) =

**📦 New**

* Settings page
* Addons
* Logout Oldest logic - Thanks [#19](https://github.com/Joel-James/loggedin/pull/19).

**👌 Improvements**

* Coding standards.
* Sanitization.

= 1.3.2 (01/10/2024) =

**🐛 Bug Fixes**

* Security fixes.

= 1.3.1 (19/09/2020) =

**👌 Improvements**

* Support ajax logins - Thanks [Carlos Faria](https://github.com/cfaria).

= 1.3.0 (28/08/2020) =

**👌 Improvements**

* Improved "Allow" logic to check only after password check.

= 1.2.0 (07/06/2019) =

**📦 New**

* Added ability to choose login logic.

= 1.1.0 (06/06/2019) =

**📦 New**

* Added ability to force logout users.
* Added cleanup on plugin uninstall.
* Added review notice.

**👌 Improvements**

* Code improvement

= 1.0.1 (02/07/2016) =

**🐛 Bug Fixes**

* Fixing misspelled variable.

= 1.0.0 (16/06/2016) =

**📦 New**

* Initial version release.


== Upgrade Notice ==

= 2.0.4 (02/01/2026) =

**👌 Improvements**

* Review notice check.

**🐛 Bug Fixes**

* Invalid nonce action prevents notices from being dismissed.
