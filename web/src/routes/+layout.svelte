<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import AnimationToggle from '$lib/components/AnimationToggle.svelte';
	import { getSiteContent, type LocaleCode } from '$lib/content';
	import '$lib/styles/global.css';
	import 'katex/dist/katex.min.css';

	let { children } = $props();
	let relativePath = $derived(page.url.pathname.slice(base.length));
	let locale = $derived<LocaleCode>(
		relativePath === '/en' || relativePath.startsWith('/en/') ? 'en' : 'zh-CN'
	);
	let site = $derived(getSiteContent(locale));
</script>

<svelte:head>
	<link rel="icon" href={`${base}/favicon.svg`} />
	<link rel="apple-touch-icon" href={`${base}/apple-touch-icon.png`} />
	<link rel="manifest" href={`${base}/site.webmanifest`} />
	<meta name="theme-color" content="#f4efe4" />
	<meta name="application-name" content="VisualChem" />
</svelte:head>

{@render children()}
<AnimationToggle content={site.shared.motionControl} />
