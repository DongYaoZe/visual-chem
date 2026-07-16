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

export interface ScrollyOptions {
	onActive: (index: number) => void;
}

export const scrolly: Action<HTMLElement, ScrollyOptions> = (node, options) => {
	let { onActive } = options;
	const observer = new IntersectionObserver(
		(entries) => {
			const visible = mostVisible(entries);
			if (!visible) return;
			onActive(Number((visible.target as HTMLElement).dataset.sceneIndex ?? 0));
		},
		{ rootMargin: SCENE_ROOT_MARGIN, threshold: SCENE_THRESHOLDS }
	);
	for (const step of node.querySelectorAll<HTMLElement>('[data-scene-index]')) {
		observer.observe(step);
	}
	return {
		update(next: ScrollyOptions) {
			({ onActive } = next);
		},
		destroy() {
			observer.disconnect();
		}
	};
};
