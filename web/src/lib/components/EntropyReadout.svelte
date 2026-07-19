<script lang="ts">
	import type { EntropyTriViewContent } from '$lib/content';

	interface Props {
		/** ln W of the current split. */
		lnW: number;
		/** ln W at the even split (the max). */
		lnPeak: number;
		/** Base-10 exponent of the all-left probability (negative number). */
		oddsExponent: number;
		content: EntropyTriViewContent['entropy'];
	}

	let { lnW, lnPeak, oddsExponent, content }: Props = $props();

	let fillFraction = $derived(lnPeak > 0 ? Math.min(1, Math.max(0, lnW / lnPeak)) : 0);
</script>

<figure class="entropy-readout">
	<div class="card" role="group" aria-label={content.ariaLabel}>
		<p class="formula">{content.lnWLabel}</p>
		<div class="meter" aria-hidden="true">
			<div class="meter-fill" style:width={`${(fillFraction * 100).toFixed(1)}%`}></div>
		</div>
		<p class="readout">{content.entropyReadout({ lnW: lnW.toFixed(1) })}</p>
		<p class="odds">{content.oddsReadout({ exponent: oddsExponent.toFixed(0) })}</p>
	</div>
	<figcaption><span>{content.viewName}</span> {content.caption}</figcaption>
</figure>

<style>
	.entropy-readout {
		display: grid;
		height: 100%;
		min-height: 220px;
		margin: 0;
		grid-template-rows: 1fr auto;
	}

	.card {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 0.9rem;
		padding: 1rem 1.1rem;
		border: 1px solid var(--line);
		border-radius: 12px;
		background: rgba(255, 255, 255, 0.35);
	}

	.formula {
		margin: 0;
		color: var(--ink);
		font-family: var(--mono);
		font-size: 1.35rem;
		font-weight: 800;
		letter-spacing: 0.06em;
	}

	.meter {
		height: 10px;
		overflow: hidden;
		border: 1px solid var(--line);
		border-radius: 5px;
		background: rgba(31, 40, 38, 0.08);
	}

	.meter-fill {
		height: 100%;
		border-radius: 5px;
		background: rgba(32, 127, 140, 0.85);
		transition: width 300ms ease;
	}

	.readout {
		margin: 0;
		color: var(--ink);
		font-family: var(--mono);
		font-size: 0.9rem;
		font-weight: 700;
	}

	.odds {
		margin: 0;
		color: var(--acid);
		font-family: var(--mono);
		font-size: 0.7rem;
		font-weight: 700;
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
</style>
