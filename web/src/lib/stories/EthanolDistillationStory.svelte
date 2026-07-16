<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { onMount, tick } from 'svelte';
	import { ETHANOL_WATER_LAI_2014, thermoFrame } from '$lib/chem';
	import ConceptCheck from '$lib/components/ConceptCheck.svelte';
	import Formula from '$lib/components/Math.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import SiteHeader from '$lib/components/SiteHeader.svelte';
	import TriView from '$lib/components/TriView.svelte';
	import {
		getEthanolDistillationContent,
		getSiteContent,
		type InlineText,
		type LocaleCode
	} from '$lib/content';
	import { sceneDefinition } from './ethanol-distillation-scenes';
	import { heroCurveGeometry } from './hero-curve';

	interface Props {
		locale?: LocaleCode;
	}

	let { locale = 'zh-CN' }: Props = $props();
	let site = $derived(getSiteContent(locale));
	let story = $derived(getEthanolDistillationContent(locale));

	let activeIndex = $state(0);
	let hookStage = $state(0);
	let hookPrediction = $state<'reach' | 'stop' | null>(null);
	let bubblePrediction = $state<'pure' | 'richer' | 'same' | null>(null);
	let stageControl = $state(7);
	let experimentIndex = $state(3);
	let recordedExperimentalIndices = $state<number[]>([]);
	let modelStrength = $state(0);
	let azeotropeSearch = $state(0.82);
	let dehydration = $state(0);
	let labComposition = $state(0.1);
	let labStage = $state(4);
	let labModel = $state(1);
	let shortGraphicOpen = $state(false);
	let openGraphicButton: HTMLButtonElement;
	let closeGraphicButton: HTMLButtonElement;

	let activeScene = $derived(sceneDefinition(story.scenes[activeIndex].id));
	let activeSceneId = $derived(activeScene.id);
	let experimentPoint = $derived(ETHANOL_WATER_LAI_2014.points[experimentIndex]);
	let experimentSceneActive = $derived(activeSceneId === 'build-the-map');
	let visualComposition = $derived(
		experimentSceneActive
			? experimentPoint.x
			: activeSceneId === 'fixed-point'
				? azeotropeSearch
				: activeScene.composition
	);
	let visualStage = $derived(
		activeSceneId === 'hook'
			? hookStage
			: activeSceneId === 'equilibrium-cascade'
				? stageControl
				: activeScene.stage
	);
	let visualModel = $derived(
		activeSceneId === 'nonideal-model' ? modelStrength : activeScene.interactionScale
	);
	// The same frame the tri-view resolves internally (memoized), so the
	// mobile status strip quotes exactly the numbers the stage displays.
	let visualFrame = $derived(
		thermoFrame({
			composition: visualComposition,
			stage: visualStage,
			interactionScale: visualModel
		})
	);
	let visualPoint = $derived(experimentSceneActive ? experimentPoint : visualFrame.current);
	let searchPoint = $derived(thermoFrame({ composition: azeotropeSearch }).current);
	let searchDelta = $derived(searchPoint.y - azeotropeSearch);
	const experimentalAzeotrope = ETHANOL_WATER_LAI_2014.azeotrope;
	const sievePores = Array.from({ length: 24 }, (_, index) => index);
	const azeotropeX = experimentalAzeotrope.x;
	// The hero backdrop draws the same calibrated envelope as the interactive
	// diagram — no hand-tuned béziers on a site about computed maps.
	const heroCurve = heroCurveGeometry({
		width: 1000,
		height: 300,
		insetLeft: 20,
		insetRight: 40,
		insetTop: 20,
		insetBottom: 24
	});
	let dehydratedComposition = $derived(
		azeotropeX / (azeotropeX + (1 - dehydration) * (1 - azeotropeX))
	);
	let hookStages = $derived(thermoFrame({ composition: 0.1, stage: hookStage }).stages);
	let hookTop = $derived(hookStages.at(-1)?.x ?? 0.1);
	let progress = $derived(((activeIndex + 1) / story.scenes.length) * 100);
	let experimentAlreadySelected = $derived(recordedExperimentalIndices.includes(experimentIndex));
	let catalogHref = $derived(locale === 'en' ? resolve('/en/') : resolve('/'));

	function recordExperiment() {
		if (experimentAlreadySelected) return;
		recordedExperimentalIndices = [...recordedExperimentalIndices, experimentIndex].sort(
			(first, second) => first - second
		);
	}

	async function openShortGraphic() {
		shortGraphicOpen = true;
		document.body.style.overflow = 'hidden';
		await tick();
		closeGraphicButton.focus();
	}

	async function closeShortGraphic(restoreFocus = true) {
		shortGraphicOpen = false;
		document.body.style.overflow = '';
		await tick();
		if (restoreFocus && openGraphicButton?.isConnected && openGraphicButton.offsetParent !== null) {
			openGraphicButton.focus();
		}
	}

	beforeNavigate(() => {
		shortGraphicOpen = false;
		document.body.style.overflow = '';
	});

	onMount(() => {
		const nodes = [...document.querySelectorAll<HTMLElement>('[data-scene-index]')];
		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries
					.filter((entry) => entry.isIntersecting)
					.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
				if (!visible) return;
				activeIndex = Number((visible.target as HTMLElement).dataset.sceneIndex ?? 0);
			},
			{ rootMargin: '-18% 0px -38% 0px', threshold: [0.2, 0.45, 0.7] }
		);
		nodes.forEach((node) => observer.observe(node));
		const shortViewport = window.matchMedia('(max-width: 850px) and (max-height: 650px)');
		const closeWhenViewportGrows = () => {
			if (shortGraphicOpen && !shortViewport.matches) void closeShortGraphic(false);
		};
		shortViewport.addEventListener('change', closeWhenViewportGrows);
		return () => {
			observer.disconnect();
			shortViewport.removeEventListener('change', closeWhenViewportGrows);
			shortGraphicOpen = false;
			document.body.style.overflow = '';
		};
	});
