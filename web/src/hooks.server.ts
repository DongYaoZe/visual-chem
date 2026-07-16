import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const language = event.route.id?.startsWith('/en') ? 'en' : 'zh-CN';
	return resolve(event, {
		transformPageChunk: ({ html }) =>
			html.replace('<html lang="zh-CN">', `<html lang="${language}">`)
	});
};
