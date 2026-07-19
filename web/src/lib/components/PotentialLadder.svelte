<script lang="ts">
	import { STANDARD_POTENTIALS_V } from '$lib/chem';
	import type { NernstTriViewContent } from '$lib/content';

	interface Props {
		/** Working EMF of the cell, volts. */
		emfV: number;
		/** Nernst shifts of each working electrode vs its standard rung, volts. */
		zincShiftV?: number;
		copperShiftV?: number;
		/** Show the wider ladder context beyond the two working rungs. */
		showLadder?: boolean;
		content: NernstTriViewContent['ladder'];
	}

	let { emfV, zincShiftV = 0, copperShiftV = 0, showLadder = false, content }: Props = $props();

	const width = 560;
	const height = 318;
	const margin = { top: 24, right: 24, bottom: 40, left: 58 };

	// Fixed window generous enough for the context rungs.
	const minV = -3.3;
	const maxV = 3.1;

	function y(volts: number): number {
		return margin.top + ((maxV - volts) / (maxV - minV)) * (height - margin.top - margin.bottom);
	}

	// Context rungs (CRC/IUPAC standard potentials, 298 K).
	const contextRungs = [
		{ label: 'F₂/F⁻', volts: 2.866 },
		{ label: 'O₂/H₂O', volts: 1.229 },
		{ label: 'Ag⁺/Ag', volts: 0.7996 },
		{ label: 'Fe²⁺/Fe', volts: -0.447 },
		{ label: 'Al³⁺/Al', volts: -1.662 },
		{ label: 'Li⁺/Li', volts: -3.04 }
	];

	const railX = 150;
	const rungHalf = 52;

	let zincV = $derived(STANDARD_POTENTIALS_V.zinc + zincShiftV);
	let copperV = $derived(STANDARD_POTENTIALS_V.copper + copperShiftV);
	let ticks = [-3, -2, -1, 0, 1, 2, 3];

	let ariaLabel = $derived(content.ariaLabel({ emf: emfV.toFixed(3) }));
</script>

