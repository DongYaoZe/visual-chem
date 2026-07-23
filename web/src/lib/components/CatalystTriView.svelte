<script lang="ts">
	import { accelerationFactor } from '$lib/chem';
	import type { CatalystKind, CatalystTriViewContent } from '$lib/content';
	import CatalystBench from './CatalystBench.svelte';
	import CatalystSurface from './CatalystSurface.svelte';
	import EnergyProfileDiagram from './EnergyProfileDiagram.svelte';

	type Focus = 'bench' | 'surface' | 'profile' | 'all';

	interface Props {
		uncatalyzedEaKJPerMol: number;
		catalyzedEaKJPerMol: number;
		deltaHKJPerMol: number;
		catalystKind: CatalystKind;
		temperatureK?: number;
		progress?: number;
		showCatalyzedPath?: boolean;
		active?: boolean;
		focus?: Focus;
		label?: string;
		content: CatalystTriViewContent;
	}

	let {
		uncatalyzedEaKJPerMol,
		catalyzedEaKJPerMol,
		deltaHKJPerMol,
		catalystKind,
		temperatureK = 298.15,
		progress = 0.22,
		showCatalyzedPath = true,
		active = false,
		focus = 'all',
		label,
		content
	}: Props = $props();

	let effectiveEa = $derived(showCatalyzedPath ? catalyzedEaKJPerMol : uncatalyzedEaKJPerMol);
	let boost = $derived(accelerationFactor(uncatalyzedEaKJPerMol, effectiveEa, temperatureK));
	let boostLog = $derived(Math.max(0, Math.log10(boost)));
	let ariaLabel = $derived(label ?? content.defaultAriaLabel);

	function dimmed(panel: Exclude<Focus, 'all'>): boolean {
		return focus !== 'all' && focus !== panel;
	}
</script>

<section class="tri-view" data-testid="catalyst-tri-view" aria-label={ariaLabel}>
	<p class="visually-hidden" aria-live="polite">
		{content.liveSummary({ ea: effectiveEa.toFixed(0), boost: boost.toExponential(1) })}
	</p>
	<header>
		<div>
			<span class="live-dot" class:active aria-hidden="true"></span>{content.synchronizedState}
		</div>
		<dl>
			<div>
				<dt>Ea</dt>
				<dd>{effectiveEa.toFixed(0)} kJ mol⁻¹</dd>
			</div>
			<div>
				<dt>ΔH</dt>
				<dd>{deltaHKJPerMol.toFixed(0)} kJ mol⁻¹</dd>
			</div>
			<div class="limit">
				<dt>k/k₀</dt>
				<dd>{boost.toExponential(1)}</dd>
			</div>
		</dl>
	</header>
	<div class="mobile-status" aria-hidden="true">
		<span>Ea {effectiveEa.toFixed(0)}</span><span>ΔH {deltaHKJPerMol.toFixed(0)}</span><span
			>×{boost.toExponential(1)}</span
		>
	</div>

	<div class="views">
		<div class="panel macro" class:dimmed={dimmed('bench')}>
			<CatalystBench {boost} {boostLog} content={content.bench} />
		</div>
		<div class="panel micro" class:dimmed={dimmed('surface')}>
			<CatalystSurface {active} {catalystKind} content={content.surface} />
		</div>
		<div class="panel symbol" class:dimmed={dimmed('profile')}>
			<EnergyProfileDiagram
				{uncatalyzedEaKJPerMol}
				{catalyzedEaKJPerMol}
				{deltaHKJPerMol}
				{progress}
				catalyzed={showCatalyzedPath}
				showCatalyzed={showCatalyzedPath}
				content={content.profile}
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
		background: #a3702a;
		box-shadow: 0 0 0 4px rgba(163, 112, 42, 0.12);
	}
	.live-dot.active {
		animation: pulse 1.5s ease-in-out infinite alternate;
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
		border-color: rgba(163, 112, 42, 0.28);
		color: #725020;
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
	@keyframes pulse {
		to {
			opacity: 0.45;
			transform: scale(0.75);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.live-dot.active {
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
