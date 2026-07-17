<script lang="ts">
	import type { WaterFrame } from '$lib/chem';
	import type { WaterTriViewContent } from '$lib/content';

	interface Props {
		frame: WaterFrame;
		active?: boolean;
		content: WaterTriViewContent['race'];
	}

	let { frame, active = true, content }: Props = $props();

	// The escape/return balance is read from the computed state: below the
	// boiling point the return arrow holds its own; at the boil the escape
	// flow visibly wins. The particles themselves are theater.
	let escaping = Array.from({ length: 10 }, (_, index) => ({
		index,
		x: 8 + ((index * 37) % 84),
		delay: -((index * 0.31) % 2.6)
	}));
	let returning = Array.from({ length: 10 }, (_, index) => ({
		index,
		x: 12 + ((index * 41) % 80),
		delay: -((index * 0.37) % 2.9)
	}));

	// How many of each flow are visible: escape scales with saturation
	// pressure relative to ambient (capped), return stays constant.
	let escapeCount = $derived.by(() => {
		if (frame.phase === 'vapor' || frame.phase === 'supercritical') return 10;
		if (frame.saturationPressurePa === null) return frame.phase === 'solid' ? 1 : 3;
		const ratio = frame.saturationPressurePa / frame.pressurePa;
		return Math.max(2, Math.min(10, Math.round(2 + ratio * 8)));
	});
	let returnCount = $derived(frame.phase === 'vapor' || frame.phase === 'supercritical' ? 2 : 6);
</script>

<figure class="race" class:active class:boiling={frame.boiling}>
	<div class="chamber">
		<div class="flow-labels" aria-hidden="true">
			<span class="escape-label">↑ {content.escapeLabel} × {escapeCount}</span>
			<span class="return-label">↓ {content.returnLabel} × {returnCount}</span>
		</div>
		<div class="interface"></div>

		{#each escaping.slice(0, escapeCount) as particle (particle.index)}
			<i
				class="particle escape"
				style:left={`${particle.x}%`}
				style:animation-delay={`${particle.delay}s`}
			></i>
		{/each}
		{#each returning.slice(0, returnCount) as particle (particle.index)}
			<i
				class="particle return"
				style:left={`${particle.x}%`}
				style:animation-delay={`${particle.delay}s`}
			></i>
		{/each}
	</div>
	<figcaption><span>{content.viewName}</span> {content.caption}</figcaption>
</figure>

<style>
	.race {
		display: grid;
		height: 100%;
		min-height: 220px;
		margin: 0;
		grid-template-rows: 1fr auto;
	}

	.chamber {
		position: relative;
		min-height: 180px;
		overflow: hidden;
		border: 1px solid rgba(31, 40, 38, 0.2);
		border-radius: 14px;
		background: linear-gradient(
			to bottom,
			rgba(255, 255, 255, 0.5) 0 62%,
			rgba(32, 127, 140, 0.22) 62%
		);
	}

	.interface {
		position: absolute;
		top: 62%;
		left: 0;
		width: 100%;
		height: 2px;
		background: linear-gradient(90deg, transparent, var(--water), transparent);
		opacity: 0.6;
	}

	.flow-labels {
		position: absolute;
		top: 8px;
		right: 10px;
		z-index: 2;
		display: grid;
		gap: 2px;
		font-family: var(--mono);
		font-size: 0.58rem;
		font-weight: 700;
		text-align: right;
	}

	.escape-label {
		color: var(--ethanol);
	}

	.return-label {
		color: var(--water);
	}

	.particle {
		position: absolute;
		width: 7px;
		height: 7px;
		border-radius: 50%;
		opacity: 0;
	}

	.particle.escape {
		top: 60%;
		background: var(--ethanol);
	}

	.particle.return {
		top: 6%;
		background: var(--water);
	}

	.active .particle.escape {
		animation: escape 2.4s ease-out infinite;
	}

	.active .particle.return {
		animation: fall 2.7s ease-in infinite;
	}

	.boiling .particle.escape {
		animation-duration: 1.3s;
	}

	@keyframes escape {
		0% {
			transform: translateY(0) scale(0.8);
			opacity: 0;
		}
		18% {
			opacity: 0.95;
		}
		100% {
			transform: translateY(-105px) scale(1.05);
			opacity: 0;
		}
	}

	@keyframes fall {
		0% {
			transform: translateY(0) scale(0.9);
			opacity: 0;
		}
		20% {
			opacity: 0.9;
		}
		100% {
			transform: translateY(96px) scale(1);
			opacity: 0;
		}
	}

	figcaption {
		margin: 0.1rem 0 0;
		color: var(--ink-muted);
		font-size: 0.64rem;
		line-height: 1.4;
	}

	figcaption span {
		margin-right: 0.35rem;
		color: var(--ink);
		font-family: var(--mono);
		font-weight: 800;
		letter-spacing: 0.12em;
	}
</style>
