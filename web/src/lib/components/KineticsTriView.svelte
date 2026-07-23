<script lang="ts">
	import { concentrationAt, rateAt, type ReactionOrder } from '$lib/chem';
	import type { KineticsTriViewContent } from '$lib/content';
	import DecayChamber from './DecayChamber.svelte';
	import DecayClockDiagram from './DecayClockDiagram.svelte';
	import ReactionBeaker from './ReactionBeaker.svelte';

	type Focus = 'beaker' | 'molecules' | 'clock' | 'all';

	interface Props {
		order: ReactionOrder;
		c0: number;
		k: number;
		totalTimeS: number;
		currentTimeS?: number;
		running?: boolean;
		showHalfLives?: boolean;
		focus?: Focus;
		label?: string;
		content: KineticsTriViewContent;
	}

	let {
		order,
		c0,
		k,
		totalTimeS,
		currentTimeS = 0,
		running = false,
		showHalfLives = true,
		focus = 'all',
		label,
		content
	}: Props = $props();

	let safeTimeS = $derived(Math.min(totalTimeS, Math.max(0, currentTimeS)));
	let concentration = $derived(concentrationAt(order, c0, k, safeTimeS));
	let fraction = $derived(c0 > 0 ? concentration / c0 : 0);
	let rate = $derived(rateAt(order, concentration, k));
	let initialRate = $derived(rateAt(order, c0, k));
	let normalizedRate = $derived(initialRate > 0 ? rate / initialRate : 0);
	let orderLabel = $derived(order === 0 ? '0' : order === 1 ? '1' : '2');
	let ariaLabel = $derived(label ?? content.defaultAriaLabel);

	function dimmed(panel: Exclude<Focus, 'all'>): boolean {
		return focus !== 'all' && focus !== panel;
	}
</script>

<section class="tri-view" data-testid="kinetics-tri-view" aria-label={ariaLabel}>
	<p class="visually-hidden" aria-live="polite">
		{content.liveSummary({ concentration: fraction.toFixed(3), timeS: safeTimeS.toFixed(0) })}
	</p>
	<header>
		<div><span class="live-dot" aria-hidden="true"></span>{content.synchronizedState}</div>
		<dl>
			<div>
				<dt>t</dt>
				<dd>{safeTimeS.toFixed(0)} s</dd>
			</div>
			<div>
				<dt>c/c₀</dt>
				<dd>{fraction.toFixed(3)}</dd>
			</div>
			<div class="limit">
				<dt>v</dt>
				<dd>{rate.toPrecision(2)} mol L⁻¹ s⁻¹</dd>
			</div>
		</dl>
	</header>
	<div class="mobile-status" aria-hidden="true">
		<span>t {safeTimeS.toFixed(0)} s</span><span>c/c₀ {fraction.toFixed(2)}</span><span
			>m {orderLabel}</span
		>
	</div>

	<div class="views">
		<div class="panel macro" class:dimmed={dimmed('beaker')}>
			<ReactionBeaker
				{fraction}
				{normalizedRate}
				timeS={safeTimeS}
				{running}
				content={content.beaker}
			/>
		</div>
		<div class="panel micro" class:dimmed={dimmed('molecules')}>
			<DecayChamber {fraction} content={content.molecules} />
		</div>
		<div class="panel symbol" class:dimmed={dimmed('clock')}>
			<DecayClockDiagram
				{order}
				{c0}
				{k}
				{totalTimeS}
				currentTimeS={safeTimeS}
				{showHalfLives}
				content={content.clock}
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
		background: #207f8c;
		box-shadow: 0 0 0 4px rgba(32, 127, 140, 0.12);
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
		border-color: rgba(32, 127, 140, 0.25);
		color: #175059;
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
