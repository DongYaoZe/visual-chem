<script lang="ts">
	import {
		hydrogenEnergyEv,
		hydrogenSeriesLines,
		isVisibleWavelength,
		visibleWavelengthColor
	} from '$lib/chem';
	import type { HydrogenSpectrumFrame } from '$lib/chem';
	import type { HydrogenSpectrumTriViewContent } from '$lib/content';

	type Focus = 'tube' | 'levels' | 'spectrum' | 'all';

	interface Props {
		frame: HydrogenSpectrumFrame;
		showSeriesSet?: boolean;
		active?: boolean;
		focus?: Focus;
		label?: string;
		content: HydrogenSpectrumTriViewContent;
	}

	let {
		frame,
		showSeriesSet = true,
		active = false,
		focus = 'all',
		label,
		content
	}: Props = $props();

	const uid = $props.id();
	const glowId = `${uid}-hydrogen-glow`;
	const arrowId = `${uid}-level-arrow`;
	const gradientId = `${uid}-visible-spectrum`;
	const glowUrl = `url(#${glowId})`;
	const arrowUrl = `url(#${arrowId})`;
	const gradientUrl = `url(#${gradientId})`;

	let upperN = $derived(frame.upperN);
	let lowerN = $derived(frame.lowerN);
	let wavelengthNm = $derived(frame.wavelengthNm);
	let visible = $derived(frame.isVisible);
	let region = $derived(frame.region);
	let regionName = $derived(content.regionNames[region]);
	let selectedColor = $derived(frame.displayColor);
	let ariaLabel = $derived(label ?? content.defaultAriaLabel);
	let photonEnergyEv = $derived(frame.photonEnergyEv);
	let gapEv = $derived(frame.energyGapEv);
	let displayLines = $derived(showSeriesSet ? hydrogenSeriesLines(lowerN) : [frame]);
	let axisBounds = $derived.by(() => {
		if (lowerN === 1) return { min: 90, max: 130 };
		if (lowerN === 2) return { min: 380, max: 750 };
		if (lowerN === 3) return { min: 800, max: 1900 };
		return { min: wavelengthNm * 0.85, max: wavelengthNm * 1.15 };
	});
	let spectrumTicks = $derived.by(() => {
		if (lowerN === 1) return [90, 100, 110, 120, 130];
		if (lowerN === 2) return [400, 500, 600, 700];
		if (lowerN === 3) return [900, 1200, 1500, 1800];
		return [axisBounds.min, wavelengthNm, axisBounds.max];
	});

	function dimmed(panel: Exclude<Focus, 'all'>): boolean {
		return focus !== 'all' && focus !== panel;
	}

	function levelY(n: number): number {
		const fraction = (hydrogenEnergyEv(n) - hydrogenEnergyEv(1)) / -hydrogenEnergyEv(1);
		return 220 - fraction * 178;
	}

	function spectrumX(wavelength: number): number {
		return 48 + ((wavelength - axisBounds.min) / (axisBounds.max - axisBounds.min)) * 510;
	}
</script>

