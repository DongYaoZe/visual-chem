<script lang="ts">
	import { daniellEmfV } from '$lib/chem';
	import type { NernstTriViewContent } from '$lib/content';
	import DaniellCell from './DaniellCell.svelte';
	import IonInterfaces from './IonInterfaces.svelte';
	import PotentialLadder from './PotentialLadder.svelte';

	type Focus = 'cell' | 'ions' | 'ladder' | 'all';

	interface Props {
		zincMolar: number;
		copperMolar: number;
		temperatureK?: number;
		/** Depth of discharge 0..1; thins the Zn slab, plates the Cu one. */
		depth?: number;
		showLadder?: boolean;
		active?: boolean;
		focus?: Focus;
		label?: string;
		content: NernstTriViewContent;
	}

	let {
		zincMolar,
		copperMolar,
		temperatureK = 298.15,
		depth = 0,
		showLadder = false,
		active = false,
		focus = 'all',
		label,
		content
	}: Props = $props();

	// One resolved cell state feeds every panel below, so the meter, the
	// interfaces, and the ladder can never disagree.
	let emfV = $derived(daniellEmfV(zincMolar, copperMolar, temperatureK));
	// Each working rung slides by its own Nernst term (RT/2F)·ln c.
	let rtOver2F = $derived((8.31446261815324 * temperatureK) / (2 * 96485.33212));
	let zincShiftV = $derived(rtOver2F * Math.log(zincMolar));
	let copperShiftV = $derived(rtOver2F * Math.log(copperMolar));
	let ariaLabel = $derived(label ?? content.defaultAriaLabel);

	function dimmed(panel: Exclude<Focus, 'all'>): boolean {
		return focus !== 'all' && focus !== panel;
	}
</script>

<section class="tri-view" data-testid="nernst-tri-view" aria-label={ariaLabel}>
	<p class="visually-hidden" aria-live="polite">
		{content.liveSummary({ emf: emfV.toFixed(3) })}
	</p>
	<header>
		<div>
			<span class="live-dot" aria-hidden="true"></span>
			{content.synchronizedState}
		</div>
		<dl>
			<div>
				<dt>E</dt>
				<dd>{emfV.toFixed(3)} V</dd>
			</div>
			<div>
				<dt>Zn²⁺</dt>
				<dd>{zincMolar.toFixed(2)} M</dd>
			</div>
			<div class="limit">
				<dt>Cu²⁺</dt>
				<dd>{copperMolar.toFixed(2)} M</dd>
			</div>
		</dl>
	</header>
	<div class="mobile-status" aria-hidden="true">
		<span>{emfV.toFixed(3)} V</span>
		<span>Zn {zincMolar.toFixed(2)} M</span>
		<span>Cu {copperMolar.toFixed(2)} M</span>
	</div>

	<div class="views">
		<div class="panel macro" class:dimmed={dimmed('cell')}>
			<DaniellCell {emfV} {zincMolar} {copperMolar} {depth} content={content.cell} />
		</div>
		<div class="panel micro" class:dimmed={dimmed('ions')}>
			<IonInterfaces {zincMolar} {copperMolar} {active} content={content.ions} />
		</div>
		<div class="panel symbol" class:dimmed={dimmed('ladder')}>
			<PotentialLadder {emfV} {zincShiftV} {copperShiftV} {showLadder} content={content.ladder} />
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
