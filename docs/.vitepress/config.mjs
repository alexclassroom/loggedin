import { defineConfig } from 'vitepress'

// Get current year.
const year = new Date().getFullYear()
export default defineConfig({
	title: 'Loggedin',
	description: 'Simplifying Concurrent Logins in WordPress',
	head: [
		[
			'link',
			{
				rel: 'icon',
				href: '/icon.svg',
			},
		]
	],
	themeConfig: {
		logo: '/icon.svg',

		nav: [
			{ text: 'Home', link: '/' },
			{ text: 'Addons', link: '/addons' },
			{ text: 'Download', link: 'https://wordpress.org/plugins/loggedin/' }
		],

		sidebar: [
			{
				text: 'Addons',
				link: '/addons',
			},
			{
				text: 'Getting Started',
				collapsed: false,
				items: [
					{ text: 'Installing Loggedin', link: '/general/installing-loggedin' },
					{ text: 'Installing an add-on', link: '/general/installing-add-on' },
					{ text: 'Updating a plugin', link: '/general/updating-plugin' },
				]
			},
			{
				text: 'Loggedin',
				collapsed: false,
				items: [
					{ text: 'General Settings', link: '/loggedin/general-settings' },
					{ text: 'Manage Sessions', link: '/loggedin/manage-sessions' },
					{ text: 'Actions & Filters', link: '/loggedin/actions-and-filters' },
				]
			},
			{
				text: 'Addon - Realtime Logout',
				collapsed: false,
				items: [
					{ text: 'Settings', link: '/realtime-logout/settings' },
				]
			},
			{
				text: 'Addon - Limit Per User',
				collapsed: false,
				items: [
					{ text: 'Settings', link: '/limit-per-user/settings' },
				]
			},
			{
				text: 'About the author',
				link: '/about',
			},
		],

		socialLinks: [
			{
				icon: 'github',
				link: 'https://github.com/Joel-James/loggedin/',
				ariaLabel: 'Loggedin on GitHub',
			},
			{
				icon: 'twitter',
				link: 'https://twitter.com/Joel_James',
				ariaLabel: 'Loggedin\'s author on Twitter',
			},
		],

		search: {
			provider: 'local',
		},

		footer: {
			copyright: `Copyright © ${year}, <a href="/about/">Joel James</a>. Loggedin is not affiliated with the WordPress Foundation.`,
		},
	}
})
