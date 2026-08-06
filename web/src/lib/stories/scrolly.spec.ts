import { describe, expect, it } from 'vitest';
import {
	SCENE_ROOT_MARGIN,
	SCENE_THRESHOLDS,
	mostVisible,
	updateVisibilitySnapshot
} from './scrolly';

describe('mostVisible', () => {
	it('picks the intersecting entry with the largest visible ratio', () => {
		const entries = [
			{ isIntersecting: true, intersectionRatio: 0.3, id: 'a' },
			{ isIntersecting: true, intersectionRatio: 0.7, id: 'b' },
			{ isIntersecting: true, intersectionRatio: 0.45, id: 'c' }
		];
		expect(mostVisible(entries)?.id).toBe('b');
	});

	it('never hands the scene to a step that left the viewport', () => {
		const entries = [
			{ isIntersecting: false, intersectionRatio: 0.9, id: 'gone' },
			{ isIntersecting: true, intersectionRatio: 0.2, id: 'here' }
		];
		expect(mostVisible(entries)?.id).toBe('here');
	});

	it('returns null when no step is visible, so the last scene holds', () => {
		expect(mostVisible([{ isIntersecting: false, intersectionRatio: 0 }])).toBeNull();
		expect(mostVisible([])).toBeNull();
	});

	it('merges incremental observer batches before selecting the global winner', () => {
		const first = { target: {}, isIntersecting: true, intersectionRatio: 0.7, id: 'a' };
		const second = { target: {}, isIntersecting: true, intersectionRatio: 0.3, id: 'b' };
		const snapshot = new Map<object, typeof first>();
		expect(updateVisibilitySnapshot(snapshot, [first, second])?.id).toBe('a');
		// Only b crossed a threshold in this callback; a remains the global winner.
		const bUpdate = { ...second, intersectionRatio: 0.45 };
		expect(updateVisibilitySnapshot(snapshot, [bUpdate])?.id).toBe('a');
		const aLeft = { ...first, isIntersecting: false, intersectionRatio: 0 };
		expect(updateVisibilitySnapshot(snapshot, [aLeft])?.id).toBe('b');
	});

	it('pins the shared observer tuning every story relies on', () => {
		expect(SCENE_ROOT_MARGIN).toBe('-18% 0px -38% 0px');
		expect(SCENE_THRESHOLDS).toEqual([0.2, 0.45, 0.7]);
	});
});
