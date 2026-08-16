import { describe, expect, it } from 'vitest';
import {
	LATEST_STORY_DATE,
	STORY_COUNT,
	STORY_MANIFEST,
	storiesForSeason
} from './story-manifest.js';

describe('story manifest', () => {
	it('is the canonical twelve-story catalogue in reading order', () => {
		expect(STORY_COUNT).toBe(12);
		expect(STORY_MANIFEST.map((story) => story.number)).toEqual(
			Array.from({ length: 12 }, (_, index) => index + 1)
		);
		expect(new Set(STORY_MANIFEST.map((story) => story.slug)).size).toBe(STORY_COUNT);
	});

	it('keeps the intended season sizes and audit scenes', () => {
		expect([1, 2, 3, 4].map((season) => storiesForSeason(season as 1 | 2 | 3 | 4).length)).toEqual([
			4, 3, 3, 2
		]);
		expect(STORY_MANIFEST.every((story) => story.keyScene.length > 0)).toBe(true);
	});

	it('exposes the newest publication date for home and sitemap metadata', () => {
		expect(LATEST_STORY_DATE).toBe('2026-08-07');
	});
});
