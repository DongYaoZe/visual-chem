<script lang="ts">
	import type { ArrheniusTriViewContent } from '$lib/content';

	interface Props {
		currentTemperatureC: number;
		comparisonTemperatureC: number;
		content: ArrheniusTriViewContent['scene'];
	}

	let { currentTemperatureC, comparisonTemperatureC, content }: Props = $props();

	let coldTemperatureC = $derived(Math.min(currentTemperatureC, comparisonTemperatureC));
	let hotTemperatureC = $derived(Math.max(currentTemperatureC, comparisonTemperatureC));
	let coldWarmth = $derived(Math.max(0, Math.min(1, (coldTemperatureC + 10) / 90)));
	let hotWarmth = $derived(Math.max(0, Math.min(1, (hotTemperatureC + 10) / 90)));

	function liquidFill(warmth: number): string {
		const red = Math.round(105 + 85 * warmth);
		const green = Math.round(135 - 55 * warmth);
		const blue = Math.round(165 - 90 * warmth);
		return 'rgba(' + red + ', ' + green + ', ' + blue + ', ' + (0.2 + 0.34 * warmth) + ')';
	}

	let coldFill = $derived(liquidFill(coldWarmth));
	let hotFill = $derived(liquidFill(hotWarmth));
	let plateFill = $derived('rgba(191, 61, 48, ' + (0.12 + 0.68 * hotWarmth) + ')');
	let shimmerOpacity = $derived(0.04 + 0.48 * hotWarmth);
	let accessibleLabel = $derived(
		content.ariaLabel({
			coldTemperatureC: coldTemperatureC.toFixed(0),
			hotTemperatureC: hotTemperatureC.toFixed(0)
		})
	);
</script>

<figure
	class="thermal-scene"
	data-testid="thermal-scene"
	data-cold-temperature={coldTemperatureC.toFixed(0)}
	data-hot-temperature={hotTemperatureC.toFixed(0)}
>
	<svg viewBox="0 0 220 190" role="img" aria-label={accessibleLabel}>
		<g aria-hidden="true">
			<line class="bench" x1="10" y1="168" x2="210" y2="168" />

			<!-- The colder member of the pair is always on the left. -->
			<path
				class="flask"
				d="M62 52 L62 88 C42 104 34 122 34 138 A32 30 0 0 0 94 138 C94 122 84 104 66 88 L66 52 Z"
				transform="translate(-14 0)"
			/>
			<path
				class="liquid"
				style:fill={coldFill}
				d="M50 108 C38 118 32 128 32 138 A28 26 0 0 0 86 138 C86 128 78 118 68 108 Z"
				transform="translate(-14 0)"
			/>
			<rect class="stopper" x="42" y="44" width="14" height="10" rx="2.5" />
			<text class="tag" x="45" y="186" text-anchor="middle">{content.coldTag}</text>

			<!-- The warmer member of the pair is always on the right. -->
			<path
				class="flask"
				d="M62 52 L62 88 C42 104 34 122 34 138 A32 30 0 0 0 94 138 C94 122 84 104 66 88 L66 52 Z"
				transform="translate(96 0)"
			/>
			<path
				class="liquid"
				style:fill={hotFill}
				d="M50 108 C38 118 32 128 32 138 A28 26 0 0 0 86 138 C86 128 78 118 68 108 Z"
				transform="translate(96 0)"
			/>
			<rect class="stopper" x="152" y="44" width="14" height="10" rx="2.5" />
			<text class="tag" x="156" y="186" text-anchor="middle">{content.hotTag}</text>

			<rect class="plate" style:fill={plateFill} x="122" y="164" width="68" height="7" rx="3.5" />

			<g class="shimmer" style:opacity={shimmerOpacity}>
				<path d="M142 36 C139 28 145 22 142 14" />
				<path d="M156 40 C153 32 159 26 156 18" />
				<path d="M170 36 C167 28 173 22 170 14" />
			</g>

			<g transform="translate(10 8)">
				<rect class="chip cold-chip" width="72" height="20" rx="10" />
				<text class="chip-text" x="36" y="14" text-anchor="middle">
					{content.temperatureLabel({ temperatureC: coldTemperatureC.toFixed(0) })}
				</text>
			</g>
			<g transform="translate(138 8)">
				<rect class="chip hot-chip" width="72" height="20" rx="10" />
				<text class="chip-text" x="36" y="14" text-anchor="middle">
					{content.temperatureLabel({ temperatureC: hotTemperatureC.toFixed(0) })}
				</text>
			</g>
		</g>
	</svg>

	<figcaption><span>{content.viewName}</span> {content.caption}</figcaption>
</figure>

<style>
	.thermal-scene {
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

	.flask {
		fill: rgba(255, 255, 255, 0.35);
		stroke: rgba(31, 40, 38, 0.55);
		stroke-width: 2;
		stroke-linejoin: round;
	}

	.liquid,
	.plate {
		transition: fill 300ms ease;
	}

	.stopper {
		fill: rgba(31, 40, 38, 0.35);
	}

	.tag {
		fill: var(--ink-muted);
		font-family: var(--mono);
		font-size: 9.5px;
		font-weight: 700;
	}

	.shimmer path {
		fill: none;
		stroke: var(--ink-muted);
		stroke-width: 1.6;
		stroke-linecap: round;
		animation: waft 2.6s ease-in-out infinite alternate;
	}

	.shimmer path:nth-child(2) {
		animation-delay: -0.9s;
	}

	.shimmer path:nth-child(3) {
		animation-delay: -1.7s;
	}

	.chip {
		fill: rgba(255, 255, 255, 0.78);
		stroke: rgba(31, 40, 38, 0.2);
	}

	.cold-chip {
		stroke: rgba(23, 99, 109, 0.5);
	}

	.hot-chip {
		stroke: rgba(163, 68, 40, 0.5);
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

	@keyframes waft {
		to {
			transform: translateY(-4px);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.liquid,
		.plate {
			transition: none;
		}

		.shimmer path {
			animation: none;
		}
	}
</style>
