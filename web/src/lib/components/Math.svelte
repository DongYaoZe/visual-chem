<script lang="ts">
	import katex from 'katex';

	interface Props {
		formula: string;
		display?: boolean;
	}

	let { formula, display = false }: Props = $props();
	let markup = $derived(
		katex.renderToString(formula, {
			displayMode: display,
			throwOnError: false,
			strict: 'warn',
			output: 'htmlAndMathml'
		})
	);
</script>

<!-- KaTeX escapes formula text and produces the trusted markup locally. -->
<!-- Display formulas can overflow-scroll on narrow screens, so they must be
     keyboard-reachable (axe: scrollable-region-focusable). -->
{#if display}
	<!-- svelte-ignore a11y_no_noninteractive_tabindex (keyboard users need to pan overflowing display math) -->
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	<span class="display" tabindex="0" role="math" aria-label={formula}>{@html markup}</span>
{:else}
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	<span>{@html markup}</span>
{/if}

<style>
	span {
		display: inline-block;
		max-width: 100%;
	}

	.display {
		display: block;
		overflow-x: auto;
		padding-block: 0.25rem;
	}
</style>
