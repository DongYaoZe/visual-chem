<script lang="ts">
	import { onMount } from 'svelte';
	import { type MotionControlContent, zhCNSiteContent } from '$lib/content';

	interface Props {
		content?: MotionControlContent;
	}

	let { content = zhCNSiteContent.shared.motionControl }: Props = $props();

	let paused = $state(false);

	onMount(() => {
		paused = window.localStorage.getItem('visual-chem-motion') === 'paused';
		applyPreference();
	});

	function applyPreference() {
		document.documentElement.dataset.motion = paused ? 'paused' : 'playing';
	}

	function toggle() {
		paused = !paused;
		window.localStorage.setItem('visual-chem-motion', paused ? 'paused' : 'playing');
		applyPreference();
	}
</script>

<button type="button" onclick={toggle} aria-label={paused ? content.resume : content.pause}>
	<span class="icon" aria-hidden="true">{paused ? '▶' : 'Ⅱ'}</span>
	<span class="label">{paused ? content.resume : content.pause}</span>
</button>

<style>
	button {
		position: fixed;
		right: 14px;
		bottom: 14px;
		z-index: 80;
		display: flex;
		min-height: 40px;
		padding: 0.55rem 0.72rem;
		gap: 0.4rem;
		align-items: center;
		border: 1px solid rgba(31, 40, 38, 0.28);
		border-radius: 999px;
		background: rgba(250, 247, 239, 0.92);
		box-shadow: 0 6px 20px rgba(31, 40, 38, 0.13);
		color: var(--ink);
		cursor: pointer;
		font-family: var(--mono);
		font-size: 0.6rem;
		font-weight: 700;
		backdrop-filter: blur(9px);
	}

	button .icon {
		font-size: 0.66rem;
	}

	@media (max-width: 560px) {
		button {
			right: 8px;
			bottom: 8px;
			width: 36px;
			min-height: 36px;
			padding: 0;
			justify-content: center;
		}

		button .label {
			display: none;
		}
	}
</style>
