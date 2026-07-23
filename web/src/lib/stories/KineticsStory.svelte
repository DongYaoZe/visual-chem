<script lang="ts">
	import { resolve } from '$app/paths';
	import {
		c14AgeYears,
		concentrationAt,
		decayCurve,
		halfLife,
		successiveHalfLives,
		type ReactionOrder
	} from '$lib/chem';
	import ConceptCheck from '$lib/components/ConceptCheck.svelte';
	import KineticsTriView from '$lib/components/KineticsTriView.svelte';
	import Formula from '$lib/components/Math.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import SiteHeader from '$lib/components/SiteHeader.svelte';
	import StoryStage from '$lib/components/StoryStage.svelte';
	import { getKineticsContent, getSiteContent, type LocaleCode } from '$lib/content';
	import { parseProse, type InlineSegment } from './prose';
	import { kineticsSceneDefinition } from './season3-scenes';
	import { scrolly } from './scrolly';

	interface Props {
		locale?: LocaleCode;
	}

	let { locale = 'zh-CN' }: Props = $props();
	let site = $derived(getSiteContent(locale));
	let story = $derived(getKineticsContent(locale));

	let activeIndex = $state(0);
	let hookPrediction = $state<string | null>(null);

	const watchDefaults = kineticsSceneDefinition('watch-it-fall');
	const fingerprintDefaults = kineticsSceneDefinition('fingerprints');
	const sandboxDefaults = kineticsSceneDefinition('sandbox');

	const watchTotalTimeS = watchDefaults.totalTimeS;
	let watchTimeS = $state(watchDefaults.timeS);
	let watchPlaying = $state(false);

	$effect(() => {
		if (!watchPlaying) return;
		const id = setInterval(() => {
			watchTimeS = Math.min(watchTotalTimeS, watchTimeS + 1.5);
			if (watchTimeS >= watchTotalTimeS) watchPlaying = false;
		}, 50);
		return () => clearInterval(id);
	});

	function resetWatch(): void {
		watchPlaying = false;
		watchTimeS = 0;
	}

	let fingerprintOrder = $state<ReactionOrder>(fingerprintDefaults.order);
	let carbonFraction = $state(0.53);
	let labOrder = $state<ReactionOrder>(sandboxDefaults.order);
	let labK = $state(sandboxDefaults.k);
	let labC0 = $state(sandboxDefaults.c0);
	const labTimeS = sandboxDefaults.timeS;
	const labTotalTimeS = sandboxDefaults.totalTimeS;

	let activeScene = $derived(kineticsSceneDefinition(story.scenes[activeIndex].id));
	let activeSceneId = $derived(activeScene.id);

	let visualOrder = $derived.by(() => {
		if (activeSceneId === 'fingerprints') return fingerprintOrder;
		if (activeSceneId === 'sandbox') return labOrder;
		return activeScene.order;
	});
	let visualC0 = $derived(activeSceneId === 'sandbox' ? labC0 : activeScene.c0);
	let visualK = $derived(activeSceneId === 'sandbox' ? labK : activeScene.k);
	let visualTimeS = $derived.by(() => {
		if (activeSceneId === 'watch-it-fall') return watchTimeS;
		if (activeSceneId === 'sandbox') return labTimeS;
		return activeScene.timeS;
	});
	let visualTotalTimeS = $derived(
		activeSceneId === 'watch-it-fall'
			? watchTotalTimeS
			: activeSceneId === 'sandbox'
				? labTotalTimeS
				: activeScene.totalTimeS
	);
	let visualConcentration = $derived(concentrationAt(visualOrder, visualC0, visualK, visualTimeS));
	let visualFraction = $derived(visualConcentration / visualC0);
	let visualFocus = $derived.by(() => {
		switch (activeSceneId) {
			case 'half-life':
			case 'fingerprints':
			case 'rate-law':
				return 'clock' as const;
			case 'watch-it-fall':
				return 'beaker' as const;
			case 'carbon-clock':
				return 'molecules' as const;
			default:
				return 'all' as const;
		}
	});

	let fingerprintSpans = $derived(
		successiveHalfLives(fingerprintOrder, fingerprintDefaults.c0, fingerprintDefaults.k)
	);
	let carbonAge = $derived(c14AgeYears(carbonFraction));
	let labHalfLife = $derived(halfLife(labOrder, labC0, labK));
	let progress = $derived(((activeIndex + 1) / story.scenes.length) * 100);
	let catalogHref = $derived(locale === 'en' ? resolve('/en/') : resolve('/'));

	// The hero line is sampled from the same integrated-rate-law kernel as the stage.
	const HERO = decayCurve(1, 1, 0.012, 300, 120);
	const heroPath = HERO.times
		.map((timeS, index) => {
			const fraction = HERO.concentrations[index] / HERO.c0;
			return `${index === 0 ? 'M' : 'L'}${(30 + (timeS / 300) * 940).toFixed(1)},${(
				35 +
				(1 - fraction) * 230
			).toFixed(1)}`;
		})
		.join(' ');

	function formatSpan(value: number): string {
		return value >= 100 ? value.toFixed(0) : value.toFixed(1);
	}
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

