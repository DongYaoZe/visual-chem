<script lang="ts">
	import { type ConceptCheckChromeContent, zhCNSiteContent } from '$lib/content';

	interface Option {
		label: string;
	}

	interface Props {
		question: string;
		options: readonly Option[];
		correctIndex: number;
		explanation: string;
		content?: ConceptCheckChromeContent;
	}

	let {
		question,
		options,
		correctIndex,
		explanation,
		content = zhCNSiteContent.shared.conceptCheck
	}: Props = $props();
	const uid = $props.id();
	const questionId = `${uid}-question`;
	let selected = $state<number | null>(null);
	let checked = $state(false);

	function changed() {
		checked = false;
	}
</script>

<section class="check" aria-labelledby={questionId}>
	<p class="eyebrow">{content.eyebrow}</p>
	<h3 id={questionId}>{question}</h3>
	<fieldset class="options" aria-labelledby={questionId}>
		{#each options as option, index (option.label)}
			<label
				class:selected={selected === index}
				class:correct={checked && index === correctIndex}
				class:incorrect={checked && selected === index && index !== correctIndex}
			>
				<input
					class="choice"
					type="radio"
					name={`${uid}-answer`}
					value={index}
					bind:group={selected}
					onchange={changed}
				/>
				<span class="marker" aria-hidden="true">{String.fromCharCode(65 + index)}</span>
				<span>{option.label}</span>
			</label>
		{/each}
	</fieldset>
	<button
		class="verify"
		type="button"
		disabled={selected === null}
		onclick={() => (checked = true)}
	>
		{content.verifyButton}
	</button>
	{#if checked}
		<div class="feedback" class:success={selected === correctIndex} aria-live="polite">
			<strong
				>{selected === correctIndex ? content.correctFeedback : content.incorrectFeedback}</strong
			>
			<p>{explanation}</p>
		</div>
	{/if}
</section>

<style>
	.check {
		padding: clamp(1.4rem, 4vw, 2.4rem);
		border: 1px solid rgba(31, 40, 38, 0.18);
		border-radius: 20px;
		background: rgba(250, 247, 239, 0.88);
		box-shadow: var(--shadow);
	}

	h3 {
		max-width: 780px;
		margin: 0.75rem 0 1.4rem;
		font-family: var(--serif);
		font-size: clamp(1.35rem, 3vw, 2.1rem);
		font-weight: 600;
		letter-spacing: -0.025em;
		line-height: 1.3;
	}

	.options {
		display: grid;
		padding: 0;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.7rem;
		border: 0;
	}

	.options label {
		position: relative;
		display: flex;
		min-height: 58px;
		padding: 0.75rem;
		gap: 0.75rem;
		align-items: center;
		border: 1px solid rgba(31, 40, 38, 0.16);
		border-radius: 11px;
		background: rgba(255, 255, 255, 0.48);
		color: var(--ink);
		cursor: pointer;
		text-align: left;
		transition:
			border 160ms ease,
			background 160ms ease,
			transform 160ms ease;
	}

	.options label:hover {
		transform: translateY(-2px);
		border-color: var(--ink-muted);
	}

	.options label:has(.choice:focus-visible) {
		outline: 3px solid #fffaf0;
		outline-offset: 2px;
		box-shadow: 0 0 0 5px #173f43;
	}

	.options label.selected {
		border-color: var(--water);
		background: rgba(32, 127, 140, 0.08);
	}

	.options label.correct {
		border-color: #3f8050;
		background: rgba(63, 128, 80, 0.1);
	}

	.options label.incorrect {
		border-color: var(--acid);
		background: rgba(191, 61, 48, 0.08);
	}

	.choice {
		position: absolute;
		width: 1px;
		height: 1px;
		opacity: 0;
	}

	.marker {
		display: grid;
		width: 28px;
		height: 28px;
		flex: 0 0 28px;
		place-items: center;
		border: 1px solid currentColor;
		border-radius: 50%;
		font-family: var(--mono);
		font-size: 0.7rem;
		font-weight: 800;
	}

	.verify {
		margin-top: 1rem;
		padding: 0.78rem 1.1rem;
		border: 0;
		border-radius: 999px;
		background: var(--ink);
		color: var(--paper);
		cursor: pointer;
		font-size: 0.78rem;
		font-weight: 800;
	}

	.verify:disabled {
		cursor: not-allowed;
		opacity: 0.35;
	}

	.feedback {
		margin-top: 1rem;
		padding: 0.9rem 1rem;
		border-left: 3px solid var(--acid);
		background: rgba(191, 61, 48, 0.05);
		font-size: 0.86rem;
		line-height: 1.65;
	}

	.feedback.success {
		border-color: #3f8050;
		background: rgba(63, 128, 80, 0.06);
	}

	.feedback p {
		margin: 0.3rem 0 0;
		color: var(--ink-muted);
	}

	@media (max-width: 640px) {
		.options {
			grid-template-columns: 1fr;
		}
	}
</style>
