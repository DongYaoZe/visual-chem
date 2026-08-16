<script lang="ts">
	import { resolve } from '$app/paths';
	import { co2InfraredFrame, co2ModeFromIndex, type CO2ModeId } from '$lib/chem';
	import CO2InfraredTriView from '$lib/components/CO2InfraredTriView.svelte';
	import ConceptCheck from '$lib/components/ConceptCheck.svelte';
	import Formula from '$lib/components/Math.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import SiteHeader from '$lib/components/SiteHeader.svelte';
	import StoryStage from '$lib/components/StoryStage.svelte';
	import { getCO2InfraredContent, getSiteContent, type LocaleCode } from '$lib/content';
	import { parseProse, type InlineSegment } from './prose';
	import { co2InfraredSceneDefinition } from './season4-co2-scenes';
	import { scrolly } from './scrolly';

	interface Props {
		locale?: LocaleCode;
	}
	let { locale = 'zh-CN' }: Props = $props();
	let site = $derived(getSiteContent(locale));
	let story = $derived(getCO2InfraredContent(locale));
	let activeIndex = $state(0);
	let hookPrediction = $state<string | null>(null);
	let modeIndex = $state(1);
	let amplitude = $state(0.72);
	let activeScene = $derived(co2InfraredSceneDefinition(story.scenes[activeIndex].id));
	let activeSceneId = $derived(activeScene.id);
	let visualMode = $derived.by<CO2ModeId>(() =>
		activeSceneId === 'sandbox' ? co2ModeFromIndex(modeIndex) : activeScene.mode
	);
	let visualAmplitude = $derived(activeSceneId === 'sandbox' ? amplitude : activeScene.amplitude);
	let frame = $derived(co2InfraredFrame(visualMode, visualAmplitude));
	let progress = $derived(((activeIndex + 1) / story.scenes.length) * 100);
	let catalogHref = $derived(locale === 'en' ? resolve('/en/') : resolve('/'));

	function rangeValue(event: Event): number {
		return Number((event.currentTarget as HTMLInputElement).value);
	}
	function activateScene(id: (typeof story.scenes)[number]['id']): void {
		const index = story.scenes.findIndex((scene) => scene.id === id);
		if (index >= 0) activeIndex = index;
	}
</script>

