<script lang="ts">
	import siteConfig from '$lib/config/site';

	interface Props {
		title: string;
		description: string;
		path: string;
		locale?: 'zh-CN' | 'en';
		type?: 'website' | 'article';
		image?: string;
		imageAlt?: string;
		chinesePath?: string;
		englishPath?: string;
		publishedTime?: string;
		modifiedTime?: string;
	}

	let {
		title,
		description,
		path,
		locale = 'zh-CN',
		type = 'website',
		image = '/og-home.png',
		imageAlt = 'VisualChem：把大学化学原理讲成可以走进去的故事',
		chinesePath,
		englishPath,
		publishedTime = '2026-07-16',
		modifiedTime = '2026-07-16'
	}: Props = $props();

	function absolute(pathname: string): string {
		return new URL(pathname.replace(/^\//, ''), siteConfig.url).toString();
	}

	let canonical = $derived(absolute(path));
	let imageUrl = $derived(absolute(image));
	let chinese = $derived(
		chinesePath ?? (locale === 'zh-CN' ? path : path.replace(/^\/en(?=\/)/, '') || '/')
	);
	let english = $derived(
		englishPath ?? (locale === 'en' ? path : `/en${path === '/' ? '/' : path}`)
	);
	let localeTag = $derived(locale === 'zh-CN' ? 'zh_CN' : 'en_US');
	let schema = $derived({
		'@context': 'https://schema.org',
		'@type': type === 'article' ? 'Article' : 'LearningResource',
		name: title,
		description,
		url: canonical,
		inLanguage: locale,
		image: imageUrl,
		dateModified: modifiedTime,
		...(type === 'article' ? { datePublished: publishedTime } : {}),
		author: {
			'@type': 'Person',
			name: siteConfig.author.name,
			url: siteConfig.author.url
		},
		isPartOf: {
			'@type': 'WebSite',
			name: siteConfig.name,
			url: siteConfig.url
		},
		license: 'https://creativecommons.org/licenses/by/4.0/'
	});
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />
	<link rel="alternate" hreflang="zh-CN" href={absolute(chinese)} />
	<link rel="alternate" hreflang="en" href={absolute(english)} />
	<link rel="alternate" hreflang="x-default" href={absolute(chinese)} />
	<meta property="og:site_name" content={siteConfig.name} />
	<meta property="og:locale" content={localeTag} />
	<meta property="og:type" content={type} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:image:alt" content={imageAlt} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />
	<meta name="twitter:image:alt" content={imageAlt} />
	{#if type === 'article'}
		<meta property="article:published_time" content={publishedTime} />
		<meta property="article:modified_time" content={modifiedTime} />
	{/if}
	<svelte:element this={"script"} type="application/ld+json"
		>{JSON.stringify(schema)}</svelte:element
	>
</svelte:head>
