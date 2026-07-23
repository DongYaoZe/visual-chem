<script lang="ts">
	import { resolve } from '$app/paths';
	import {
		dolbearChirpsPerMinute,
		doublingRiseK,
		mbDistribution,
		rateRatio,
		tailFraction
	} from '$lib/chem';
	import ArrheniusTriView from '$lib/components/ArrheniusTriView.svelte';
	import ConceptCheck from '$lib/components/ConceptCheck.svelte';
	import Formula from '$lib/components/Math.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import SiteHeader from '$lib/components/SiteHeader.svelte';
	import StoryStage from '$lib/components/StoryStage.svelte';
	import {
		getArrheniusContent,
		getSiteContent,
		type ArrheniusSceneId,
		type LocaleCode
	} from '$lib/content';
	import { parseProse, type InlineSegment } from './prose';
	import { ARRHENIUS_TWO_POINT_EA_KJ_PER_MOL, arrheniusSceneDefinition } from './season3-scenes';
	import { scrolly } from './scrolly';

	interface Props {
		locale?: LocaleCode;
	}

	type StageFocus = 'scene' | 'collisions' | 'distribution' | 'all';

	const tailDefaults = arrheniusSceneDefinition('the-tail');
	const ruleDefaults = arrheniusSceneDefinition('rule-of-thumb');
	const sandboxDefaults = arrheniusSceneDefinition('sandbox');
	const REFERENCE_TEMPERATURE_C = tailDefaults.referenceTemperatureC;
	const TAIL_EA_KJ_PER_MOL = tailDefaults.eaKJPerMol;
	const TWO_POINT_EA = ARRHENIUS_TWO_POINT_EA_KJ_PER_MOL;

	// Both hero curves are produced by the same MB kernel as the live diagram.
	const HERO_COLD = mbDistribution(0.86, 150);
	const HERO_HOT = mbDistribution(1.2, 150);
	const HERO_PEAK = Math.max(...HERO_COLD.ys, ...HERO_HOT.ys) * 1.05;

	function heroDistributionPath(curve: { xs: readonly number[]; ys: readonly number[] }): string {
		return curve.xs
			.map((value, index) => {
				const x = 28 + (value / 3.4) * 944;
				const y = 278 - (curve.ys[index] / HERO_PEAK) * 246;
				return (index === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1);
			})
			.join(' ');
	}

	const heroColdPath = heroDistributionPath(HERO_COLD);
	const heroHotPath = heroDistributionPath(HERO_HOT);

	function sceneFocus(id: ArrheniusSceneId): StageFocus {
		switch (id) {
			case 'hook':
			case 'life-runs-on-it':
				return 'scene';
			case 'two-populations':
				return 'collisions';
			case 'the-tail':
			case 'arrhenius-law':
			case 'rule-of-thumb':
			case 'two-point':
				return 'distribution';
			default:
				return 'all';
		}
	}

	function formatRatio(value: number): string {
		if (value >= 100 || value < 0.01) return value.toExponential(2);
		if (value >= 10) return value.toFixed(1);
		return value.toFixed(2);
	}

	function isSymbolScene(id: ArrheniusSceneId): boolean {
		return sceneFocus(id) === 'distribution';
	}

	let { locale = 'zh-CN' }: Props = $props();
	let site = $derived(getSiteContent(locale));
	let story = $derived(getArrheniusContent(locale));

	let activeIndex = $state(0);
	let hookPrediction = $state<string | null>(null);
	let tailTemperatureC = $state(tailDefaults.temperatureC);
	let ruleEaKJPerMol = $state(ruleDefaults.eaKJPerMol);
	let labTemperatureC = $state(sandboxDefaults.temperatureC);
	let labEaKJPerMol = $state(sandboxDefaults.eaKJPerMol);

	let activeScene = $derived(arrheniusSceneDefinition(story.scenes[activeIndex].id));
	let activeSceneId = $derived(activeScene.id);

	let visualTemperatureC = $derived.by(() => {
		switch (activeSceneId) {
			case 'the-tail':
				return tailTemperatureC;
			case 'sandbox':
				return labTemperatureC;
			default:
				return activeScene.temperatureC;
		}
	});

	let visualReferenceTemperatureC = $derived(activeScene.referenceTemperatureC);

	let visualEaKJPerMol = $derived.by(() => {
		switch (activeSceneId) {
			case 'rule-of-thumb':
				return ruleEaKJPerMol;
			case 'sandbox':
				return labEaKJPerMol;
			default:
				return activeScene.eaKJPerMol;
		}
	});

	let visualTemperatureK = $derived(visualTemperatureC + 273.15);
	let visualReferenceTemperatureK = $derived(visualReferenceTemperatureC + 273.15);
	let visualTailShare = $derived(tailFraction(visualEaKJPerMol, visualTemperatureK));
	let visualFocus = $derived(sceneFocus(activeSceneId));
	let visualActive = $derived(
		activeScene.active ||
			activeSceneId === 'the-tail' ||
			activeSceneId === 'rule-of-thumb' ||
			activeSceneId === 'sandbox'
	);

	let tailBoost = $derived(
		rateRatio(TAIL_EA_KJ_PER_MOL, REFERENCE_TEMPERATURE_C + 273.15, tailTemperatureC + 273.15)
	);
	let ruleDoublingRise = $derived(doublingRiseK(ruleEaKJPerMol, 298.15));
	let labTailShare = $derived(tailFraction(labEaKJPerMol, labTemperatureC + 273.15));
	let labDoublingRise = $derived(doublingRiseK(labEaKJPerMol, labTemperatureC + 273.15));
	let labChirps = $derived(dolbearChirpsPerMinute(labTemperatureC));

	let progress = $derived(((activeIndex + 1) / story.scenes.length) * 100);
	let catalogHref = $derived(locale === 'en' ? resolve('/en/') : resolve('/'));
