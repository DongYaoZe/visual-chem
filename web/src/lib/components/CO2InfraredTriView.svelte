<script lang="ts">
	import { co2ModeLabel, type CO2InfraredFrame } from '$lib/chem';
	import type { CO2InfraredTriViewContent } from '$lib/content';

	interface Props {
		frame: CO2InfraredFrame;
		label?: string;
		active?: boolean;
		content: CO2InfraredTriViewContent;
	}

	let { frame, label, active = false, content }: Props = $props();
	let mode = $derived(frame.id);
	let modeName = $derived(content.molecule.modeNames[mode]);
	let activityName = $derived(
		frame.irActive ? content.activityNames.active : content.activityNames.silent
	);
	const uid = $props.id();
	const arrowId = `${uid}-co2-arrow`;

	function atomX(index: number): number {
		const center = 220;
		const displacement = frame.amplitude * 30;
		if (mode === 'symmetric-stretch')
			return index === 0
				? center - 86 - displacement
				: index === 2
					? center + 86 + displacement
					: center;
		if (mode === 'asymmetric-stretch')
			return index === 0
				? center - 86 - displacement
				: index === 2
					? center + 86 - displacement
					: center;
		return index === 0 ? center - 86 : index === 2 ? center + 86 : center;
	}

	function atomY(index: number): number {
		if (mode !== 'bend') return 120;
		if (index === 0 || index === 2) return 120 - frame.amplitude * 34;
		return 120 + frame.amplitude * 26;
	}

	function spectrumX(wavenumber: number): number {
		return 54 + ((wavenumber - 400) / (2600 - 400)) * 470;
	}
</script>

<section
	class="tri-view"
	data-testid="co2-infrared-tri-view"
	data-active={active}
	aria-label={label ?? content.defaultAriaLabel}