</script>

{#snippet inlineText(segments: InlineText)}
	{#each segments as segment, index (index)}
		{#if segment.emphasis === 'strong'}
			<strong>{segment.text}</strong>
		{:else if segment.emphasis === 'em'}
			<em>{segment.text}</em>
		{:else if segment.emphasis === 'subscript'}
			<sub>{segment.text}</sub>
		{:else}
			{segment.text}
		{/if}
	{/each}
{/snippet}

<svelte:window
	onkeydown={(event) => {
		if (event.key === 'Escape' && shortGraphicOpen) closeShortGraphic();
		if (event.key === 'Tab' && shortGraphicOpen) {
			event.preventDefault();
			closeGraphicButton.focus();
		}
	}}
/>

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

<div class="progress" style:width={`${progress}%`} aria-hidden="true"></div>
<SiteHeader compact {locale} content={site.shared.header} />

<main>
	<section class="story-hero shell">
		<div class="hero-meta">
			<p class="eyebrow">{story.hero.eyebrow}</p>
			{#each story.hero.metadata as item (item)}
				<span>{item}</span>
			{/each}
		</div>
		<h1>{story.hero.heading.lines[0]}<br /><em>{story.hero.heading.emphasis}</em></h1>
		<div class="hero-bottom">
			<p>{story.hero.ledeLines[0]}<br />{story.hero.ledeLines[1]}</p>
			<div class="scroll-cue"><span></span>{story.hero.scrollCue}</div>
		</div>
		<div class="hero-curve" aria-hidden="true">
			<svg viewBox="0 0 1000 300">
				<path d={heroCurve.bubblePath} />
				<path class="dashed" d={heroCurve.dewPath} />
				<circle
					cx={heroCurve.azeotrope.px.toFixed(1)}
					cy={heroCurve.azeotrope.py.toFixed(1)}
					r="10"
				/>
				<line
					x1={heroCurve.azeotrope.px.toFixed(1)}
					x2={heroCurve.azeotrope.px.toFixed(1)}
					y1={heroCurve.azeotrope.py.toFixed(1)}
					y2={heroCurve.baselineY}
				/>
			</svg>
			<span>{story.hero.curveEvidence}</span>
		</div>
	</section>

	<section class="reading-note">
		<div class="shell">
			<p class="eyebrow">{story.readingNote.eyebrow}</p>
			<p>{@render inlineText(story.readingNote.body)}</p>
		</div>
	</section>

	<section class="scrolly shell" id="story-flow">
		<div
			class="graphic"
			class:short-open={shortGraphicOpen}
			id="story-graphic"
			role={shortGraphicOpen ? 'dialog' : undefined}
			aria-modal={shortGraphicOpen ? 'true' : undefined}
			aria-label={shortGraphicOpen ? story.stage.dialogAriaLabel : undefined}
		>
			<button
				bind:this={closeGraphicButton}
				class="close-graphic"
				type="button"
				onclick={() => closeShortGraphic()}
				aria-label={story.stage.closeGraphicAriaLabel}>×</button
			>
			<TriView
				composition={visualComposition}
				stage={visualStage}
				interactionScale={visualModel}
				reveal={activeScene.reveal}
				focus={activeScene.focus}
				showAzeotrope={activeScene.showAzeotrope}
				experimentMode={experimentSceneActive}
				showExperimentalData={activeScene.showExperimentalData}
				experimentalPoint={experimentSceneActive ? experimentPoint : undefined}
				recordedExperimentalIndices={experimentSceneActive ? recordedExperimentalIndices : []}
				label={story.stage.triViewAriaLabel}
				content={site.shared}
			/>
		</div>
		<aside class="short-state" aria-label={story.stage.shortStateAriaLabel}>
			<span>{story.stage.shortState.liquid({ composition: visualComposition.toFixed(3) })}</span>
			<span>{story.stage.shortState.vapor({ composition: visualPoint.y.toFixed(3) })}</span>
			<span
				>{story.stage.shortState.temperature({
					temperatureC: visualPoint.temperatureC.toFixed(1)
				})}</span
			>
			<button bind:this={openGraphicButton} type="button" onclick={openShortGraphic}
				>{story.stage.openGraphicButton}</button
			>
		</aside>

		<div class="steps">
			{#each story.scenes as scene, index (scene.id)}
				<article
					class="step"
					class:active={activeIndex === index}
					class:symbol-step={sceneDefinition(scene.id).focus === 'symbol'}
					data-scene-index={index}
					data-scene-id={scene.id}
				>
					<div class="step-card">
						<p class="eyebrow">{scene.kicker}</p>
						<h2>{scene.title}</h2>
						{#each scene.paragraphs as paragraph (paragraph)}
							<p>{paragraph}</p>
						{/each}
						{#if scene.formula}
							<div class="formula"><Formula formula={scene.formula} display /></div>
						{/if}

						{#if scene.id === 'hook'}
							<div class="prediction">
								<span>{story.interactions.hook.prompt}</span>
								<div>
									<button
										type="button"
										aria-pressed={hookPrediction === 'reach'}
										class:selected={hookPrediction === 'reach'}
										onclick={() => (hookPrediction = 'reach')}
										>{story.interactions.hook.choices[0].label}</button
									>
									<button
										type="button"
										aria-pressed={hookPrediction === 'stop'}
										class:selected={hookPrediction === 'stop'}
										onclick={() => (hookPrediction = 'stop')}
										>{story.interactions.hook.choices[1].label}</button
									>
								</div>
							</div>
							<div class="inline-control">
								<button type="button" onclick={() => (hookStage = Math.min(14, hookStage + 1))}
									>{story.interactions.hook.addStageButton}</button
								>
								<button class="ghost" type="button" onclick={() => (hookStage = 0)}
									>{story.interactions.hook.resetButton}</button
								>
								<output
									>{story.interactions.hook.stageOutput({
										stage: hookStage,
										composition: hookTop.toFixed(3)
									})}</output
								>
							</div>
							{#if hookPrediction && hookStage >= 6}
								<p class="evidence">{story.interactions.hook.evidence}</p>
							{/if}
						{/if}

						{#if scene.id === 'first-bubble'}
							<div class="prediction">
								<span>{story.interactions.firstBubble.prompt}</span>
								<div>
									<button
										type="button"
										aria-pressed={bubblePrediction === 'pure'}
										class:selected={bubblePrediction === 'pure'}
										onclick={() => (bubblePrediction = 'pure')}
										>{story.interactions.firstBubble.choices[0].label}</button
									>
									<button
										type="button"
										aria-pressed={bubblePrediction === 'richer'}
										class:selected={bubblePrediction === 'richer'}
										onclick={() => (bubblePrediction = 'richer')}
										>{story.interactions.firstBubble.choices[1].label}</button
									>
									<button
										type="button"
										aria-pressed={bubblePrediction === 'same'}
										class:selected={bubblePrediction === 'same'}
										onclick={() => (bubblePrediction = 'same')}
										>{story.interactions.firstBubble.choices[2].label}</button
									>
								</div>
							</div>
							{#if bubblePrediction}
								<p class="evidence">{story.interactions.firstBubble.evidence}</p>
							{/if}
						{/if}

						{#if scene.id === 'build-the-map'}
							<label class="range-control experiment">
								<span>{story.interactions.experiment.controlLabel}</span>
								<strong>{experimentPoint.x.toFixed(3)}</strong>
								<input
									type="range"
									min="0"
									max={ETHANOL_WATER_LAI_2014.points.length - 1}
									step="1"
									aria-label={story.interactions.experiment.sliderAriaLabel}
									aria-valuetext={story.interactions.experiment.sliderValueText({
										index: experimentIndex + 1,
										liquidComposition: experimentPoint.x.toFixed(3)
									})}
									bind:value={experimentIndex}
								/>
								<small
									>{story.interactions.experiment.measurement({
										temperatureC: experimentPoint.temperatureC.toFixed(2),
										temperatureUncertaintyC: experimentPoint.temperatureUncertaintyK95.toFixed(2),
										vaporComposition: experimentPoint.y.toFixed(3)
									})}</small
								>
							</label>
							<div class="inline-control experiment-actions">
								<button
									type="button"
									onclick={recordExperiment}
									disabled={experimentAlreadySelected}
									>{experimentAlreadySelected
										? story.interactions.experiment.addedButton
										: story.interactions.experiment.addButton}</button
								>
								<button
									class="ghost"
									type="button"
									onclick={() => (recordedExperimentalIndices = [])}
									>{story.interactions.experiment.clearButton}</button
								>
								<output
									>{story.interactions.experiment.selectionOutput({
										selected: recordedExperimentalIndices.length,
										total: ETHANOL_WATER_LAI_2014.points.length
									})}</output
								>
							</div>
							{#if recordedExperimentalIndices.length >= 5}
								<p class="evidence">{story.interactions.experiment.completeEvidence}</p>
							{:else}
								<p class="evidence">{story.interactions.experiment.incompleteEvidence}</p>
							{/if}
						{/if}

						{#if scene.id === 'equilibrium-cascade'}
							<label class="range-control">
								<span>{story.interactions.idealCascade.controlLabel}</span>
								<strong>{stageControl}</strong>
								<input
									type="range"
									min="0"
									max="12"
									step="1"
									aria-label={story.interactions.idealCascade.sliderAriaLabel}
									bind:value={stageControl}
								/>
							</label>
						{/if}

						{#if scene.id === 'nonideal-model'}
							<label class="range-control">
								<span>{story.interactions.nonidealModel.controlLabel}</span>
								<strong>{modelStrength.toFixed(2)}</strong>
								<input
									type="range"
									min="0"
									max="1"
									step="0.01"
									aria-label={story.interactions.nonidealModel.sliderAriaLabel}
									bind:value={modelStrength}
								/>
								<span class="slider-scale" aria-hidden="true">
									<span>{story.interactions.nonidealModel.scale.start}</span>
									<span>{story.interactions.nonidealModel.scale.end}</span>
								</span>
							</label>
						{/if}

						{#if scene.id === 'fixed-point'}
							<label class="range-control search">
								<span>{story.interactions.azeotropeSearch.controlLabel}</span>
								<strong class:near={Math.abs(searchDelta) < 0.003}
									>{searchDelta >= 0 ? '+' : ''}{searchDelta.toFixed(4)}</strong
								>
								<input
									type="range"
									min="0.7"
									max="0.98"
									step="0.001"
									aria-label={story.interactions.azeotropeSearch.sliderAriaLabel}
									bind:value={azeotropeSearch}
								/>
								<small
									>{story.interactions.azeotropeSearch.compositionOutput({
										liquidComposition: azeotropeSearch.toFixed(3),
										vaporComposition: searchPoint.y.toFixed(3)
									})}</small
								>
							</label>
							{#if Math.abs(searchDelta) < 0.003}
								<p class="evidence">
									{story.interactions.azeotropeSearch.nearEvidence({
										modelComposition: '0.895',
										modelTemperatureC: '78.15',
										experimentalComposition: experimentalAzeotrope.x.toFixed(3),
										experimentalCompositionUncertainty:
											experimentalAzeotrope.compositionUncertainty95.toFixed(3),
										experimentalTemperatureC: experimentalAzeotrope.temperatureC.toFixed(2),
										experimentalTemperatureUncertaintyC:
											experimentalAzeotrope.temperatureUncertaintyK95.toFixed(2)
									})}
								</p>
							{/if}
						{/if}
					</div>
				</article>
			{/each}
		</div>
	</section>

	<section class="escape">
		<div class="shell escape-grid">
			<div class="escape-copy">
				<p class="eyebrow">{story.escape.eyebrow}</p>
				<h2>{story.escape.heading.lines[0]}<br />{story.escape.heading.lines[1]}</h2>
				<p>{story.escape.body}</p>
				<label class="dehydrate-control">
					<span>{story.escape.controlLabel}</span>
					<strong
						>{story.escape.percentOutput({
							percent: (dehydration * 100).toFixed(1)
						})}</strong
					>
					<input
						type="range"
						min="0"
						max="0.999"
						step="0.001"
						aria-label={story.escape.controlAriaLabel}
						bind:value={dehydration}
					/>
				</label>
			</div>
			<figure class="sieve-visual">
				<figcaption class="visually-hidden">{story.escape.figureCaption}</figcaption>
				<div class="before">
					<span>{story.escape.beforeLabel}</span>
					<strong
						>{story.escape.beforeValue({
							molePercent: (azeotropeX * 100).toFixed(1)
						})}</strong
					>
					<div class="mixture" style:--ethanol-stop={`${azeotropeX * 100}%`}></div>
				</div>
				<div class="sieve">
					{#each sievePores as index (index)}
						<i class:captured={index / 24 < dehydration}></i>
					{/each}
					<span>{story.escape.sieveLabelLines[0]}<br />{story.escape.sieveLabelLines[1]}</span>
				</div>
				<div class="after">
					<span>{story.escape.afterLabel}</span>
					<strong
						>{story.escape.afterValue({
							molePercent: (dehydratedComposition * 100).toFixed(2)
						})}</strong
					>
					<div class="mixture" style:--ethanol-stop={`${dehydratedComposition * 100}%`}></div>
				</div>
				<svg viewBox="0 0 600 90" aria-hidden="true">
					<path d="M22 50h556" />
					<path d="m557 35 21 15-21 15" />
				</svg>
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
				<p class="eyebrow">{story.sandbox.eyebrow}</p>
				<h2>{story.sandbox.title}</h2>
			</div>
			<p>{story.sandbox.introduction}</p>
		</div>
		<div class="shell sandbox-grid">
			<div class="sandbox-controls">
				<label>
					<span>{story.sandbox.controls.initialComposition}</span><strong
						>{labComposition.toFixed(3)}</strong
					>
					<input
						type="range"
						min="0.01"
						max="0.99"
						step="0.005"
						aria-label={story.sandbox.controls.initialCompositionAriaLabel}
						bind:value={labComposition}
					/>
				</label>
				<label>
					<span>{story.sandbox.controls.equilibriumStages}</span><strong>{labStage}</strong>
					<input
						type="range"
						min="0"
						max="14"
						step="1"
						aria-label={story.sandbox.controls.equilibriumStagesAriaLabel}
						bind:value={labStage}
					/>
				</label>
				<label>
					<span>{story.sandbox.controls.nonidealStrength}</span><strong
						>{labModel.toFixed(2)}</strong
					>
					<input
						type="range"
						min="0"
						max="1"
						step="0.01"
						aria-label={story.sandbox.controls.nonidealStrengthAriaLabel}
						bind:value={labModel}
					/>
					<span class="slider-scale" aria-hidden="true">
						<span>{story.sandbox.controls.nonidealStrengthScale.start}</span>
						<span>{story.sandbox.controls.nonidealStrengthScale.end}</span>
					</span>
				</label>
				<div class="challenge">
					<strong>{story.sandbox.challengeLabel}</strong>
					<p>{story.sandbox.challenge}</p>
				</div>
			</div>
			<TriView
				composition={labComposition}
				stage={labStage}
				interactionScale={labModel}
				showExperimentalData
				label={story.sandbox.triViewAriaLabel}
				content={site.shared}
			/>
		</div>
	</section>

	<section class="model-notes shell">
		<div>
			<p class="eyebrow">{story.modelCard.eyebrow}</p>
			<h2>
				{#each story.modelCard.heading.lines as line, index (line)}
					{#if index > 0}<br />{/if}{line}
				{/each}
			</h2>
		</div>
		<div class="notes">
			{#each story.modelCard.items as item (item.title)}
				<details open={item.openByDefault}>
					<summary>{item.title}</summary>
					<p>{@render inlineText(item.body)}</p>
					{#if item.links?.length}
						<p class="source-links">
							{#each item.links as link, index (link.href)}
								{#if index > 0}<span aria-hidden="true"> · </span>{/if}
								<a href={link.href} rel="external">{link.label}</a>
							{/each}
						</p>
					{/if}
				</details>
			{/each}
		</div>
	</section>

	<section class="ending">
		<div class="shell">
			<p>{story.ending.lead}</p>
			<h2>
				{#each story.ending.heading.lines as line, index (line)}
					{#if index > 0}<br />{/if}{line}
				{/each}
			</h2>
			<div>
				<a href={catalogHref}>{story.ending.catalogLink}</a>
				<a href="https://github.com/DongYaoZe/visual-chem">{story.ending.sourceLink}</a>
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
		background: var(--ethanol);
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

	.hero-meta span {
		color: var(--ink-muted);
		font-family: var(--mono);
		font-size: 0.62rem;
	}

	.story-hero h1 {
		position: relative;
		z-index: 2;
		margin: 1.2rem 0 2.5rem;
		font-family: var(--serif);
		font-size: clamp(4rem, 10vw, 9.8rem);
		font-weight: 500;
		letter-spacing: -0.075em;
		line-height: 0.8;
	}

	.story-hero h1 em {
		display: inline-block;
		margin-left: 22%;
		color: var(--ethanol);
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

	.scroll-cue {
		display: flex;
		gap: 0.6rem;
		align-items: center;
		color: var(--ink-muted);
		font-family: var(--mono);
		font-size: 0.6rem;
	}

	.scroll-cue span {
		position: relative;
		width: 18px;
		height: 30px;
		border: 1px solid currentColor;
		border-radius: 999px;
	}

	.scroll-cue span::after {
		position: absolute;
		top: 6px;
		left: 7px;
		width: 2px;
		height: 7px;
		border-radius: 2px;
		background: currentColor;
		content: '';
		animation: scroll 1.4s ease-in-out infinite;
	}

	.hero-curve {
		position: absolute;
		right: -5%;
		bottom: 2%;
		width: 72%;
		opacity: 0.27;
	}

	.hero-curve svg {
		display: block;
		width: 100%;
	}

	.hero-curve path,
	.hero-curve line {
		fill: none;
		stroke: var(--ethanol);
		stroke-width: 4;
	}

	.hero-curve .dashed {
		stroke: var(--water);
		stroke-dasharray: 10 10;
	}

	.hero-curve circle {
		fill: var(--acid);
	}

	.hero-curve line {
		stroke: var(--acid);
		stroke-dasharray: 4 7;
		stroke-width: 2;
	}

	.hero-curve span {
		position: absolute;
		right: 11%;
		bottom: -0.5rem;
		color: var(--acid);
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
		color: var(--ethanol-bright);
	}

	.reading-note p:last-child {
		max-width: 800px;
		margin: 0;
		color: rgba(244, 239, 228, 0.72);
		font-family: var(--serif);
		font-size: clamp(1.1rem, 2vw, 1.35rem);
		line-height: 1.9;
	}

	.reading-note strong {
		color: var(--paper);
	}

	.scrolly {
		display: grid;
		grid-template-columns: minmax(290px, 0.7fr) minmax(570px, 1.3fr);
		gap: clamp(2rem, 5vw, 5rem);
		align-items: start;
		padding-block: 8rem;
	}

	.graphic {
		position: sticky;
		top: 1rem;
		grid-column: 2;
		grid-row: 1;
	}

	.close-graphic {
		display: none;
	}

	.short-state {
		display: none;
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
		background: rgba(250, 247, 239, 0.94);
		box-shadow: 0 18px 45px rgba(36, 40, 34, 0.08);
	}

	.step h2 {
		margin: 0.65rem 0 1.15rem;
		font-family: var(--serif);
		font-size: clamp(1.65rem, 3vw, 2.55rem);
		font-weight: 500;
		letter-spacing: -0.035em;
		line-height: 1.18;
	}

	.step-card > p:not(.eyebrow):not(.evidence) {
		margin: 0.72rem 0;
		color: var(--ink-muted);
		font-family: var(--serif);
		font-size: 0.98rem;
		line-height: 1.8;
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
		background: rgba(32, 127, 140, 0.07);
	}

	.prediction > span {
		display: block;
		margin-bottom: 0.55rem;
		color: var(--water);
		font-family: var(--mono);
		font-size: 0.6rem;
		font-weight: 800;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.prediction > div,
	.inline-control {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
	}

	.prediction button,
	.inline-control button {
		padding: 0.52rem 0.68rem;
		border: 1px solid rgba(31, 40, 38, 0.18);
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.65);
		color: var(--ink);
		cursor: pointer;
		font-size: 0.7rem;
		font-weight: 700;
	}

	.prediction button.selected {
		border-color: var(--water);
		background: var(--water);
		color: white;
	}

	.inline-control {
		align-items: center;
		margin-top: 0.8rem;
	}

	.inline-control button:first-child {
		border-color: var(--ink);
		background: var(--ink);
		color: var(--paper);
	}

	.inline-control .ghost {
		background: transparent;
	}

	.inline-control output {
		width: 100%;
		margin-top: 0.25rem;
		font-family: var(--mono);
		font-size: 0.66rem;
		font-weight: 700;
	}

	.evidence {
		margin: 0.75rem 0 0;
		padding-left: 0.7rem;
		border-left: 2px solid var(--ethanol);
		color: var(--ink-muted);
		font-size: 0.75rem;
		line-height: 1.65;
	}

	.range-control,
	.dehydrate-control,
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
	.dehydrate-control strong,
	.sandbox-controls label strong {
		font-family: var(--mono);
	}

	.range-control strong.near {
		color: #367a48;
	}

	.range-control input,
	.dehydrate-control input,
	.sandbox-controls input {
		width: 100%;
		grid-column: 1 / -1;
		accent-color: var(--ethanol);
	}

	.range-control small {
		grid-column: 1 / -1;
		color: var(--ink-muted);
		font-family: var(--mono);
	}

	/* Endpoint captions under a slider track: what 0 and 1 actually claim. */
	.slider-scale {
		display: flex;
		grid-column: 1 / -1;
		justify-content: space-between;
		margin-top: -0.2rem;
		color: var(--ink-muted);
		font-family: var(--mono);
		font-size: 0.62rem;
	}

	.escape {
		padding-block: clamp(6rem, 12vw, 10rem);
		background: #1f2826;
		color: var(--paper);
	}

	.escape-grid {
		display: grid;
		grid-template-columns: 0.72fr 1.28fr;
		gap: 5rem;
		align-items: center;
	}

	.escape .eyebrow {
		color: var(--ethanol-bright);
	}

	.escape h2,
	.sandbox h2,
	.model-notes h2,
	.ending h2 {
		margin: 0.75rem 0 1.3rem;
		font-family: var(--serif);
		font-size: clamp(2.6rem, 5vw, 5.1rem);
		font-weight: 500;
		letter-spacing: -0.055em;
		line-height: 1;
	}

	.escape-copy > p:not(.eyebrow) {
		color: rgba(244, 239, 228, 0.63);
		font-family: var(--serif);
		line-height: 1.85;
	}

	.dehydrate-control {
		border-color: rgba(244, 239, 228, 0.18);
	}

	.dehydrate-control input {
		accent-color: var(--ethanol-bright);
	}

	.sieve-visual {
		position: relative;
		display: grid;
		min-height: 390px;
		grid-template-columns: 1fr 150px 1fr;
		gap: 1.3rem;
		align-items: center;
		margin: 0;
	}

	.before,
	.after {
		position: relative;
		z-index: 2;
		display: flex;
		align-items: center;
		flex-direction: column;
	}

	.before span,
	.after span {
		color: rgba(244, 239, 228, 0.55);
		font-size: 0.68rem;
	}

	.before strong,
	.after strong {
		margin: 0.4rem 0 0.8rem;
		font-family: var(--serif);
		font-size: 1.8rem;
	}

	.mixture {
		--ethanol-stop: 50%;
		width: 120px;
		height: 170px;
		border: 2px solid rgba(244, 239, 228, 0.45);
		border-radius: 12px 12px 48px 48px;
		background: linear-gradient(
			to right,
			var(--ethanol) 0 var(--ethanol-stop),
			var(--water) var(--ethanol-stop) 100%
		);
		box-shadow: inset 10px 8px 20px rgba(255, 255, 255, 0.12);
		transition: background 400ms ease;
	}

	.sieve {
		position: relative;
		z-index: 3;
		display: grid;
		width: 138px;
		height: 210px;
		padding: 18px;
		grid-template-columns: repeat(4, 1fr);
		gap: 6px;
		border: 2px solid #c6b58f;
		border-radius: 22px;
		background: #7d6e52;
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.28);
	}

	.sieve i {
		border-radius: 50%;
		background: #a59168;
		transition: background 220ms ease;
	}

	.sieve i.captured {
		background: var(--water-bright);
		box-shadow: 0 0 7px rgba(114, 198, 203, 0.6);
	}

	.sieve span {
		position: absolute;
		top: 50%;
		left: 50%;
		padding: 0.5rem;
		border-radius: 50%;
		background: #63563e;
		font-family: var(--mono);
		font-size: 0.68rem;
		font-weight: 800;
		text-align: center;
		transform: translate(-50%, -50%);
	}

	.sieve-visual svg {
		position: absolute;
		top: 50%;
		left: 0;
		width: 100%;
		transform: translateY(-28%);
	}

	.sieve-visual path {
		fill: none;
		stroke: rgba(244, 239, 228, 0.24);
		stroke-width: 2;
	}

	.concept {
		padding-block: clamp(5rem, 10vw, 8rem);
	}

	.sandbox {
		padding-block: clamp(5rem, 10vw, 9rem);
		background: #dfd6c4;
	}

	.sandbox .eyebrow {
		color: #3f5947;
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
		grid-template-columns: 230px minmax(0, 1fr);
		gap: 1rem;
		align-items: start;
	}

	.sandbox-controls {
		padding: 0.85rem;
		border: 1px solid rgba(31, 40, 38, 0.17);
		border-radius: 16px;
		background: rgba(244, 239, 228, 0.35);
	}

	.sandbox-controls label {
		margin: 0 0 0.7rem;
		background: rgba(255, 255, 255, 0.25);
	}

	.challenge {
		padding: 0.8rem;
		border-left: 3px solid var(--ethanol);
		background: rgba(214, 107, 50, 0.06);
	}

	.challenge strong {
		font-family: var(--mono);
		font-size: 0.64rem;
	}

	.challenge p {
		margin: 0.4rem 0 0;
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
		background: #a9441d;
		color: #fff8ec;
		text-align: center;
	}

	.ending p {
		font-family: var(--mono);
		font-size: 0.68rem;
		letter-spacing: 0.08em;
	}

	.ending h2 {
		font-size: clamp(3rem, 7vw, 6.8rem);
	}

	.ending div div {
		display: flex;
		gap: 1.3rem;
		justify-content: center;
		margin-top: 2.5rem;
	}

	.ending a {
		padding: 0.75rem 1rem;
		border: 1px solid rgba(255, 248, 236, 0.65);
		border-radius: 999px;
		font-size: 0.72rem;
		font-weight: 800;
		text-decoration: none;
	}

	@keyframes scroll {
		50% {
			transform: translateY(8px);
			opacity: 0.35;
		}
	}

	@media (max-width: 1050px) {
		.scrolly {
			grid-template-columns: minmax(260px, 0.65fr) minmax(500px, 1.35fr);
			gap: 1.5rem;
		}

		.escape-grid {
			grid-template-columns: 1fr;
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

		.graphic {
			position: sticky;
			top: 0;
			z-index: 6;
			width: calc(100% - 16px);
			margin-inline: auto;
			padding-top: 0.35rem;
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
			box-shadow: 0 20px 65px rgba(36, 40, 34, 0.2);
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
			font-size: clamp(4rem, 21vw, 6.4rem);
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

		.reading-note .shell {
			grid-template-columns: 1fr;
			gap: 1rem;
		}

		.graphic {
			width: calc(100% - 8px);
		}

		.step {
			min-height: 96vh;
		}

		.step-card {
			padding: 1rem;
		}

		.sieve-visual {
			min-height: 300px;
			grid-template-columns: 1fr 88px 1fr;
			gap: 0.4rem;
		}

		.mixture {
			width: 75px;
			height: 120px;
		}

		.sieve {
			width: 82px;
			height: 150px;
			padding: 10px;
			gap: 3px;
		}

		.sieve span {
			font-size: 0.55rem;
		}

		.before strong,
		.after strong {
			font-size: 1.2rem;
		}

		.ending div div {
			align-items: center;
			flex-direction: column;
		}
	}

	@media (max-width: 850px) and (max-height: 650px) {
		.graphic {
			position: relative;
			top: auto;
		}

		.short-state {
			position: sticky;
			top: 0;
			z-index: 7;
			display: flex;
			min-height: 38px;
			padding: 0.4rem 0.7rem;
			gap: 0.65rem;
			align-items: center;
			justify-content: center;
			border-block: 1px solid var(--line);
			background: rgba(250, 247, 239, 0.96);
			font-family: var(--mono);
			font-size: 0.58rem;
		}

		.short-state button {
			margin-left: auto;
			padding: 0.35rem 0.55rem;
			border: 1px solid var(--ink);
			border-radius: 999px;
			background: var(--ink);
			color: var(--paper);
			cursor: pointer;
			font-weight: 800;
		}

		.graphic.short-open {
			position: fixed;
			inset: 6px;
			z-index: 120;
			display: grid;
			width: auto;
			margin: 0;
			overflow: auto;
			place-items: center;
			padding: 34px 4px 4px;
			background: rgba(244, 239, 228, 0.98);
		}

		.graphic.short-open .close-graphic {
			position: fixed;
			top: 12px;
			right: 12px;
			z-index: 121;
			display: grid;
			width: 36px;
			height: 36px;
			place-items: center;
			border: 1px solid var(--ink);
			border-radius: 50%;
			background: var(--paper);
			color: var(--ink);
			cursor: pointer;
			font-size: 1.2rem;
		}

		.step {
			min-height: auto;
			padding-block: 2rem;
		}
	}
</style>
