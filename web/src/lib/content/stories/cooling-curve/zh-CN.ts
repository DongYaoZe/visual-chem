import type { CoolingCurveStoryContent } from '../../types';

export const zhCNCoolingCurveContent = {
	locale: 'zh-CN',
	seo: {
		title: '冷却曲线侦探 — VisualChem',
		description:
			'一支不知配比的铋镉合金、一根温度计:从降温曲线的转折与台阶,倒推出整张二元共晶相图。液相线由 Schröder–van Laar 方程逐点算出,冷却曲线由潜热热平衡模拟。',
		path: '/stories/cooling-curve/',
		alternateLocalePath: '/en/stories/cooling-curve/',
		type: 'article',
		image: '/og-cooling-curve.png',
		imageAlt: '铋镉共晶相图、坩埚与冷却曲线组成的 VisualChem 叙事封面',
		publishedTime: '2026-07-18',
		modifiedTime: '2026-07-18'
	},
	hero: {
		eyebrow: 'PHASE EQUILIBRIUM · STORY 04',
		title: ['冷却曲线', '侦探'],
		subtitle: '一支合金,一根温度计——从一条降温记录,倒推出整张相图。'
	},
	readingNote:
		'右侧舞台由同一个熔体状态驱动:宏观的坩埚告诉你合金在做什么,微观的原子解释它为什么这样做,符号面板在"温度—时间曲线"与"温度—组成地图"之间切换——侦探的证据与结论。',
	stage: {
		dialogAriaLabel: '当前叙事幕图形',
		closeGraphicAriaLabel: '关闭当前图形',
		openGraphicButton: '查看当前图',
		shortStateAriaLabel: '当前图形状态'
	},
	shortState: {
		temperature: ({ temperatureC }) => `T ${temperatureC} °C`,
		time: ({ timeS }) => `t ${timeS} s`,
		phase: '相态'
	},
	scenes: [
		{
			id: 'hook',
			prose: `物理化学实验室里,你拿到一支装着熔融合金的试管——老师说它是"铋镉二元合金",但没告诉你配比。

你唯一的仪器是一根温度计。

**能从一条降温曲线,倒推出这个合金的完整相图吗?**

先预测:这条曲线会是什么形状?`
		},
		{
			id: 'pure-metal',
			prose: `如果试管里是**纯金属**(比如纯铋),降温曲线会有一段**水平台阶**——金属凝固时,释放的潜热恰好抵消散热,温度停在熔点不动,直到最后一滴液体凝固。

台阶的高度就是熔点;台阶的长度正比于凝固释放的潜热。

但你的合金不是纯物质。会发生什么?`
		},
		{
			id: 'first-crystal',
			prose: `慢慢降温。到某个温度,**第一颗晶体**从熔体中析出——是铋,还是镉?取决于配比:铋多先析铋,镉多先析镉。

**液相线方程**(Schröder–van Laar)告诉你第一颗晶体何时出现:

$$T_{\\mathrm{liq}} = \\left(\\frac{1}{T_{\\mathrm{fus}}} - \\frac{R}{\\Delta H_{\\mathrm{fus}}}\\ln x\\right)^{-1}$$

晶体一旦析出,**熔体的组成就开始变化**——析出的是纯铋,剩下的液体富镉,液相线温度随之下降。曲线出现**转折**,但不会停住,而是换一个更缓的斜率继续降温。`
		},
		{
			id: 'eutectic-arrest',
			prose: `液相的组成沿液相线一路滑到**共晶点**:两种晶体开始同时析出,交织成层片,把最后的液体一次冻结。

曲线在这里出现**水平台阶**——不是传热变慢了,而是三相共存把温度钉死。

**台阶的长度,正比于到达共晶时还剩多少液体。**这句话后面有大用。`
		},
		{
			id: 'read-the-map',
			prose: `现在把证据搬上地图:

- **转折点**的温度 → 这个组成的**液相线**数据点
- **台阶**的温度 → **共晶温度**(所有组成共享同一条水平线)
- **台阶的长度** → 到达共晶时的液相分数

测多个组成,每个组成给一个液相线点;所有台阶都停在同一温度;把点连起来——**从曲线,重建出相图**。这正是物化实验"二元金属相图(步冷曲线法)"让你亲手做的事。`
		},
		{
			id: 'phase-rule',
			prose: `为什么曲线"该转折时转折、该停时停"?相律一句话统领全部(凝聚系统):

$$F = C - P + 1$$

- **全液相**(1 相):$F=2$,温度自由下滑——曲线是斜的
- **液 + 一种晶体**(2 相):$F=1$,组成被液相线钉住——曲线转折后继续斜降
- **液 + 两种晶体**(3 相):$F=0$,温度与组成都被钉死——水平台阶

台阶是**相律禁止温度变化**,直到最后一滴液体消失。`
		},
		{
			id: 'real-anchors',
			prose: `把地图与真实世界对表:

- 纯铋熔点 **271.3 °C**(熔化焓 10.9 kJ/mol),纯镉 **321.1 °C**(6.3 kJ/mol)
- 实测共晶约 **145.5 °C**、60 at% Bi / 40 at% Cd;本页理想模型算出 **135.3 °C**、x(Cd)=0.565——组成几乎命中,温度低约 10 K,这是理想溶液近似的诚实代价

生活里的共晶无处不在:撒盐化雪的极限是盐水共晶 **−21.1 °C**;63/37 焊锡在 **183 °C** 干脆凝固,而 50/50 焊锡要经过约 30 °C 的"糊状区";消防喷头里的伍德合金 **70 °C** 一到就整体熔断。`
		},
		{
			id: 'cooling-rate',
			prose: `实验的告诫:降温不能太快,否则**过冷**让晶体推迟析出,曲线先俯冲再回弹(复辉),转折被抹圆、台阶被拖低。

理想的步冷曲线需要接近平衡:每一刻液相组成都待在液相线上。本页的曲线按牛顿散热 + 平衡凝固模拟——真实记录仪上的小波动与圆角,是动力学在提醒你它的存在。`
		},
		{
			id: 'sandbox',
			prose: `现在整支试管交给你:调配任意组成,按下降温,看曲线如何响应。

**挑战**:找出台阶最长的配比(Tammann 三角的顶点);再配一条几乎看不见台阶的曲线;从转折点读出液相线温度,与地图对照。`
		}
	],
	interactions: {
		hook: {
			question: '先预测:这条降温曲线的形状是',
			options: [
				{ id: 'smooth', label: '光滑下降,没有转折' },
				{ id: 'one-break', label: '一个转折 + 一个台阶', correct: true },
				{ id: 'many-steps', label: '多级台阶,像楼梯' }
			],
			correctExplanation:
				'正确。非共晶配比先析出一种晶体(曲线转折变缓),最后在共晶温度一次冻结(水平台阶)。'
		},
		firstCrystal: {
			compositionLabel: '镉摩尔分数',
			compositionUnit: 'x(Cd)',
			showLiquidusButton: '显示计算的液相线'
		},
		eutecticArrest: {
			compositionLabel: '镉摩尔分数',
			compositionUnit: 'x(Cd)',
			showSolidusButton: '标出共晶温度线'
		},
		readTheMap: {
			showCurveButton: '把证据搬上地图'
		},
		sandbox: {
			compositionLabel: '镉摩尔分数',
			compositionUnit: 'x(Cd)',
			playButton: '▶ 开始降温',
			pauseButton: '⏸ 暂停',
			resetButton: '↻ 重置',
			challenge: '找出台阶最长的配比;再配一条几乎看不见台阶的曲线。'
		}
	},
	triView: {
		defaultAriaLabel: '铋镉合金的三重表征舞台',
		liveSummary: ({ region, melt }) => `当前状态:${region},液相占 ${melt}。`,
		synchronizedState: '同一熔体 · 三种表征',
		crucible: {
			ariaLabel: '坩埚视图',
			viewName: '宏观 · 坩埚',
			caption: '熔体辉光与晶体形态为解释性示意;析出何种晶体、析出多少由计算判断。',
			temperatureLabel: ({ temperatureC }) => `${temperatureC} °C`,
			liquidLabel: ({ percent }) => `液相 ${percent}%`,
			solidALabel: ({ percent }) => `Bi 晶体 ${percent}%`,
			solidBLabel: ({ percent }) => `Cd 晶体 ${percent}%`,
			clockLabel: ({ minutes }) => `t = ${minutes} min`
		},
		melt: {
			ariaLabel: '原子视图',
			viewName: '微观 · 原子',
			caption: '原子数目按相分数等比例缩放;位置为示意,不是分子动力学。',
			bismuth: 'Bi',
			cadmium: 'Cd',
			liquidTag: '熔体',
			crystalTag: '晶体'
		},
		diagram: {
			ariaLabel: ({ temperatureC, region }) => `铋镉相图,当前 ${temperatureC} °C,处于${region}`,
			xAxis: '镉摩尔分数 x(Cd)',
			curveXAxis: '时间 t / s',
			yAxis: '温度 T / °C',
			bismuthVertex: 'Bi',
			cadmiumVertex: 'Cd',
			liquidusLine: '液相线',
			eutecticPoint: '共晶点',
			breakMarker: '转折',
			arrestMarker: '台阶',
			caption: {
				map: '液相线由 Schröder–van Laar 方程逐点计算;共晶点是两支的交点。',
				curve: '该组成的步冷曲线由牛顿散热 + 凝固潜热逐步模拟;转折与台阶都是算出来的。'
			}
		},
		regionNames: {
			liquid: '全液相',
			'liquid+A': '液相 + Bi 晶体',
			'liquid+B': '液相 + Cd 晶体',
			'eutectic-arrest': '共晶凝固中',
			'solid-mixture': '固体混合物'
		}
	},
	edge: {
		title: '侦探的工具箱',
		facts: [
			{
				term: '液相线',
				definition: '第一颗晶体析出的温度—组成关系;理想溶液下由 Schröder–van Laar 方程给出。'
			},
			{
				term: '共晶点',
				definition: '两支液相线的交点:两种晶体同时析出的唯一温度与组成,F = 0。'
			},
			{
				term: '相律',
				definition: 'F = C − P + 1(凝聚系统):自由度 = 还能独立变化的强度性质数目。'
			},
			{
				term: 'Tammann 三角',
				definition: '共晶台阶时长对组成作图得三角形,顶点即共晶组成——1903 年沿用至今的经典方法。'
			}
		]
	},
	conceptCheck: {
		question: '如果合金配比恰好是共晶比例,冷却曲线会是什么样?',
		options: [
			{ label: '没有台阶,一路斜降到底' },
			{ label: '只有一个台阶,停在共晶温度' },
			{ label: '两个台阶,分别对应两种晶体' },
			{ label: '先台阶后转折,顺序与普通配比相反' }
		],
		correctIndex: 1,
		explanation:
			'共晶配比的液相线就在共晶温度:一降到那里,三相共存(F=0)立即开始,整个凝固都发生在这一个温度——曲线像纯物质一样只有一个台阶,这正是"共晶焊锡"干脆凝固的原因。'
	},
	sandbox: {
		title: '步冷曲线实验室',
		description: '调配任意组成,模拟一次完整降温;曲线、坩埚与地图同步响应。',
		compositionLabel: '镉摩尔分数',
		compositionUnit: 'x(Cd)',
		controls: {
			play: '▶ 开始降温',
			pause: '⏸ 暂停',
			reset: '↻ 重置'
		},
		challenge:
			'找出台阶最长的配比(Tammann 顶点);配一条几乎无台阶的曲线;从转折读液相线温度并与地图对照。'
	},
	modelCard: {
		title: '模型卡 · V0.1',
		items: [
			{
				term: '体系',
				value:
					'铋–镉二元简单共晶;端际固溶度可忽略(<1 at%),析出为纯晶体——这正是它成为步冷曲线经典教学体系的原因(国内教材常用 Sn-Bi/Pb-Sn,原理相同)。'
			},
			{
				term: '液相线',
				value:
					'Schröder–van Laar 理想溶液方程,双向解析。纯组分数据:Bi 熔点 271.3 °C、ΔH_fus 10.9 kJ/mol(NIST 标准物质给 11.1);Cd 321.1 °C、6.25 kJ/mol(CODATA)。'
			},
			{
				term: '共晶点(理想 vs 实测)',
				value:
					'模型 135.3 °C、x(Cd)=0.565;文献 144–146 °C、约 40 at% Cd。组成命中 1 at% 内,温度低约 10 K——Bi-Cd 混合焓约 +840 J/mol(近理想),偏差如实标注。'
			},
			{
				term: '冷却曲线模拟',
				value:
					'牛顿散热 + 平衡凝固潜热源项;两相区有效热容 C_p + ΔH·(df_s/dT),共晶平台按剩余液体的潜热预算逐步支付。过冷与复辉未建模,正文单独说明。'
			},
			{
				term: '生活锚点来源',
				value:
					'盐水共晶 −21.1 °C/23.3 wt%(冰 + NaCl·2H₂O);FHWA 手册的撒盐实操下限约 −9.5 °C;Sn-Pb 63/37 与 50/50 的固液相线;伍德合金 70 °C 消防熔断——均有一手引文,见仓库数据说明。'
			}
		]
	},
	ending: {
		summary: '一条降温曲线里藏着整张地图:转折交出液相线,台阶钉住共晶温度,台阶的长短指向共晶组成。',
		invitation: '侦探的下一案,在故事目录里等你。',
		backToHome: '回到故事目录'
	}
} satisfies CoolingCurveStoryContent;

export default zhCNCoolingCurveContent;
