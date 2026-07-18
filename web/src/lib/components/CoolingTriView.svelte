<script lang="ts">
	import { eutecticFrame } from '$lib/chem';
	import type { CoolingTriViewContent } from '$lib/content';
	import Crucible from './Crucible.svelte';
	import EutecticTxyDiagram from './EutecticTxyDiagram.svelte';
	import MeltChamber from './MeltChamber.svelte';

	type Focus = 'crucible' | 'melt' | 'diagram' | 'all';

	interface Props {
		/** Melt composition, mole fraction of Cd. */
		xCd: number;
		temperatureC: number;
		/** Clock position on the recorded curve, seconds; null hides the clock. */
		timeS?: number | null;
		focus?: Focus;
		diagramMode?: 'curve' | 'map';
		showLiquidus?: boolean;
		showEutectic?: boolean;
		showEvidence?: boolean;
		label?: string;
		content: CoolingTriViewContent;
	}

	let {
		xCd,
		temperatureC,
		timeS = null,
		focus = 'all',
		diagramMode = 'map',
		showLiquidus = false,
		showEutectic = false,
		showEvidence = false,
		label,
		content
	}: Props = $props();

	// One resolved melt state feeds every panel below, so the header, the
	// crucible, the atoms, and the diagram can never disagree.
	let frame = $derived(eutecticFrame({ xCd, temperatureC }));
	let regionName = $derived(content.regionNames[frame.region]);
	let liquidPercent = $derived((frame.split.liquidFraction * 100).toFixed(0));
	let ariaLabel = $derived(label ?? content.defaultAriaLabel);

	function dimmed(panel: Exclude<Focus, 'all'>): boolean {
		return focus !== 'all' && focus !== panel;
	}
</script>

<section class="tri-view" data-testid="cooling-tri-view" aria-label={ariaLabel}>
	<p class="visually-hidden" aria-live="polite">
		{content.liveSummary({ region: regionName, melt: `${liquidPercent}%` })}
	</p>
	<header>
		<div>
			<span class="live-dot" aria-hidden="true"></span>
			{content.synchronizedState}
		</div>
		<dl>
			<div>
				<dt>T</dt>
				<dd>{frame.temperatureC.toFixed(0)} °C</dd>
			</div>
			<div>
				<dt>x(Cd)</dt>
				<dd>{frame.xCd.toFixed(2)}</dd>
			</div>
			<div class="limit">
				<dt aria-hidden="true">●</dt>
				<dd>{regionName}</dd>
			</div>
		</dl>
	</header>
	<div class="mobile-status" aria-hidden="true">
		<span>{frame.temperatureC.toFixed(0)} °C</span>
		<span>x(Cd) {frame.xCd.toFixed(2)}</span>
		<span>{regionName}</span>
	</div>

	<div class="views">
		<div class="panel macro" class:dimmed={dimmed('crucible')}>
			<Crucible {frame} {timeS} content={content.crucible} />
		</div>
		<div class="panel micro" class:dimmed={dimmed('melt')}>
			<MeltChamber {frame} content={content.melt} />
		</div>
		<div class="panel symbol" class:dimmed={dimmed('diagram')}>
			<EutecticTxyDiagram
				{frame}
				mode={diagramMode}
				{timeS}
				{showLiquidus}
				{showEutectic}
				{showEvidence}
				content={content.diagram}
				{regionName}
			/>
		</div>
	</div>
</section>

<style>
	.tri-view {
		overflow: hidden;
		border: 1px solid rgba(31, 40, 38, 0.2);
		border-radius: 20px;
		background: rgba(250, 247, 239, 0.92);
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
		background: #51945f;
		box-shadow: 0 0 0 4px rgba(81, 148, 95, 0.12);
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
		border-color: rgba(191, 61, 48, 0.22);
		color: var(--acid);
	}

	.views {
		display: grid;
		grid-template-columns: 1.25fr 0.75fr;
	}

	.mobile-status {
		display: none;
	}

	.panel {
		min-width: 0;
		padding: 0.65rem 0.8rem 0.55rem;
		transition:
			opacity 400ms ease,
			filter 400ms ease;
	}

	.panel.dimmed {
		filter: grayscale(0.8) saturate(0.35);
		transform: scale(0.985);
	}

	.micro {
		border-left: 1px solid var(--line);
	}

	.symbol {
		grid-column: 1 / -1;
		padding-top: 0.4rem;
		border-top: 1px solid var(--line);
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
			grid-template-columns: 1fr 0.8fr;
		}

		.panel {
			padding: 0.4rem 0.45rem;
		}

		.macro,
		.micro {
			height: 120px;
			max-height: 120px;
			overflow: hidden;
		}

		.symbol {
			height: 190px;
			overflow: hidden;
		}

		.symbol :global(svg) {
			max-height: 164px;
		}

		.symbol :global(.legend),
		.symbol :global(figcaption) {
			display: none;
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
