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
				text: 'General',
				collapsed: false,
				items: [
					{ text: 'Installing a Plugin', link: '/general/installing-plugin' },
					{ text: 'Manually Updating', link: '/general/manually-updating' },
				]
			},
			{
				text: 'Addon - Realtime Logout',
				collapsed: false,
				items: [
					{ text: 'Configuration', link: '/realtime-logout/configuration' },
				]
			},
			{
				text: 'Addon - Limit Per User',
				collapsed: false,
				items: [
					{ text: 'Configuration', link: '/limit-per-user/configuration' },
				]
			}
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