<section class="tri-view" data-testid="hydrogen-spectrum-tri-view" aria-label={ariaLabel}>
	<p class="visually-hidden" aria-live="polite">
		{content.liveSummary({
			upperN,
			lowerN,
			wavelengthNm: wavelengthNm.toFixed(1),
			region: regionName
		})}
	</p>
	<header>
		<div>
			<span class="live-dot" class:active aria-hidden="true"></span>{content.synchronizedState}
		</div>
		<dl>
			<div>
				<dt>{content.transitionLabel}</dt>
				<dd>n={upperN}→{lowerN}</dd>
			</div>
			<div>
				<dt>{content.wavelengthLabel}</dt>
				<dd>{wavelengthNm.toFixed(1)} nm</dd>
			</div>
			<div class="limit">
				<dt>{content.photonEnergyLabel}</dt>
				<dd>{photonEnergyEv.toFixed(3)} eV</dd>
			</div>
		</dl>
	</header>
	<div class="mobile-status" aria-hidden="true">
		<span>n {upperN}→{lowerN}</span><span>{wavelengthNm.toFixed(1)} nm</span><span
			>{regionName}</span
		>
	</div>

	<div class="views">
		<figure
			class="panel macro"
			class:dimmed={dimmed('tube')}
			data-testid="hydrogen-discharge-tube"
			data-region={region}
			data-wavelength-nm={wavelengthNm.toFixed(2)}
		>
			<svg
				viewBox="0 0 440 180"
				role="img"
				aria-label={content.tube.ariaLabel({
					wavelengthNm: wavelengthNm.toFixed(1),
					region: regionName
				})}
			>
				<defs>
					<filter id={glowId}><feGaussianBlur stdDeviation="5" /></filter>
				</defs>
				<rect class="dark" x="3" y="3" width="434" height="174" rx="14" />
				<g class="tube-shape">
					<rect x="26" y="60" width="148" height="58" rx="29" />
					<line x1="42" y1="89" x2="62" y2="89" />
					<line x1="138" y1="89" x2="158" y2="89" />
					<path class="plasma" style:filter={glowUrl} d="M62 89 C82 67 113 111 138 89" />
				</g>
				<text x="100" y="142" text-anchor="middle">{content.tube.tubeLabel}</text>
				<g class="grating">
					<line x1="214" y1="46" x2="214" y2="132" />
					{#each [0, 1, 2, 3, 4, 5] as offset (offset)}
						<line x1={207 + offset * 3} y1="52" x2={207 + offset * 3} y2="126" />
					{/each}
					<text x="214" y="151" text-anchor="middle">{content.tube.gratingLabel}</text>
				</g>
				<line class="incident" x1="174" y1="89" x2="206" y2="89" />
				{#each displayLines as line, index (`${line.upperN}-${line.lowerN}`)}
					{@const color = visibleWavelengthColor(line.wavelengthNm)}
					{@const lineVisible = isVisibleWavelength(line.wavelengthNm)}
					{@const endY = 48 + index * (86 / Math.max(1, displayLines.length - 1))}
					{#if lineVisible}
						<line
							class="beam-glow"
							x1="222"
							y1="89"
							x2="400"
							y2={endY}
							stroke={color}
							style:filter={glowUrl}
							class:selected={line.upperN === upperN && line.lowerN === lowerN}
						/>
					{/if}
					<line
						class="beam"
						class:invisible={!lineVisible}
						x1="222"
						y1="89"
						x2="400"
						y2={endY}
						stroke={color}
						class:selected={line.upperN === upperN && line.lowerN === lowerN}
					/>
					<line x1="404" y1={endY - 8} x2="404" y2={endY + 8} stroke={color} stroke-width="4" />
				{/each}
				{#if !visible}
					<text class="invisible-note" x="330" y="90" text-anchor="middle">{regionName}</text>
				{/if}
				<text x="330" y="158" text-anchor="middle">{content.tube.lightLabel}</text>
			</svg>
			<figcaption><strong>{content.tube.viewName}</strong>{content.tube.caption}</figcaption>
		</figure>

		<figure
			class="panel micro"
			class:dimmed={dimmed('levels')}
			data-testid="hydrogen-energy-levels"
			data-upper-n={upperN}
			data-lower-n={lowerN}
		>
			<svg
				viewBox="0 0 400 250"
				role="img"
				aria-label={content.levels.ariaLabel({
					upperN,
					lowerN,
					energyEv: gapEv.toFixed(3),
					wavelengthNm: wavelengthNm.toFixed(1),
					region: regionName,
					isVisible: visible
				})}
			>
				<defs>
					<marker
						id={arrowId}
						viewBox="0 0 10 10"
						refX="8"
						refY="5"
						markerWidth="6"
						markerHeight="6"
						orient="auto-start-reverse"
					>
						<path d="M 0 0 L 10 5 L 0 10 z" fill={selectedColor} />
					</marker>
				</defs>
				<line class="axis" x1="50" y1="28" x2="50" y2="226" />
				<text class="axis-label" x="16" y="132" transform="rotate(-90 16 132)"
					>{content.levels.energyAxis}</text
				>
				{#each [1, 2, 3, 4, 5, 6] as n (n)}
					<line
						class="level"
						class:selected-level={n === upperN || n === lowerN}
						x1="72"
						x2="330"
						y1={levelY(n)}
						y2={levelY(n)}
					/>
					<text class="level-label" x="340" y={levelY(n) + 4}>n={n}</text>
				{/each}
				<circle
					class="electron"
					class:active
					cx="132"
					cy={levelY(upperN)}
					r="7"
					fill={selectedColor}
				/>
				<text x="113" y={levelY(upperN) - 10}>{content.levels.electronLabel}</text>
				<line
					class="transition-arrow"
					x1="196"
					y1={levelY(upperN) + 5}
					x2="196"
					y2={levelY(lowerN) - 6}
					stroke={selectedColor}
					marker-end={arrowUrl}
				/>
				<text
					class="photon-label"
					x="205"
					y={(levelY(upperN) + levelY(lowerN)) / 2}
					fill={selectedColor}
				>
					{content.levels.photonLabel({ wavelengthNm: wavelengthNm.toFixed(1) })}
				</text>
			</svg>
			<figcaption><strong>{content.levels.viewName}</strong>{content.levels.caption}</figcaption>
		</figure>

		<figure
			class="panel symbol"
			class:dimmed={dimmed('spectrum')}
			data-testid="hydrogen-line-spectrum"
			data-series={frame.series}
		>
			<svg
				viewBox="0 0 600 190"
				role="img"
				aria-label={content.spectrum.ariaLabel({
					upperN,
					lowerN,
					wavelengthNm: wavelengthNm.toFixed(1),
					region: regionName,
					isVisible: visible
				})}
			>
				<defs>
					<linearGradient id={gradientId} x1="0" x2="1">
						<stop offset="0" stop-color="#6d3cb4" /><stop offset="0.18" stop-color="#4668df" />
						<stop offset="0.35" stop-color="#2fa9c8" /><stop offset="0.55" stop-color="#55a75a" />
						<stop offset="0.75" stop-color="#e2a62b" /><stop offset="1" stop-color="#d84646" />
					</linearGradient>
				</defs>
				<text class="series-title" x="48" y="23">
					{content.spectrum.seriesNames[frame.series]} · n→{lowerN}
				</text>
				<rect
					class="spectrum-band"
					fill={lowerN === 2 ? gradientUrl : undefined}
					x="48"
					y="43"
					width="510"
					height="72"
					rx="5"
				/>
				{#each displayLines as line (`${line.upperN}-${line.lowerN}`)}
					<line
						class="spectral-line"
						class:selected={line.upperN === upperN && line.lowerN === lowerN}
						x1={spectrumX(line.wavelengthNm)}
						x2={spectrumX(line.wavelengthNm)}
						y1="48"
						y2="110"
						stroke={visibleWavelengthColor(line.wavelengthNm)}
					/>
				{/each}
				<path
					class="selected-marker"
					d={`M${spectrumX(wavelengthNm) - 5} 36 L${spectrumX(wavelengthNm)} 43 L${spectrumX(wavelengthNm) + 5} 36`}
				/>
				<text class="selected-label" x={spectrumX(wavelengthNm)} y="31" text-anchor="middle">
					{content.spectrum.selectedLine}
					{wavelengthNm.toFixed(1)} nm
				</text>
				<line class="spectrum-axis" x1="48" x2="558" y1="130" y2="130" />
				{#each spectrumTicks as tick (tick)}
					<line class="tick" x1={spectrumX(tick)} x2={spectrumX(tick)} y1="130" y2="136" />
					<text class="tick-label" x={spectrumX(tick)} y="151" text-anchor="middle"
						>{tick.toFixed(0)}</text
					>
				{/each}
				<text class="axis-title" x="303" y="174" text-anchor="middle">{content.spectrum.xAxis}</text
				>
			</svg>
			<figcaption>
				<strong>{content.spectrum.viewName}</strong>{content.spectrum.caption}
			</figcaption>
		</figure>
	</div>
</section>

<style>
	.tri-view {
		overflow: hidden;
		border: 1px solid rgba(31, 40, 38, 0.2);
		border-radius: 20px;
		background: rgba(250, 247, 239, 0.94);
		box-shadow: var(--shadow);
		color: var(--ink);
		backdrop-filter: blur(18px);
	}
	header {
		display: flex;
		min-height: 48px;
		padding: 0.55rem 0.8rem 0.55rem 1rem;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid var(--line);
		background: rgba(31, 40, 38, 0.035);
		font-family: var(--mono);
		font-size: 0.62rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
	header > div:first-child {
		display: flex;
		gap: 0.45rem;
		align-items: center;
		white-space: nowrap;
	}
	.live-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: #7757a8;
		box-shadow: 0 0 0 4px rgba(119, 87, 168, 0.14);
	}
	.live-dot.active {
		animation: pulse 1.25s ease-in-out infinite alternate;
	}
	dl {
		display: flex;
		margin: 0;
		gap: 0.35rem;
		align-items: center;
	}
	dl div {
		display: flex;
		gap: 0.35rem;
		padding: 0.35rem 0.5rem;
		border: 1px solid rgba(31, 40, 38, 0.1);
		border-radius: 7px;
		background: rgba(255, 255, 255, 0.5);
		letter-spacing: 0;
		text-transform: none;
	}
	dt {
		color: var(--ink-muted);
		font-weight: 500;
	}
	dd {
		margin: 0;
		font-weight: 800;
	}
	.limit {
		border-color: rgba(119, 87, 168, 0.28);
		color: #5f3c92;
	}
	.views {
		display: grid;
		grid-template-columns: 1.05fr 0.95fr;
	}
	.mobile-status {
		display: none;
	}
	.panel {
		min-width: 0;
		margin: 0;
		padding: 0.55rem 0.7rem 0.5rem;
		transition:
			opacity 400ms ease,
			filter 400ms ease,
			transform 400ms ease;
	}
	.panel.dimmed {
		filter: grayscale(0.82) saturate(0.3);
		transform: scale(0.985);
	}
	.panel > svg {
		display: block;
		width: 100%;
		height: auto;
	}
	.micro {
		border-left: 1px solid var(--line);
	}
	.symbol {
		grid-column: 1 / -1;
		padding-top: 0.35rem;
		border-top: 1px solid var(--line);
	}
	figcaption {
		display: flex;
		gap: 0.45rem;
		margin-top: 0.15rem;
		color: var(--ink-muted);
		font-size: 0.55rem;
		line-height: 1.45;
	}
	figcaption strong {
		flex: 0 0 auto;
		color: #5f3c92;
		font-family: var(--mono);
		letter-spacing: 0.04em;
	}
	.dark {
		fill: #171823;
	}
	.tube-shape rect {
		fill: rgba(201, 225, 255, 0.06);
		stroke: rgba(220, 235, 255, 0.55);
		stroke-width: 2;
	}
	.tube-shape line {
		stroke: #c8ced9;
		stroke-width: 3;
	}
	.plasma {
		fill: none;
		stroke: #d8c8ff;
		stroke-width: 5;
	}
	.grating line {
		stroke: #b8c0d0;
		stroke-width: 1;
	}
	.incident {
		stroke: #e7e5ee;
		stroke-width: 2;
	}
	.beam-glow {
		opacity: 0.45;
		stroke-width: 7;
	}
	.beam {
		opacity: 0.75;
		stroke-width: 1.5;
	}
	.beam.invisible {
		opacity: 0.55;
		stroke-dasharray: 5 5;
	}
	.beam.selected {
		opacity: 1;
		stroke-width: 3;
	}
	.beam-glow.selected {
		opacity: 0.85;
		stroke-width: 10;
	}
	.macro text {
		fill: #cfd3dd;
		font-family: var(--mono);
		font-size: 9px;
	}
	.macro .invisible-note {
		fill: #9ba1af;
		font-size: 12px;
	}
	.axis {
		stroke: rgba(31, 40, 38, 0.45);
		stroke-width: 1;
	}
	.axis-label,
	.axis-title,
	.tick-label,
	.level-label {
		fill: var(--ink-muted);
		font-family: var(--mono);
		font-size: 10px;
	}
	.level {
		stroke: rgba(31, 40, 38, 0.35);
		stroke-width: 1.5;
	}
	.level.selected-level {
		stroke: #5f3c92;
		stroke-width: 2.5;
	}
	.electron {
		stroke: white;
		stroke-width: 2;
	}
	.electron.active {
		animation: electron-pulse 800ms ease-in-out infinite alternate;
	}
	.transition-arrow {
		stroke-width: 3;
	}
	.photon-label {
		font-family: var(--mono);
		font-size: 10px;
		font-weight: 800;
	}
	.micro text:not(.axis-label):not(.level-label):not(.photon-label) {
		fill: var(--ink);
		font-family: var(--mono);
		font-size: 9px;
	}
	.series-title {
		fill: #5f3c92;
		font-family: var(--mono);
		font-size: 11px;
		font-weight: 800;
	}
	.spectrum-band {
		fill: #16171f;
		opacity: 0.48;
	}
	.spectral-line {
		opacity: 0.8;
		stroke-width: 3;
	}
	.spectral-line.selected {
		opacity: 1;
		stroke-width: 7;
	}
	.selected-marker {
		fill: none;
		stroke: #5f3c92;
		stroke-width: 1.5;
	}
	.selected-label {
		fill: #5f3c92;
		font-family: var(--mono);
		font-size: 10px;
		font-weight: 800;
	}
	.spectrum-axis,
	.tick {
		stroke: rgba(31, 40, 38, 0.45);
	}
	.axis-title {
		font-size: 11px;
	}
	@keyframes pulse {
		to {
			opacity: 0.4;
			transform: scale(0.75);
		}
	}
	@keyframes electron-pulse {
		to {
			opacity: 0.55;
			transform: scale(0.8);
			transform-origin: center;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.live-dot.active,
		.electron.active {
			animation: none;
		}
	}
	@media (max-width: 800px) {
		header {
			align-items: flex-start;
			flex-direction: column;
			gap: 0.5rem;
		}
		dl {
			width: 100%;
			overflow-x: auto;
		}
		dl div {
			flex: 0 0 auto;
		}
	}
	@media (max-width: 560px) {
		.views {
			grid-template-columns: 1.05fr 0.95fr;
		}
		.panel {
			position: relative;
			padding: 0.35rem 0.4rem;
		}
		.macro,
		.micro {
			height: 135px;
			max-height: 135px;
			overflow: hidden;
		}
		.micro {
			border-top: 0;
			border-left: 1px solid var(--line);
		}
		.symbol {
			height: 180px;
			overflow: hidden;
		}
		.macro figcaption,
		.micro figcaption {
			position: absolute;
			top: 0.45rem;
			left: 0.5rem;
			display: block;
			margin: 0;
			font-size: 0;
			line-height: 1;
		}
		.macro figcaption strong,
		.micro figcaption strong {
			padding: 0.18rem 0.3rem;
			border-radius: 999px;
			background: rgba(250, 247, 239, 0.9);
			box-shadow: 0 2px 8px rgba(31, 40, 38, 0.12);
			font-size: 0.48rem;
		}
		.symbol figcaption {
			display: none;
		}
		.macro text {
			font-size: 13px;
		}
		.macro .invisible-note {
			font-size: 16px;
		}
		.micro text:not(.axis-label):not(.level-label):not(.photon-label),
		.axis-label,
		.level-label,
		.photon-label {
			font-size: 12px;
		}
		header {
			display: none;
		}
		.mobile-status {
			display: flex;
			height: 28px;
			padding-inline: 0.55rem;
			gap: 0.7rem;
			align-items: center;
			justify-content: center;
			border-bottom: 1px solid var(--line);
			font-family: var(--mono);
			font-size: 0.58rem;
			font-weight: 700;
		}
	}
</style>
