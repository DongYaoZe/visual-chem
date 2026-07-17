<script lang="ts">
	import { resolve } from '$app/paths';
	import {
		kno3SaturatedMolality,
		KNO3_MOLAR_MASS_G_PER_MOL,
		massesToComposition,
		saltFrame,
		saltIsotherm,
		ternaryToXY,
		type SaltPotState,
		type TernaryComposition
	} from '$lib/chem';
	import ConceptCheck from '$lib/components/ConceptCheck.svelte';
	import Formula from '$lib/components/Math.svelte';
	import SaltTriView from '$lib/components/SaltTriView.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import SiteHeader from '$lib/components/SiteHeader.svelte';
	import StoryStage from '$lib/components/StoryStage.svelte';
	import {
		getSaltSplitContent,
		getSiteContent,
		type InlineText,
		type LocaleCode
	} from '$lib/content';
	import {
		COLD_TEMPERATURE_C,
		EVAPORATION_MAX_G,
		HOOK_POT,
		coldHookPot,
		hookMotherLiquor,
		saltSceneDefinition
	} from './salt-split-scenes';
	import { scrolly } from './scrolly';

	interface Props {
		locale?: LocaleCode;
	}

	let { locale = 'zh-CN' }: Props = $props();
	let site = $derived(getSiteContent(locale));
	let story = $derived(getSaltSplitContent(locale));

	let activeIndex = $state(0);
	let hookPrediction = $state<'kno3' | 'nano3' | 'both' | null>(null);
	let curvesTemperatureC = $state(25);
	let sharedNano3G = $state(30);
	let mapKno3G = $state(100);
	let mapNano3G = $state(100);
	let coolingTemperatureC = $state(100);
	let filtered = $state(false);
	let evaporatedG = $state(0);
	let honestScale = $state(1);

	let activeScene = $derived(saltSceneDefinition(story.scenes[activeIndex].id));
	let activeSceneId = $derived(activeScene.id);

	const coldPot = coldHookPot();
	const liquorCold = hookMotherLiquor(COLD_TEMPERATURE_C);
	const liquorHot = hookMotherLiquor(100);

	// Which pot the stage shows: scene defaults, overridden by whichever
	// control the active scene hands to the reader.
	let visualPot = $derived.by<SaltPotState>(() => {
		switch (activeSceneId) {
			case 'hook':
				return hookPrediction ? coldPot : HOOK_POT;
			case 'two-curves':
				return { ...HOOK_POT, temperatureC: curvesTemperatureC };
			case 'shared-water':
				return { ...activeScene.pot, nano3G: sharedNano3G };
			case 'triangle-map':
			case 'isotherm':
				return { ...activeScene.pot, kno3G: mapKno3G, nano3G: mapNano3G };
			case 'cooling':
				return { ...HOOK_POT, temperatureC: coolingTemperatureC };
			case 'filter-jump':
				return filtered ? liquorCold : coldPot;
			case 'evaporate':
				return { ...liquorHot, waterG: liquorHot.waterG - evaporatedG };
			default:
				return activeScene.pot;
		}
	});
	let visualScale = $derived(
		activeSceneId === 'honest-map' ? honestScale : activeScene.interactionScale
	);
	let visualFrame = $derived(saltFrame({ ...visualPot, interactionScale: visualScale }));
	let visualRegionName = $derived(story.triView.regionNames[visualFrame.region]);
	let solidsSummary = $derived.by(() => {
		const solids = visualFrame.equilibrium.solids;
		const parts: string[] = [];
		if (solids.kno3G > 0.05)
			parts.push(story.triView.pot.kno3CrystalsLabel({ grams: solids.kno3G.toFixed(1) }));
		if (solids.nano3G > 0.05)
			parts.push(story.triView.pot.nano3CrystalsLabel({ grams: solids.nano3G.toFixed(1) }));
		return parts.length > 0 ? parts.join(' · ') : visualRegionName;
	});

	let visualTrajectory = $derived.by<readonly TernaryComposition[]>(() => {
		if (activeSceneId === 'filter-jump' && filtered) {
			return [massesToComposition(coldPot), massesToComposition(liquorCold)];
		}
		if (activeSceneId === 'evaporate' && evaporatedG > 0.5) {
			return [massesToComposition(liquorHot), massesToComposition(visualPot)];
		}
		return [];
	});

	// Scene 02 teaches the ideal common-ion squeeze; capacities per 100 g water.
	const soloCapacityG = saltSceneDefinition('shared-water').pot.kno3G;
	let sharedCapacityG = $derived(
		kno3SaturatedMolality(COLD_TEMPERATURE_C, (sharedNano3G * 10) / 84.995, 0) *
			(KNO3_MOLAR_MASS_G_PER_MOL / 10)
	);

	let coolingFrame = $derived(
		saltFrame({ ...HOOK_POT, temperatureC: coolingTemperatureC, interactionScale: 1 })
	);
	let filterCrystalsG = $derived(
		saltFrame({ ...coldPot, interactionScale: 1 }).equilibrium.solids.kno3G
	);
	let evaporateFrame = $derived(
		saltFrame({ ...liquorHot, waterG: liquorHot.waterG - evaporatedG, interactionScale: 1 })
	);

	let progress = $derived(((activeIndex + 1) / story.scenes.length) * 100);
	let catalogHref = $derived(locale === 'en' ? resolve('/en/') : resolve('/'));

	// Sandbox: the full act with free operations and a visible track.
	const LAB_START: SaltPotState = { ...HOOK_POT };
	let labPot = $state<SaltPotState>({ ...HOOK_POT });
	let labHarvestKno3 = $state(0);
	let labHarvestNano3 = $state(0);
	let labEvaporated = $state(0);
	let labTrail = $state<TernaryComposition[]>([massesToComposition(HOOK_POT)]);
	let labFrame = $derived(saltFrame({ ...labPot, interactionScale: 1 }));

	function labTrack() {
		const next = massesToComposition(labPot);
		labTrail = [...labTrail.slice(-39), next];
	}
	function labEvaporate() {
		labPot = { ...labPot, waterG: Math.max(2, labPot.waterG - 10) };
		labEvaporated += 10;
		labTrack();
	}
	function labAddWater() {
		labPot = { ...labPot, waterG: Math.min(300, labPot.waterG + 10) };
		labTrack();
	}
	function labFilter() {
		const split = labFrame.equilibrium;
		labHarvestKno3 += split.solids.kno3G;
		labHarvestNano3 += split.solids.nano3G;
		labPot = {
			temperatureC: labPot.temperatureC,
			waterG: split.liquid.waterG,
			kno3G: split.liquid.kno3G,
			nano3G: split.liquid.nano3G
		};
		labTrack();
	}
	function labReset() {
		labPot = { ...LAB_START };
		labHarvestKno3 = 0;
		labHarvestNano3 = 0;
		labEvaporated = 0;
		labTrail = [massesToComposition(LAB_START)];
	}

	// The hero backdrop sketches the same computed 25 °C isotherm the story
	// runs, flattened into the wide banner, with the classic pot marked on it.
	const heroProject = (composition: TernaryComposition) => {
		const unit = ternaryToXY(composition);
		return { x: 30 + unit.x * 940, y: 290 - (unit.y / 0.866) * 270 };
	};
	const heroIsotherm = saltIsotherm(25, 1, 40);
	const heroBranchPath = (points: readonly TernaryComposition[]) =>
		points
			.map((point, index) => {
				const { x, y } = heroProject(point);
				return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
			})
			.join(' ');
	const heroK = heroProject({ waterFrac: 0, kno3Frac: 1, nano3Frac: 0 });
	const heroN = heroProject({ waterFrac: 0, kno3Frac: 0, nano3Frac: 1 });
	const heroW = heroProject({ waterFrac: 1, kno3Frac: 0, nano3Frac: 0 });
	const heroEutonic = heroProject(heroIsotherm.eutonic);
	const heroPot = heroProject(massesToComposition(HOOK_POT));
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
			<svg viewBox="0 0 1000 320">
				<path
					class="edge-line"
					d={`M${heroK.x},${heroK.y} L${heroW.x},${heroW.y} L${heroN.x},${heroN.y} Z`}
				/>
				<path class="branch-k" d={heroBranchPath(heroIsotherm.kno3Branch)} />
				<path class="branch-n" d={heroBranchPath(heroIsotherm.nano3Branch)} />
				<circle class="eutonic" cx={heroEutonic.x.toFixed(1)} cy={heroEutonic.y.toFixed(1)} r="9" />
				<circle class="pot" cx={heroPot.x.toFixed(1)} cy={heroPot.y.toFixed(1)} r="10" />
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
				<SaltTriView
					temperatureC={visualPot.temperatureC}
					waterG={visualPot.waterG}
					kno3G={visualPot.kno3G}
					nano3G={visualPot.nano3G}
					interactionScale={visualScale}
					focus={activeScene.focus ?? 'all'}
					diagramMode={activeScene.diagramMode}
					showIsotherm={activeScene.showIsotherm}
					showRegions={activeScene.showRegions}
					showEutonic={activeScene.showEutonic}
					showTieLine={activeScene.showTieLine}
					showExperimentPoints={activeScene.showExperimentPoints}
					trajectory={visualTrajectory}
					label={story.stage.triViewAriaLabel}
					content={story.triView}
				/>
			{/snippet}
			{#snippet status()}
				<span
					>{story.stage.shortState.temperature({
						temperatureC: visualPot.temperatureC.toFixed(0)
					})}</span
				>
				<span
					>{story.stage.shortState.liquid({
						kno3G: visualFrame.equilibrium.liquid.kno3G.toFixed(0),
						nano3G: visualFrame.equilibrium.liquid.nano3G.toFixed(0)
					})}</span
				>
				<span>{story.stage.shortState.solids({ summary: solidsSummary })}</span>
			{/snippet}
		</StoryStage>

		<div class="steps" use:scrolly={{ onActive: (index) => (activeIndex = index) }}>
			{#each story.scenes as scene, index (scene.id)}
				<article
					class="step"
					class:active={activeIndex === index}
					class:symbol-step={saltSceneDefinition(scene.id).focus === 'diagram'}
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
										aria-pressed={hookPrediction === 'kno3'}
										class:selected={hookPrediction === 'kno3'}
										onclick={() => (hookPrediction = 'kno3')}
										>{story.interactions.hook.choices[0].label}</button
									>
									<button
										type="button"
										aria-pressed={hookPrediction === 'nano3'}
										class:selected={hookPrediction === 'nano3'}
										onclick={() => (hookPrediction = 'nano3')}
										>{story.interactions.hook.choices[1].label}</button
									>
									<button
										type="button"
										aria-pressed={hookPrediction === 'both'}
										class:selected={hookPrediction === 'both'}
										onclick={() => (hookPrediction = 'both')}
										>{story.interactions.hook.choices[2].label}</button
									>
								</div>
							</div>
							{#if hookPrediction}
								<p class="evidence">{story.interactions.hook.evidence}</p>
							{/if}
						{/if}

						{#if scene.id === 'two-curves'}
							<label class="range-control">
								<span>{story.interactions.twoCurves.controlLabel}</span>
								<strong>{curvesTemperatureC.toFixed(0)} °C</strong>
								<input
									type="range"
									min="0"
									max="100"
									step="1"
									aria-label={story.interactions.twoCurves.sliderAriaLabel}
									bind:value={curvesTemperatureC}
								/>
								<small
									>{story.interactions.twoCurves.readout({
										temperatureC: curvesTemperatureC.toFixed(0),
										kno3Solubility: visualFrame.kno3SolubilityGPer100g.toFixed(1),
										nano3Solubility: visualFrame.nano3SolubilityGPer100g.toFixed(1)
									})}</small
								>
							</label>
						{/if}

						{#if scene.id === 'shared-water'}
							<label class="range-control">
								<span>{story.interactions.sharedWater.controlLabel}</span>
								<strong>{sharedNano3G.toFixed(0)} g</strong>
								<input
									type="range"
									min="0"
									max="80"
									step="1"
									aria-label={story.interactions.sharedWater.sliderAriaLabel}
									bind:value={sharedNano3G}
								/>
								<span class="slider-scale" aria-hidden="true">
									<span>{story.interactions.sharedWater.scale.start}</span>
									<span>{story.interactions.sharedWater.scale.end}</span>
								</span>
								<small
									>{story.interactions.sharedWater.readout({
										nano3G: sharedNano3G.toFixed(0),
										kno3CapacityG: sharedCapacityG.toFixed(1),
										soloCapacityG: soloCapacityG.toFixed(1)
									})}</small
								>
							</label>
						{/if}

						{#if scene.id === 'triangle-map' || scene.id === 'isotherm'}
							<label class="range-control">
								<span>{story.interactions.triangleMap.kno3ControlLabel}</span>
								<strong>{mapKno3G.toFixed(0)} g</strong>
								<input
									type="range"
									min="0"
									max="150"
									step="1"
									aria-label={story.interactions.triangleMap.kno3SliderAriaLabel}
									bind:value={mapKno3G}
								/>
							</label>
							<label class="range-control">
								<span>{story.interactions.triangleMap.nano3ControlLabel}</span>
								<strong>{mapNano3G.toFixed(0)} g</strong>
								<input
									type="range"
									min="0"
									max="150"
									step="1"
									aria-label={story.interactions.triangleMap.nano3SliderAriaLabel}
									bind:value={mapNano3G}
								/>
								<small
									>{story.interactions.triangleMap.readout({
										waterPct: ((visualFrame.composition?.waterFrac ?? 0) * 100).toFixed(0),
										kno3Pct: ((visualFrame.composition?.kno3Frac ?? 0) * 100).toFixed(0),
										nano3Pct: ((visualFrame.composition?.nano3Frac ?? 0) * 100).toFixed(0)
									})}</small
								>
							</label>
							{#if scene.id === 'isotherm'}
								<p class="evidence">
									{story.interactions.isotherm.regionReadout({ region: visualRegionName })}
									{#if visualFrame.equilibrium.solids.kno3G > 0.05 || visualFrame.equilibrium.solids.nano3G > 0.05}
										· {story.interactions.isotherm.crystalReadout({ summary: solidsSummary })}
									{/if}
								</p>
							{/if}
						{/if}

						{#if scene.id === 'cooling'}
							<label class="range-control">
								<span>{story.interactions.cooling.controlLabel}</span>
								<strong>{coolingTemperatureC.toFixed(0)} °C</strong>
								<input
									type="range"
									min="25"
									max="100"
									step="1"
									aria-label={story.interactions.cooling.sliderAriaLabel}
									bind:value={coolingTemperatureC}
								/>
								<small
									>{story.interactions.cooling.readout({
										temperatureC: coolingTemperatureC.toFixed(0),
										kno3CrystalsG: coolingFrame.equilibrium.solids.kno3G.toFixed(1)
									})}</small
								>
							</label>
						{/if}

						{#if scene.id === 'filter-jump'}
							<div class="inline-control">
								<button type="button" class:selected={filtered} onclick={() => (filtered = true)}
									>{story.interactions.filterJump.filterButton}</button
								>
								<button type="button" onclick={() => (filtered = false)}
									>{story.interactions.filterJump.resetButton}</button
								>
							</div>
							{#if filtered}
								<p class="evidence">
									{story.interactions.filterJump.harvestOutput({
										crystalsG: filterCrystalsG.toFixed(1)
									})}
								</p>
							{:else}
								<p class="evidence">{story.interactions.filterJump.waitingHint}</p>
							{/if}
						{/if}

						{#if scene.id === 'evaporate'}
							<label class="range-control">
								<span>{story.interactions.evaporate.controlLabel}</span>
								<strong>{evaporatedG.toFixed(0)} g</strong>
								<input
									type="range"
									min="0"
									max={EVAPORATION_MAX_G}
									step="1"
									aria-label={story.interactions.evaporate.sliderAriaLabel}
									bind:value={evaporatedG}
								/>
								<small
									>{story.interactions.evaporate.readout({
										waterRemovedG: evaporatedG.toFixed(0),
										nano3CrystalsG: evaporateFrame.equilibrium.solids.nano3G.toFixed(1)
									})}</small
								>
							</label>
						{/if}

						{#if scene.id === 'honest-map'}
							<div class="inline-control view-toggle">
								<span class="toggle-label">{story.interactions.honestMap.toggleLabel}</span>
								<button
									type="button"
									class:selected={honestScale === 0}
									aria-pressed={honestScale === 0}
									onclick={() => (honestScale = 0)}
									>{story.interactions.honestMap.idealButton}</button
								>
								<button
									type="button"
									class:selected={honestScale === 1}
									aria-pressed={honestScale === 1}
									onclick={() => (honestScale = 1)}
									>{story.interactions.honestMap.calibratedButton}</button
								>
							</div>
							<p class="evidence">
								{honestScale === 0
									? story.interactions.honestMap.verdictIdeal
									: story.interactions.honestMap.verdictCalibrated}
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
				<h2>{story.edge.heading.lines[0]}<br />{story.edge.heading.lines[1]}</h2>
				<p>{story.edge.body}</p>
			</div>
			<figure class="edge-facts">
				<figcaption class="visually-hidden">{story.edge.figureCaption}</figcaption>
				{#each story.edge.industryFacts as fact (fact.label)}
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
						>{labPot.temperatureC.toFixed(0)} °C</strong
					>
					<input
						type="range"
						min="0"
						max="100"
						step="1"
						aria-label={story.sandbox.controls.temperatureAriaLabel}
						bind:value={labPot.temperatureC}
					/>
				</label>
				<div class="op-buttons">
					<button
						type="button"
						aria-label={story.sandbox.controls.evaporateAriaLabel}
						onclick={labEvaporate}>{story.sandbox.controls.evaporate}</button
					>
					<button
						type="button"
						aria-label={story.sandbox.controls.addWaterAriaLabel}
						onclick={labAddWater}>{story.sandbox.controls.addWater}</button
					>
					<button type="button" onclick={labFilter}>{story.sandbox.controls.filterButton}</button>
					<button type="button" class="reset" onclick={labReset}
						>{story.sandbox.controls.resetButton}</button
					>
				</div>
				<div class="harvest" aria-live="polite">
					<strong>{story.sandbox.harvest.label}</strong>
					<span>{story.sandbox.harvest.kno3({ grams: labHarvestKno3.toFixed(1) })}</span>
					<span>{story.sandbox.harvest.nano3({ grams: labHarvestNano3.toFixed(1) })}</span>
					<span>{story.sandbox.harvest.water({ grams: labEvaporated.toFixed(0) })}</span>
				</div>
				<div class="challenge">
					<strong>{story.sandbox.challengeLabel}</strong>
					<p>{story.sandbox.challenge}</p>
				</div>
			</div>
			<SaltTriView
				temperatureC={labPot.temperatureC}
				waterG={labPot.waterG}
				kno3G={labPot.kno3G}
				nano3G={labPot.nano3G}
				showIsotherm
				showRegions
				showEutonic
				showTieLine
				trajectory={labTrail}
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
		background: #5f6398;
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
		color: #5f6398;
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
		right: -4%;
		bottom: 2%;
		width: 64%;
		opacity: 0.3;
	}

	.hero-curve svg {
		display: block;
		width: 100%;
	}

	.hero-curve .edge-line {
		fill: none;
		stroke: var(--ink);
		stroke-width: 1.6;
		opacity: 0.55;
	}

	.hero-curve .branch-k {
		fill: none;
		stroke: #5f6398;
		stroke-width: 4;
	}

	.hero-curve .branch-n {
		fill: none;
		stroke: #a3702a;
		stroke-width: 4;
	}

	.hero-curve .eutonic {
		fill: var(--paper);
		stroke: var(--acid);
		stroke-width: 3;
	}

	.hero-curve .pot {
		fill: var(--acid);
	}

	.hero-curve span {
		position: absolute;
		right: 8%;
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
		color: #b0b3d8;
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
		background: rgba(95, 99, 152, 0.08);
	}

	.prediction > span {
		display: block;
		margin-bottom: 0.55rem;
		color: #4c4f7c;
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
		border-color: #5f6398;
		background: #5f6398;
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
		border-left: 2px solid #5f6398;
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
		accent-color: #5f6398;
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
		background: #23222e;
		color: var(--paper);
	}

	.edge-grid {
		display: grid;
		grid-template-columns: 1.15fr 0.85fr;
		gap: 5rem;
		align-items: center;
	}

	.edge .eyebrow {
		color: #b0b3d8;
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
		font-size: 0.86rem;
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
		background: #d3d2df;
	}

	.sandbox .eyebrow {
		color: #4c4f7c;
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
		background: rgba(244, 239, 228, 0.35);
	}

	.sandbox-controls label {
		margin: 0 0 0.7rem;
		background: rgba(255, 255, 255, 0.25);
	}

	.op-buttons {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin-bottom: 0.7rem;
	}

	.op-buttons button {
		padding: 0.5rem 0.62rem;
		border: 1px solid rgba(31, 40, 38, 0.2);
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.6);
		color: var(--ink);
		cursor: pointer;
		font-size: 0.66rem;
		font-weight: 700;
	}

	.op-buttons button.reset {
		border-style: dashed;
	}

	.harvest {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem 0.8rem;
		margin-bottom: 0.7rem;
		padding: 0.6rem 0.7rem;
		border: 1px solid var(--line);
		border-radius: 11px;
		font-family: var(--mono);
		font-size: 0.64rem;
	}

	.harvest strong {
		width: 100%;
		font-size: 0.6rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.challenge {
		padding: 0.8rem;
		border-left: 3px solid #5f6398;
		background: rgba(95, 99, 152, 0.07);
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
		background: #34335c;
		color: #eeeffa;
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
		border: 1px solid rgba(238, 239, 250, 0.65);
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
			font-size: clamp(3.4rem, 19vw, 6.4rem);
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
