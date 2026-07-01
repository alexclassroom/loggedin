/**
 * Barrel export — shared UI primitives used across every admin tab.
 *
 * Imports elsewhere read like `import { AppShell, PageHeader } from '../common'`
 * rather than reaching into individual files, so the common shape of
 * an admin page is obvious from the top of each module.
 */
export { default as AdminNoticeSlot } from './admin-notice-slot';
export { default as AppShell } from './app-shell';
export { default as ErrorBoundary } from './error-boundary';
export { default as Footer } from './footer';
export { default as Notices } from './notices';
export { default as PageBody } from './page-body';
export { default as PageHeader } from './page-header';
export { default as TabNav } from './tab-nav';