<div class="progress" style:width={`${progress}%`} aria-hidden="true"></div>
<SiteHeader compact {locale} content={site.shared.header} />

<main>
	<section class="story-hero shell">
		<div class="hero-meta"><p class="eyebrow">{story.hero.eyebrow}</p></div>
		<h1>{story.hero.title[0]}<br /><em>{story.hero.title[1]}</em></h1>
		<div class="hero-bottom"><p>{story.hero.subtitle}</p></div>
		<div class="hero-curve" aria-hidden="true">
			<svg viewBox="0 0 1000 300"><path d={heroPath} /></svg>
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
				<KineticsTriView
					order={visualOrder}
					c0={visualC0}
					k={visualK}
					totalTimeS={visualTotalTimeS}
					currentTimeS={visualTimeS}
					running={activeSceneId === 'watch-it-fall' && watchPlaying}
					showHalfLives={activeScene.showHalfLives}
					focus={visualFocus}
					label={story.triView.defaultAriaLabel}
					content={story.triView}
				/>
			{/snippet}
			{#snippet status()}
				<span>t {visualTimeS.toFixed(0)} s</span>
				<span>c/c₀ {visualFraction.toFixed(3)}</span>
				<span>m {visualOrder}</span>
			{/snippet}
		</StoryStage>

		<div class="steps" use:scrolly={{ onActive: (index) => (activeIndex = index) }}>
			{#each story.scenes as scene, index (scene.id)}
				<article
					class="step"
					class:active={activeIndex === index}
					class:symbol-step={scene.id === 'half-life' ||
						scene.id === 'fingerprints' ||
						scene.id === 'rate-law' ||
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

						{#if scene.id === 'watch-it-fall'}
							<div class="inline-control watch-controls">
								<button type="button" onclick={() => (watchPlaying = !watchPlaying)}>
									{watchPlaying
										? story.interactions.watchItFall.pauseButton
										: story.interactions.watchItFall.playButton}
								</button>
								<button type="button" onclick={resetWatch}
									>{story.interactions.watchItFall.resetButton}</button
								>
								<output aria-live="polite">t = {watchTimeS.toFixed(0)} s</output>
							</div>
						{/if}

						{#if scene.id === 'fingerprints'}
							<div class="choice-control">
								<span>{story.interactions.fingerprints.orderLabel}</span>
								<div>
									{#each story.interactions.fingerprints.orderNames as name, order (order)}
										<button
											type="button"
											aria-pressed={fingerprintOrder === order}
											class:selected={fingerprintOrder === order}
											onclick={() => (fingerprintOrder = order as ReactionOrder)}>{name}</button
										>
									{/each}
								</div>
							</div>
							<p class="evidence">
								{story.interactions.fingerprints.readout({
									first: formatSpan(fingerprintSpans[0]),
									second: formatSpan(fingerprintSpans[1]),
									third: formatSpan(fingerprintSpans[2])
								})}
							</p>
						{/if}

						{#if scene.id === 'carbon-clock'}
							<label class="range-control">
								<span>{story.interactions.carbonClock.fractionLabel}</span>
								<strong>{(carbonFraction * 100).toFixed(0)}%</strong>
								<input
									type="range"
									min="0.1"
									max="1"
									step="0.01"
									aria-label={story.interactions.carbonClock.fractionLabel}
									bind:value={carbonFraction}
								/>
								<small>
									{story.interactions.carbonClock.readout({
										percent: (carbonFraction * 100).toFixed(0),
										years: carbonAge.toFixed(0)
									})}
								</small>
							</label>
						{/if}

						{#if scene.id === 'sandbox'}
							{@render sandboxControls(false)}
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
					<div><span>{fact.term}</span><strong>{fact.definition}</strong></div>
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
			<div class="sandbox-controls">{@render sandboxControls(true)}</div>
			<KineticsTriView
				order={labOrder}
				c0={labC0}
				k={labK}
				totalTimeS={labTotalTimeS}
				currentTimeS={labTimeS}
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

{#snippet sandboxControls(showChallenge: boolean)}
	<div class="choice-control compact">
		<span>{story.interactions.sandbox.orderLabel}</span>
		<div>
			{#each story.interactions.fingerprints.orderNames as name, order (order)}
				<button
					type="button"
					aria-pressed={labOrder === order}
					class:selected={labOrder === order}
					onclick={() => (labOrder = order as ReactionOrder)}>{name}</button
				>
			{/each}
		</div>
	</div>
	<label class="range-control">
		<span>{story.interactions.sandbox.kLabel}</span><strong
			>{labK.toFixed(3)} {story.interactions.sandbox.kUnit({ order: labOrder })}</strong
		>
		<input
			type="range"
			min="0.002"
			max="0.03"
			step="0.001"
			aria-label={story.interactions.sandbox.kLabel}
			bind:value={labK}
		/>
	</label>
	<label class="range-control">
		<span>{story.interactions.sandbox.c0Label}</span><strong>{labC0.toFixed(1)} mol L⁻¹</strong>
		<input
			type="range"
			min="0.2"
			max="2"
			step="0.1"
			aria-label={story.interactions.sandbox.c0Label}
			bind:value={labC0}
		/>
		<small>{story.interactions.sandbox.readout({ halfLife: formatSpan(labHalfLife) })}</small>
	</label>
	{#if showChallenge}
		<div class="challenge">
			<p>{story.interactions.sandbox.readout({ halfLife: formatSpan(labHalfLife) })}</p>
		</div>
	{/if}
{/snippet}

<style>
	.progress {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 100;
		height: 3px;
		background: #207f8c;
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
		color: #207f8c;
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

	.hero-bottom p {
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
		opacity: 0.32;
	}

	.hero-curve svg {
		display: block;
		width: 100%;
	}

	.hero-curve path {
		fill: none;
		stroke: #207f8c;
		stroke-linecap: round;
		stroke-width: 4;
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

	.reading-note .eyebrow,
	.edge .eyebrow {
		color: #83cbd2;
	}

	.reading-note p:last-child {
		max-width: 800px;
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
		background: rgba(250, 247, 239, 0.94);
		box-shadow: 0 18px 45px rgba(36, 40, 34, 0.08);
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
		border-block: 1px solid var(--line);
		color: var(--ink);
		font-size: 1.02rem;
		text-align: center;
	}

	.prediction,
	.choice-control {
		margin-top: 1rem;
		padding: 0.85rem;
		border-radius: 10px;
		background: rgba(32, 127, 140, 0.08);
	}

	.prediction > span,
	.choice-control > span {
		display: block;
		margin-bottom: 0.55rem;
		color: #175d66;
		font-family: var(--mono);
		font-size: 0.6rem;
		font-weight: 800;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.prediction > div,
	.choice-control > div,
	.inline-control {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
	}

	.prediction button,
	.choice-control button,
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
	.choice-control button.selected {
		border-color: #207f8c;
		background: #207f8c;
		color: white;
	}

	.inline-control {
		align-items: center;
		margin-top: 0.8rem;
	}

	.watch-controls output {
		margin-left: auto;
		color: #175d66;
		font-family: var(--mono);
		font-size: 0.68rem;
		font-weight: 800;
	}

	.evidence {
		margin: 0.75rem 0 0;
		padding-left: 0.7rem;
		border-left: 2px solid #207f8c;
		color: var(--ink-muted);
		font-size: 0.75rem;
		line-height: 1.65;
	}

	.range-control {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 0.5rem;
		margin-top: 1.1rem;
		padding: 0.8rem;
		border: 1px solid var(--line);
		border-radius: 11px;
		font-size: 0.7rem;
	}

	.range-control strong {
		font-family: var(--mono);
	}

	.range-control input {
		width: 100%;
		grid-column: 1 / -1;
		accent-color: #207f8c;
	}

	.range-control small {
		grid-column: 1 / -1;
		color: var(--ink-muted);
		font-family: var(--mono);
	}

	.edge {
		padding-block: clamp(6rem, 12vw, 10rem);
		background: #193136;
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
		color: #83cbd2;
		font-family: var(--mono);
		font-size: 0.68rem;
		font-weight: 800;
		letter-spacing: 0.08em;
	}

	.edge-facts strong {
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
		background: #d5e1de;
	}

	.sandbox .eyebrow {
		color: #175d66;
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

	.sandbox-controls :global(.choice-control),
	.sandbox-controls :global(.range-control) {
		margin: 0 0 0.7rem;
		background: rgba(255, 255, 255, 0.25);
	}

	.choice-control.compact {
		padding: 0.7rem;
	}

	.challenge {
		padding: 0.8rem;
		border-left: 3px solid #207f8c;
		background: rgba(32, 127, 140, 0.07);
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
		background: #17383d;
		color: #f2fbf9;
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
		border: 1px solid rgba(242, 251, 249, 0.65);
		border-radius: 999px;
		color: inherit;
		font-size: 0.72rem;
		font-weight: 800;
		text-decoration: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.progress,
		.step {
			transition: none;
		}
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
			padding-bottom: 8vh;
			align-items: end;
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
