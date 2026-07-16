export type AbsoluteHttpsUrl = `https://${string}`;

export interface SiteConfig {
	readonly name: string;
	readonly shortName: string;
	readonly tagline: string;
	readonly defaultDescription: string;
	readonly locale: string;
	readonly version: `${number}.${number}.${number}${string}`;
	readonly url: AbsoluteHttpsUrl;
	readonly basePath: `/${string}`;
	readonly repository: {
		readonly owner: string;
		readonly name: string;
		readonly url: AbsoluteHttpsUrl;
		readonly issuesUrl: AbsoluteHttpsUrl;
	};
	readonly author: {
		readonly name: string;
		readonly github: string;
		readonly url: AbsoluteHttpsUrl;
	};
	readonly licenses: {
		readonly software: 'MIT';
		readonly content: 'CC BY 4.0';
	};
}

export const siteConfig = {
	name: 'VisualChem',
	shortName: 'VisualChem',
	tagline: '用故事看懂化学',
	defaultDescription:
		'把宏观现象、微观粒子与化学符号锁进同一个可操纵故事。VisualChem 是面向大学化学的开源叙事可视化项目。',
	locale: 'zh-CN',
	version: '0.1.0-alpha.1',
	url: 'https://dongyaoze.github.io/visual-chem/',
	basePath: '/visual-chem',
	repository: {
		owner: 'DongYaoZe',
		name: 'visual-chem',
		url: 'https://github.com/DongYaoZe/visual-chem',
		issuesUrl: 'https://github.com/DongYaoZe/visual-chem/issues'
	},
	author: {
		name: 'Dong YaoZe',
		github: 'DongYaoZe',
		url: 'https://github.com/DongYaoZe'
	},
	licenses: {
		software: 'MIT',
		content: 'CC BY 4.0'
	}
} as const satisfies SiteConfig;

export default siteConfig;
