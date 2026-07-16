<script lang="ts">
	import { type ParticleContent, zhCNSiteContent } from '$lib/content';

	interface Props {
		liquidComposition: number;
		vaporComposition: number;
		active?: boolean;
		content?: ParticleContent;
	}

	let {
		liquidComposition,
		vaporComposition,
		active = true,
		content = zhCNSiteContent.shared.particles
	}: Props = $props();

	const liquidParticles = Array.from({ length: 44 }, (_, index) => ({
		index,
		x: 7 + ((index * 37) % 87),
		y: 59 + ((index * 23) % 34),
		delay: -((index * 0.13) % 2.4)
	}));
	const vaporParticles = Array.from({ length: 24 }, (_, index) => ({
		index,
		x: 8 + ((index * 41) % 84),
		y: 8 + ((index * 29) % 39),
		delay: -((index * 0.17) % 2.8)
	}));

	let liquidEthanol = $derived(Math.round(liquidComposition * liquidParticles.length));
	let vaporEthanol = $derived(Math.round(vaporComposition * vaporParticles.length));

	function isEthanol(index: number, ethanolCount: number, total: number): boolean {
		return (index * 17) % total < ethanolCount;
	}
</script>

<figure class="micro" class:active>
	<div class="chamber">
		<div class="phase-label vapor-label">
			<span>{content.vaporPhase}</span>
			<strong>y = {vaporComposition.toFixed(3)}</strong>
		</div>
		<div class="phase-label liquid-label">
			<span>{content.liquidPhase}</span>
			<strong>x = {liquidComposition.toFixed(3)}</strong>
		</div>
		<div class="interface"></div>

		{#each vaporParticles as particle (particle.index)}
			<i
				class:ethanol={isEthanol(particle.index, vaporEthanol, vaporParticles.length)}
				class:water={!isEthanol(particle.index, vaporEthanol, vaporParticles.length)}
				class="particle vapor"
				style:left={`${particle.x}%`}
				style:top={`${particle.y}%`}
				style:animation-delay={`${particle.delay}s`}
			></i>
		{/each}

		{#each liquidParticles as particle (particle.index)}
			<i
				class:ethanol={isEthanol(particle.index, liquidEthanol, liquidParticles.length)}
				class:water={!isEthanol(particle.index, liquidEthanol, liquidParticles.length)}
				class="particle liquid"
				style:left={`${particle.x}%`}
				style:top={`${particle.y}%`}
				style:animation-delay={`${particle.delay}s`}
			></i>
		{/each}
	</div>
	<div class="legend" aria-hidden="true">
		<span><i class="ethanol-dot"></i>{content.ethanol}</span>
		<span><i class="water-dot"></i>{content.water}</span>
	</div>
	<figcaption><span>{content.viewName}</span> {content.caption}</figcaption>
</figure>

<style>
	.micro {
		display: grid;
		height: 100%;
		min-height: 220px;
		margin: 0;
		grid-template-rows: 1fr auto auto;
	}

	.chamber {
		position: relative;
		min-height: 180px;
		overflow: hidden;
		border: 1px solid rgba(31, 40, 38, 0.2);
		border-radius: 50% 50% 14px 14px / 18% 18% 14px 14px;
		background:
			linear-gradient(to bottom, rgba(255, 255, 255, 0.5) 0 53%, rgba(32, 127, 140, 0.1) 53%),
			radial-gradient(circle at 34% 20%, rgba(255, 255, 255, 0.9), transparent 30%);
		box-shadow: inset 10px 0 20px rgba(255, 255, 255, 0.3);
	}

	.interface {
		position: absolute;
		top: 53%;
		left: 0;
		width: 100%;
		height: 2px;
		background: linear-gradient(90deg, transparent, var(--water), transparent);
		opacity: 0.55;
	}

	.particle {
		position: absolute;
		display: block;
		width: 8px;
		height: 8px;
		border: 1px solid rgba(255, 255, 255, 0.72);
		border-radius: 50%;
		box-shadow: 0 2px 5px rgba(31, 40, 38, 0.16);
		transition:
			background 450ms ease,
			opacity 450ms ease;
	}

	.particle.ethanol,
	.ethanol-dot {
		background: var(--ethanol);
	}

	.particle.water,
	.water-dot {
		background: var(--water);
		border-radius: 2px 50% 50% 50%;
	}

	.particle.ethanol::after {
		position: absolute;
		inset: 2px;
		border: 1px solid rgba(255, 255, 255, 0.72);
		border-radius: 50%;
		content: '';
	}

	.active .particle.vapor {
		animation: wander 2.8s ease-in-out infinite alternate;
	}

	.active .particle.liquid {
		animation: jostle 1.6s ease-in-out infinite alternate;
	}

	.phase-label {
		position: absolute;
		z-index: 2;
		display: flex;
		gap: 0.45rem;
		align-items: baseline;
		padding: 0.3rem 0.48rem;
		border-radius: 7px;
		background: rgba(244, 239, 228, 0.84);
		backdrop-filter: blur(5px);
		font-family: var(--mono);
		font-size: 0.6rem;
	}

	.phase-label span {
		color: var(--ink-muted);
	}

	.phase-label strong {
		font-size: 0.66rem;
	}

	.vapor-label {
		top: 9px;
		left: 12px;
	}

	.liquid-label {
		right: 12px;
		bottom: 10px;
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

	@keyframes wander {
		to {
			transform: translate(5px, -7px);
		}
	}

	@keyframes jostle {
		to {
			transform: translate(2px, -2px);
		}
	}
</style>
