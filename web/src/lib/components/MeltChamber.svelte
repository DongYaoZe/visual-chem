<script lang="ts">
	import type { EutecticFrame } from '$lib/chem/eutectic-frame';
	import type { CoolingTriViewContent } from '$lib/content';

	interface Props {
		frame: EutecticFrame;
		content: CoolingTriViewContent['melt'];
	}

	let { frame, content }: Props = $props();

	const CHAMBER_WIDTH = 208;
	const CHAMBER_HEIGHT = 178;
	const CHAMBER_X = 6;
	const CHAMBER_Y = 6;
	const BI_RADIUS = 4.5;
	const CD_RADIUS = 3.5;
	const TOTAL_ATOMS = 26;

	// Honest proportion: split atoms by frame.xCd, ensuring at least 1 of each when 0 < xCd < 1
	let biCount = $derived(
		frame.xCd <= 0
			? TOTAL_ATOMS
			: frame.xCd >= 1
				? 0
				: Math.max(1, Math.round(TOTAL_ATOMS * (1 - frame.xCd)))
	);
	let cdCount = $derived(
		frame.xCd <= 0 ? 0 : frame.xCd >= 1 ? TOTAL_ATOMS : Math.max(1, TOTAL_ATOMS - biCount)
	);

	// Deterministic pseudo-random positions: index-hashed scatter
	function scatterPosition(index: number, radius: number) {
		const hash = ((index * 2654435761) >>> 0) / 4294967296;
		const hash2 = ((index * 1664525 + 1013904223) >>> 0) / 4294967296;
		return {
			x: CHAMBER_X + radius + hash * (CHAMBER_WIDTH - 2 * radius),
			y: CHAMBER_Y + radius + hash2 * (CHAMBER_HEIGHT - 2 * radius),
			delay: -((index * 0.13) % 2.6)
		};
	}

	let biAtoms = $derived(
		Array.from({ length: biCount }, (_, i) => ({
			index: i,
			...scatterPosition(i, BI_RADIUS)
		}))
	);
	let cdAtoms = $derived(
		Array.from({ length: cdCount }, (_, i) => ({
			index: i + 100,
			...scatterPosition(i + 100, CD_RADIUS)
		}))
	);

	let split = $derived(frame.split);
	let solidBiCount = $derived(Math.round(split.solidAFraction * biCount));
	let solidCdCount = $derived(Math.round(split.solidBFraction * cdCount));
	let liquidBiCount = $derived(biCount - solidBiCount);
	let liquidCdCount = $derived(cdCount - solidCdCount);

	// Lattice blocks: Bi bottom-left, Cd bottom-right
	function latticeSites(count: number, originX: number, originY: number, spacing = 9) {
		const sites = [];
		const cols = Math.ceil(Math.sqrt(count * 1.5));
		for (let i = 0; i < count; i += 1) {
			sites.push({
				key: i,
				x: originX + (i % cols) * spacing,
				y: originY - Math.floor(i / cols) * spacing
			});
		}
		return sites;
	}

	let biLattice = $derived(latticeSites(solidBiCount, 20, 172));
	let cdLattice = $derived(latticeSites(solidCdCount, 190, 172));

	// Eutectic lamellar block: thin alternating stripes at bottom center
	let eutecticCount = $derived(
		frame.region === 'solid-mixture' ? Math.round(frame.eutecticLiquidFraction * TOTAL_ATOMS) : 0
	);
	let eutecticRows = $derived(Math.min(8, Math.max(2, Math.ceil(eutecticCount / 3))));
</script>

<figure class="melt-chamber">
	<svg viewBox="0 0 220 190" role="img" aria-label={content.ariaLabel}>
		<g aria-hidden="true">
			<rect
				class="chamber"
				x={CHAMBER_X}
				y={CHAMBER_Y}
				width={CHAMBER_WIDTH}
				height={CHAMBER_HEIGHT}
				rx="12"
			/>

			<!-- Liquid zone tag -->
			{#if liquidBiCount + liquidCdCount > 0}
				<text class="tag" x="14" y="21">{content.liquidTag}</text>
			{/if}

			<!-- Liquid atoms: Bi -->
			{#each biAtoms.slice(0, liquidBiCount) as atom (atom.index)}
				<circle
					class="atom bi liquid"
					cx={atom.x}
					cy={atom.y}
					r={BI_RADIUS}
					style:animation-delay={`${atom.delay}s`}
				/>
			{/each}

			<!-- Liquid atoms: Cd -->
			{#each cdAtoms.slice(0, liquidCdCount) as atom (atom.index)}
				<circle
					class="atom cd liquid"
					cx={atom.x}
					cy={atom.y}
					r={CD_RADIUS}
					style:animation-delay={`${atom.delay}s`}
				/>
			{/each}

			<!-- Bi crystal lattice -->
			{#if solidBiCount > 0}
				<text
					class="tag"
					x="16"
					y={172 - Math.ceil(solidBiCount / Math.ceil(Math.sqrt(solidBiCount * 1.5))) * 9 - 8}
					>{content.crystalTag}</text
				>
				{#each biLattice as site (site.key)}
					<circle class="atom bi solid" cx={site.x} cy={site.y} r={BI_RADIUS * 0.9} />
				{/each}
			{/if}

			<!-- Cd crystal lattice -->
			{#if solidCdCount > 0}
				<text
					class="tag"
					x="204"
					y={172 - Math.ceil(solidCdCount / Math.ceil(Math.sqrt(solidCdCount * 1.5))) * 9 - 8}
					text-anchor="end">{content.crystalTag}</text
				>
				{#each cdLattice as site (site.key)}
					<circle class="atom cd solid" cx={site.x} cy={site.y} r={CD_RADIUS * 0.9} />
				{/each}
			{/if}

			<!-- Eutectic lamellar block -->
			{#if eutecticCount > 0}
				<g class="eutectic-lamellae">
					{#each Array.from({ length: eutecticRows }, (_item, index) => index) as i (i)}
						{#if i % 2 === 0}
							<rect class="bi" x="98" y={175 - i * 3} width="24" height="2.5" />
						{:else}
							<rect class="cd" x="98" y={175 - i * 3} width="24" height="2.5" />
						{/if}
					{/each}
				</g>
			{/if}
		</g>
	</svg>

	<!-- Legend -->
	<div class="legend" aria-hidden="true">
		<span><i class="dot bi"></i>{content.bismuth}</span>
		<span><i class="dot cd"></i>{content.cadmium}</span>
	</div>

	<figcaption><span>{content.viewName}</span> {content.caption}</figcaption>
</figure>

<style>
	.melt-chamber {
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
		fill: rgba(95, 99, 152, 0.06);
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

	.atom {
		stroke: rgba(255, 255, 255, 0.7);
		stroke-width: 0.8;
	}

	.atom.liquid {
		animation: drift 2.6s ease-in-out infinite alternate;
	}

	@media (prefers-reduced-motion: reduce) {
		.atom.liquid {
			animation: none;
		}
	}

	.atom.bi {
		fill: #5f6398;
	}

	.atom.cd {
		fill: #a3702a;
	}

	.atom.solid {
		stroke-width: 0.6;
	}

	.eutectic-lamellae rect.bi {
		fill: #5f6398;
	}

	.eutectic-lamellae rect.cd {
		fill: #a3702a;
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

	.legend .dot.bi {
		background: #5f6398;
	}

	.legend .dot.cd {
		background: #a3702a;
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

	@keyframes drift {
		to {
			transform: translate(3px, -4px);
		}
	}
</style>