>
	<p class="visually-hidden" aria-live="polite">
		{content.liveSummary({
			mode: modeName,
			wavenumberCm: frame.wavenumberCm,
			wavelengthUm: frame.wavelengthUm.toFixed(2),
			irActive: frame.irActive
		})}
	</p>
	<header>
		<div>
			<span class="live-dot" class:active aria-hidden="true"></span>{content.synchronizedState}
		</div>
		<dl>
			<div>
				<dt>{content.modeLabel}</dt>
				<dd>{co2ModeLabel(frame.id)} · {modeName}</dd>
			</div>
			<div>
				<dt>{content.wavenumberLabel}</dt>
				<dd>{frame.wavenumberCm} cm⁻¹</dd>
			</div>
			<div>
				<dt>{content.wavelengthLabel}</dt>
				<dd>{frame.wavelengthUm.toFixed(2)} μm</dd>
			</div>
			<div class="activity" class:silent={!frame.irActive}>
				<dt>{content.activityLabel}</dt>
				<dd>{activityName}</dd>
			</div>
		</dl>
	</header>
	<div class="views">
		<figure
			class="panel macro"
			data-testid="co2-ir-instrument"
			data-mode={frame.id}
			data-active={frame.irActive}
		>
			<svg
				viewBox="0 0 440 190"
				role="img"
				aria-label={content.instrument.ariaLabel({
					mode: modeName,
					wavenumberCm: frame.wavenumberCm,
					irActive: frame.irActive
				})}
			>
				<rect class="dark" x="3" y="3" width="434" height="184" rx="14" />
				<rect class="lamp" x="28" y="72" width="70" height="34" rx="17" />
				<text x="63" y="130" text-anchor="middle">{content.instrument.beamLabel}</text>
				<line class="beam" x1="98" y1="89" x2="150" y2="89" />
				<rect class="cell" x="150" y="52" width="132" height="74" rx="8" />
				<text x="216" y="145" text-anchor="middle">{content.instrument.sampleLabel}</text>
				<line class="beam" class:absorbed={frame.irActive} x1="282" y1="89" x2="340" y2="89" />
				<circle class="detector" cx="362" cy="89" r="20" />
				<text x="362" y="130" text-anchor="middle">{content.instrument.detectorLabel}</text>
				{#if frame.irActive}<line
						class="absorption-mark"
						x1="215"
						y1="58"
						x2="215"
						y2="120"
					/>{:else}<text class="silent-note" x="216" y="92" text-anchor="middle"
						>{content.activityNames.silent}</text
					>{/if}
			</svg>
			<figcaption>
				<strong>{content.instrument.viewName}</strong>{content.instrument.caption}
			</figcaption>
		</figure>

		<figure
			class="panel micro"
			data-testid="co2-normal-mode"
			data-mode={frame.id}
			data-amplitude={frame.amplitude.toFixed(2)}
		>
			<svg
				viewBox="0 0 440 190"
				role="img"
				aria-label={content.molecule.ariaLabel({
					mode: modeName,
					amplitude: Math.round(frame.amplitude * 100)
				})}
			>
				<defs
					><marker
						id={arrowId}
						viewBox="0 0 10 10"
						refX="5"
						refY="5"
						markerWidth="6"
						markerHeight="6"
						orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" /></marker
					></defs
				>
				<line class="bond" x1={atomX(0)} y1={atomY(0)} x2={atomX(1)} y2={atomY(1)} />
				<line class="bond" x1={atomX(1)} y1={atomY(1)} x2={atomX(2)} y2={atomY(2)} />
				{#each [0, 1, 2] as index (index)}
					<circle
						class:carbon={index === 1}
						class="atom"
						cx={atomX(index)}
						cy={atomY(index)}
						r={index === 1 ? 18 : 22}
					/>
					<text class="atom-label" x={atomX(index)} y={atomY(index) + 5} text-anchor="middle"
						>{index === 1 ? content.molecule.carbonLabel : content.molecule.oxygenLabel}</text
					>
				{/each}
				<line
					class="motion-arrow"
					x1="120"
					y1="160"
					x2="180"
					y2="160"
					marker-end={`url(#${arrowId})`}
				/>
				<line
					class="motion-arrow"
					x1="320"
					y1="160"
					x2="260"
					y2="160"
					marker-end={`url(#${arrowId})`}
				/>
				<text x="220" y="180" text-anchor="middle"
					>{modeName} · {Math.round(frame.amplitude * 100)}%</text
				>
			</svg>
			<figcaption>
				<strong>{content.molecule.viewName}</strong>{content.molecule.caption}
			</figcaption>
		</figure>

		<figure
			class="panel symbol"
			data-testid="co2-ir-spectrum"
			data-mode={frame.id}
			data-active={frame.irActive}
		>
			<svg
				viewBox="0 0 580 190"
				role="img"
				aria-label={content.spectrum.ariaLabel({
					mode: modeName,
					wavenumberCm: frame.wavenumberCm,
					irActive: frame.irActive
				})}
			>
				<line class="spectrum-axis" x1="54" x2="524" y1="140" y2="140" />
				<line class="axis-y" x1="54" x2="54" y1="32" y2="140" />
				<text class="axis-title" x="288" y="174" text-anchor="middle">{content.spectrum.xAxis}</text
				>
				<text class="axis-title" x="16" y="92" transform="rotate(-90 16 92)" text-anchor="middle"
					>{content.spectrum.yAxis}</text
				>
				{#each [667, 1333, 2349] as tick (tick)}
					<line
						class:silent-band={tick === 1333}
						class="band"
						x1={spectrumX(tick)}
						x2={spectrumX(tick)}
						y1={tick === frame.wavenumberCm && frame.irActive ? 58 : 92}
						y2="140"
					/>
					<text class="tick-label" x={spectrumX(tick)} y="155" text-anchor="middle">{tick}</text>
				{/each}
				<line
					class="selected-band"
					x1={spectrumX(frame.wavenumberCm)}
					x2={spectrumX(frame.wavenumberCm)}
					y1="42"
					y2="140"
				/>
				<text class="selected-label" x={spectrumX(frame.wavenumberCm)} y="28" text-anchor="middle"
					>{content.spectrum.selectedBand}</text
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
		font-size: 0.58rem;
		font-weight: 700;
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
		background: #357c9d;
		box-shadow: 0 0 0 4px rgba(53, 124, 157, 0.14);
	}
	.live-dot.active {
		animation: pulse 1.25s ease-in-out infinite alternate;
	}
	dl {
		display: flex;
		margin: 0;
		gap: 0.3rem;
		align-items: center;
	}
	dl div {
		display: flex;
		gap: 0.3rem;
		padding: 0.3rem 0.4rem;
		border: 1px solid rgba(31, 40, 38, 0.1);
		border-radius: 7px;
		background: rgba(255, 255, 255, 0.5);
		letter-spacing: 0;
	}
	dt {
		color: var(--ink-muted);
		font-weight: 500;
	}
	dd {
		margin: 0;
		font-weight: 800;
	}
	.activity {
		border-color: rgba(47, 130, 150, 0.3);
		color: #216f7e;
	}
	.activity.silent {
		border-color: rgba(110, 110, 110, 0.25);
		color: #666;
	}
	.views {
		display: grid;
		grid-template-columns: 1.05fr 0.95fr;
	}
	.panel {
		min-width: 0;
		margin: 0;
		padding: 0.55rem 0.7rem 0.5rem;
	}
	.panel > svg {
		display: block;
		width: 100%;
		height: auto;
	}
	figcaption {
		min-height: 2.7rem;
		color: var(--ink-muted);
		font-family: var(--serif);
		font-size: 0.72rem;
		line-height: 1.45;
	}
	figcaption strong {
		display: block;
		margin-bottom: 0.25rem;
		color: var(--ink);
		font-family: var(--mono);
		font-size: 0.58rem;
		letter-spacing: 0.06em;
	}
	.dark {
		fill: #182229;
	}
	.lamp {
		fill: #86d9e4;
	}
	.cell {
		fill: rgba(130, 200, 220, 0.16);
		stroke: #4a98b1;
		stroke-width: 2;
	}
	.detector {
		fill: #dbb65c;
		stroke: #735d27;
		stroke-width: 3;
	}
	.beam {
		stroke: #d7f4ff;
		stroke-width: 5;
	}
	.beam.absorbed {
		stroke: #6db8ca;
		stroke-dasharray: 7 5;
	}
	.absorption-mark {
		stroke: #e9c85b;
		stroke-width: 5;
	}
	.silent-note {
		fill: #c5cbd0;
		font-family: var(--mono);
		font-size: 12px;
	}
	.atom {
		fill: #e6e2d6;
		stroke: #6e7876;
		stroke-width: 2;
	}
	.atom.carbon {
		fill: #64777b;
	}
	.atom-label {
		fill: #1d292b;
		font-family: var(--mono);
		font-size: 13px;
		font-weight: 800;
	}
	.bond {
		stroke: #52605f;
		stroke-width: 7;
	}
	.motion-arrow {
		stroke: #357c9d;
		stroke-width: 3;
	}
	.motion-arrow + text {
		fill: var(--ink-muted);
		font-family: var(--mono);
		font-size: 11px;
	}
	.spectrum-axis,
	.axis-y {
		stroke: #4c5552;
		stroke-width: 1.5;
	}
	.band {
		stroke: #b6c0bd;
		stroke-width: 10;
		opacity: 0.45;
	}
	.band.silent-band {
		stroke: #a4a7a5;
		stroke-dasharray: 4 4;
		opacity: 0.75;
	}
	.selected-band {
		stroke: #2c9eaa;
		stroke-width: 6;
	}
	.tick-label,
	.selected-label,
	.axis-title {
		fill: var(--ink-muted);
		font-family: var(--mono);
		font-size: 10px;
	}
	.selected-label {
		fill: #216f7e;
		font-weight: 800;
	}
	@keyframes pulse {
		from {
			opacity: 0.5;
		}
		to {
			opacity: 1;
		}
	}
	@media (max-width: 850px) {
		header {
			display: block;
		}
		dl {
			margin-top: 0.45rem;
			flex-wrap: wrap;
		}
		.views {
			grid-template-columns: 1fr;
		}
	}
</style>
