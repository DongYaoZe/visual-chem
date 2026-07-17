<script lang="ts">
	import type { WaterFrame } from '$lib/chem';
	import type { WaterTriViewContent } from '$lib/content';

	interface Props {
		frame: WaterFrame;
		/** Altitude readout shown on the placard, when the scene is traveling. */
		altitudeM?: number | null;
		active?: boolean;
		content: WaterTriViewContent['kitchen'];
	}

	let { frame, altitudeM = null, active = true, content }: Props = $props();
	const uid = $props.id();

	// Everything the drawing says is derived from the frame: whether the pot
	// rolls, how hard, and what the placard reads.
	let boiling = $derived(frame.boiling);
	let frozen = $derived(frame.phase === 'solid');
	let steamStrength = $derived(boiling ? 1 : frame.temperatureC > 55 ? 0.4 : 0);
	let bubbleSeeds = [0, 1, 2, 3, 4, 5, 6, 7];
</script>

<figure class="kitchen" class:active class:boiling class:frozen>
	<svg viewBox="0 0 520 300" role="img" aria-label={content.ariaLabel}>
		<defs>
			<linearGradient id={`${uid}-steel`} x1="0" x2="1">
				<stop offset="0" stop-color="#fff" stop-opacity=".65" />
				<stop offset=".5" stop-color="#cfdad7" stop-opacity=".2" />
				<stop offset="1" stop-color="#fff" stop-opacity=".45" />
			</linearGradient>
		</defs>

		<path class="bench" d="M20 268h480" />

		<!-- Pot -->
		<path
			class="pot"
			fill={`url(#${uid}-steel)`}
			d="M140 128h240v104c0 20-14 32-34 32H174c-20 0-34-12-34-32Z"
		/>
		<path class="handle" d="M140 150h-36m276-22v0m0 22h36" />
		<path
			class="water"
			class:ice={frozen}
			d="M152 152h216v80c0 14-10 22-26 22H178c-16 0-26-8-26-22Z"
		/>

		{#if frozen}
			<path class="crack" d="M200 190l30 12 24-16 30 18 26-12" />
		{:else}
			{#each bubbleSeeds as seed (seed)}
				<circle
					class="bubble"
					cx={168 + ((seed * 29) % 184)}
					cy={238 - ((seed * 13) % 48)}
					r={2.5 + (seed % 3)}
					style:animation-delay={`${seed * -0.27}s`}
				/>
			{/each}
		{/if}

		<!-- Steam -->
		{#each [0, 1, 2] as plume (plume)}
			<path
				class="steam"
				style:opacity={steamStrength * (0.8 - plume * 0.2)}
				style:animation-delay={`${plume * -0.7}s`}
				d={`M${212 + plume * 48} 118c-8-14 8-22 0-36c-6-10 6-18 2-28`}
			/>
		{/each}

		<!-- Flame -->
		<g class="burner">
			<path
				class="flame outer"
				d="M228 288c-6-14 4-20 8-30c6 12 14 14 10 30c8-6 10-2 8 6h-44c-2-8 0-12 8-6c-4-16 4-18 10-30c4 10 6 16 0 30Z"
			/>
		</g>
		<path class="stove" d="M208 268h104v10c0 6-6 10-14 10h-76c-8 0-14-4-14-10Z" />

		<!-- Placard -->
		<g class="placard">
			{#if altitudeM !== null}
				<text class="label" x="472" y="52" text-anchor="end"
					>{content.altitudeLabel({ altitudeM })}</text
				>
			{/if}
			{#if frame.boilingPointC !== null}
				<text class="label strong" x="472" y="74" text-anchor="end"
					>{content.boilingLabel({ temperatureC: frame.boilingPointC.toFixed(1) })}</text
				>
			{/if}
			<text class="label" x="472" y="96" text-anchor="end"
				>{content.waterState({ temperatureC: frame.temperatureC.toFixed(1) })}</text
			>
		</g>
	</svg>
	<figcaption><span>{content.viewName}</span> {content.caption}</figcaption>
</figure>

<style>
	.kitchen {
		height: 100%;
		min-height: 220px;
		margin: 0;
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
		max-height: 260px;
	}

	.bench {
		stroke: rgba(31, 40, 38, 0.22);
		stroke-width: 2;
	}

	.pot {
		stroke: #52625f;
		stroke-width: 3;
	}

	.handle,
	.stove {
		fill: none;
		stroke: #52625f;
		stroke-linecap: round;
		stroke-width: 3;
	}

	.stove {
		fill: rgba(82, 98, 95, 0.12);
	}

	.water {
		fill: rgba(32, 127, 140, 0.55);
		transition: fill 500ms ease;
	}

	.water.ice {
		fill: rgba(190, 216, 222, 0.85);
	}

	.crack {
		fill: none;
		stroke: rgba(255, 255, 255, 0.9);
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-width: 2;
	}

	.bubble {
		fill: rgba(255, 255, 255, 0.3);
		stroke: rgba(255, 255, 255, 0.85);
		opacity: 0;
	}

	.active.boiling .bubble {
		animation: rise 1.6s ease-in infinite;
	}

	.steam {
		fill: none;
		stroke: rgba(31, 40, 38, 0.4);
		stroke-linecap: round;
		stroke-width: 3;
		transition: opacity 500ms ease;
	}

	.active .steam {
		animation: drift 2.6s ease-in-out infinite;
	}

	.flame {
		fill: rgba(214, 107, 50, 0.85);
		opacity: 0.9;
	}

	.active .flame {
		animation: flicker 900ms ease-in-out infinite alternate;
	}

	.label {
		fill: var(--ink-muted);
		font-family: var(--mono);
		font-size: 12px;
		font-weight: 700;
	}

	.label.strong {
		fill: var(--ink);
		font-size: 13px;
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

	@keyframes rise {
		0% {
			transform: translateY(6px) scale(0.6);
			opacity: 0;
		}
		30% {
			opacity: 0.95;
		}
		100% {
			transform: translateY(-58px) scale(1.2);
			opacity: 0;
		}
	}

	@keyframes drift {
		0%,
		100% {
			transform: translateX(0);
		}
		50% {
			transform: translateX(5px) translateY(-4px);
		}
	}

	@keyframes flicker {
		to {
			transform: scaleY(1.12);
			opacity: 0.75;
		}
	}
</style>
