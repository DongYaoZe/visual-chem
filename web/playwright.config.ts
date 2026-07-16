import { defineConfig, devices } from '@playwright/test';

const basePath = process.env.BASE_PATH ?? '';
if (basePath !== '' && !basePath.startsWith('/')) {
	throw new Error('BASE_PATH must be empty or start with /.');
}

export default defineConfig({
	webServer: {
		command: 'npm run build && npm run preview -- --host 127.0.0.1',
		port: 4173,
		reuseExistingServer: !process.env.CI && basePath === '',
		env: { BASE_PATH: basePath }
	},
	testMatch: '**/*.e2e.{ts,js}',
	use: { baseURL: 'http://127.0.0.1:4173' },
	projects: [
		{ name: 'desktop-chromium', use: { ...devices['Desktop Chrome'] } },
		{ name: 'mobile-chromium', use: { ...devices['Pixel 7'] } }
	]
});
