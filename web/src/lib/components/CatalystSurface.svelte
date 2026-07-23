<script lang="ts">
	import type { CatalystKind, CatalystTriViewContent } from '$lib/content';

	interface Props {
		catalystKind: CatalystKind;
		/** Animate the selected molecular route when true. */
		active?: boolean;
		content: CatalystTriViewContent['surface'];
	}

	let { catalystKind, active = true, content }: Props = $props();
	let state = $derived(content.states[catalystKind]);

	const solutionDots = Array.from({ length: 18 }, (_item, index) => ({
		index,
		x: 16 + ((index * 47) % 190),
		y: 18 + ((index * 31) % 142)
	}));
</script>

<figure class="catalyst-surface" data-testid="catalyst-surface" data-catalyst-kind={catalystKind}>
	<svg viewBox="0 0 220 190" role="img" aria-label={state.ariaLabel}>
		<g aria-hidden="true">
			<rect class="chamber" x="6" y="6" width="208" height="178" rx="12" />

			{#if catalystKind === 'none'}
				<g class="moving" class:paused={!active}>
					<circle class="reactant" data-species="h2o2" cx="42" cy="94" r="7" />
					<circle class="reactant" data-species="h2o2" cx="54" cy="94" r="7" />
				</g>
				<path class="direct-arrow" d="M68 94 C94 50 126 50 150 94" />
				<path class="arrow-head" d="M144 87 L151 94 L142 98" />
				<g>
					<circle class="water" data-species="h2o" cx="163" cy="94" r="6.5" />
					<circle class="water" data-species="h2o" cx="176" cy="94" r="6.5" />
					<g data-species="o2">
						<circle class="oxygen" cx="190" cy="88" r="4" />
						<circle class="oxygen" cx="198" cy="88" r="4" />
					</g>
				</g>
				<text class="barrier-label" x="110" y="49" text-anchor="middle">Ea 73</text>
				<text class="route-tag" x="110" y="154" text-anchor="middle">{state.cycleTag}</text>
			{:else if catalystKind === 'iodide'}
				{#each solutionDots as dot (dot.index)}
					<circle class="solution-dot" cx={dot.x} cy={dot.y} r="1.25" />
				{/each}
				<g class="moving" class:paused={!active}>
					<circle class="reactant" data-species="h2o2" cx="38" cy="52" r="5.2" />
					<circle class="reactant" data-species="h2o2" cx="48" cy="52" r="5.2" />
				</g>
				<circle class="mediator iodide" cx="91" cy="91" r="18" />
				<text class="mediator-label" x="91" y="96" text-anchor="middle">I⁻</text>
				<circle class="mediator hypoiodite" cx="148" cy="91" r="18" />
				<text class="mediator-label" x="148" y="96" text-anchor="middle">IO⁻</text>
				<path class="cycle" d="M108 81 C120 68 134 68 144 78" />
				<path class="cycle" d="M133 107 C119 116 104 110 98 105" />
				<path class="arrow-head" d="M139 73 L145 78 L137 81" />
				<path class="arrow-head" d="M102 111 L97 105 L105 103" />
				<g class="moving products" class:paused={!active}>
					<circle class="water" data-species="h2o" cx="164" cy="45" r="5.2" />
					<circle class="water" data-species="h2o" cx="175" cy="45" r="5.2" />
					<g data-species="o2">
						<circle class="oxygen" cx="188" cy="39" r="3" />
						<circle class="oxygen" cx="194" cy="39" r="3" />
					</g>
				</g>
				<text class="route-tag" x="110" y="154" text-anchor="middle">{state.cycleTag}</text>
			{:else}
				<path
					class="enzyme-pocket"
					d="M53 39 C27 58 25 122 54 148 C81 172 151 169 177 139 C198 115 192 63 164 43 C143 28 123 42 112 60 C99 40 76 23 53 39 Z"
				/>
				<path class="pocket-mouth" d="M91 42 C94 64 98 79 112 84 C127 77 132 61 133 42" />
				<circle class="heme" cx="112" cy="111" r="18" />
				<circle class="heme-core" cx="112" cy="111" r="7" />
				<text class="heme-label" x="112" y="115" text-anchor="middle">Fe</text>
				<g class="moving substrate" class:paused={!active}>
					<circle class="reactant" data-species="h2o2" cx="101" cy="70" r="5.4" />
					<circle class="reactant" data-species="h2o2" cx="122" cy="70" r="5.4" />
				</g>
				<path class="select-arrow" d="M112 78 L112 91" />
				<path class="arrow-head" d="M107 87 L112 93 L117 87" />
				<polygon class="decoy" points="33,63 41,49 49,63" />
				<path class="reject-mark" d="M28 45 L51 68 M51 45 L28 68" />
				<g class="moving products enzyme-products" class:paused={!active}>
					<circle class="water" data-species="h2o" cx="158" cy="75" r="5" />
					<circle class="water" data-species="h2o" cx="169" cy="75" r="5" />
					<g data-species="o2">
						<circle class="oxygen" cx="182" cy="69" r="3" />
						<circle class="oxygen" cx="188" cy="69" r="3" />
					</g>
				</g>
				<text class="route-tag" x="112" y="152" text-anchor="middle">{state.cycleTag}</text>
			{/if}
			<text class="stoichiometry-label" x="110" y="179" text-anchor="middle">
				2 H₂O₂ → 2 H₂O + O₂
			</text>
		</g>
	</svg>

	<div class="legend" aria-hidden="true">
		<span><i class="swatch reactant-swatch"></i>{state.reactantLabel}</span>
		<span><i class="swatch catalyst-swatch"></i>{state.catalystLabel}</span>
		<span><i class="swatch product-swatch"></i>{state.productLabel}</span>
	</div>

	<figcaption><span>{content.viewName}</span> {state.caption}</figcaption>
</figure>

<style>
	.catalyst-surface {
		display: grid;
		height: 100%;
		min-height: 220px;
		margin: 0;
		grid-template-rows: 1fr auto auto;
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
		max-height: 260px;
	}

	.chamber {
		fill: rgba(163, 112, 42, 0.035);
		stroke: rgba(31, 40, 38, 0.2);
	}

	.reactant {
		fill: #207f8c;
		stroke: rgba(255, 255, 255, 0.75);
		stroke-width: 1;
	}

	.water {
		fill: #9fb6bb;
	}

	.oxygen {
		fill: #4a5f63;
	}

	.direct-arrow,
	.cycle,
	.select-arrow,
	.pocket-mouth {
		fill: none;
		stroke: #7a5424;
		stroke-width: 2;
		stroke-linecap: round;
	}

	.direct-arrow {
		stroke-dasharray: 5 5;
	}

	.arrow-head {
		fill: none;
		stroke: #7a5424;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.barrier-label,
	.route-tag,
	.stoichiometry-label,
	.mediator-label,
	.heme-label {
		fill: #6d4b1f;
		font-family: var(--mono);
		font-size: 9px;
		font-weight: 800;
	}

	.stoichiometry-label {
		fill: var(--ink-muted);
		font-size: 8px;
		font-weight: 700;
	}

	.solution-dot {
		fill: rgba(32, 127, 140, 0.18);
	}

	.mediator {
		stroke: rgba(255, 255, 255, 0.7);
		stroke-width: 1.4;
	}

	.mediator.iodide {
		fill: #a3702a;
	}

	.mediator.hypoiodite {
		fill: #c59243;
	}

	.mediator-label,
	.heme-label {
		fill: white;
		font-size: 11px;
	}

	.enzyme-pocket {
		fill: rgba(163, 112, 42, 0.17);
		stroke: #7a5424;
		stroke-width: 2.2;
	}

	.pocket-mouth {
		stroke: #207f8c;
		stroke-width: 2.6;
	}

	.heme {
		fill: #a34428;
		stroke: rgba(255, 255, 255, 0.8);
		stroke-width: 1.4;
	}

	.heme-core {
		fill: #653020;
	}

	.decoy {
		fill: rgba(80, 96, 100, 0.24);
		stroke: #526064;
		stroke-width: 1.4;
	}

	.reject-mark {
		fill: none;
		stroke: #a34428;
		stroke-width: 2;
	}

	.moving {
		animation: breathe 2.6s ease-in-out infinite alternate;
	}

	.products {
		animation-name: lift;
	}

	.substrate {
		animation-name: bind;
	}

	.moving.paused {
		animation-play-state: paused;
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.65rem;
		justify-content: center;
		padding-top: 0.45rem;
		color: var(--ink-muted);
		font-size: 0.58rem;
	}

	.legend span {
		display: flex;
		gap: 0.3rem;
		align-items: center;
	}

	.swatch {
		display: inline-block;
		width: 7px;
		height: 7px;
		border-radius: 50%;
	}

	.reactant-swatch {
		background: #207f8c;
	}

	.catalyst-swatch {
		background: #a3702a;
	}

	.product-swatch {
		background: #9fb6bb;
	}

	figcaption {
		margin: 0.35rem 0 0;
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

	@keyframes breathe {
		to {
			transform: translateX(8px);
		}
	}

	@keyframes lift {
		to {
			transform: translateY(-8px);
		}
	}

	@keyframes bind {
		to {
			transform: translateY(10px);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.moving {
			animation: none;
		}
	}
</style>
