<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import { onMount, tick, type Snippet } from 'svelte';

	interface Props {
		/** aria-label for the graphic when it becomes a short-viewport dialog. */
		dialogAriaLabel: string;
		closeAriaLabel: string;
		openButtonLabel: string;
		statusAriaLabel: string;
		/** The sticky graphic a story keeps in view — usually a TriView. */
		stage: Snippet;
		/** The compact readings quoted in the short-viewport status strip. */
		status: Snippet;
	}

	let { dialogAriaLabel, closeAriaLabel, openButtonLabel, statusAriaLabel, stage, status }: Props =
		$props();

	let open = $state(false);
	let openButton: HTMLButtonElement;
	let closeButton: HTMLButtonElement;

	async function openDialog() {
		open = true;
		document.body.style.overflow = 'hidden';
		await tick();
		closeButton.focus();
	}

	async function closeDialog(restoreFocus = true) {
		open = false;
		document.body.style.overflow = '';
		await tick();
		if (restoreFocus && openButton?.isConnected && openButton.offsetParent !== null) {
			openButton.focus();
		}
	}

	beforeNavigate(() => {
		open = false;
		document.body.style.overflow = '';
	});

	onMount(() => {
		const shortViewport = window.matchMedia('(max-width: 850px) and (max-height: 650px)');
		const closeWhenViewportGrows = () => {
			if (open && !shortViewport.matches) void closeDialog(false);
		};
		shortViewport.addEventListener('change', closeWhenViewportGrows);
		return () => {
			shortViewport.removeEventListener('change', closeWhenViewportGrows);
			open = false;
			document.body.style.overflow = '';
		};
	});
</script>

<svelte:window
	onkeydown={(event) => {
		if (event.key === 'Escape' && open) closeDialog();
		if (event.key === 'Tab' && open) {
			event.preventDefault();
			closeButton.focus();
		}
	}}
/>

<div
	class="graphic"
	class:short-open={open}
	role={open ? 'dialog' : undefined}
	aria-modal={open ? 'true' : undefined}
	aria-label={open ? dialogAriaLabel : undefined}
>
	<button
		bind:this={closeButton}
		class="close-graphic"
		type="button"
		onclick={() => closeDialog()}
		aria-label={closeAriaLabel}>×</button
	>
	{@render stage()}
</div>
<aside class="short-state" aria-label={statusAriaLabel}>
	{@render status()}
	<button bind:this={openButton} type="button" onclick={openDialog}>{openButtonLabel}</button>
</aside>

<style>
	.graphic {
		position: sticky;
		top: 1rem;
		grid-column: 2;
		grid-row: 1;
	}

	.close-graphic {
		display: none;
	}

	.short-state {
		display: none;
	}

	@media (max-width: 850px) {
		.graphic {
			position: sticky;
			top: 0;
			z-index: 6;
			width: calc(100% - 16px);
			margin-inline: auto;
			padding-top: 0.35rem;
		}
	}

	@media (max-width: 620px) {
		.graphic {
			width: calc(100% - 8px);
		}
	}

	@media (max-width: 850px) and (max-height: 650px) {
		.graphic {
			position: relative;
			top: auto;
		}

		.short-state {
			position: sticky;
			top: 0;
			z-index: 7;
			display: flex;
			min-height: 38px;
			padding: 0.4rem 0.7rem;
			gap: 0.65rem;
			align-items: center;
			justify-content: center;
			border-block: 1px solid var(--line);
			background: rgba(250, 247, 239, 0.96);
			font-family: var(--mono);
			font-size: 0.58rem;
		}

		.short-state button {
			margin-left: auto;
			padding: 0.35rem 0.55rem;
			border: 1px solid var(--ink);
			border-radius: 999px;
			background: var(--ink);
			color: var(--paper);
			cursor: pointer;
			font-weight: 800;
		}

		.graphic.short-open {
			position: fixed;
			inset: 6px;
			z-index: 120;
			display: grid;
			width: auto;
			margin: 0;
			overflow: auto;
			place-items: center;
			padding: 34px 4px 4px;
			background: rgba(244, 239, 228, 0.98);
		}

		.graphic.short-open .close-graphic {
			position: fixed;
			top: 12px;
			right: 12px;
			z-index: 121;
			display: grid;
			width: 36px;
			height: 36px;
			place-items: center;
			border: 1px solid var(--ink);
			border-radius: 50%;
			background: var(--paper);
			color: var(--ink);
			cursor: pointer;
			font-size: 1.2rem;
		}
	}
</style>
