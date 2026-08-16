<script lang="ts">
	import { resolve } from '$app/paths';
	import { type HeaderContent, type LocaleCode, zhCNSiteContent } from '$lib/content';
	import siteConfig from '$lib/config/site';

	interface Props {
		compact?: boolean;
		locale?: LocaleCode;
		content?: HeaderContent;
	}

	let {
		compact = false,
		locale = 'zh-CN',
		content = zhCNSiteContent.shared.header
	}: Props = $props();
	let home = $derived(locale === 'en' ? resolve('/en/') : resolve('/'));
	let story = $derived(
		locale === 'en'
			? resolve('/en/stories/ethanol-distillation/')
			: resolve('/stories/ethanol-distillation/')
	);
	let primaryHref = $derived(compact ? home : story);
	let primaryLabel = $derived(compact ? content.catalogLink : content.storyLink);
</script>

<header class:compact>
	<a class="brand" href={home} aria-label={content.homeAriaLabel}>
		<svg viewBox="0 0 44 44" aria-hidden="true">
			<path d="M7 33.2 17.5 9.8h9L37 33.2" />
			<path d="M12.5 27.4h19" />
			<circle cx="17.5" cy="27.4" r="2.2" />
			<circle cx="27" cy="27.4" r="2.2" />
		</svg>
		<span>{content.brand}</span>
		<small>{content.tagline} · v{siteConfig.version}</small>
	</a>
	<nav aria-label={content.navigationAriaLabel}>
		<a href={primaryHref}>{primaryLabel}</a>
		<a href="https://github.com/DongYaoZe/visual-chem">{content.githubLink}</a>
	</nav>
</header>

<style>
	header {
		position: relative;
		z-index: 20;
		display: flex;
		width: min(1180px, calc(100% - 40px));
		min-height: 84px;
		margin-inline: auto;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid var(--line);
	}

	header.compact {
		min-height: 68px;
	}

	.brand {
		display: grid;
		grid-template-columns: 38px auto;
		column-gap: 0.65rem;
		align-items: center;
		color: var(--ink);
		text-decoration: none;
	}

	.brand svg {
		grid-row: span 2;
		width: 38px;
		height: 38px;
		fill: none;
		stroke: var(--ethanol);
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-width: 2.2;
	}

	.brand span {
		align-self: end;
		font-family: var(--serif);
		font-size: 1.12rem;
		font-weight: 700;
		letter-spacing: -0.02em;
		line-height: 1;
	}

	.brand small {
		align-self: start;
		margin-top: 0.28rem;
		color: var(--ink-muted);
		font-family: var(--mono);
		font-size: 0.58rem;
		letter-spacing: 0.09em;
	}

	nav {
		display: flex;
		gap: 1.8rem;
		align-items: center;
	}

	nav a {
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-decoration: none;
	}

	nav a:first-child {
		padding: 0.72rem 1rem;
		border: 1px solid var(--ink);
		border-radius: 999px;
		transition:
			background 180ms ease,
			color 180ms ease;
	}

	nav a:first-child:hover {
		background: var(--ink);
		color: var(--paper);
	}

	@media (max-width: 680px) {
		header {
			width: calc(100% - 24px);
			min-height: 68px;
		}

		.brand small,
		nav a:last-child {
			display: none;
		}

		.brand {
			grid-template-columns: 30px auto;
		}

		.brand svg {
			grid-row: auto;
			width: 30px;
			height: 30px;
		}

		nav a:first-child {
			padding: 0.6rem 0.75rem;
			font-size: 0.68rem;
		}
	}
</style>
