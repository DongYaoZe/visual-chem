/**
 * Canonical catalogue of live VisualChem stories.
 *
 * Keep route identity, season order, publication date, and visual-audit scene
 * here instead of duplicating those facts across the home page, sitemap, and
 * screenshot scripts. Narrative copy remains in the typed locale content.
 *
 * @typedef {Object} StoryManifestEntry
 * @property {number} number
 * @property {1|2|3|4} season
 * @property {string} slug
 * @property {string} published
 * @property {string} keyScene
 */

/** @type {readonly StoryManifestEntry[]} */
export const STORY_MANIFEST = Object.freeze([
	{
		number: 1,
		season: 1,
		slug: 'ethanol-distillation',
		published: '2026-07-16',
		keyScene: 'tie-line'
	},
	{
		number: 2,
		season: 1,
		slug: 'boiling-map',
		published: '2026-07-17',
		keyScene: 'altitude-travel'
	},
	{ number: 3, season: 1, slug: 'salt-split', published: '2026-07-17', keyScene: 'cooling' },
	{
		number: 4,
		season: 1,
		slug: 'cooling-curve',
		published: '2026-07-18',
		keyScene: 'read-the-map'
	},
	{ number: 5, season: 2, slug: 'entropy', published: '2026-07-18', keyScene: 'the-spike' },
	{
		number: 6,
		season: 2,
		slug: 'gibbs-valley',
		published: '2026-07-18',
		keyScene: 'slope-is-deltaG'
	},
	{ number: 7, season: 2, slug: 'nernst', published: '2026-07-18', keyScene: 'nernst-slope' },
	{ number: 8, season: 3, slug: 'kinetics', published: '2026-07-23', keyScene: 'fingerprints' },
	{ number: 9, season: 3, slug: 'arrhenius', published: '2026-07-23', keyScene: 'the-tail' },
	{ number: 10, season: 3, slug: 'catalyst', published: '2026-07-23', keyScene: 'lower-pass' },
	{
		number: 11,
		season: 4,
		slug: 'hydrogen-spectrum',
		published: '2026-07-24',
		keyScene: 'three-families'
	},
	{ number: 12, season: 4, slug: 'co2-infrared', published: '2026-08-07', keyScene: 'dipole-rule' }
]);

export const STORY_COUNT = STORY_MANIFEST.length;

/** @param {1|2|3|4} season */
export function storiesForSeason(season) {
	return STORY_MANIFEST.filter((story) => story.season === season);
}

export const LATEST_STORY_DATE = STORY_MANIFEST.reduce(
	(latest, story) => (story.published > latest ? story.published : latest),
	'0000-00-00'
);