{#snippet inline(segments: InlineSegment[])}
	{#each segments as segment, index (index)}
		{#if segment.type === 'strong'}<strong>{segment.value}</strong
			>{:else if segment.type === 'math'}<Formula formula={segment.value} />
			>{:else}{segment.value}{/if}
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
		<p class="eyebrow">{story.hero.eyebrow}</p>
		<h1>{story.hero.title[0]}<br /><em>{story.hero.title[1]}</em></h1>
		<p class="hero-subtitle">{story.hero.subtitle}</p>
		<div class="hero-modes" aria-hidden="true">
			<span>ν₂ 667</span><span>ν₁ 1333</span><span>ν₃ 2349</span><small>{story.hero.heroTag}</small>
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
			compactMobile
		>
			{#snippet stage()}<CO2InfraredTriView
					{frame}
					active={activeScene.active}
					label={story.triView.defaultAriaLabel}
					content={story.triView}
				/>{/snippet}
			{#snippet status()}<span>{frame.wavenumberCm} cm⁻¹</span><span
					>{frame.wavelengthUm.toFixed(2)} μm</span
				><span
					>{frame.irActive
						? story.triView.activityNames.active
						: story.triView.activityNames.silent}</span
				>{/snippet}
		</StoryStage>
		<div class="steps" use:scrolly={{ onActive: (index) => (activeIndex = index) }}>
			{#each story.scenes as scene, index (scene.id)}
				<article
					class="step"
					class:active={activeIndex === index}
					class:symbol-step={scene.id === 'dipole-rule' ||
						scene.id === 'read-the-spectrum' ||
						scene.id === 'sandbox'}
					data-scene-index={index}
					data-scene-id={scene.id}
				>
					<div class="step-card">
						<p class="eyebrow">{story.kickers[scene.id]}</p>
						{#each parseProse(scene.prose) as block, blockIndex (blockIndex)}
							{#if block.kind === 'math'}<div class="formula">
									<Formula formula={block.formula} display />
								</div>{:else if block.kind === 'list'}<ul>
									{#each block.items as item, itemIndex (itemIndex)}<li>
											{@render inline(item)}
										</li>{/each}
								</ul>{:else}<p>{@render inline(block.segments)}</p>{/if}
						{/each}
						{#if scene.id === 'hook'}<div class="prediction">
								<span>{story.interactions.hook.question}</span>
								<div>
									{#each story.interactions.hook.options as option (option.id)}<button
											type="button"
											aria-pressed={hookPrediction === option.id}
											class:selected={hookPrediction === option.id}
											onclick={() => {
												hookPrediction = option.id;
												activateScene('hook');
											}}>{option.label}</button
										>{/each}
								</div>
							</div>
							{#if hookPrediction}<p class="evidence">
									{story.interactions.hook.explanation}
								</p>{/if}{/if}
						{#if scene.id === 'three-motions' || scene.id === 'sandbox'}<label class="range-control"
								><span>{story.interactions.mode.label}</span><strong
									>{story.triView.molecule.modeNames[visualMode]}</strong
								><input
									type="range"
									min="0"
									max="2"
									step="1"
									value={modeIndex}
									aria-label={story.interactions.mode.ariaLabel}
									oninput={(event) => (modeIndex = rangeValue(event))}
								/></label
							>{/if}
						{#if scene.id === 'sandbox'}<label class="range-control"
								><span>{story.interactions.amplitude.label}</span><strong
									>{Math.round(amplitude * 100)}%</strong
								><input
									type="range"
									min="0.2"
									max="1"
									step="0.01"
									value={amplitude}
									aria-label={story.interactions.amplitude.ariaLabel}
									oninput={(event) => (amplitude = rangeValue(event))}
								/><small
									>{story.interactions.mode.readout({
										mode: story.triView.molecule.modeNames[visualMode],
										wavenumberCm: frame.wavenumberCm,
										wavelengthUm: frame.wavelengthUm.toFixed(2),
										irActive: frame.irActive
									})}</small
								></label
							>{/if}
					</div>
				</article>
			{/each}
		</div>
	</section>
	<section class="edge">
		<div class="shell edge-grid">
			<div>
				<p class="eyebrow">{story.edge.eyebrow}</p>
				<h2>{story.edge.title}</h2>
			</div>
			<div class="edge-facts">
				{#each story.edge.facts as fact (fact.term)}<article>
						<span>{fact.term}</span>
						<p>{fact.definition}</p>
					</article>{/each}
			</div>
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
				<label class="range-control"
					><span>{story.interactions.mode.label}</span><strong
						>{story.triView.molecule.modeNames[co2ModeFromIndex(modeIndex)]}</strong
					><input
						type="range"
						min="0"
						max="2"
						step="1"
						bind:value={modeIndex}
						aria-label={story.interactions.mode.ariaLabel}
					/></label
				><label class="range-control"
					><span>{story.interactions.amplitude.label}</span><strong
						>{Math.round(amplitude * 100)}%</strong
					><input
						type="range"
						min="0.2"
						max="1"
						step="0.01"
						bind:value={amplitude}
						aria-label={story.interactions.amplitude.ariaLabel}
					/><small
						>{story.interactions.mode.readout({
							mode: story.triView.molecule.modeNames[co2ModeFromIndex(modeIndex)],
							wavenumberCm: co2InfraredFrame(co2ModeFromIndex(modeIndex), amplitude).wavenumberCm,
							wavelengthUm: co2InfraredFrame(
								co2ModeFromIndex(modeIndex),
								amplitude
							).wavelengthUm.toFixed(2),
							irActive: co2InfraredFrame(co2ModeFromIndex(modeIndex), amplitude).irActive
						})}</small
					></label
				>
			</div>
			<CO2InfraredTriView
				frame={co2InfraredFrame(co2ModeFromIndex(modeIndex), amplitude)}
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
			{#each story.modelCard.items as item, index (item.term)}<details open={index < 2}>
					<summary>{item.term}</summary>
					<p>{item.value}</p>
				</details>{/each}
		</div>
	</section>
	<section class="ending">
		<div class="shell">
			<p>{story.ending.summary}</p>
			<h2>{story.ending.invitation}</h2>
			<div>
				<a href={catalogHref}>{story.ending.backToHome}</a><a
					href="https://github.com/DongYaoZe/visual-chem">GitHub ↗</a
				>
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
		background: #357c9d;
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
	.story-hero h1 {
		position: relative;
		z-index: 2;
		margin: 1.2rem 0 2.2rem;
		font-family: var(--serif);
		font-size: clamp(3.1rem, 8.2vw, 7.8rem);
		font-weight: 500;
		letter-spacing: -0.075em;
		line-height: 0.86;
	}
	.story-hero h1 em {
		display: inline-block;
		margin-left: 12%;
		color: #357c9d;
		font-weight: 500;
		transform: rotate(-1.5deg);
	}
	.hero-subtitle {
		position: relative;
		z-index: 2;
		max-width: 760px;
		margin: 0;
		font-family: var(--serif);
		font-size: clamp(1.1rem, 2vw, 1.4rem);
		line-height: 1.75;
	}
	.hero-modes {
		position: absolute;
		right: 4%;
		bottom: 9%;
		display: grid;
		width: min(54%, 620px);
		grid-template-columns: repeat(3, 1fr);
		gap: 0.4rem;
		padding: 1.4rem;
		border-radius: 14px;
		background: #182229;
		color: #d7f4ff;
		font-family: var(--mono);
		font-size: clamp(0.7rem, 1.3vw, 1rem);
		box-shadow: 0 28px 70px rgba(25, 40, 50, 0.18);
		transform: rotate(-1deg);
	}
	.hero-modes span {
		padding: 1.2rem 0.7rem;
		border: 1px solid rgba(215, 244, 255, 0.2);
		text-align: center;
	}
	.hero-modes small {
		grid-column: 1 / -1;
		color: #86d9e4;
		text-align: right;
	}
	.reading-note {
		padding-block: 4.5rem;
		background: #17242a;
		color: var(--paper);
	}
	.reading-note .shell {
		display: grid;
		grid-template-columns: 0.35fr 1fr;
		gap: 3rem;
	}
	.reading-note .eyebrow,
	.edge .eyebrow {
		color: #86d9e4;
	}
	.reading-note p:last-child {
		max-width: 820px;
		margin: 0;
		color: rgba(244, 239, 228, 0.76);
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
		box-shadow: 0 18px 45px rgba(36, 40, 34, 0.08);
	}
	.step-card > p:not(.eyebrow):not(.evidence),
	.step-card ul {
		color: var(--ink-muted);
		font-family: var(--serif);
		font-size: 0.97rem;
		line-height: 1.8;
	}
	.step-card > p:not(.eyebrow):not(.evidence) {
		margin: 0.72rem 0;
	}
	.step-card ul {
		margin: 0.72rem 0;
		padding-left: 1.2rem;
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
		font-family: var(--mono);
		text-align: center;
	}
	.prediction,
	.range-control {
		margin-top: 1rem;
		padding: 0.85rem;
		border-radius: 10px;
		background: rgba(53, 124, 157, 0.09);
	}
	.prediction > span,
	.range-control > span {
		display: block;
		margin-bottom: 0.55rem;
		color: #216f7e;
		font-family: var(--mono);
		font-size: 0.62rem;
		font-weight: 800;
	}
	.prediction > div {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
	}
	button {
		padding: 0.52rem 0.68rem;
		border: 1px solid rgba(31, 40, 38, 0.18);
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.68);
		color: var(--ink);
		cursor: pointer;
		font-size: 0.7rem;
		font-weight: 700;
	}
	button.selected {
		border-color: #357c9d;
		background: #357c9d;
		color: white;
	}
	.evidence {
		margin: 0.75rem 0 0;
		padding-left: 0.7rem;
		border-left: 2px solid #357c9d;
		color: var(--ink-muted);
		font-size: 0.75rem;
		line-height: 1.65;
	}
	.range-control {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 0.5rem;
	}
	.range-control input {
		width: 100%;
		grid-column: 1 / -1;
		accent-color: #357c9d;
	}
	.range-control small {
		grid-column: 1 / -1;
		color: var(--ink-muted);
		font-family: var(--mono);
		line-height: 1.5;
	}
	.edge {
		padding-block: clamp(6rem, 12vw, 10rem);
		background: #17242a;
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
	}
	.edge-facts article {
		padding: 1rem 1.2rem;
		border: 1px solid rgba(244, 239, 228, 0.18);
		border-radius: 12px;
	}
	.edge-facts span {
		color: #86d9e4;
		font-family: var(--mono);
		font-size: 0.68rem;
		font-weight: 800;
	}
	.edge-facts p {
		margin: 0.45rem 0 0;
		color: rgba(244, 239, 228, 0.82);
		font-size: 0.82rem;
		line-height: 1.6;
	}
	.concept {
		padding-block: clamp(5rem, 10vw, 8rem);
	}
	.sandbox {
		padding-block: clamp(5rem, 10vw, 9rem);
		background: #d9e7e9;
	}
	.sandbox .eyebrow {
		color: #216f7e;
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
	.sandbox-controls .range-control {
		margin: 0 0 0.7rem;
		background: rgba(255, 255, 255, 0.28);
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
		background: #17242a;
		color: #f0fbff;
		text-align: center;
	}
	.ending > div > p {
		max-width: 720px;
		margin-inline: auto;
		font-family: var(--mono);
		font-size: 0.68rem;
		letter-spacing: 0.08em;
		line-height: 1.8;
	}
	.ending > div > div {
		display: flex;
		gap: 1.3rem;
		justify-content: center;
		margin-top: 2.5rem;
	}
	.ending a {
		padding: 0.75rem 1rem;
		border: 1px solid rgba(240, 251, 255, 0.65);
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
		.hero-modes {
			right: -8%;
			width: 65%;
			opacity: 0.55;
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
			padding-bottom: 8vh;
			align-items: end;
		}
		.step.symbol-step {
			padding-top: 365px;
			align-items: flex-start;
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
		.story-hero h1 {
			font-size: clamp(2.7rem, 14vw, 5rem);
		}
		.hero-modes {
			right: 0;
			width: 78%;
		}
		.reading-note .shell {
			grid-template-columns: 1fr;
			gap: 1rem;
		}
		.step,
		.step.symbol-step {
			min-height: auto;
			padding-block: 2.2rem;
			align-items: stretch;
		}
		.step.symbol-step {
			padding-top: 2.2rem;
		}
		.step-card {
			padding: 1rem;
		}
		.ending > div > div {
			align-items: center;
			flex-direction: column;
		}
	}
</style>
