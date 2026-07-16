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
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
<span class:display>{@html markup}</span>

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
