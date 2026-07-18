<script lang="ts">
	import type { EutecticFrame } from '$lib/chem/eutectic-frame';
	import type { CoolingTriViewContent } from '$lib/content';

	interface Props {
		frame: EutecticFrame;
		/** Elapsed time on the recorded curve, seconds; null hides the clock. */
		timeS?: number | null;
		content: CoolingTriViewContent['crucible'];
	}

	let { frame, timeS = null, content }: Props = $props();

	let split = $derived(frame.split);
	let liquidFraction = $derived(split.liquidFraction);
	let solidAFraction = $derived(split.solidAFraction);
	let solidBFraction = $derived(split.solidBFraction);

	// Melt color: interpolate from deep charcoal-red at 60 °C to bright orange at 340 °C
	let tempClamped = $derived(Math.min(340, Math.max(60, frame.temperatureC)));
	let tempT = $derived((tempClamped - 60) / (340 - 60));
	let meltFill = $derived(
		tempT < 0.5
			? `rgb(${Math.round(80 + tempT * 2 * 80)}, ${Math.round(20 + tempT * 2 * 50)}, ${Math.round(20 + tempT * 2 * 20)})`
			: `rgb(${Math.round(160 + (tempT - 0.5) * 2 * 95)}, ${Math.round(70 + (tempT - 0.5) * 2 * 90)}, ${Math.round(40 + (tempT - 0.5) * 2 * 30)})`
	);

	let showBiCrystals = $derived(solidAFraction > 0.005);
	let showCdCrystals = $derived(solidBFraction > 0.005);
	let biScale = $derived(Math.min(1.2, 0.4 + solidAFraction * 3));
	let cdScale = $derived(Math.min(1.2, 0.4 + solidBFraction * 3));
	let showEutecticLamellae = $derived(frame.region === 'solid-mixture');

	let showLiquid = $derived(liquidFraction > 0.005);
	let showSolidA = $derived(solidAFraction > 0.005);
	let showSolidB = $derived(solidBFraction > 0.005);
	let showClock = $derived(timeS != null);
</script>

<figure class="crucible">
	<svg viewBox="0 0 220 190" role="img" aria-label={content.ariaLabel}>
		<g aria-hidden="true">
			<path class="bench" d="M14 168h192" />

			<!-- Furnace stand -->
			<path class="stand" d="M76 160v-98M144 160v-98" stroke="#52625f" stroke-width="2" />
			<path class="stand" d="M76 62h68" stroke="#52625f" stroke-width="2" />

			<!-- Crucible body: truncated cone -->
			<path class="vessel" d="M90 70l-8 82c0 6 6 10 12 10h32c6 0 12-4 12-10l-8-82Z" />

			<!-- Melt fill -->
			{#if showLiquid || frame.region === 'solid-mixture'}
				<path
					class="melt"
					style:fill={meltFill}
					d="M92 74l-7 74c0 4 4 7 9 7h32c5 0 9-3 9-7l-7-74Z"
				/>
			{/if}

			<!-- Eutectic lamellae in solid-mixture region -->
			{#if showEutecticLamellae}
				<g class="eutectic-block">
					{#each Array.from({ length: 8 }, (_item, index) => index) as i (i)}
						<rect
							class:bi={i % 2 === 0}
							class:cd={i % 2 === 1}
							x={103 + i * 2}
							y="144"
							width="2"
							height="12"
						/>
					{/each}
				</g>
			{/if}

			<!-- Bi crystals growing from wall -->
			{#if showBiCrystals && !showEutecticLamellae}
				<g transform={`translate(88 148) scale(${biScale})`}>
					<path class="bi-crystal" d="M0 0l-6-14 4 14z" />
					<path class="bi-crystal" d="M0 0l-4-10 3 10z" />
					<path class="bi-crystal" d="M4 -6l-5-9 4 9z" />
				</g>
			{/if}

			<!-- Cd crystals growing from wall -->
			{#if showCdCrystals && !showEutecticLamellae}
				<g transform={`translate(132 148) scale(${cdScale})`}>
					<path class="cd-crystal" d="M0 0l3-8 3 2-3 6z" />
					<path class="cd-crystal" d="M6 0l3-11 3 2-3 9z" />
					<path class="cd-crystal" d="M2 -7l3-6 2 1-2 5z" />
				</g>
			{/if}

			<!-- Thermocouple probe entering from top -->
			<line class="probe" x1="110" y1="10" x2="110" y2="100" />
			<circle class="probe-tip" cx="110" cy="102" r="2.5" />

			<!-- Temperature chip -->
			<g class="placard">
				<text class="label strong" x="212" y="16" text-anchor="end"
					>{content.temperatureLabel({
						temperatureC: Math.round(frame.temperatureC)
					})}</text
				>
				{#if showLiquid}
					<text class="label" x="212" y="29" text-anchor="end"
						>{content.liquidLabel({
							percent: (liquidFraction * 100).toFixed(0)
						})}</text
					>
				{/if}
				{#if showSolidA}
					<text class="label" x="212" y="42" text-anchor="end"
						>{content.solidALabel({
							percent: (solidAFraction * 100).toFixed(0)
						})}</text
					>
				{/if}
				{#if showSolidB}
					<text class="label" x="212" y="55" text-anchor="end"
						>{content.solidBLabel({
							percent: (solidBFraction * 100).toFixed(0)
						})}</text
					>
				{/if}
				{#if showClock}
					<text class="label clock" x="212" y="70" text-anchor="end"
						>{content.clockLabel({
							minutes: ((timeS ?? 0) / 60).toFixed(1)
						})}</text
					>
				{/if}
			</g>
		</g>
	</svg>
	<figcaption><span>{content.viewName}</span> {content.caption}</figcaption>
</figure>

<style>
	.crucible {
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

	.stand {
		fill: none;
	}

	.vessel {
		fill: rgba(200, 190, 175, 0.4);
		stroke: #52625f;
		stroke-width: 2.5;
	}

	.melt {
		transition: fill 500ms ease;
	}

	.bi-crystal {
		fill: rgba(95, 99, 152, 0.85);
		stroke: #4c4f7c;
		stroke-linejoin: round;
		stroke-width: 0.8;
	}

	.cd-crystal {
		fill: rgba(163, 112, 42, 0.85);
		stroke: #8a5d24;
		stroke-linejoin: round;
		stroke-width: 0.8;
	}

	.eutectic-block rect.bi {
		fill: #5f6398;
	}

	.eutectic-block rect.cd {
		fill: #a3702a;
	}

	.probe {
		stroke: rgba(31, 40, 38, 0.3);
		stroke-linecap: round;
		stroke-width: 2.5;
	}

	.probe-tip {
		fill: #52625f;
	}

	.label {
		fill: var(--ink-muted);
		font-family: var(--mono);
		font-size: 8px;
		font-weight: 700;
		paint-order: stroke;
		stroke: var(--paper);
		stroke-width: 3;
	}

	.label.strong {
		fill: var(--ink);
		font-size: 9.5px;
	}

	.label.clock {
		fill: var(--ink);
		font-size: 8.5px;
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
