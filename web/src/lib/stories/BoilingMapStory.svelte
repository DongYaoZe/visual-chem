<script lang="ts">
	import { resolve } from '$app/paths';
	import {
		celsiusToKelvin,
		kelvinToCelsius,
		pressureAtAltitudePa,
		saturationPressurePa,
		saturationTemperatureK,
		waterFrame
	} from '$lib/chem';
	import ConceptCheck from '$lib/components/ConceptCheck.svelte';
	import Formula from '$lib/components/Math.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import SiteHeader from '$lib/components/SiteHeader.svelte';
	import StoryStage from '$lib/components/StoryStage.svelte';
	import WaterTriView from '$lib/components/WaterTriView.svelte';
	import {
		getBoilingMapContent,
		getSiteContent,
		type InlineText,
		type LocaleCode
	} from '$lib/content';
	import {
		ALTITUDE_LANDMARKS,
		FREEZE_DRY_WAYPOINTS,
		boilingSceneDefinition,
		freezeDryState
	} from './boiling-map-scenes';
	import { scrolly } from './scrolly';

	interface Props {
		locale?: LocaleCode;
	}

	let { locale = 'zh-CN' }: Props = $props();
	let site = $derived(getSiteContent(locale));
	let story = $derived(getBoilingMapContent(locale));

	let activeIndex = $state(0);
	let hookPrediction = $state<'hotter' | 'same' | 'cooler' | null>(null);
	let curveTemperatureC = $state(75);
	let boilingPressureKPa = $state(101.325);
	let linearizedView = $state(false);
	let altitudeM = $state(3650);
	let freezeDryProgress = $state(0);
	let cookerPressureKPa = $state(101.325);
	let labTemperatureC = $state(25);
	// Sandbox pressure lives on a log10(Pa) slider: 2 → 100 Pa, 7 → 10 MPa.
	let labPressureExponent = $state(5.005);

	let activeScene = $derived(boilingSceneDefinition(story.scenes[activeIndex].id));
	let activeSceneId = $derived(activeScene.id);
	let freezeDry = $derived(freezeDryState(freezeDryProgress));

	// Which (T, p) the stage shows: scene defaults, overridden by whichever
	// control the active scene hands to the reader.
	let visualTemperatureC = $derived.by(() => {
		switch (activeSceneId) {
			case 'draw-the-curve':
				return curveTemperatureC;
			case 'boiling-defined':
				return kelvinToCelsius(saturationTemperatureK(boilingPressureKPa * 1000));
			case 'altitude-travel':
				return kelvinToCelsius(saturationTemperatureK(pressureAtAltitudePa(altitudeM)));
			case 'freeze-dry-detour':
				return freezeDry.temperatureC;
			case 'pressure-cooker':
				return kelvinToCelsius(saturationTemperatureK(cookerPressureKPa * 1000));
			default:
				return activeScene.temperatureC;
		}
	});
	let visualPressurePa = $derived.by(() => {
		switch (activeSceneId) {
			case 'draw-the-curve':
				return saturationPressurePa(celsiusToKelvin(curveTemperatureC));
			case 'boiling-defined':
				return boilingPressureKPa * 1000;
			case 'altitude-travel':
				return pressureAtAltitudePa(altitudeM);
			case 'freeze-dry-detour':
				return freezeDry.pressurePa;
			case 'pressure-cooker':
				return cookerPressureKPa * 1000;
			default:
				return activeScene.pressurePa;
		}
	});
	let visualLinearized = $derived(
		activeSceneId === 'straighten-the-curve' ? linearizedView : activeScene.linearized
	);
	let visualAltitude = $derived(
		activeSceneId === 'altitude-travel' ? altitudeM : activeSceneId === 'hook' ? 3650 : null
	);
	let visualFrame = $derived(
		waterFrame({ temperatureC: visualTemperatureC, pressurePa: visualPressurePa })
	);
	let visualPhaseName = $derived(story.triView.phaseNames[visualFrame.phase]);
	let displayPressureKPa = $derived(
		visualPressurePa >= 100
			? (visualPressurePa / 1000).toFixed(visualPressurePa >= 1e6 ? 0 : 1)
			: (visualPressurePa / 1000).toFixed(3)
	);

	let enthalpyReadout = $derived(
		waterFrame({ temperatureC: 100, pressurePa: 101325 }).vaporizationEnthalpyKJPerMol
	);
	let progress = $derived(((activeIndex + 1) / story.scenes.length) * 100);
	let catalogHref = $derived(locale === 'en' ? resolve('/en/') : resolve('/'));

	// Snap the altitude slider to the nearest landmark when close enough
	// that the label should claim it.
	let nearestLandmark = $derived(
		ALTITUDE_LANDMARKS.find((landmark) => Math.abs(landmark.altitudeM - altitudeM) < 120) ?? null
	);

	let labFrame = $derived(
		waterFrame({ temperatureC: labTemperatureC, pressurePa: 10 ** labPressureExponent })
	);

	// The hero backdrop sketches the same computed saturation curve the
	// story runs, in a log-pressure projection, with Lhasa's ambient line
	// crossing it at the hook's boiling point.
	const heroProject = (temperatureK: number, pressurePa: number) => ({
		x: 20 + ((temperatureK - 250) / (700 - 250)) * 940,
		y: 280 - ((Math.log10(pressurePa) - 2) / (7.5 - 2)) * 250
	});
	const heroPath = Array.from({ length: 81 }, (_, index) => {
		const temperatureK = 273.16 + ((647.096 - 273.16) * index) / 80;
		const point = heroProject(temperatureK, saturationPressurePa(Math.max(273.15, temperatureK)));
		return `${index === 0 ? 'M' : 'L'}${point.x.toFixed(1)},${point.y.toFixed(1)}`;
	}).join(' ');
	const heroLhasaPa = pressureAtAltitudePa(3650);
	const heroLhasa = heroProject(saturationTemperatureK(heroLhasaPa), heroLhasaPa);
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
				<path d={heroPath} />
				<line
					class="ambient"
					x1="20"
					x2="960"
					y1={heroLhasa.y.toFixed(1)}
					y2={heroLhasa.y.toFixed(1)}
				/>
				<circle cx={heroLhasa.x.toFixed(1)} cy={heroLhasa.y.toFixed(1)} r="10" />
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
		<StoryStage
			dialogAriaLabel={story.stage.dialogAriaLabel}
			closeAriaLabel={story.stage.closeGraphicAriaLabel}
			openButtonLabel={story.stage.openGraphicButton}
			statusAriaLabel={story.stage.shortStateAriaLabel}
		>
			{#snippet stage()}
				<WaterTriView
					temperatureC={visualTemperatureC}
					pressurePa={visualPressurePa}
					focus={activeScene.focus}
					reveal={activeScene.reveal}
					showSolid={activeScene.showSolid}
					showCritical={activeScene.showCritical}
					linearized={visualLinearized}
					showPressureLine={activeScene.showPressureLine}
					routePoints={activeSceneId === 'freeze-dry-detour' ? FREEZE_DRY_WAYPOINTS : []}
					altitudeM={visualAltitude}
					label={story.stage.triViewAriaLabel}
					content={story.triView}
				/>
			{/snippet}
			{#snippet status()}
				<span
					>{story.stage.shortState.temperature({
						temperatureC: visualTemperatureC.toFixed(1)
					})}</span
				>
				<span>{story.stage.shortState.pressure({ pressureKPa: displayPressureKPa })}</span>
				<span>{story.stage.shortState.phase({ phase: visualPhaseName })}</span>
			{/snippet}
		</StoryStage>

		<div class="steps" use:scrolly={{ onActive: (index) => (activeIndex = index) }}>
			{#each story.scenes as scene, index (scene.id)}
				<article
					class="step"
					class:active={activeIndex === index}
					class:symbol-step={boilingSceneDefinition(scene.id).focus === 'symbol'}
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
										aria-pressed={hookPrediction === 'hotter'}
										class:selected={hookPrediction === 'hotter'}
										onclick={() => (hookPrediction = 'hotter')}
										>{story.interactions.hook.choices[0].label}</button
									>
									<button
										type="button"
										aria-pressed={hookPrediction === 'same'}
										class:selected={hookPrediction === 'same'}
										onclick={() => (hookPrediction = 'same')}
										>{story.interactions.hook.choices[1].label}</button
									>
									<button
										type="button"
										aria-pressed={hookPrediction === 'cooler'}
										class:selected={hookPrediction === 'cooler'}
										onclick={() => (hookPrediction = 'cooler')}
										>{story.interactions.hook.choices[2].label}</button
									>
								</div>
							</div>
							{#if hookPrediction}
								<p class="evidence">{story.interactions.hook.evidence}</p>
							{/if}
						{/if}

						{#if scene.id === 'draw-the-curve'}
							<label class="range-control">
								<span>{story.interactions.drawTheCurve.controlLabel}</span>
								<strong>{curveTemperatureC.toFixed(0)} °C</strong>
								<input
									type="range"
									min="1"
									max="370"
									step="1"
									aria-label={story.interactions.drawTheCurve.sliderAriaLabel}
									bind:value={curveTemperatureC}
								/>
								<small
									>{story.interactions.drawTheCurve.readout({
										temperatureC: curveTemperatureC.toFixed(0),
										pressureKPa: (
											saturationPressurePa(celsiusToKelvin(curveTemperatureC)) / 1000
										).toFixed(curveTemperatureC < 46 ? 2 : 1)
									})}</small
								>
							</label>
						{/if}

						{#if scene.id === 'boiling-defined'}
							<label class="range-control">
								<span>{story.interactions.boilingDefined.controlLabel}</span>
								<strong>{boilingPressureKPa.toFixed(1)} kPa</strong>
								<input
									type="range"
									min="5"
									max="250"
									step="0.5"
									aria-label={story.interactions.boilingDefined.sliderAriaLabel}
									bind:value={boilingPressureKPa}
								/>
								<span class="slider-scale" aria-hidden="true">
									<span>{story.interactions.boilingDefined.scale.start}</span>
									<span>{story.interactions.boilingDefined.scale.end}</span>
								</span>
								<small
									>{story.interactions.boilingDefined.readout({
										pressureKPa: boilingPressureKPa.toFixed(1),
										temperatureC: kelvinToCelsius(
											saturationTemperatureK(boilingPressureKPa * 1000)
										).toFixed(1)
									})}</small
								>
							</label>
						{/if}

						{#if scene.id === 'straighten-the-curve'}
							<div class="inline-control view-toggle">
								<span class="toggle-label">{story.interactions.straighten.toggleLabel}</span>
								<button
									type="button"
									class:selected={!linearizedView}
									aria-pressed={!linearizedView}
									onclick={() => (linearizedView = false)}
									>{story.interactions.straighten.mapButton}</button
								>
								<button
									type="button"
									class:selected={linearizedView}
									aria-pressed={linearizedView}
									onclick={() => (linearizedView = true)}
									>{story.interactions.straighten.linearizedButton}</button
								>
							</div>
							{#if linearizedView && enthalpyReadout !== null}
								<p class="evidence">
									{story.interactions.straighten.enthalpyReadout({
										enthalpyKJ: enthalpyReadout.toFixed(1)
									})}
								</p>
							{/if}
						{/if}

						{#if scene.id === 'altitude-travel'}
							<label class="range-control">
								<span>{story.interactions.altitude.controlLabel}</span>
								<strong
									>{nearestLandmark
										? story.interactions.altitude.landmarks[nearestLandmark.id]
										: `${altitudeM} m`}</strong
								>
								<input
									type="range"
									min="0"
									max="8849"
									step="1"
									list="altitude-landmarks"
									aria-label={story.interactions.altitude.sliderAriaLabel}
									bind:value={altitudeM}
								/>
								<datalist id="altitude-landmarks">
									{#each ALTITUDE_LANDMARKS as landmark (landmark.id)}
										<option value={landmark.altitudeM}></option>
									{/each}
								</datalist>
								<small
									>{story.interactions.altitude.readout({
										altitudeM,
										pressureKPa: (pressureAtAltitudePa(altitudeM) / 1000).toFixed(1),
										temperatureC: kelvinToCelsius(
											saturationTemperatureK(pressureAtAltitudePa(altitudeM))
										).toFixed(1)
									})}</small
								>
							</label>
						{/if}

						{#if scene.id === 'freeze-dry-detour'}
							<label class="range-control">
								<span>{story.interactions.freezeDry.controlLabel}</span>
								<strong>{story.interactions.freezeDry.stages[freezeDry.stageIndex]}</strong>
								<input
									type="range"
									min="0"
									max="1"
									step="0.005"
									aria-label={story.interactions.freezeDry.sliderAriaLabel}
									bind:value={freezeDryProgress}
								/>
								<small
									>{story.interactions.freezeDry.readout({
										temperatureC: freezeDry.temperatureC.toFixed(1),
										pressureKPa:
											freezeDry.pressurePa >= 1000
												? (freezeDry.pressurePa / 1000).toFixed(1)
												: (freezeDry.pressurePa / 1000).toFixed(3)
									})}</small
								>
							</label>
						{/if}

						{#if scene.id === 'pressure-cooker'}
							<label class="range-control">
								<span>{story.interactions.pressureCooker.controlLabel}</span>
								<strong>{cookerPressureKPa.toFixed(0)} kPa</strong>
								<input
									type="range"
									min="101.325"
									max="250"
									step="0.5"
									aria-label={story.interactions.pressureCooker.sliderAriaLabel}
									bind:value={cookerPressureKPa}
								/>
								<span class="slider-scale" aria-hidden="true">
									<span>{story.interactions.pressureCooker.scale.start}</span>
									<span>{story.interactions.pressureCooker.scale.end}</span>
								</span>
								<small
									>{story.interactions.pressureCooker.readout({
										pressureKPa: cookerPressureKPa.toFixed(0),
										temperatureC: kelvinToCelsius(
											saturationTemperatureK(cookerPressureKPa * 1000)
										).toFixed(1)
									})}</small
								>
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
				<h2>{story.edge.heading.lines[0]}<br />{story.edge.heading.lines[1]}</h2>
				<p>{story.edge.body}</p>
			</div>
			<figure class="edge-facts">
				<figcaption class="visually-hidden">{story.edge.figureCaption}</figcaption>
				{#each story.edge.criticalFacts as fact (fact.label)}
					<div>
						<span>{fact.label}</span>
						<strong>{fact.value}</strong>
					</div>
				{/each}
				<p class="edge-caption" aria-hidden="true">{story.edge.figureCaption}</p>
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
					<span>{story.sandbox.controls.temperature}</span><strong
						>{labTemperatureC.toFixed(0)} °C</strong
					>
					<input
						type="range"
						min="-60"
						max="400"
						step="1"
						aria-label={story.sandbox.controls.temperatureAriaLabel}
						bind:value={labTemperatureC}
					/>
				</label>
				<label>
					<span>{story.sandbox.controls.pressure}</span><strong
						>{labFrame.pressurePa >= 1e6
							? `${(labFrame.pressurePa / 1e6).toFixed(1)} MPa`
							: labFrame.pressurePa >= 1000
								? `${(labFrame.pressurePa / 1000).toFixed(1)} kPa`
								: `${labFrame.pressurePa.toFixed(0)} Pa`}</strong
					>
					<input
						type="range"
						min="2"
						max="7"
						step="0.005"
						aria-label={story.sandbox.controls.pressureAriaLabel}
						bind:value={labPressureExponent}
					/>
					<span class="slider-scale" aria-hidden="true">
						<span>{story.sandbox.controls.pressureScale.start}</span>
						<span>{story.sandbox.controls.pressureScale.end}</span>
					</span>
				</label>
				<div class="challenge">
					<strong>{story.sandbox.challengeLabel}</strong>
					<p>{story.sandbox.challenge}</p>
				</div>
			</div>
			<WaterTriView
				temperatureC={labTemperatureC}
				pressurePa={labFrame.pressurePa}
				showSolid
				showCritical
				label={story.sandbox.triViewAriaLabel}
				content={story.triView}
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
		background: var(--water);
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
		color: var(--water);
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

	.hero-curve path {
		fill: none;
		stroke: var(--water);
		stroke-width: 4;
	}

	.hero-curve .ambient {
		stroke: var(--acid);
		stroke-dasharray: 4 7;
		stroke-width: 2;
	}

	.hero-curve circle {
		fill: var(--acid);
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
		color: var(--water-bright);
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

	.prediction button.selected,
	.inline-control button.selected {
		border-color: var(--water);
		background: var(--water);
		color: white;
	}

	.inline-control {
		align-items: center;
		margin-top: 0.8rem;
	}

	.toggle-label {
		color: var(--ink-muted);
		font-family: var(--mono);
		font-size: 0.62rem;
		font-weight: 800;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.evidence {
		margin: 0.75rem 0 0;
		padding-left: 0.7rem;
		border-left: 2px solid var(--water);
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
		accent-color: var(--water);
	}

	.range-control small {
		grid-column: 1 / -1;
		color: var(--ink-muted);
		font-family: var(--mono);
	}

	/* Endpoint captions under a slider track: what the ends actually claim. */
	.slider-scale {
		display: flex;
		grid-column: 1 / -1;
		justify-content: space-between;
		margin-top: -0.2rem;
		color: var(--ink-muted);
		font-family: var(--mono);
		font-size: 0.62rem;
	}

	.edge {
		padding-block: clamp(6rem, 12vw, 10rem);
		background: #1f2826;
		color: var(--paper);
	}

	.edge-grid {
		display: grid;
		grid-template-columns: 1.15fr 0.85fr;
		gap: 5rem;
		align-items: center;
	}

	.edge .eyebrow {
		color: var(--water-bright);
	}

	.edge h2,
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

	.edge-copy > p:not(.eyebrow) {
		color: rgba(244, 239, 228, 0.63);
		font-family: var(--serif);
		line-height: 1.85;
	}

	.edge-facts {
		display: grid;
		gap: 1rem;
		margin: 0;
	}

	.edge-facts div {
		display: flex;
		padding: 1rem 1.2rem;
		align-items: baseline;
		justify-content: space-between;
		border: 1px solid rgba(244, 239, 228, 0.18);
		border-radius: 12px;
	}

	.edge-facts span {
		color: rgba(244, 239, 228, 0.68);
		font-size: 0.68rem;
	}

	.edge-facts strong {
		font-family: var(--mono);
		font-size: 0.95rem;
	}

	.edge-caption {
		margin: 0.4rem 0 0;
		color: rgba(244, 239, 228, 0.68);
		font-size: 0.62rem;
		line-height: 1.5;
	}

	.concept {
		padding-block: clamp(5rem, 10vw, 8rem);
	}

	.sandbox {
		padding-block: clamp(5rem, 10vw, 9rem);
		background: #ccd8d2;
	}

	.sandbox .eyebrow {
		color: #2c5a63;
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
		border-left: 3px solid var(--water);
		background: rgba(32, 127, 140, 0.06);
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
		background: #16505c;
		color: #eefaf8;
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
		border: 1px solid rgba(238, 250, 248, 0.65);
		border-radius: 999px;
		color: inherit;
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

		.edge-grid {
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
		.step {
			min-height: auto;
			padding-block: 2rem;
		}
	}
</style>