<figure class="diagram">
	<svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={ariaLabel}>
		{#each ticks as tick (tick)}
			<line class="grid" x1={margin.left} x2={width - margin.right} y1={y(tick)} y2={y(tick)} />
			<text class="tick" x={margin.left - 8} y={y(tick) + 4} text-anchor="end"
				>{tick > 0 ? `+${tick}` : tick}</text
			>
		{/each}

		<!-- the vertical rail -->
		<line class="rail" x1={railX} x2={railX} y1={y(maxV - 0.05)} y2={y(minV + 0.05)} />

		{#if showLadder}
			{#each contextRungs as rung (rung.label)}
				<line
					class="rung context"
					x1={railX - rungHalf * 0.62}
					x2={railX + rungHalf * 0.62}
					y1={y(rung.volts)}
					y2={y(rung.volts)}
				/>
				<text class="rung-label context" x={railX + rungHalf * 0.62 + 7} y={y(rung.volts) + 3.5}
					>{rung.label}</text
				>
			{/each}
		{/if}

		<!-- SHE zero -->
		<line
			class="rung she"
			x1={railX - rungHalf * 0.8}
			x2={railX + rungHalf * 0.8}
			y1={y(0)}
			y2={y(0)}
		/>
		<text class="rung-label she" x={railX - rungHalf * 0.8 - 7} y={y(0) + 3.5} text-anchor="end"
			>{content.sheLabel}</text
		>

		<!-- the two working rungs -->
		<line
			class="rung copper"
			x1={railX - rungHalf}
			x2={railX + rungHalf}
			y1={y(copperV)}
			y2={y(copperV)}
		/>
		<text class="rung-label copper" x={railX - rungHalf - 7} y={y(copperV) + 3.5} text-anchor="end"
			>{content.copperRung}</text
		>
		<line
			class="rung zinc"
			x1={railX - rungHalf}
			x2={railX + rungHalf}
			y1={y(zincV)}
			y2={y(zincV)}
		/>
		<text class="rung-label zinc" x={railX - rungHalf - 7} y={y(zincV) + 3.5} text-anchor="end"
			>{content.zincRung}</text
		>

		<!-- the gap brace -->
		<line
			class="gap"
			x1={railX + rungHalf + 46}
			x2={railX + rungHalf + 46}
			y1={y(copperV)}
			y2={y(zincV)}
		/>
		<line
			class="gap-cap"
			x1={railX + rungHalf + 40}
			x2={railX + rungHalf + 52}
			y1={y(copperV)}
			y2={y(copperV)}
		/>
		<line
			class="gap-cap"
			x1={railX + rungHalf + 40}
			x2={railX + rungHalf + 52}
			y1={y(zincV)}
			y2={y(zincV)}
		/>
		<text class="gap-label" x={railX + rungHalf + 58} y={(y(copperV) + y(zincV)) / 2 + 4}
			>{content.gapLabel({ emf: emfV.toFixed(3) })}</text
		>

		<!-- electron arrow up the gap -->
		<path
			class="electron-arrow"
			d={`M${railX + rungHalf + 20},${y(zincV) - 8} L${railX + rungHalf + 20},${y(copperV) + 12} M${railX + rungHalf + 15},${y(copperV) + 19} L${railX + rungHalf + 20},${y(copperV) + 11} L${railX + rungHalf + 25},${y(copperV) + 19}`}
		/>

		<line
			class="axis"
			x1={margin.left}
			x2={margin.left}
			y1={margin.top}
			y2={height - margin.bottom}
		/>
		<text
			class="axis-label y-label"
			transform={`translate(15 ${(margin.top + height - margin.bottom) / 2}) rotate(-90)`}
			text-anchor="middle">{content.yAxis}</text
		>
	</svg>
	<figcaption>{content.caption}</figcaption>
</figure>

<style>
	.diagram {
		min-width: 0;
		margin: 0;
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
		max-height: 298px;
		overflow: visible;
	}

	.axis {
		stroke: var(--ink);
		stroke-width: 1.4;
	}

	.grid {
		stroke: rgba(31, 40, 38, 0.08);
		stroke-dasharray: 2 5;
	}

	.tick,
	.axis-label {
		fill: var(--ink-muted);
		font-family: var(--mono);
		font-size: 10px;
	}

	.axis-label {
		fill: var(--ink);
		font-size: 11px;
		font-weight: 700;
	}

	.rail {
		stroke: rgba(31, 40, 38, 0.35);
		stroke-width: 2;
	}

	.rung {
		stroke-linecap: round;
		stroke-width: 3.4;
		transition:
			y1 260ms ease,
			y2 260ms ease;
	}

	.rung.context {
		stroke: rgba(31, 40, 38, 0.28);
		stroke-width: 2.2;
	}

	.rung.she {
		stroke: var(--ink-muted);
		stroke-dasharray: 5 4;
		stroke-width: 1.8;
	}

	.rung.copper {
		stroke: #a3702a;
	}

	.rung.zinc {
		stroke: #5f6398;
	}

	.rung-label {
		font-family: var(--mono);
		font-size: 10px;
		font-weight: 700;
		fill: var(--ink-muted);
	}

	.rung-label.copper {
		fill: #a3702a;
		font-weight: 800;
	}

	.rung-label.zinc {
		fill: #4c4f7c;
		font-weight: 800;
	}

	.rung-label.she {
		fill: var(--ink-muted);
	}

	.rung-label.context {
		fill: rgba(31, 40, 38, 0.45);
	}

	.gap,
	.gap-cap {
		stroke: var(--acid);
		stroke-width: 1.8;
		transition:
			y1 260ms ease,
			y2 260ms ease;
	}

	.gap-label {
		fill: var(--acid);
		font-family: var(--mono);
		font-size: 11px;
		font-weight: 800;
	}

	.electron-arrow {
		fill: none;
		stroke: var(--water);
		stroke-width: 1.8;
		stroke-linecap: round;
		stroke-linejoin: round;
		transition: d 260ms ease;
	}

	figcaption {
		margin: 0.35rem 0 0;
		color: var(--ink-muted);
		font-size: 0.64rem;
		line-height: 1.4;
	}

	@media (max-width: 540px) {
		.tick {
			font-size: 18px;
		}

		.axis-label {
			font-size: 17px;
		}

		.rung-label,
		.gap-label {
			font-size: 14px;
		}
	}
</style>
