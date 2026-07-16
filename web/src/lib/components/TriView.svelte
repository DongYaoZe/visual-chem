<script lang="ts">
	import { onMount } from 'svelte';
	import {
		ATM_BAR,
		ETHANOL_WATER_LAI_2014,
		thermoFrame,
		type ExperimentalVlePoint
	} from '$lib/chem';
	import { type VisualizationContent, zhCNSiteContent } from '$lib/content';
	import DistillationApparatus from './DistillationApparatus.svelte';
	import ParticleChamber from './ParticleChamber.svelte';
	import TxyDiagram from './TxyDiagram.svelte';

	type Focus = 'macro' | 'micro' | 'symbol' | 'all';

	interface Props {
		composition: number;
		stage?: number;
		pressureBar?: number;
		interactionScale?: number;
		reveal?: number;
		focus?: Focus;
		active?: boolean;
		showAzeotrope?: boolean;
		experimentMode?: boolean;
		showExperimentalData?: boolean;
		experimentalPoint?: ExperimentalVlePoint;
		recordedExperimentalIndices?: number[];
		label?: string;
		content?: VisualizationContent;
	}

	let {
		composition,
		stage = 0,
		pressureBar = ATM_BAR,
		interactionScale = 1,
		reveal = 1,
		focus = 'all',
		active = true,
		showAzeotrope = true,
		experimentMode = false,
		showExperimentalData = false,
		experimentalPoint,
		recordedExperimentalIndices = [],
		label,
		content = zhCNSiteContent.shared
	}: Props = $props();
	let root: HTMLElement;
	let visible = $state(true);

	// One resolved thermodynamic state feeds every panel below, so the header,
	// the apparatus, the particles, and the diagram can never disagree.
	let frame = $derived(thermoFrame({ composition, stage, pressureBar, interactionScale }));
	let current = $derived(experimentalPoint ?? frame.current);
	let usesExperimentalEvidence = $derived(experimentMode || showExperimentalData);
	let running = $derived(active && visible);
	let ariaLabel = $derived(label ?? content.triView.defaultAriaLabel);

	onMount(() => {
		const observer = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), {
			rootMargin: '120px'
		});
		observer.observe(root);
		return () => observer.disconnect();
	});

	function dimmed(panel: Exclude<Focus, 'all'>): boolean {
		return focus !== 'all' && focus !== panel;
	}
</script>

<section bind:this={root} class="tri-view" data-testid="tri-view" aria-label={ariaLabel}>
	<p class="visually-hidden" aria-live="polite">
		{content.triView.liveSummary({
			liquidComposition: current.x.toFixed(3),
			vaporComposition: current.y.toFixed(3),
			bubblePointC: current.temperatureC.toFixed(2),
			stage
		})}
	</p>
	<header>
		<div>
			<span class="live-dot" aria-hidden="true"></span>
			{content.triView.synchronizedState}
		</div>
		<dl>
			<div>
				<dt>{content.triView.liquidComposition}</dt>
				<dd>{current.x.toFixed(3)}</dd>
			</div>
			<div>
				<dt>{content.triView.vaporComposition}</dt>
				<dd>{current.y.toFixed(3)}</dd>
			</div>
			<div>
				<dt>{content.triView.bubblePoint}</dt>
				<dd>{current.temperatureC.toFixed(2)} °C</dd>
			</div>
			{#if showAzeotrope}
				{#if usesExperimentalEvidence}
					<div class="limit">
						<dt>{content.triView.experimentalAzeotrope}</dt>
						<dd>
							{content.triView.massPercent({
								value: (ETHANOL_WATER_LAI_2014.azeotrope.massFractionEthanol * 100).toFixed(1)
							})}
						</dd>
					</div>
				{:else if frame.azeotrope}
					<div class="limit">
						<dt>{content.triView.modelLimit}</dt>
						<dd>
							{content.triView.massPercent({
								value: (frame.azeotrope.massFractionA * 100).toFixed(1)
							})}
						</dd>
					</div>
				{/if}
			{/if}
		</dl>
	</header>
	<div class="mobile-status" aria-hidden="true">
		<span>x {current.x.toFixed(3)}</span>
		<span>y {current.y.toFixed(3)}</span>
		<span>{current.temperatureC.toFixed(2)} °C</span>
	</div>

	<div class="views">
		<div class="panel macro" class:dimmed={dimmed('macro')}>
			<DistillationApparatus
				liquidComposition={current.x}
				vaporComposition={current.y}
				{stage}
				active={running}
				content={content.apparatus}
			/>
		</div>
		<div class="panel micro" class:dimmed={dimmed('micro')}>
			<ParticleChamber
				liquidComposition={current.x}
				vaporComposition={current.y}
				active={running}
				content={content.particles}
			/>
		</div>
		<div class="panel symbol" class:dimmed={dimmed('symbol')}>
			<TxyDiagram
				{frame}
				{reveal}
				{showAzeotrope}
				{experimentMode}
				{showExperimentalData}
				currentPointOverride={experimentalPoint}
				{recordedExperimentalIndices}
				content={content.diagram}
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