</script>

{#snippet inline(segments: InlineSegment[])}
	{#each segments as segment, index (index)}
		{#if segment.type === 'strong'}
			<strong>{segment.value}</strong>
		{:else if segment.type === 'math'}
			<Formula formula={segment.value} />
		{:else}
			{segment.value}
		{/if}
	{/each}
{/snippet}

<Seo
	title={story.seo.title}
	description={story.seo.description}
	path={story.seo.path}
	englishPath={locale === 'en' ? story.seo.path : story.seo.alternateLocalePath}
	{locale}
	type={story.seo.type}
	image={story.seo.image}
	imageAlt={story.seo.imageAlt}
	publishedTime={story.seo.publishedTime}
	modifiedTime={story.seo.modifiedTime}
/>

<div class="progress" style:width={progress + '%'} aria-hidden="true"></div>
<SiteHeader compact {locale} content={site.shared.header} />

<main>
	<section class="story-hero shell">
		<div class="hero-meta">
			<p class="eyebrow">{story.hero.eyebrow}</p>
		</div>
		<h1>{story.hero.title[0]}<br /><em>{story.hero.title[1]}</em></h1>
		<div class="hero-bottom">
			<p>{story.hero.subtitle}</p>
		</div>
		<div class="hero-curve" aria-hidden="true">
			<svg viewBox="0 0 1000 300">
				<path class="cold-path" d={heroColdPath} />
				<path class="hot-path" d={heroHotPath} />
			</svg>
			<span>{story.hero.heroTag}</span>
		</div>
	</section>

	<section class="reading-note">
		<div class="shell">
			<p class="eyebrow">HOW TO READ</p>
			<p>{story.readingNote}</p>
		</div>
	</section>

	<section class="scrolly shell" id="story-flow">
		<StoryStage
			dialogAriaLabel={story.stage.dialogAriaLabel}
			closeAriaLabel={story.stage.closeGraphicAriaLabel}
			openButtonLabel={story.stage.openGraphicButton}
			statusAriaLabel={story.stage.shortStateAriaLabel}
		>
			{#snippet stage()}
				<ArrheniusTriView
					temperatureK={visualTemperatureK}
					referenceTemperatureK={visualReferenceTemperatureK}
					eaKJPerMol={visualEaKJPerMol}
					active={visualActive}
					focus={visualFocus}
					label={story.triView.defaultAriaLabel}
					content={story.triView}
				/>
			{/snippet}
			{#snippet status()}
				<span>T {visualTemperatureC.toFixed(0)} °C</span>
				<span>Ea {visualEaKJPerMol.toFixed(0)} kJ/mol</span>
				<span>k/A {visualTailShare.toExponential(1)}</span>
			{/snippet}
		</StoryStage>

		<div class="steps" use:scrolly={{ onActive: (index) => (activeIndex = index) }}>
			{#each story.scenes as scene, index (scene.id)}
				<article
					class="step"
					class:active={activeIndex === index}
					class:symbol-step={isSymbolScene(scene.id)}
					data-scene-index={index}
					data-scene-id={scene.id}
				>
					<div class="step-card">
						<p class="eyebrow">{story.kickers[scene.id]}</p>
						{#each parseProse(scene.prose) as block, blockIndex (blockIndex)}
							{#if block.kind === 'math'}
								<div class="formula"><Formula formula={block.formula} display /></div>
							{:else if block.kind === 'list'}
								<ul>
									{#each block.items as item, itemIndex (itemIndex)}
										<li>{@render inline(item)}</li>
									{/each}
								</ul>
							{:else}
								<p>{@render inline(block.segments)}</p>
							{/if}
						{/each}

						{#if scene.id === 'hook'}
							<div class="prediction">
								<span>{story.interactions.hook.question}</span>
								<div>
									{#each story.interactions.hook.options as option (option.id)}
										<button
											type="button"
											aria-pressed={hookPrediction === option.id}
											class:selected={hookPrediction === option.id}
											onclick={() => (hookPrediction = option.id)}>{option.label}</button
										>
									{/each}
								</div>
							</div>
							{#if hookPrediction}
								<p class="evidence">{story.interactions.hook.explanation}</p>
							{/if}
						{/if}

						{#if scene.id === 'the-tail'}
							<label class="range-control">
								<span>{story.interactions.theTail.temperatureLabel}</span>
								<strong>{tailTemperatureC.toFixed(0)} °C</strong>
								<input
									type="range"
									min="0"
									max="80"
									step="1"
									aria-label={story.interactions.theTail.temperatureLabel}
									bind:value={tailTemperatureC}
								/>
								<span class="slider-scale">
									<span>{story.interactions.theTail.temperatureScale.start}</span>
									<span>{story.interactions.theTail.temperatureScale.end}</span>
								</span>
								<small>
									{story.interactions.theTail.readout({
										tailShare: tailFraction(
											TAIL_EA_KJ_PER_MOL,
											tailTemperatureC + 273.15
										).toExponential(2),
										boost: formatRatio(tailBoost)
									})}
								</small>
							</label>
						{/if}

						{#if scene.id === 'rule-of-thumb'}
							<label class="range-control">
								<span>{story.interactions.ruleOfThumb.eaLabel}</span>
								<strong>{ruleEaKJPerMol.toFixed(0)} kJ/mol</strong>
								<input
									type="range"
									min="20"
									max="120"
									step="1"
									aria-label={story.interactions.ruleOfThumb.eaLabel}
									bind:value={ruleEaKJPerMol}
								/>
								<small>
									{story.interactions.ruleOfThumb.readout({
										ea: ruleEaKJPerMol.toFixed(0),
										rise: ruleDoublingRise.toFixed(1)
									})}
								</small>
							</label>
						{/if}

						{#if scene.id === 'two-point'}
							<div
								class="measurement-grid"
								aria-label={story.interactions.twoPoint.readout({
									ea: TWO_POINT_EA.toFixed(1)
								})}
							>
								<div><span>T₁</span><strong>293.15 K</strong></div>
								<div><span>k₁</span><strong>1.20×10⁻³ s⁻¹</strong></div>
								<div><span>T₂</span><strong>313.15 K</strong></div>
								<div><span>k₂</span><strong>6.09×10⁻³ s⁻¹</strong></div>
							</div>
							<p class="evidence">
								{story.interactions.twoPoint.readout({ ea: TWO_POINT_EA.toFixed(1) })}
							</p>
						{/if}

						{#if scene.id === 'sandbox'}
							<label class="range-control">
								<span>{story.interactions.sandbox.temperatureLabel}</span>
								<strong>{labTemperatureC.toFixed(0)} °C</strong>
								<input
									type="range"
									min="0"
									max="80"
									step="1"
									aria-label={story.interactions.sandbox.temperatureLabel}
									bind:value={labTemperatureC}
								/>
							</label>
							<label class="range-control">
								<span>{story.interactions.sandbox.eaLabel}</span>
								<strong>{labEaKJPerMol.toFixed(0)} kJ/mol</strong>
								<input
									type="range"
									min="20"
									max="120"
									step="1"
									aria-label={story.interactions.sandbox.eaLabel}
									bind:value={labEaKJPerMol}
								/>
								<small>
									{story.interactions.sandbox.readout({
										tailShare: labTailShare.toExponential(2),
										doubling: labDoublingRise.toFixed(1),
										chirps: labChirps.toFixed(0)
									})}
								</small>
							</label>
						{/if}
					</div>
				</article>
			{/each}
		</div>
	</section>

	<section class="edge">
		<div class="shell edge-grid">
			<div class="edge-copy">
				<p class="eyebrow">{story.edge.eyebrow}</p>
				<h2>{story.edge.title}</h2>
			</div>
			<figure class="edge-facts">
				{#each story.edge.facts as fact (fact.term)}
					<div>
						<span>{fact.term}</span>
						<strong class="fact-definition">{fact.definition}</strong>
					</div>
				{/each}
			</figure>
		</div>
	</section>

	<section class="concept shell">
		<ConceptCheck
			question={story.conceptCheck.question}
			options={story.conceptCheck.options}
			correctIndex={story.conceptCheck.correctIndex}
			explanation={story.conceptCheck.explanation}
			content={site.shared.conceptCheck}
		/>
	</section>

	<section class="sandbox">
		<div class="shell sandbox-head">
			<div>
				<p class="eyebrow">{story.sandboxIntro.eyebrow}</p>
				<h2>{story.sandboxIntro.title}</h2>
			</div>
			<p>{story.sandboxIntro.description}</p>
		</div>
		<div class="shell sandbox-grid">
			<div class="sandbox-controls">
				<label>
					<span>{story.interactions.sandbox.temperatureLabel}</span>
					<strong>{labTemperatureC.toFixed(0)} °C</strong>
					<input
						type="range"
						min="0"
						max="80"
						step="1"
						aria-label={story.interactions.sandbox.temperatureLabel}
						bind:value={labTemperatureC}
					/>
				</label>
				<label>
					<span>{story.interactions.sandbox.eaLabel}</span>
					<strong>{labEaKJPerMol.toFixed(0)} kJ/mol</strong>
					<input
						type="range"
						min="20"
						max="120"
						step="1"
						aria-label={story.interactions.sandbox.eaLabel}
						bind:value={labEaKJPerMol}
					/>
				</label>
				<div class="challenge">
					<p>
						{story.interactions.sandbox.readout({
							tailShare: labTailShare.toExponential(2),
							doubling: labDoublingRise.toFixed(1),
							chirps: labChirps.toFixed(0)
						})}
					</p>
				</div>
			</div>
			<ArrheniusTriView
				temperatureK={labTemperatureC + 273.15}
				referenceTemperatureK={REFERENCE_TEMPERATURE_C + 273.15}
				eaKJPerMol={labEaKJPerMol}
				active
				label={story.sandboxIntro.title}
				content={story.triView}
			/>
		</div>
	</section>

	<section class="model-notes shell">
		<div>
			<p class="eyebrow">MODEL CARD</p>
			<h2>{story.modelCard.title}</h2>
		</div>
		<div class="notes">
			{#each story.modelCard.items as item, itemIndex (item.term)}
				<details open={itemIndex < 3}>
					<summary>{item.term}</summary>
					<p>{item.value}</p>
				</details>
			{/each}
		</div>
	</section>

	<section class="ending">
		<div class="shell">
			<p>{story.ending.summary}</p>
			<h2>{story.ending.invitation}</h2>
			<div>
				<a href={catalogHref}>{story.ending.backToHome}</a>
				<a href="https://github.com/DongYaoZe/visual-chem">GitHub ↗</a>
			</div>
		</div>
	</section>
</main>

<style>
	.progress {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 100;
		height: 3px;
		background: #a34428;
		transition: width 450ms ease;
	}

	.story-hero {
		position: relative;
		display: flex;
		min-height: calc(100vh - 68px);
		padding-block: 5rem 3rem;
		flex-direction: column;
		justify-content: center;
		overflow: hidden;
	}

	.hero-meta {
		display: flex;
		gap: 1.2rem;
		align-items: center;
	}

	.story-hero h1 {
		position: relative;
		z-index: 2;
		margin: 1.2rem 0 2.5rem;
		font-family: var(--serif);
		font-size: clamp(3.2rem, 8.4vw, 8rem);
		font-weight: 500;
		letter-spacing: -0.075em;
		line-height: 0.85;
	}

	.story-hero h1 em {
		display: inline-block;
		margin-left: 14%;
		color: #a34428;
		font-weight: 500;
		transform: rotate(-2deg);
	}

	.hero-bottom {
		position: relative;
		z-index: 3;
		display: flex;
		max-width: 850px;
		align-items: end;
		justify-content: space-between;
	}

	.hero-bottom > p {
		margin: 0;
		font-family: var(--serif);
		font-size: clamp(1.1rem, 2vw, 1.4rem);
		line-height: 1.75;
	}

	.hero-curve {
		position: absolute;
		right: -4%;
		bottom: 4%;
		width: 62%;
		opacity: 0.34;
	}

	.hero-curve svg {
		display: block;
		width: 100%;
	}

	.hero-curve path {
		fill: none;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.hero-curve .cold-path {
		stroke: #17636d;
		stroke-width: 3;
	}

	.hero-curve .hot-path {
		stroke: #a34428;
		stroke-width: 4;
	}

	.hero-curve span {
		position: absolute;
		right: 8%;
		bottom: -0.5rem;
		color: #78321f;
		font-family: var(--mono);
		font-size: 0.65rem;
		font-weight: 800;
	}

	.reading-note {
		padding-block: 4.5rem;
		background: var(--ink);
		color: var(--paper);
	}

	.reading-note .shell {
		display: grid;
		grid-template-columns: 0.35fr 1fr;
		gap: 3rem;
	}

	.reading-note .eyebrow {
		color: #efb49c;
	}

	.reading-note p:last-child {
		max-width: 800px;
		margin: 0;
		color: rgba(244, 239, 228, 0.74);
		font-family: var(--serif);
		font-size: clamp(1.1rem, 2vw, 1.35rem);
		line-height: 1.9;
	}

	.scrolly {
		display: grid;
		grid-template-columns: minmax(290px, 0.7fr) minmax(570px, 1.3fr);
		gap: clamp(2rem, 5vw, 5rem);
		align-items: start;
		padding-block: 8rem;
	}

	.steps {
		grid-column: 1;
		grid-row: 1;
	}

	.step {
		display: flex;
		min-height: 82vh;
		align-items: center;
		transition: transform 350ms ease;
	}

	.step.active {
		transform: translateX(4px);
	}

	.step-card {
		width: 100%;
		padding: 1.4rem;
		border: 1px solid rgba(31, 40, 38, 0.15);
		border-radius: 16px;
		background: rgba(250, 247, 239, 0.95);
		box-shadow: 0 18px 45px rgba(50, 28, 20, 0.09);
	}

	.step-card > p:not(.eyebrow):not(.evidence) {
		margin: 0.72rem 0;
		color: var(--ink-muted);
		font-family: var(--serif);
		font-size: 0.98rem;
		line-height: 1.8;
	}

	.step-card ul {
		margin: 0.72rem 0;
		padding-left: 1.2rem;
		color: var(--ink-muted);
		font-family: var(--serif);
		font-size: 0.94rem;
		line-height: 1.75;
	}

	.step-card li {
		margin-block: 0.36rem;
	}

	.step-card :global(strong) {
		color: var(--ink);
	}

	.formula {
		margin: 1rem 0;
		padding: 0.7rem;
		border-block: 1px solid var(--line);
		color: var(--ink);
		font-size: 1.02rem;
		text-align: center;
	}

	.prediction {
		margin-top: 1rem;
		padding: 0.85rem;
		border-radius: 10px;
		background: rgba(163, 68, 40, 0.08);
	}

	.prediction > span {
		display: block;
		margin-bottom: 0.55rem;
		color: #843722;
		font-family: var(--mono);
		font-size: 0.6rem;
		font-weight: 800;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.prediction > div {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
	}

	.prediction button {
		padding: 0.52rem 0.68rem;
		border: 1px solid rgba(31, 40, 38, 0.2);
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.7);
		color: var(--ink);
		cursor: pointer;
		font-size: 0.7rem;
		font-weight: 700;
	}

	.prediction button:hover {
		border-color: #a34428;
	}

	.prediction button.selected {
		border-color: #a34428;
		background: #a34428;
		color: white;
	}

	.prediction button:focus-visible,
	input:focus-visible,
	summary:focus-visible,
	.ending a:focus-visible {
		outline: 3px solid #17636d;
		outline-offset: 3px;
	}

	.evidence {
		margin: 0.75rem 0 0;
		padding-left: 0.7rem;
		border-left: 2px solid #a34428;
		color: var(--ink-muted);
		font-size: 0.75rem;
		line-height: 1.65;
	}

	.range-control,
	.sandbox-controls label {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 0.5rem;
		margin-top: 1.1rem;
		padding: 0.8rem;
		border: 1px solid var(--line);
		border-radius: 11px;
		font-size: 0.7rem;
	}

	.range-control strong,
	.sandbox-controls label strong {
		font-family: var(--mono);
	}

	.range-control input,
	.sandbox-controls input {
		width: 100%;
		grid-column: 1 / -1;
		accent-color: #a34428;
	}

	.range-control small {
		grid-column: 1 / -1;
		color: var(--ink-muted);
		font-family: var(--mono);
		line-height: 1.55;
	}

	.slider-scale {
		display: flex;
		grid-column: 1 / -1;
		justify-content: space-between;
		margin-top: -0.2rem;
		color: var(--ink-muted);
		font-family: var(--mono);
		font-size: 0.6rem;
	}

	.measurement-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.45rem;
		margin-top: 1rem;
	}

	.measurement-grid div {
		display: grid;
		gap: 0.2rem;
		padding: 0.65rem;
		border: 1px solid var(--line);
		border-radius: 9px;
		background: rgba(163, 68, 40, 0.045);
	}

	.measurement-grid span {
		color: #843722;
		font-family: var(--mono);
		font-size: 0.58rem;
		font-weight: 800;
	}

	.measurement-grid strong {
		font-family: var(--mono);
		font-size: 0.7rem;
	}

	.edge {
		padding-block: clamp(6rem, 12vw, 10rem);
		background: #2b201d;
		color: var(--paper);
	}

	.edge-grid {
		display: grid;
		grid-template-columns: 0.7fr 1.3fr;
		gap: 5rem;
		align-items: start;
	}

	.edge .eyebrow {
		color: #efb49c;
	}

	.edge h2,
	.sandbox h2,
	.model-notes h2,
	.ending h2 {
		margin: 0.75rem 0 1.3rem;
		font-family: var(--serif);
		font-size: clamp(2.4rem, 5vw, 4.6rem);
		font-weight: 500;
		letter-spacing: -0.055em;
		line-height: 1;
	}

	.edge-facts {
		display: grid;
		gap: 1rem;
		margin: 0;
	}

	.edge-facts div {
		display: grid;
		gap: 0.4rem;
		padding: 1rem 1.2rem;
		border: 1px solid rgba(244, 239, 228, 0.18);
		border-radius: 12px;
	}

	.edge-facts span {
		color: #efb49c;
		font-family: var(--mono);
		font-size: 0.68rem;
		font-weight: 800;
		letter-spacing: 0.08em;
	}

	.fact-definition {
		color: rgba(244, 239, 228, 0.84);
		font-size: 0.82rem;
		font-weight: 500;
		line-height: 1.6;
	}

	.concept {
		padding-block: clamp(5rem, 10vw, 8rem);
	}

	.sandbox {
		padding-block: clamp(5rem, 10vw, 9rem);
		background: #ead6cc;
	}

	.sandbox .eyebrow {
		color: #78321f;
	}

	.sandbox-head {
		display: grid;
		grid-template-columns: 1.1fr 0.9fr;
		gap: 4rem;
		align-items: end;
		margin-bottom: 3rem;
	}

	.sandbox-head > p {
		margin: 0 0 0.6rem;
		color: var(--ink-muted);
		font-family: var(--serif);
		font-size: 1.05rem;
		line-height: 1.8;
	}

	.sandbox-grid {
		display: grid;
		grid-template-columns: 250px minmax(0, 1fr);
		gap: 1rem;
		align-items: start;
	}

	.sandbox-controls {
		padding: 0.85rem;
		border: 1px solid rgba(31, 40, 38, 0.17);
		border-radius: 16px;
		background: rgba(244, 239, 228, 0.42);
	}

	.sandbox-controls label {
		margin: 0 0 0.7rem;
		background: rgba(255, 255, 255, 0.28);
	}

	.challenge {
		padding: 0.8rem;
		border-left: 3px solid #a34428;
		background: rgba(163, 68, 40, 0.07);
	}

	.challenge p {
		margin: 0;
		font-family: var(--mono);
		font-size: 0.72rem;
		line-height: 1.6;
	}

	.model-notes {
		display: grid;
		grid-template-columns: 0.85fr 1.15fr;
		gap: 5rem;
		padding-block: clamp(6rem, 12vw, 10rem);
	}

	.notes {
		border-top: 1px solid var(--ink);
	}

	.notes details {
		padding: 1rem 0;
		border-bottom: 1px solid var(--line);
	}

	.notes summary {
		cursor: pointer;
		font-family: var(--serif);
		font-size: 1.15rem;
		font-weight: 600;
	}

	.notes p {
		margin: 0.8rem 0 0;
		color: var(--ink-muted);
		font-size: 0.82rem;
		line-height: 1.8;
	}

	.ending {
		padding-block: clamp(7rem, 15vw, 13rem);
		background: #371d18;
		color: #fff0e9;
		text-align: center;
	}

	.ending p {
		max-width: 720px;
		margin-inline: auto;
		font-family: var(--mono);
		font-size: 0.68rem;
		letter-spacing: 0.08em;
		line-height: 1.8;
	}

	.ending h2 {
		font-size: clamp(2.4rem, 6vw, 5.4rem);
	}

	.ending div div {
		display: flex;
		gap: 1.3rem;
		justify-content: center;
		margin-top: 2.5rem;
	}

	.ending a {
		padding: 0.75rem 1rem;
		border: 1px solid rgba(255, 240, 233, 0.68);
		border-radius: 999px;
		color: inherit;
		font-size: 0.72rem;
		font-weight: 800;
		text-decoration: none;
	}

	@media (max-width: 1050px) {
		.scrolly {
			grid-template-columns: minmax(260px, 0.65fr) minmax(500px, 1.35fr);
			gap: 1.5rem;
		}

		.edge-grid {
			grid-template-columns: 1fr;
			gap: 2rem;
		}
	}

	@media (max-width: 850px) {
		.story-hero h1 em {
			margin-left: 8%;
		}

		.scrolly {
			display: block;
			width: 100%;
			padding-top: 1rem;
		}

		.steps {
			position: relative;
			z-index: 5;
			width: min(100% - 24px, 520px);
			margin-inline: auto;
		}

		.step {
			min-height: 92vh;
			align-items: end;
			padding-bottom: 8vh;
		}

		.step.symbol-step {
			padding-top: 370px;
			align-items: flex-start;
		}

		.step-card {
			box-shadow: 0 20px 65px rgba(50, 28, 20, 0.2);
		}

		.sandbox-head,
		.sandbox-grid,
		.model-notes {
			grid-template-columns: 1fr;
		}

		.sandbox-grid,
		.model-notes {
			gap: 2rem;
		}
	}

	@media (max-width: 620px) {
		.hero-meta {
			flex-wrap: wrap;
		}

		.story-hero h1 {
			font-size: clamp(2.8rem, 15vw, 5.2rem);
		}

		.hero-bottom {
			align-items: flex-start;
			flex-direction: column;
			gap: 2rem;
		}

		.hero-curve {
			right: -24%;
			bottom: 11%;
			width: 120%;
		}

		.hero-curve span {
			right: 24%;
			bottom: -1.6rem;
			width: 72vw;
			line-height: 1.35;
			text-align: right;
			white-space: normal;
		}

		.reading-note .shell {
			grid-template-columns: 1fr;
			gap: 1rem;
		}

		.step {
			min-height: 96vh;
		}

		.step-card {
			padding: 1rem;
		}

		.measurement-grid {
			grid-template-columns: 1fr;
		}

		.ending div div {
			align-items: center;
			flex-direction: column;
		}
	}

	@media (max-width: 850px) and (max-height: 650px) {
		.step {
			min-height: auto;
			padding-block: 2rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.progress,
		.step {
			transition: none;
		}
	}
</style>
