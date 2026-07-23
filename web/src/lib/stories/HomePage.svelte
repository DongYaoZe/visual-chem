<script lang="ts">
	import { resolve } from '$app/paths';
	import Seo from '$lib/components/Seo.svelte';
	import SiteHeader from '$lib/components/SiteHeader.svelte';
	import TriView from '$lib/components/TriView.svelte';
	import { getSiteContent, type LocaleCode } from '$lib/content';
	import { heroCurveGeometry } from './hero-curve';

	interface Props {
		locale?: LocaleCode;
	}

	let { locale = 'zh-CN' }: Props = $props();
	let site = $derived(getSiteContent(locale));
	let storyHref = $derived(
		locale === 'en'
			? resolve('/en/stories/ethanol-distillation/')
			: resolve('/stories/ethanol-distillation/')
	);
	let boilingMapHref = $derived(
		locale === 'en' ? resolve('/en/stories/boiling-map/') : resolve('/stories/boiling-map/')
	);
	let saltSplitHref = $derived(
		locale === 'en' ? resolve('/en/stories/salt-split/') : resolve('/stories/salt-split/')
	);
	let entropyHref = $derived(
		locale === 'en' ? resolve('/en/stories/entropy/') : resolve('/stories/entropy/')
	);
	let gibbsHref = $derived(
		locale === 'en' ? resolve('/en/stories/gibbs-valley/') : resolve('/stories/gibbs-valley/')
	);
	let nernstHref = $derived(
		locale === 'en' ? resolve('/en/stories/nernst/') : resolve('/stories/nernst/')
	);
	let coolingCurveHref = $derived(
		locale === 'en' ? resolve('/en/stories/cooling-curve/') : resolve('/stories/cooling-curve/')
	);
	let kineticsHref = $derived(
		locale === 'en' ? resolve('/en/stories/kinetics/') : resolve('/stories/kinetics/')
	);
	let arrheniusHref = $derived(
		locale === 'en' ? resolve('/en/stories/arrhenius/') : resolve('/stories/arrhenius/')
	);
	let catalystHref = $derived(
		locale === 'en' ? resolve('/en/stories/catalyst/') : resolve('/stories/catalyst/')
	);
	let demoComposition = $state(0.1);
	let demoStage = $state(2);
	// The hero envelope is computed from the calibrated model, not sketched.
	const heroCurve = heroCurveGeometry({
		width: 600,
		height: 500,
		insetLeft: 52,
		insetRight: 52,
		insetTop: 130,
		insetBottom: 104
	});
</script>

<Seo
	title={site.home.seo.title}
	description={site.home.seo.description}
	path={site.home.seo.path}
	englishPath={locale === 'en' ? site.home.seo.path : site.home.seo.alternateLocalePath}
	{locale}
	type={site.home.seo.type}
	image={site.home.seo.image}
	imageAlt={site.home.seo.imageAlt}
	modifiedTime={site.home.seo.modifiedTime}
/>

<SiteHeader {locale} content={site.shared.header} />

