import type { Action } from 'svelte/action';

/**
 * Scroll-driven scene tracking for story layouts.
 *
 * A story marks each step with `data-scene-index`; the `scrolly` action
 * watches the marked descendants of its node and reports whichever step
 * currently owns the reader's attention. Every story shares this one
 * observer tuning, so scenes hand over at the same reading depth across
 * the whole site.
 */

/** The observation band: a step activates while it crosses the zone between
 * 18% from the top and 38% from the bottom of the viewport. */
export const SCENE_ROOT_MARGIN = '-18% 0px -38% 0px';
export const SCENE_THRESHOLDS = [0.2, 0.45, 0.7];

export interface VisibilityEntry {
	isIntersecting: boolean;
	intersectionRatio: number;
}

/** Pick the entry that owns the reader's attention: the intersecting one
 * with the largest visible ratio, or null when none qualifies. */
export function mostVisible<Entry extends VisibilityEntry>(
	entries: readonly Entry[]
): Entry | null {
	let winner: Entry | null = null;
	for (const entry of entries) {
		if (!entry.isIntersecting) continue;
		if (!winner || entry.intersectionRatio > winner.intersectionRatio) winner = entry;
	}
	return winner;
}

/** Merge the changed entries from an IntersectionObserver callback into a
 * full snapshot before choosing a scene. Observer callbacks are incremental;
 * looking only at the current batch can resurrect a neighbouring card that
 * is no longer the most visible one. */
export function updateVisibilitySnapshot<Entry extends VisibilityEntry & { target: object }>(
	snapshot: Map<object, Entry>,
	entries: readonly Entry[]
): Entry | null {
	for (const entry of entries) snapshot.set(entry.target, entry);
	return mostVisible([...snapshot.values()]);
}

export interface ScrollyOptions {
	onActive: (index: number) => void;
}

export const scrolly: Action<HTMLElement, ScrollyOptions> = (node, options) => {
	let { onActive } = options;
	const snapshot = new Map<object, IntersectionObserverEntry>();
	let interactionPinnedStep: HTMLElement | null = null;
	const observer = new IntersectionObserver(
		(entries) => {
			const visible = updateVisibilitySnapshot(snapshot, entries);
			// A visible control belongs to the scene the reader is actively
			// manipulating. Re-rendering the sticky stage can itself trigger an
			// observer callback; do not let that callback hand the stage to a
			// neighbouring card. The next explicit navigation intent releases the
			// pin; geometry alone is not reliable while the stage is re-laying out.
			if (interactionPinnedStep) {
				onActive(Number(interactionPinnedStep.dataset.sceneIndex ?? 0));
				return;
			}
			if (!visible) return;
			onActive(Number((visible.target as HTMLElement).dataset.sceneIndex ?? 0));
		},
		{ rootMargin: SCENE_ROOT_MARGIN, threshold: SCENE_THRESHOLDS }
	);
	const activateFromInteraction = (event: Event) => {
		const target = event.target;
		if (!(target instanceof Element)) return;
		const step = target.closest<HTMLElement>('[data-scene-index]');
		if (!step || !node.contains(step)) return;
		interactionPinnedStep = step;
		onActive(Number(step.dataset.sceneIndex ?? 0));
	};
	const releaseInteractionPin = () => {
		interactionPinnedStep = null;
	};
	const releaseFromOutsidePointer = (event: PointerEvent) => {
		const target = event.target;
		if (!(target instanceof Node) || !node.contains(target)) releaseInteractionPin();
	};
	const releaseFromOutsideFocus = (event: FocusEvent) => {
		const target = event.target;
		if (!(target instanceof Node) || !node.contains(target)) releaseInteractionPin();
	};
	const releaseFromScrollKey = (event: KeyboardEvent) => {
		const target = event.target;
		if (
			target instanceof Element &&
			target.closest(
				'button, input, select, textarea, a, [role="button"], [contenteditable="true"]'
			)
		) {
			return;
		}
		if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) {
			releaseInteractionPin();
		}
	};
	node.addEventListener('pointerdown', activateFromInteraction);
	node.addEventListener('focusin', activateFromInteraction);
	// Release only on a new navigation intent. Plain `scroll` is too broad:
	// focusing a control or re-laying out the sticky stage can emit a scroll
	// event and would immediately undo the interaction hand-off.
	window.addEventListener('wheel', releaseInteractionPin, { passive: true });
	window.addEventListener('touchmove', releaseInteractionPin, { passive: true });
	window.addEventListener('pointerdown', releaseFromOutsidePointer);
	window.addEventListener('focusin', releaseFromOutsideFocus);
	window.addEventListener('keydown', releaseFromScrollKey);
	for (const step of node.querySelectorAll<HTMLElement>('[data-scene-index]')) {
		observer.observe(step);
	}
	return {
		update(next: ScrollyOptions) {
			({ onActive } = next);
		},
		destroy() {
			observer.disconnect();
			snapshot.clear();
			interactionPinnedStep = null;
			node.removeEventListener('pointerdown', activateFromInteraction);
			node.removeEventListener('focusin', activateFromInteraction);
			window.removeEventListener('wheel', releaseInteractionPin);
			window.removeEventListener('touchmove', releaseInteractionPin);
			window.removeEventListener('pointerdown', releaseFromOutsidePointer);
			window.removeEventListener('focusin', releaseFromOutsideFocus);
			window.removeEventListener('keydown', releaseFromScrollKey);
		}
	};
};
