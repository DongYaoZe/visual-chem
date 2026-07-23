<script lang="ts">
	import type { CatalystTriViewContent } from '$lib/content';

	interface Props {
		/** True catalyzed/uncatalyzed rate ratio shown to the reader. */
		boost: number;
		/** log10 of the catalyzed/uncatalyzed rate boost, 0..12 — drives foam. */
		boostLog: number;
		content: CatalystTriViewContent['bench'];
	}

	let { boost, boostLog, content }: Props = $props();

	function hashed(index: number, salt: number): number {
		return (((index + salt) * 2654435761) >>> 0) / 4294967296;
	}

	let clamped = $derived(Math.max(0, Math.min(12, boostLog)));
	let bubbleCount = $derived(clamped === 0 ? 2 : Math.min(15, 3 + Math.round(clamped)));
	let bubbleDuration = $derived(clamped === 0 ? 6 : 3.4 - 0.2 * clamped);
	let foamHeight = $derived(clamped === 0 ? 0 : 4 + 14 * (clamped / 12));
	let boostDisplay = $derived.by(() => {
		if (boost < 10) return boost.toFixed(1).replace(/\.0$/, '');
		if (boost < 1000) return boost.toFixed(0);
		return boost.toExponential(1);
	});

	// Fixed lanes inside the catalyzed tube; each bubble owns one.
	let bubbles = $derived(
		Array.from({ length: bubbleCount }, (_item, index) => ({
			index,
			x: 148 + 6 + hashed(index, 13) * 30,
			r: 1.6 + hashed(index, 31) * 1.6,
			delay: -(hashed(index, 53) * bubbleDuration)
		}))
	);

	// Foam cap: a fixed cluster of small ellipses, clipped by foamHeight.
	const foamBlobs = Array.from({ length: 7 }, (_item, index) => ({
		index,
		x: 150 + hashed(index, 71) * 36,
		dy: hashed(index, 89) * 12,
		rx: 4 + hashed(index, 97) * 3.5
	}));
</script>

<figure class="catalyst-bench" data-testid="catalyst-bench">
	<svg viewBox="0 0 220 190" role="img" aria-label={content.ariaLabel}>
		<g aria-hidden="true">
			<line class="bench" x1="12" y1="160" x2="208" y2="160" />

			<!-- plain tube -->
			<path class="tube" d="M42 34 L42 138 A17 17 0 0 0 76 138 L76 34" />
			<rect class="liquid" x="44" y="70" width="30" height="76" rx="12" />
			<circle class="bubble slow" cx="54" cy="120" r="1.8" />
			<circle class="bubble slow late" cx="65" cy="132" r="1.6" />
			<text class="tag" x="59" y="176" text-anchor="middle">{content.plainTag}</text>

			<!-- catalyzed tube -->
			<path class="tube" d="M146 34 L146 138 A17 17 0 0 0 180 138 L180 34" />
			<rect class="liquid" x="148" y="70" width="30" height="76" rx="12" />
			{#each bubbles as bubble (bubble.index)}
				<circle
					class="bubble lively"
					cx={bubble.x}
					cy="138"
					r={bubble.r}
					style:animation-duration={`${bubbleDuration}s`}
					style:animation-delay={`${bubble.delay}s`}
				/>
			{/each}
			<!-- foam cap -->
			{#if foamHeight > 0}
				<g class="foam">
					{#each foamBlobs as blob (blob.index)}
						<ellipse
							cx={blob.x}
							cy={66 - (blob.dy * foamHeight) / 16}
							rx={blob.rx}
							ry={2.6 + foamHeight / 6}
						/>
					{/each}
				</g>
			{/if}
			<text class="tag" x="163" y="176" text-anchor="middle">{content.catalyzedTag}</text>

			<!-- boost readout -->
			<g transform="translate(64 8)">
				<rect class="chip" width="94" height="20" rx="10" />
				<text class="chip-text" x="47" y="14" text-anchor="middle"
					>{content.bubbleRate({ boost: boostDisplay })}</text
				>
			</g>
		</g>
	</svg>

	<figcaption><span>{content.viewName}</span> {content.caption}</figcaption>
</figure>

<style>
	.catalyst-bench {
		display: grid;
		height: 100%;
		min-height: 220px;
		margin: 0;
		grid-template-rows: 1fr auto;
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
		max-height: 260px;
	}

	.bench {
		stroke: rgba(31, 40, 38, 0.3);
		stroke-width: 2;
		stroke-linecap: round;
	}

	.tube {
		fill: rgba(255, 255, 255, 0.35);
		stroke: rgba(31, 40, 38, 0.55);
		stroke-width: 2;
		stroke-linejoin: round;
	}

	.liquid {
		fill: rgba(32, 127, 140, 0.14);
	}

	.bubble {
		fill: rgba(255, 255, 255, 0.9);
		stroke: rgba(31, 40, 38, 0.35);
		stroke-width: 0.7;
	}

	.bubble.slow {
		animation: rise 6s linear infinite;
	}

	.bubble.slow.late {
		animation-delay: -3s;
	}

	.bubble.lively {
		animation: rise 2.4s linear infinite;
	}

	@media (prefers-reduced-motion: reduce) {
		.bubble {
			animation: none;
		}
	}

	.foam ellipse {
		fill: rgba(255, 255, 255, 0.92);
		stroke: rgba(31, 40, 38, 0.18);
		stroke-width: 0.6;
	}

	.tag {
		fill: var(--ink-muted);
		font-family: var(--mono);
		font-size: 9.5px;
		font-weight: 700;
	}

	.chip {
		fill: rgba(255, 255, 255, 0.75);
		stroke: rgba(31, 40, 38, 0.2);
	}

	.chip-text {
		fill: var(--ink);
		font-family: var(--mono);
		font-size: 10px;
		font-weight: 800;
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

	@keyframes rise {
		from {
			transform: translateY(0);
			opacity: 0.9;
		}

		to {
			transform: translateY(-64px);
			opacity: 0;
		}
	}
</style>