<main>
	<section class="hero shell">
		<div class="hero-copy">
			<p class="eyebrow">{site.home.hero.eyebrow}</p>
			<h1>
				{site.home.hero.heading.lines[0]}<br />{site.home.hero.heading.lines[1]}<em
					>{site.home.hero.heading.emphasis}</em
				>
			</h1>
			<p class="lead">{site.home.hero.lead}</p>
			<div class="hero-actions">
				<a class="primary" href={storyHref}
					>{site.home.hero.primaryAction.label}
					<span>{site.home.hero.primaryAction.symbol}</span></a
				>
				<a class="text-link" href="#method">{site.home.hero.methodAction}</a>
			</div>
			<div class="proof-strip">
				{#each site.home.hero.proofs as proof (proof.label)}
					<div><strong>{proof.value}</strong><span>{proof.label}</span></div>
				{/each}
			</div>
		</div>

		<div class="hero-art" aria-label={site.home.hero.previewAriaLabel}>
			<div class="limit-card">
				<span>{site.home.hero.limitLabel}</span>
				<strong>{site.home.hero.limitValue}<sup>{site.home.hero.limitUnit}</sup></strong>
				<small>{site.home.hero.limitContext}</small>
			</div>
			<div class="hundred">{site.home.hero.unreachableValue}</div>
			<svg viewBox="0 0 600 500" aria-hidden="true">
				<path class="ideal" d={heroCurve.idealBubblePath} />
				<path class="ideal dew" d={heroCurve.idealDewPath} />
				<path class="curve warm" d={heroCurve.bubblePath} />
				<path class="curve cool" d={heroCurve.dewPath} />
				<circle
					cx={heroCurve.azeotrope.px.toFixed(1)}
					cy={heroCurve.azeotrope.py.toFixed(1)}
					r="9"
				/>
				<line
					x1={heroCurve.azeotrope.px.toFixed(1)}
					x2={heroCurve.azeotrope.px.toFixed(1)}
					y1={heroCurve.azeotrope.py.toFixed(1)}
					y2={heroCurve.baselineY + 24}
				/>
				<text
					x={(heroCurve.azeotrope.px - 14).toFixed(1)}
					y={(heroCurve.azeotrope.py - 19).toFixed(1)}
					text-anchor="end">{site.home.hero.fixedPointLabel}</text
				>
				<text
					x={heroCurve.azeotrope.px.toFixed(1)}
					y={heroCurve.baselineY + 50}
					text-anchor="middle">{site.home.hero.azeotropeCompositionLabel}</text
				>
			</svg>
			<p>{site.home.hero.storyPreview}</p>
		</div>
	</section>

	<section class="manifesto" id="method">
		<div class="shell manifesto-grid">
			<div>
				<p class="eyebrow">{site.home.method.eyebrow}</p>
				<h2>{site.home.method.heading.lines[0]}<br />{site.home.method.heading.lines[1]}</h2>
			</div>
			<p>{site.home.method.body}</p>
		</div>

		<div class="triangle-demo shell">
			<div class="demo-controls">
				<label>
					<span>{site.home.method.controls.initialComposition}</span>
					<strong>{demoComposition.toFixed(2)}</strong>
					<input
						type="range"
						min="0.03"
						max="0.86"
						step="0.01"
						bind:value={demoComposition}
						aria-label={site.home.method.controls.initialCompositionAriaLabel}
					/>
				</label>
				<label>
					<span>{site.home.method.controls.equilibriumStages}</span>
					<strong>{demoStage}</strong>
					<input
						type="range"
						min="0"
						max="8"
						step="1"
						bind:value={demoStage}
						aria-label={site.home.method.controls.equilibriumStagesAriaLabel}
					/>
				</label>
				<p>{site.home.method.controls.hint}</p>
			</div>
			<TriView
				composition={demoComposition}
				stage={demoStage}
				focus="all"
				label={site.home.method.controls.triViewAriaLabel}
				content={site.shared}
			/>
		</div>
	</section>

	<section class="season shell">
		<header>
			<div>
				<p class="eyebrow">{site.home.season.eyebrow}</p>
				<h2>{site.home.season.title}</h2>
			</div>
			<p>{site.home.season.introduction}</p>
		</header>

		<div class="story-list">
			<a class="story live" href={storyHref}>
				<span class="number">{site.home.season.stories[0].number}</span>
				<div>
					<small>{site.home.season.stories[0].status}</small>
					<h3>{site.home.season.stories[0].title}</h3>
					<p>{site.home.season.stories[0].description}</p>
				</div>
				<strong>{site.home.season.stories[0].action}</strong>
			</a>
			<a class="story live" href={boilingMapHref}>
				<span class="number">{site.home.season.stories[1].number}</span>
				<div>
					<small>{site.home.season.stories[1].status}</small>
					<h3>{site.home.season.stories[1].title}</h3>
					<p>{site.home.season.stories[1].description}</p>
				</div>
				<strong>{site.home.season.stories[1].action}</strong>
			</a>
			<a class="story live" href={saltSplitHref}>
				<span class="number">{site.home.season.stories[2].number}</span>
				<div>
					<small>{site.home.season.stories[2].status}</small>
					<h3>{site.home.season.stories[2].title}</h3>
					<p>{site.home.season.stories[2].description}</p>
				</div>
				<strong>{site.home.season.stories[2].action}</strong>
			</a>
			<a class="story live" href={coolingCurveHref}>
				<span class="number">{site.home.season.stories[3].number}</span>
				<div>
					<small>{site.home.season.stories[3].status}</small>
					<h3>{site.home.season.stories[3].title}</h3>
					<p>{site.home.season.stories[3].description}</p>
				</div>
				<strong>{site.home.season.stories[3].action}</strong>
			</a>
		</div>
	</section>

	<section class="season season-two shell">
		<header>
			<div>
				<p class="eyebrow">{site.home.seasonTwo.eyebrow}</p>
				<h2>{site.home.seasonTwo.title}</h2>
			</div>
			<p>{site.home.seasonTwo.introduction}</p>
		</header>

		<div class="story-list">
			<a class="story live" href={entropyHref}>
				<span class="number">{site.home.seasonTwo.stories[0].number}</span>
				<div>
					<small>{site.home.seasonTwo.stories[0].status}</small>
					<h3>{site.home.seasonTwo.stories[0].title}</h3>
					<p>{site.home.seasonTwo.stories[0].description}</p>
				</div>
				<strong>{site.home.seasonTwo.stories[0].action}</strong>
			</a>
			<a class="story live" href={gibbsHref}>
				<span class="number">{site.home.seasonTwo.stories[1].number}</span>
				<div>
					<small>{site.home.seasonTwo.stories[1].status}</small>
					<h3>{site.home.seasonTwo.stories[1].title}</h3>
					<p>{site.home.seasonTwo.stories[1].description}</p>
				</div>
				<strong>{site.home.seasonTwo.stories[1].action}</strong>
			</a>
			<a class="story live" href={nernstHref}>
				<span class="number">{site.home.seasonTwo.stories[2].number}</span>
				<div>
					<small>{site.home.seasonTwo.stories[2].status}</small>
					<h3>{site.home.seasonTwo.stories[2].title}</h3>
					<p>{site.home.seasonTwo.stories[2].description}</p>
				</div>
				<strong>{site.home.seasonTwo.stories[2].action}</strong>
			</a>
		</div>
	</section>

	<section class="season season-three shell">
		<header>
			<div>
				<p class="eyebrow">{site.home.seasonThree.eyebrow}</p>
				<h2>{site.home.seasonThree.title}</h2>
			</div>
			<p>{site.home.seasonThree.introduction}</p>
		</header>

		<div class="story-list">
			<a class="story live" href={kineticsHref}>
				<span class="number">{site.home.seasonThree.stories[0].number}</span>
				<div>
					<small>{site.home.seasonThree.stories[0].status}</small>
					<h3>{site.home.seasonThree.stories[0].title}</h3>
					<p>{site.home.seasonThree.stories[0].description}</p>
				</div>
				<strong>{site.home.seasonThree.stories[0].action}</strong>
			</a>
			<a class="story live" href={arrheniusHref}>
				<span class="number">{site.home.seasonThree.stories[1].number}</span>
				<div>
					<small>{site.home.seasonThree.stories[1].status}</small>
					<h3>{site.home.seasonThree.stories[1].title}</h3>
					<p>{site.home.seasonThree.stories[1].description}</p>
				</div>
				<strong>{site.home.seasonThree.stories[1].action}</strong>
			</a>
			<a class="story live" href={catalystHref}>
				<span class="number">{site.home.seasonThree.stories[2].number}</span>
				<div>
					<small>{site.home.seasonThree.stories[2].status}</small>
					<h3>{site.home.seasonThree.stories[2].title}</h3>
					<p>{site.home.seasonThree.stories[2].description}</p>
				</div>
				<strong>{site.home.seasonThree.stories[2].action}</strong>
			</a>
		</div>
	</section>

	<section class="principles">
		<div class="shell">
			<p class="eyebrow">{site.home.principles.eyebrow}</p>
			<h2>
				{site.home.principles.heading.lines[0]}<br />{site.home.principles.heading.lines[1]}
			</h2>
			<div class="principle-grid">
				{#each site.home.principles.items as principle (principle.number)}
					<article>
						<span>{principle.number}</span>
						<h3>{principle.title}</h3>
						<p>{principle.body}</p>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<footer class="shell">
		<p>{site.home.footer.tagline}</p>
		<div>
			<a href="https://github.com/DongYaoZe/visual-chem">{site.home.footer.sourceCodeLink}</a>
			<a href={storyHref}>{site.home.footer.firstStoryLink}</a>
		</div>
	</footer>
</main>

<style>
	.hero {
		display: grid;
		min-height: calc(100vh - 84px);
		grid-template-columns: 1.02fr 0.98fr;
		gap: clamp(2rem, 5vw, 6rem);
		align-items: center;
		padding-block: clamp(3.5rem, 8vh, 7.5rem);
	}

	.hero-copy {
		position: relative;
		z-index: 2;
	}

	h1 {
		margin: 1rem 0 1.5rem;
		font-family: var(--serif);
		font-size: clamp(3.3rem, 6.2vw, 5.9rem);
		font-weight: 500;
		letter-spacing: -0.065em;
		line-height: 0.93;
	}

	h1 em {
		display: inline-block;
		margin-top: 0.18em;
		color: var(--ethanol);
		font-weight: 500;
		white-space: nowrap;
	}

	.lead {
		max-width: 590px;
		margin: 0;
		color: var(--ink-muted);
		font-family: var(--serif);
		font-size: clamp(1.05rem, 1.5vw, 1.3rem);
		line-height: 1.85;
	}

	.hero-actions {
		display: flex;
		gap: 1.4rem;
		align-items: center;
		margin-top: 2rem;
	}

	.primary {
		display: inline-flex;
		gap: 1.5rem;
		align-items: center;
		padding: 0.9rem 1.2rem;
		border-radius: 999px;
		background: var(--ink);
		color: var(--paper);
		font-size: 0.84rem;
		font-weight: 800;
		text-decoration: none;
		transition: transform 180ms ease;
	}

	.primary:hover {
		transform: translateY(-3px);
	}

	.text-link {
		font-size: 0.82rem;
		font-weight: 700;
	}

	.proof-strip {
		display: flex;
		margin-top: 3.2rem;
		gap: 1.4rem;
	}

	.proof-strip div {
		display: flex;
		gap: 0.45rem;
		align-items: baseline;
	}

	.proof-strip strong {
		font-family: var(--serif);
		font-size: 1.35rem;
	}

	.proof-strip span {
		color: var(--ink-muted);
		font-size: 0.63rem;
	}

	.hero-art {
		position: relative;
		min-height: 590px;
	}

	.hero-art::before {
		position: absolute;
		inset: 9% 1% 2% 8%;
		border: 1px solid rgba(31, 40, 38, 0.14);
		border-radius: 50% 50% 36% 44% / 48% 45% 55% 52%;
		background: rgba(255, 255, 255, 0.26);
		box-shadow: var(--shadow);
		content: '';
		transform: rotate(-4deg);
	}

	.hero-art svg {
		position: absolute;
		inset: 4% -2% 5% 2%;
		width: 100%;
		height: 90%;
		overflow: visible;
	}

	.ideal,
	.curve {
		fill: none;
		stroke-linecap: round;
	}

	/* The ideal-Raoult envelope: same scale, no fixed point. Kept faint —
	   it is the counterfactual the calibrated curves argue against. */
	.ideal {
		stroke: rgba(31, 40, 38, 0.14);
		stroke-width: 1.5;
	}

	.ideal.dew {
		stroke-dasharray: 3 8;
	}

	.curve {
		stroke-width: 5;
	}

	.curve.warm {
		stroke: var(--ethanol);
	}

	.curve.cool {
		stroke: var(--water);
		stroke-dasharray: 10 9;
	}

	.hero-art circle {
		fill: var(--acid);
		stroke: var(--paper);
		stroke-width: 5;
	}

	.hero-art line {
		stroke: var(--acid);
		stroke-dasharray: 3 6;
	}

	.hero-art text {
		fill: var(--ink-muted);
		font-family: var(--mono);
		font-size: 12px;
		font-weight: 700;
	}

	.hero-art > p {
		position: absolute;
		right: 4%;
		bottom: 2%;
		margin: 0;
		font-family: var(--serif);
		font-size: 1rem;
		font-style: italic;
	}

	.limit-card {
		position: absolute;
		top: 15%;
		left: 11%;
		z-index: 2;
		display: flex;
		flex-direction: column;
	}

	.limit-card span,
	.limit-card small {
		font-family: var(--mono);
		font-size: 0.62rem;
		letter-spacing: 0.08em;
	}

	.limit-card span {
		color: var(--acid);
		font-weight: 800;
	}

	.limit-card small {
		color: var(--ink-muted);
	}

	.limit-card strong {
		font-family: var(--serif);
		font-size: clamp(5rem, 10vw, 8rem);
		font-weight: 500;
		letter-spacing: -0.08em;
		line-height: 0.92;
	}

	.limit-card sup {
		font-size: 0.3em;
	}

	.hundred {
		position: absolute;
		top: 6%;
		right: 2%;
		color: rgba(31, 40, 38, 0.15);
		font-family: var(--serif);
		font-size: 2.7rem;
		text-decoration: line-through;
		transform: rotate(8deg);
	}

	.manifesto {
		padding-block: clamp(5rem, 10vw, 9rem);
		background: #1f2826;
		color: var(--paper);
	}

	.manifesto .eyebrow {
		color: var(--ethanol-bright);
	}

	.manifesto-grid {
		display: grid;
		grid-template-columns: 0.9fr 1.1fr;
		gap: 4rem;
		align-items: end;
		margin-bottom: 4rem;
	}

	.manifesto h2,
	.season h2,
	.principles h2 {
		margin: 0.75rem 0 0;
		font-family: var(--serif);
		font-size: clamp(2.7rem, 6vw, 5.6rem);
		font-weight: 500;
		letter-spacing: -0.055em;
		line-height: 0.98;
	}

	.manifesto-grid > p {
		margin: 0;
		color: rgba(244, 239, 228, 0.66);
		font-family: var(--serif);
		font-size: 1.12rem;
		line-height: 1.9;
	}

	.triangle-demo {
		display: grid;
		grid-template-columns: 240px minmax(0, 1fr);
		gap: 1.2rem;
		align-items: start;
	}

	.demo-controls {
		position: sticky;
		top: 1rem;
		padding: 1rem;
		border: 1px solid rgba(244, 239, 228, 0.16);
		border-radius: 16px;
		background: rgba(244, 239, 228, 0.04);
	}

	.demo-controls label {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 0.6rem;
		margin-bottom: 1.2rem;
		font-size: 0.68rem;
		line-height: 1.5;
	}

	.demo-controls label strong {
		font-family: var(--mono);
	}

	.demo-controls input {
		width: 100%;
		grid-column: 1 / -1;
		accent-color: var(--ethanol-bright);
	}

	.demo-controls p {
		margin: 1.6rem 0 0;
		color: #b9bcb5;
		font-size: 0.68rem;
		line-height: 1.7;
	}

	.season-two {
		padding-top: 0;
	}

	.season {
		padding-block: clamp(5rem, 10vw, 9rem);
	}

	.season > header {
		display: grid;
		grid-template-columns: 1fr 0.7fr;
		gap: 3rem;
		align-items: end;
		margin-bottom: 3.5rem;
	}

	.season > header > p {
		margin: 0;
		color: var(--ink-muted);
		font-family: var(--serif);
		font-size: 1.05rem;
		line-height: 1.8;
	}

	.story-list {
		border-top: 1px solid var(--ink);
	}

	.story {
		display: grid;
		min-height: 180px;
		padding: 1.4rem 0;
		grid-template-columns: 90px 1fr auto;
		gap: 1rem;
		align-items: center;
		border-bottom: 1px solid var(--line);
		text-decoration: none;
	}

	.story.live {
		transition: padding 180ms ease;
	}

	.story.live:hover {
		padding-inline: 1rem;
		background: rgba(214, 107, 50, 0.05);
	}

	.story .number {
		align-self: start;
		padding-top: 0.2rem;
		font-family: var(--mono);
		font-size: 0.7rem;
	}

	.story small {
		color: var(--ink-muted);
		font-family: var(--mono);
		font-size: 0.62rem;
		letter-spacing: 0.07em;
	}

	.story h3 {
		margin: 0.4rem 0;
		font-family: var(--serif);
		font-size: clamp(1.75rem, 4vw, 3.3rem);
		font-weight: 500;
		letter-spacing: -0.035em;
	}

	.story p {
		margin: 0;
		color: var(--ink-muted);
		font-size: 0.86rem;
	}

	.story > strong {
		align-self: end;
		font-family: var(--mono);
		font-size: 0.66rem;
	}

	.principles {
		padding-block: clamp(5rem, 10vw, 9rem);
		background: #dcd3c1;
	}

	.principles .eyebrow {
		color: #3f5947;
	}

	.principle-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1px;
		margin-top: 4rem;
		background: rgba(31, 40, 38, 0.18);
		border: 1px solid rgba(31, 40, 38, 0.18);
	}

	.principle-grid article {
		padding: clamp(1.3rem, 3vw, 2.5rem);
		background: #dcd3c1;
	}

	.principle-grid span {
		font-family: var(--mono);
		font-size: 0.65rem;
	}

	.principle-grid h3 {
		margin: 2.5rem 0 0.75rem;
		font-family: var(--serif);
		font-size: 1.7rem;
		font-weight: 500;
	}

	.principle-grid p {
		margin: 0;
		color: #48534f;
		font-size: 0.83rem;
		line-height: 1.75;
	}

	footer {
		display: flex;
		min-height: 130px;
		align-items: center;
		justify-content: space-between;
		font-family: var(--serif);
		font-size: 0.9rem;
	}

	footer div {
		display: flex;
		gap: 1.2rem;
		font-family: var(--mono);
		font-size: 0.65rem;
	}

	@media (max-width: 900px) {
		.hero {
			min-height: auto;
			grid-template-columns: 1fr;
		}

		.hero-art {
			min-height: 520px;
		}

		.manifesto-grid,
		.season > header {
			grid-template-columns: 1fr;
		}

		.triangle-demo {
			grid-template-columns: 1fr;
		}

		.demo-controls {
			position: static;
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 1rem;
		}

		.demo-controls p {
			margin: 0;
		}
	}

	@media (max-width: 680px) {
		.hero {
			padding-top: 3rem;
		}

		h1 {
			font-size: clamp(3rem, 15vw, 4.8rem);
		}

		h1 em {
			white-space: normal;
		}

		.proof-strip {
			flex-wrap: wrap;
		}

		.hero-art {
			min-height: 420px;
		}

		.hundred {
			font-size: 2rem;
		}

		.manifesto-grid {
			gap: 1.5rem;
		}

		.demo-controls {
			display: block;
		}

		.story {
			grid-template-columns: 42px 1fr;
		}

		.story > strong {
			display: none;
		}

		.principle-grid {
			grid-template-columns: 1fr;
		}

		.principle-grid h3 {
			margin-top: 1.2rem;
		}

		footer {
			align-items: flex-start;
			flex-direction: column;
			justify-content: center;
		}
	}
</style>
