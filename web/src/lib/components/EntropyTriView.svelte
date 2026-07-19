<script lang="ts">
	import { lnMultiplicity, multiplicityDistribution } from '$lib/chem';
	import type { EntropyTriViewContent } from '$lib/content';
	import EntropyReadout from './EntropyReadout.svelte';
	import MicrostateHistogram from './MicrostateHistogram.svelte';
	import TwinBulbs from './TwinBulbs.svelte';

	type Focus = 'bulbs' | 'histogram' | 'entropy' | 'all';

	interface Props {
		total: number;
		leftCount: number;
		valveOpen: boolean;
		markAllLeft?: boolean;
		window?: number | null;
		focus?: Focus;
		label?: string;
		content: EntropyTriViewContent;
	}

	let {
		total,
		leftCount,
		valveOpen,
		markAllLeft = false,
		window = null,
		focus = 'all',
		label,
		content
	}: Props = $props();

	// One census feeds every panel below, so the bulbs, the histogram, and
	// the entropy readout can never disagree.
	let roundedLeft = $derived(Math.round(leftCount));
	let lnW = $derived(lnMultiplicity(total, roundedLeft));
	let lnPeak = $derived(multiplicityDistribution(total).lnPeak);
	let oddsExponent = $derived(-total * Math.log10(2));
	let ariaLabel = $derived(label ?? content.defaultAriaLabel);

	function dimmed(panel: Exclude<Focus, 'all'>): boolean {
		return focus !== 'all' && focus !== panel;
	}
</script>

<section class="tri-view" data-testid="entropy-tri-view" aria-label={ariaLabel}>
	<p class="visually-hidden" aria-live="polite">
		{content.liveSummary({ leftCount: roundedLeft, total })}
	</p>
	<header>
		<div>
			<span class="live-dot" aria-hidden="true"></span>
			{content.synchronizedState}
		</div>
		<dl>
			<div>
				<dt>N</dt>
				<dd>{total}</dd>
			</div>
			<div>
				<dt>n</dt>
				<dd>{roundedLeft}</dd>
			</div>
			<div class="limit">
				<dt>ln W</dt>
				<dd>{lnW.toFixed(1)}</dd>
			</div>
		</dl>
	</header>
	<div class="mobile-status" aria-hidden="true">
		<span>N {total}</span>
		<span>n {roundedLeft}</span>
		<span>ln W {lnW.toFixed(1)}</span>
	</div>

	<div class="views">
		<div class="panel macro" class:dimmed={dimmed('bulbs')}>
			<TwinBulbs {total} leftCount={roundedLeft} {valveOpen} content={content.bulbs} />
		</div>
		<div class="panel micro" class:dimmed={dimmed('entropy')}>
			<EntropyReadout {lnW} {lnPeak} {oddsExponent} content={content.entropy} />
		</div>
		<div class="panel symbol" class:dimmed={dimmed('histogram')}>
			<MicrostateHistogram
				{total}
				leftCount={roundedLeft}
				{markAllLeft}
				{window}
				content={content.histogram}
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
