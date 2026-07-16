<script lang="ts">
	import { type ApparatusContent, zhCNSiteContent } from '$lib/content';

	interface Props {
		liquidComposition: number;
		vaporComposition: number;
		stage?: number;
		active?: boolean;
		content?: ApparatusContent;
	}

	let {
		liquidComposition,
		vaporComposition,
		stage = 0,
		active = true,
		content = zhCNSiteContent.shared.apparatus
	}: Props = $props();
	const uid = $props.id();

	function mixtureColor(composition: number): string {
		const x = Math.min(1, Math.max(0, composition));
		const water = [32, 127, 140];
		const ethanol = [214, 107, 50];
		return `rgb(${water.map((value, index) => Math.round(value + (ethanol[index] - value) * x)).join(',')})`;
	}

	let liquidColor = $derived(mixtureColor(liquidComposition));
	let vaporColor = $derived(mixtureColor(vaporComposition));
</script>

<figure class="apparatus" class:active>
	<svg viewBox="0 0 520 300" role="img" aria-label={content.ariaLabel}>
		<defs>
			<linearGradient id={`${uid}-glass`} x1="0" x2="1">
				<stop offset="0" stop-color="#fff" stop-opacity=".72" />
				<stop offset=".45" stop-color="#dbe8e5" stop-opacity=".12" />
				<stop offset="1" stop-color="#fff" stop-opacity=".5" />
			</linearGradient>
			<filter id={`${uid}-soft-glow`}>
				<feGaussianBlur stdDeviation="5" />
			</filter>
		</defs>

		<path class="bench" d="M24 264h472" />
		<path
			class="glass"
			fill={`url(#${uid}-glass)`}
			d="M104 64v48l-52 96c-18 32 4 56 42 56h116c38 0 60-24 42-56l-52-96V64"
		/>
		<path class="neck" d="M96 64h112" />
		<path
			class="liquid"
			style:fill={liquidColor}
			d="M70 208c34-14 131-14 165 0 15 28-4 44-29 44H98c-25 0-44-16-28-44Z"
		/>
		<ellipse class="liquid-top" style:fill={liquidColor} cx="152" cy="208" rx="82" ry="13" />
		<circle class="heat-glow" filter={`url(#${uid}-soft-glow)`} cx="153" cy="268" r="44" />
		<path class="heater" d="M96 270c20-18 92-18 112 0" />

		{#each [0, 1, 2, 3, 4, 5] as bubble (bubble)}
			<circle
				class="bubble"
				cx={105 + ((bubble * 31) % 92)}
				cy={224 - ((bubble * 17) % 66)}
				r={3 + (bubble % 3)}
				style:animation-delay={`${bubble * -0.31}s`}
			/>
		{/each}

		<path class="pipe-outer" d="M152 64V36h128l30 32h96" />
		<path class="pipe-inner" d="M152 64V36h128l30 32h96" />
		<path class="cooler" d="m274 28 52 55m-35-69 52 55" />
		<path class="water-in" d="M313 81v30" />
		<path class="water-out" d="M300 14V2" />
		<path
			class="receiver"
			fill={`url(#${uid}-glass)`}
			d="M390 110v42l-32 82c-7 18 4 30 24 30h70c20 0 31-12 24-30l-32-82v-42"
		/>
		<path class="neck" d="M382 110h70" />
		<path
			class="distillate"
			style:fill={vaporColor}
			d="M370 224c20-8 73-8 94 0l8 22c2 6-5 10-17 10h-76c-12 0-19-4-17-10Z"
		/>
		<ellipse class="distillate-top" style:fill={vaporColor} cx="417" cy="224" rx="47" ry="7" />

		{#each [0, 1, 2] as drop (drop)}
			<circle
				class="drop"
				style:fill={vaporColor}
				cx={406 + drop * 6}
				cy={90 + drop * 13}
				r="3"
				style:animation-delay={`${drop * -0.42}s`}
			/>
		{/each}

		<text class="label" x="152" y="184" text-anchor="middle"
			>{content.stillLiquid({ composition: liquidComposition.toFixed(3) })}</text
		>
		<text class="label" x="417" y="204" text-anchor="middle"
			>{content.distillate({ composition: vaporComposition.toFixed(3) })}</text
		>
		<text class="stage" x="488" y="28" text-anchor="end">{content.equilibriumStage({ stage })}</text
		>
	</svg>
	<figcaption><span>{content.viewName}</span> {content.caption}</figcaption>
</figure>

<style>
	.apparatus {
		height: 100%;
		min-height: 220px;
		margin: 0;
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
		max-height: 260px;
	}

	.glass,
	.receiver {
		stroke: #52625f;
		stroke-width: 3;
	}

	.neck,
	.pipe-outer,
	.cooler,
	.water-in,
	.water-out,
	.heater,
	.bench {
		fill: none;
		stroke: #52625f;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.neck,
	.heater {
		stroke-width: 3;
	}

	.pipe-outer {
		stroke-width: 14;
	}

	.pipe-inner {
		fill: none;
		stroke: rgba(255, 255, 255, 0.82);
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-width: 7;
	}

	.cooler {
		stroke: var(--water);
		stroke-width: 8;
	}

	.water-in,
	.water-out {
		stroke: var(--water);
		stroke-width: 3;
	}

	.bench {
		stroke: rgba(31, 40, 38, 0.22);
		stroke-width: 2;
	}

	.liquid,
	.liquid-top,
	.distillate,
	.distillate-top {
		opacity: 0.77;
		transition: fill 500ms ease;
	}

	.heat-glow {
		fill: rgba(214, 107, 50, 0.28);
		opacity: 0;
		transition: opacity 300ms ease;
	}

	.active .heat-glow {
		opacity: 1;
		animation: heat 1.8s ease-in-out infinite alternate;
	}

	.bubble {
		fill: rgba(255, 255, 255, 0.25);
		stroke: rgba(255, 255, 255, 0.8);
		opacity: 0;
	}

	.active .bubble {
		animation: bubble 2.2s ease-in infinite;
	}

	.drop {
		opacity: 0;
	}

	.active .drop {
		animation: drip 1.4s ease-in infinite;
	}

	.label,
	.stage {
		fill: var(--ink);
		font-family: var(--mono);
		font-size: 12px;
		font-weight: 700;
	}

	.stage {
		fill: var(--ink-muted);
		font-size: 11px;
	}

	figcaption {
		margin: 0.1rem 0 0;
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

	@keyframes bubble {
		0% {
			transform: translateY(8px) scale(0.65);
			opacity: 0;
		}
		25% {
			opacity: 0.9;
		}
		100% {
			transform: translateY(-46px) scale(1.15);
			opacity: 0;
		}
	}

	@keyframes drip {
		0% {
			transform: translateY(-14px);
			opacity: 0;
		}
		25% {
			opacity: 0.8;
		}
		100% {
			transform: translateY(52px);
			opacity: 0;
		}
	}

	@keyframes heat {
		to {
			transform: scale(1.08);
			opacity: 0.72;
		}
	}
</style>
