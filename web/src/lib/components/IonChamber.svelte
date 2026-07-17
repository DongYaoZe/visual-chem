<script lang="ts">
	import type { SaltFrame } from '$lib/chem';
	import type { SaltTriViewContent } from '$lib/content';

	interface Props {
		frame: SaltFrame;
		content: SaltTriViewContent['ions'];
	}

	let { frame, content }: Props = $props();

	const MAX_DOTS = 14;
	const kSlots = Array.from({ length: MAX_DOTS }, (_, index) => ({
		index,
		x: 24 + ((index * 53) % 168),
		y: 36 + ((index * 37) % 90),
		delay: -((index * 0.13) % 2.4)
	}));
	const naSlots = Array.from({ length: MAX_DOTS }, (_, index) => ({
		index,
		x: 30 + ((index * 61) % 160),
		y: 40 + ((index * 29) % 84),
		delay: -((index * 0.17) % 2.8)
	}));
	const no3Slots = Array.from({ length: MAX_DOTS }, (_, index) => ({
		index,
		x: 20 + ((index * 47) % 176),
		y: 33 + ((index * 43) % 94),
		delay: -((index * 0.11) % 2.2)
	}));

	// Each dissolved formula unit yields one cation and one nitrate:
	// KNO3 101.103 g/mol, NaNO3 84.995 g/mol.
	let molK = $derived(frame.equilibrium.liquid.kno3G / 101.103);
	let molNa = $derived(frame.equilibrium.liquid.nano3G / 84.995);
	let molNo3 = $derived(molK + molNa);
	let maxMol = $derived(Math.max(molK, molNa, molNo3));

	function dotCount(mol: number, reference: number): number {
		if (mol <= 0 || reference <= 0) return 0;
		return Math.max(1, Math.round((mol / reference) * MAX_DOTS));
	}

	let kCount = $derived(dotCount(molK, maxMol));
	let naCount = $derived(dotCount(molNa, maxMol));
	let no3Count = $derived(dotCount(molNo3, maxMol));

	function latticeCells(grams: number): number {
		if (grams <= 0.05) return 0;
		return Math.min(4, Math.max(2, Math.round(2 + grams / 18)));
	}

	function latticeSites(cells: number, originX: number, originY: number, direction: 1 | -1) {
		const sites = [];
		for (let row = 0; row < cells; row += 1) {
			for (let column = 0; column < cells; column += 1) {
				sites.push({
					key: row * cells + column,
					x: originX + direction * column * 9,
					y: originY - row * 9,
					cation: (row + column) % 2 === 0
				});
			}
		}
		return sites;
	}

	let kno3Cells = $derived(latticeCells(frame.equilibrium.solids.kno3G));
	let nano3Cells = $derived(latticeCells(frame.equilibrium.solids.nano3G));
	let kno3Sites = $derived(latticeSites(kno3Cells, 22, 168, 1));
	let nano3Sites = $derived(latticeSites(nano3Cells, 198, 168, -1));
</script>

<figure class="ions">
	<svg viewBox="0 0 220 190" role="img" aria-label={content.ariaLabel}>
		<g aria-hidden="true">
			<rect class="chamber" x="6" y="6" width="208" height="178" rx="12" />
			<text class="tag" x="14" y="21">{content.dissolvedTag}</text>

			{#each no3Slots.slice(0, no3Count) as slot (slot.index)}
				<circle
					class="ion no3"
					cx={slot.x}
					cy={slot.y}
					r="4.5"
					style:animation-delay={`${slot.delay}s`}
				/>
			{/each}
			{#each kSlots.slice(0, kCount) as slot (slot.index)}
				<circle
					class="ion k"
					cx={slot.x}
					cy={slot.y}
					r="4.5"
					style:animation-delay={`${slot.delay}s`}
				/>
			{/each}
			{#each naSlots.slice(0, naCount) as slot (slot.index)}
				<circle
					class="ion na"
					cx={slot.x}
					cy={slot.y}
					r="4.5"
					style:animation-delay={`${slot.delay}s`}
				/>
			{/each}

			{#if kno3Cells > 0}
				<text class="tag" x="16" y={168 - (kno3Cells - 1) * 9 - 10}>{content.latticeTag}</text>
				{#each kno3Sites as site (site.key)}
					<circle
						class="site"
						class:k={site.cation}
						class:no3={!site.cation}
						cx={site.x}
						cy={site.y}
						r="3.2"
					/>
				{/each}
			{/if}
			{#if nano3Cells > 0}
				<text class="tag" x="204" y={168 - (nano3Cells - 1) * 9 - 10} text-anchor="end"
					>{content.latticeTag}</text
				>
				{#each nano3Sites as site (site.key)}
					<circle
						class="site"
						class:na={site.cation}
						class:no3={!site.cation}
						cx={site.x}
						cy={site.y}
						r="3.2"
					/>
				{/each}
			{/if}
		</g>
	</svg>
	<div class="legend" aria-hidden="true">
		<span><i class="dot k"></i>{content.potassium}</span>
		<span><i class="dot na"></i>{content.sodium}</span>
		<span><i class="dot no3"></i>{content.nitrate}</span>
	</div>
	<figcaption><span>{content.viewName}</span> {content.caption}</figcaption>
</figure>

<style>
	.ions {
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
		fill: rgba(32, 127, 140, 0.08);
		stroke: rgba(31, 40, 38, 0.2);
	}

	.tag {
		fill: var(--ink-muted);
		font-family: var(--mono);
		font-size: 7.5px;
		font-weight: 700;
		paint-order: stroke;
		stroke: var(--paper);
		stroke-width: 2.5;
	}

	.ion {
		stroke: rgba(255, 255, 255, 0.72);
		animation: sway 2.6s ease-in-out infinite alternate;
	}

	/* Lattice sites hold still; only dissolved ions drift. */
	.site {
		stroke: rgba(255, 255, 255, 0.6);
		stroke-width: 0.8;
	}

	.ion.k,
	.site.k {
		fill: #5f6398;
	}

	.ion.na,
	.site.na {
		fill: #d99a3d;
	}

	.ion.no3,
	.site.no3 {
		fill: var(--water);
	}

	.dot.k {
		background: #5f6398;
	}

	.dot.na {
		background: #d99a3d;
	}

	.dot.no3 {
		background: var(--water);
	}

	.legend {
		display: flex;
		gap: 1rem;
		justify-content: center;
		padding-top: 0.45rem;
		color: var(--ink-muted);
		font-size: 0.62rem;
	}

	.legend span {
		display: flex;
		gap: 0.3rem;
		align-items: center;
	}

	.legend i {
		display: inline-block;
		width: 7px;
		height: 7px;
		border-radius: 50%;
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

	@keyframes sway {
		to {
			transform: translate(3px, -4px);
		}
	}
</style>
