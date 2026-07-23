<script lang="ts">
	import { resolve } from '$app/paths';
	import {
		accelerationFactor,
		arrheniusFactor,
		catalyzedProfile,
		H2O2_BARRIERS_KJ,
		H2O2_DELTA_H_KJ,
		uncatalyzedProfile,
		type ProfilePoint
	} from '$lib/chem';
	import CatalystTriView from '$lib/components/CatalystTriView.svelte';
	import ConceptCheck from '$lib/components/ConceptCheck.svelte';
	import Formula from '$lib/components/Math.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import SiteHeader from '$lib/components/SiteHeader.svelte';
	import StoryStage from '$lib/components/StoryStage.svelte';
	import {
		getCatalystContent,
		getSiteContent,
		type CatalystKind,
		type LocaleCode
	} from '$lib/content';
	import { parseProse, type InlineSegment } from './prose';
	import {
		catalystSceneDefinition,
		type CatalystPath,
		type CatalystSceneDefinition
	} from './season3-scenes';
	import { scrolly } from './scrolly';

	interface Props {
		locale?: LocaleCode;
	}

	type TriFocus = 'bench' | 'surface' | 'profile' | 'all';

	let { locale = 'zh-CN' }: Props = $props();
	let site = $derived(getSiteContent(locale));
	let story = $derived(getCatalystContent(locale));

	const pathDefaults = catalystSceneDefinition('lower-pass');
	const sandboxDefaults = catalystSceneDefinition('sandbox');

	let activeIndex = $state(0);
	let hookPrediction = $state<string | null>(null);
	let selectedPath = $state<CatalystPath>(pathDefaults.catalyst);
	const labEa = sandboxDefaults.eaKJPerMol;
	let labTemperatureC = $state(sandboxDefaults.temperatureC);

	let activeScene = $derived(catalystSceneDefinition(story.scenes[activeIndex].id));
	let activeSceneId = $derived(activeScene.id);

	function barrierFor(path: CatalystPath): number {
		switch (path) {
			case 'none':
				return H2O2_BARRIERS_KJ.uncatalyzed;
			case 'iodide':
				return H2O2_BARRIERS_KJ.iodide;
			case 'catalase':
				return H2O2_BARRIERS_KJ.catalase;
		}
	}

	function pathFor(index: number): CatalystPath {
		return (['none', 'iodide', 'catalase'] as const)[index];
	}

	function displayBoost(value: number): string {
		if (value < 10) return value.toFixed(1);
		if (value < 1000) return value.toFixed(0);
		return value.toExponential(1);
	}

	function focusFor(scene: CatalystSceneDefinition): TriFocus {
		switch (scene.id) {
			case 'the-pass':
			case 'both-ways':
				return 'profile';
			case 'unconsumed':
			case 'enzymes':
				return 'surface';
			case 'hook':
				return 'bench';
			default:
				return 'all';
		}
	}

	let selectedEa = $derived(barrierFor(selectedPath));
	let visualEa = $derived.by(() => {
		switch (activeSceneId) {
			case 'lower-pass':
			case 'both-ways':
				return selectedEa;
			case 'sandbox':
				return labEa;
			default:
				return activeScene.eaKJPerMol;
		}
	});
	let visualTemperatureC = $derived(
		activeSceneId === 'sandbox' ? labTemperatureC : activeScene.temperatureC
	);
	let visualShowCatalyzed = $derived.by(() => {
		switch (activeSceneId) {
			case 'lower-pass':
			case 'both-ways':
				return selectedPath !== 'none';
			case 'sandbox':
				return labEa < H2O2_BARRIERS_KJ.uncatalyzed;
			default:
				return activeScene.showCatalyzedPath;
		}
	});
	let visualCatalystKind = $derived.by((): CatalystKind => {
		switch (activeSceneId) {
			case 'lower-pass':
			case 'both-ways':
				return selectedPath;
			case 'sandbox':
				return 'iodide';
			default:
				return activeScene.catalyst;
		}
	});
	let visualActive = $derived(
		(activeScene.active || activeSceneId === 'lower-pass') && visualCatalystKind !== 'none'
	);
	let visualFocus = $derived(focusFor(activeScene));
	let visualBoost = $derived(
		accelerationFactor(
			H2O2_BARRIERS_KJ.uncatalyzed,
			visualShowCatalyzed ? visualEa : H2O2_BARRIERS_KJ.uncatalyzed,
			visualTemperatureC + 273.15
		)
	);
	let selectedBoost = $derived(
		accelerationFactor(H2O2_BARRIERS_KJ.uncatalyzed, selectedEa, 298.15)
	);
	let labBoost = $derived(
		accelerationFactor(H2O2_BARRIERS_KJ.uncatalyzed, labEa, labTemperatureC + 273.15)
	);
	let labUncatalyzedFactor = $derived(
		arrheniusFactor(H2O2_BARRIERS_KJ.uncatalyzed, labTemperatureC + 273.15)
	);
	let labCatalyzedFactor = $derived(arrheniusFactor(labEa, labTemperatureC + 273.15));
	let progress = $derived(((activeIndex + 1) / story.scenes.length) * 100);
	let catalogHref = $derived(locale === 'en' ? resolve('/en/') : resolve('/'));

	function energyPath(points: readonly ProfilePoint[]): string {
		return points
			.map((point, index) => {
				const x = 30 + ((point.x + 0.02) / 1.04) * 940;
				const y = 30 + ((80 - point.e) / 185) * 240;
				return (index === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1);
			})
			.join(' ');
	}

	// Both hero paths come from the same numerical kernel as the story diagram.
	const heroUncatalyzedPath = energyPath(
		uncatalyzedProfile(H2O2_BARRIERS_KJ.uncatalyzed, H2O2_DELTA_H_KJ, 40)
	);
	const heroCatalyzedPath = energyPath(
		catalyzedProfile(H2O2_BARRIERS_KJ.iodide, H2O2_DELTA_H_KJ, 24)
	);
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
		<div class="hero-meta"><p class="eyebrow">{story.hero.eyebrow}</p></div>
		<h1>{story.hero.title[0]}<br /><em>{story.hero.title[1]}</em></h1>
		<div class="hero-bottom"><p>{story.hero.subtitle}</p></div>
		<div class="hero-curve" aria-hidden="true">
			<svg viewBox="0 0 1000 300">
				<path class="uncatalyzed" d={heroUncatalyzedPath} />
				<path class="catalyzed" d={heroCatalyzedPath} />
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
				<CatalystTriView
					uncatalyzedEaKJPerMol={H2O2_BARRIERS_KJ.uncatalyzed}
					catalyzedEaKJPerMol={visualEa}
					deltaHKJPerMol={H2O2_DELTA_H_KJ}
					catalystKind={visualCatalystKind}
					temperatureK={visualTemperatureC + 273.15}
					progress={0.18 + activeIndex * 0.085}
					showCatalyzedPath={visualShowCatalyzed}
					active={visualActive}
					focus={visualFocus}
					label={story.triView.defaultAriaLabel}
					content={story.triView}
				/>
			{/snippet}
			{#snippet status()}
				<span>Ea {visualEa.toFixed(0)} kJ/mol</span>
				<span>{visualTemperatureC.toFixed(0)} °C</span>
				<span>×{displayBoost(visualBoost)}</span>
			{/snippet}
		</StoryStage>

		<div class="steps" use:scrolly={{ onActive: (index) => (activeIndex = index) }}>
			{#each story.scenes as scene, index (scene.id)}
				<article
					class="step"
					class:active={activeIndex === index}
					class:symbol-step={scene.id === 'the-pass' ||
						scene.id === 'lower-pass' ||
						scene.id === 'both-ways' ||
						scene.id === 'sandbox'}
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

						{#if scene.id === 'lower-pass' || scene.id === 'both-ways'}
							<div class="path-selector">
								<span>{story.interactions.lowerPass.catalystLabel}</span>
								<div>
									{#each story.interactions.lowerPass.catalystNames as name, choiceIndex (name)}
										{@const choice = pathFor(choiceIndex)}
										<button
											type="button"
											aria-pressed={selectedPath === choice}
											class:selected={selectedPath === choice}
											onclick={() => (selectedPath = choice)}>{name}</button
										>
									{/each}
								</div>
							</div>
							<p class="evidence" aria-live="polite">
								{#if scene.id === 'both-ways'}
									{story.interactions.bothWays.readout({
										forwardBoost: displayBoost(selectedBoost),
										reverseBoost: displayBoost(selectedBoost)
									})}
								{:else}
									{story.interactions.lowerPass.readout({
										ea: selectedEa.toFixed(0),
										boost: displayBoost(selectedBoost)
									})}
								{/if}
							</p>
						{/if}

						{#if scene.id === 'sandbox'}
							<div class="fixed-parameter">
								<span>{story.interactions.sandbox.eaLabel}</span>
								<strong>{labEa.toFixed(0)} kJ/mol</strong>
							</div>
							<label class="range-control">
								<span>{story.interactions.sandbox.temperatureLabel}</span>
								<strong>{labTemperatureC.toFixed(0)} °C</strong>
								<input
									type="range"
									min="0"
									max="100"
									step="1"
									aria-label={story.interactions.sandbox.temperatureLabel}
									bind:value={labTemperatureC}
								/>
							</label>
							<p class="evidence" aria-live="polite">
								{story.interactions.sandbox.readout({
									ea: labEa.toFixed(0),
									boost: displayBoost(labBoost),
									uncatalyzedFactor: labUncatalyzedFactor.toExponential(2),
									catalyzedFactor: labCatalyzedFactor.toExponential(2)
								})}
							</p>
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
				<div class="fixed-parameter">
					<span>{story.interactions.sandbox.eaLabel}</span>
					<strong>{labEa.toFixed(0)} kJ/mol</strong>
				</div>
				<label>
					<span>{story.interactions.sandbox.temperatureLabel}</span>
					<strong>{labTemperatureC.toFixed(0)} °C</strong>
					<input
						type="range"
						min="0"
						max="100"
						step="1"
						aria-label={story.interactions.sandbox.temperatureLabel}
						bind:value={labTemperatureC}
					/>
				</label>
				<div class="challenge" aria-live="polite">
					<p>
						{story.interactions.sandbox.readout({
							ea: labEa.toFixed(0),
							boost: displayBoost(labBoost),
							uncatalyzedFactor: labUncatalyzedFactor.toExponential(2),
							catalyzedFactor: labCatalyzedFactor.toExponential(2)
						})}
					</p>
				</div>
			</div>
			<CatalystTriView
				uncatalyzedEaKJPerMol={H2O2_BARRIERS_KJ.uncatalyzed}
				catalyzedEaKJPerMol={labEa}
				deltaHKJPerMol={H2O2_DELTA_H_KJ}
				catalystKind="iodide"
				temperatureK={labTemperatureC + 273.15}
				progress={0.55}
				showCatalyzedPath={labEa < H2O2_BARRIERS_KJ.uncatalyzed}
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
		background: #a3702a;
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
		color: #a3702a;
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
		bottom: 2%;
		width: 62%;
		opacity: 0.48;
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

	.hero-curve .uncatalyzed {
		stroke: rgba(54, 45, 32, 0.45);
		stroke-width: 3;
		stroke-dasharray: 10 8;
	}

	.hero-curve .catalyzed {
		stroke: #a3702a;
		stroke-width: 5;
	}

	.hero-curve span {
		position: absolute;
		right: 8%;
		bottom: -0.5rem;
		color: #725020;
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

	.reading-note .eyebrow,
	.edge .eyebrow {
		color: #e7c98f;
	}

	.reading-note p:last-child {
		max-width: 800px;
		margin: 0;
		color: rgba(244, 239, 228, 0.75);
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
		box-shadow: 0 18px 45px rgba(50, 40, 23, 0.09);
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
		margin-block: 0.3rem;
	}

	.step-card :global(strong) {
		color: var(--ink);
	}

	.formula {
		margin: 1rem 0;
		padding: 0.7rem;
		overflow-x: auto;
		border-block: 1px solid var(--line);
		color: var(--ink);
		font-size: 1.02rem;
		text-align: center;
	}

	.prediction,
	.path-selector {
		margin-top: 1rem;
		padding: 0.85rem;
		border-radius: 10px;
		background: rgba(163, 112, 42, 0.09);
	}

	.prediction > span,
	.path-selector > span {
		display: block;
		margin-bottom: 0.55rem;
		color: #725020;
		font-family: var(--mono);
		font-size: 0.6rem;
		font-weight: 800;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.prediction > div,
	.path-selector > div {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
	}

	.prediction button,
	.path-selector button {
		padding: 0.52rem 0.68rem;
		border: 1px solid rgba(31, 40, 38, 0.18);
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.68);
		color: var(--ink);
		cursor: pointer;
		font-size: 0.7rem;
		font-weight: 700;
	}

	.prediction button.selected,
	.path-selector button.selected {
		border-color: #80551f;
		background: #80551f;
		color: white;
	}

	.evidence {
		margin: 0.75rem 0 0;
		padding-left: 0.7rem;
		border-left: 2px solid #a3702a;
		color: var(--ink-muted);
		font-size: 0.75rem;
		line-height: 1.65;
	}

	.range-control,
	.fixed-parameter,
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
	.fixed-parameter strong,
	.sandbox-controls label strong {
		font-family: var(--mono);
	}

	.range-control input,
	.sandbox-controls input {
		width: 100%;
		grid-column: 1 / -1;
		accent-color: #a3702a;
	}

	.edge {
		padding-block: clamp(6rem, 12vw, 10rem);
		background: #2b2419;
		color: var(--paper);
	}

	.edge-grid {
		display: grid;
		grid-template-columns: 0.7fr 1.3fr;
		gap: 5rem;
		align-items: start;
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
		color: #e7c98f;
		font-family: var(--mono);
		font-size: 0.68rem;
		font-weight: 800;
		letter-spacing: 0.08em;
	}

	.fact-definition {
		color: rgba(244, 239, 228, 0.82);
		font-size: 0.82rem;
		font-weight: 500;
		line-height: 1.6;
	}

	.concept {
		padding-block: clamp(5rem, 10vw, 8rem);
	}

	.sandbox {
		padding-block: clamp(5rem, 10vw, 9rem);
		background: #e3d5bd;
	}

	.sandbox .eyebrow {
		color: #725020;
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
		background: rgba(244, 239, 228, 0.38);
	}

	.sandbox-controls label {
		margin: 0 0 0.7rem;
		background: rgba(255, 255, 255, 0.3);
	}

	.sandbox-controls .fixed-parameter {
		margin: 0 0 0.7rem;
		background: rgba(255, 255, 255, 0.3);
	}

	.challenge {
		padding: 0.8rem;
		border-left: 3px solid #a3702a;
		background: rgba(163, 112, 42, 0.08);
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
		background: #3a2b18;
		color: #f5ead6;
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
		border: 1px solid rgba(245, 234, 214, 0.68);
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
			box-shadow: 0 20px 65px rgba(50, 40, 23, 0.2);
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
			bottom: 10%;
			width: 120%;
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

		.ending div div {
			align-items: center;
			flex-direction: column;
		}
	}

	@media (max-width: 850px) and (max-height: 650px) {
		.step,
		.step.symbol-step {
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
