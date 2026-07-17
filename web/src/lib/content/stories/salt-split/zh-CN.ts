import type { SaltSplitStoryContent } from '../../types';

export const zhCNSaltSplitContent = {
	locale: 'zh-CN',
	seo: {
		title: '一锅盐水的分身术 — VisualChem',
		description:
			'两种盐溶进同一锅水,还能一种一种请出来吗?三元水盐相图在浏览器里由溶解度数据逐点算出:降温析硝酸钾、蒸发析硝酸钠,一张三角地图规划整场分身术。',
		path: '/stories/salt-split/',
		alternateLocalePath: '/en/stories/salt-split/',
		type: 'article',
		image: '/og-salt-split.png',
		imageAlt: '三元水盐三角相图、结晶烧杯与离子视图组成的 VisualChem 叙事封面',
		publishedTime: '2026-07-17',
		modifiedTime: '2026-07-17'
	},
	hero: {
		eyebrow: 'PHASE EQUILIBRIUM · STORY 03',
		metadata: ['约 12 分钟', '三元水盐体系', '可交互 Alpha'],
		heading: {
			lines: ['一锅盐水的'],
			emphasis: '分身术'
		},
		ledeLines: [
			'两种盐溶进同一锅水,就再也分不开了吗?',
			'一张三角形的地图,教你把它们一种一种请出来。'
		],
		scrollCue: '向下滚动,先留下你的预测',
		curveEvidence: '25 °C 等温线 · 由溶解度数据逐点算出'
	},
	readingNote: {
		eyebrow: 'HOW TO READ',
		body: [
			{ text: '右侧舞台由同一锅 (T, 配方) 驱动:' },
			{ text: '宏观', emphasis: 'strong' },
			{ text: '的烧杯告诉你锅里发生了什么,' },
			{ text: '微观', emphasis: 'strong' },
			{ text: '的离子解释它为什么发生,' },
			{ text: '符号', emphasis: 'strong' },
			{ text: '的三角地图标出所有配方的领土。' }
		]
	},
	stage: {
		dialogAriaLabel: '当前叙事幕图形',
		closeGraphicAriaLabel: '关闭当前图形',
		triViewAriaLabel: '当前叙事幕的三重表征舞台',
		shortStateAriaLabel: '当前图形状态',
		openGraphicButton: '查看当前图',
		shortState: {
			temperature: ({ temperatureC }) => `T ${temperatureC} °C`,
			liquid: ({ kno3G, nano3G }) => `液相 K ${kno3G} g · Na ${nano3G} g`,
			solids: ({ summary }) => `${summary}`
		}
	},
	scenes: [
		{
			id: 'hook',
			kicker: '00 · 钩子',
			title: '一锅溶了两种盐的水。',
			paragraphs: [
				'100 克硝酸钾、100 克硝酸钠,溶进 100 克接近沸腾的水——全部溶解,一锅透明的浓汤。K⁺、Na⁺、NO₃⁻ 在水里彼此不分你我。',
				'现在把火关掉,让它降回 25 °C。先下一个判断:析出来的晶体,会是什么?'
			]
		},
		{
			id: 'two-curves',
			kicker: '01 · 陡与不陡',
			title: '同样是升温助溶,幅度天差地别。',
			paragraphs: [
				'从 0 °C 到 100 °C,100 克水能溶的硝酸钾从 13.3 克涨到 246 克——十八倍还多;硝酸钠从 73 克到约 176 克,不到两倍半。',
				'换句话说:“冷”对硝酸钾是一场灾难,对硝酸钠只是打个折。降温结晶偏爱曲线陡的盐——这是分身术的第一件道具。但一锅水里同时有两种盐时,事情比两条曲线更微妙。'
			]
		},
		{
			id: 'shared-water',
			kicker: '02 · 一锅水不是两只锅',
			title: '两种盐,共享同一群硝酸根。',
			paragraphs: [
				'溶解平衡管的是离子的乘积:K⁺ 的浓度乘以 NO₃⁻ 的浓度,到顶就析出。可 NO₃⁻ 不问自己来自哪种盐——硝酸钠贡献的硝酸根,同样挤占硝酸钾的乘积上限。',
				'往饱和的硝酸钾溶液里加硝酸钠,什么都还没发生,硝酸钾的容量已经开始缩水。这叫同离子效应:两种盐不是并排的两条曲线,而是互相牵制的一张网。(这是理想溶液的第一课;真实卤水在第 08 幕还有一次反转。)'
			],
			formula: String.raw`K_{sp}=m_{\mathrm{K^+}}\cdot m_{\mathrm{NO_3^-}}`
		},
		{
			id: 'triangle-map',
			kicker: '03 · 从线到三角',
			title: '三种成分,一张三角形的地图。',
			paragraphs: [
				'水、硝酸钾、硝酸钠——三个质量分数,加起来是 100%。两个数定第三个,所以全部配方正好铺满一个三角形:三个顶点是纯物质,三条边是二元混合,内部每一个点,就是一锅确定的汤。',
				'你的锅此刻是三角形正中的一个点。接下来的每一次操作——降温、蒸发、加水、过滤——都会在这张地图上留下一条轨迹。'
			]
		},
		{
			id: 'isotherm',
			kicker: '04 · 25 °C 的国界线',
			title: '一条等温线,把三角分成四个国度。',
			paragraphs: [
				'在 25 °C,溶解平衡在三角形里画出两支边界:靠水顶点的一侧是不饱和溶液的海;越过硝酸钾的边界,进入“硝酸钾结晶场”——那里的每一锅都在析出纯硝酸钾;硝酸钠一侧同理。',
				'两支边界相遇于一点:共饱和点 E。它与两个盐顶点围出“双盐之谷”——在谷里,两种晶体一起析出,分身术就失败了。整场戏的目标,是让轨迹始终绕开这个谷。'
			]
		},
		{
			id: 'cooling',
			kicker: '05 · 点不动,地图动',
			title: '降温时,是国界线扫过你的锅。',
			paragraphs: [
				'降温不改变配方,总组成的点一动不动;移动的是国界。从 100 °C 一路降到 25 °C,硝酸钾的结晶场急剧扩张,越过你的锅——锅里开始落下纯硝酸钾晶体。',
				'此刻锅分成两个点:晶体在硝酸钾顶点,母液沿饱和边界滑行。总组成、母液、盐顶点三点共线——线段的分割比例就是产量。而硝酸钠的边界直到 25 °C 都没碰到你的锅——但只差一步:母液恰好停在共饱和点旁。再贪几度冷,第二种晶体就会跟着落下;经典配方停在这里,是有原因的。'
			]
		},
		{
			id: 'filter-jump',
			kicker: '06 · 过滤是一次传送',
			title: '捞走晶体,锅瞬间移动。',
			paragraphs: [
				'过滤只做一件事:把晶体从系统里拿走。总组成从原来的点,瞬间跳到母液所在的点——地图上的一次传送。',
				'这就是分身术的机关:结晶把一个点拆成“晶体”与“母液”两个点,过滤替你选择留下哪一个。第一只瓶子里,已经装着接近纯净的硝酸钾;锅里剩下的,是一锅硝酸钠为主的母液。'
			]
		},
		{
			id: 'evaporate',
			kicker: '07 · 离水远行',
			title: '蒸发,是沿直线远离水顶点。',
			paragraphs: [
				'重新加热到 100 °C,开始蒸水。地图上的规则很简单:失去水,总组成沿“背离水顶点”的直线一路远行——盐的比例不变,浓度越来越高。',
				'这条直线先撞上的,是硝酸钠的国界:纯硝酸钠开始析出。硝酸钾呢?100 °C 下它的溶解度大得惊人,乖乖待在液相里。第二次过滤:第二只瓶子,装上纯硝酸钠。但别蒸过头——直线的尽头是双盐之谷,贪心的最后几克水,会让硝酸钾跟着一起掉出来。'
			]
		},
		{
			id: 'honest-map',
			kicker: '08 · 这张地图有多真?',
			title: '把模型按在实测数据上。',
			paragraphs: [
				'把地图开到 90 °C——2005 年 Livermore 实验室在这里实测了 17 组饱和卤水(Carroll 等,逆向潮解法,浓度不确定度约 2%)。切换到“理想模型”:不考虑离子间相互作用的国界整体缩进一大圈,把实测点远远抛在界外;开头那锅 25 °C 的“纯硝酸钾”预言,理想模型甚至会判成双盐混晶。',
				'本页的校准模型给每个溶解平衡加上一个经验盐效应项,用 10、25、90 °C 三个实测共饱和点把它钉住;钉过之后,它在百年前的 25 °C 实测支线上偏差不超过一成,在 90 °C 的 17 组卤水上均方差约 9%。这不丢人:连 Yucca Mountain 项目的专业 Pitzer 数据库,在同一个共饱和点上也曾低估浓度近两倍。诚实的地图,应当标出自己被什么钉住。'
			],
			formula: String.raw`K_{sp}^{\mathrm{eff}}=K_{sp}\,(1+\beta\,m_{\mathrm{other}})`
		}
	],
	interactions: {
		hook: {
			prompt: '先预测:25 °C 时析出的晶体是',
			choices: [{ label: '只有硝酸钾' }, { label: '只有硝酸钠' }, { label: '两种盐的混晶' }],
			evidence:
				'实验与校准模型一致:析出约 54 克晶体,几乎全部是纯硝酸钾;硝酸钠一克也没离开母液。冷,对陡曲线的盐才是灾难。'
		},
		twoCurves: {
			controlLabel: '温度 T',
			sliderAriaLabel: '沿溶解度曲线选择温度',
			readout: ({ temperatureC, kno3Solubility, nano3Solubility }) =>
				`${temperatureC} °C:100 g 水溶 KNO₃ ${kno3Solubility} g · NaNO₃ ${nano3Solubility} g`
		},
		sharedWater: {
			controlLabel: '加入硝酸钠',
			sliderAriaLabel: '向饱和硝酸钾溶液加入硝酸钠',
			scale: {
				start: '0 g · 只有硝酸钾',
				end: '80 g · 硝酸根拥挤'
			},
			readout: ({ nano3G, kno3CapacityG, soloCapacityG }) =>
				`加入 NaNO₃ ${nano3G} g 后,100 g 水还能容纳 KNO₃ ${kno3CapacityG} g(独占时 ${soloCapacityG} g)`
		},
		triangleMap: {
			kno3ControlLabel: '硝酸钾 / g',
			kno3SliderAriaLabel: '设定锅中硝酸钾质量',
			nano3ControlLabel: '硝酸钠 / g',
			nano3SliderAriaLabel: '设定锅中硝酸钠质量',
			readout: ({ waterPct, kno3Pct, nano3Pct }) =>
				`水 ${waterPct}% · KNO₃ ${kno3Pct}% · NaNO₃ ${nano3Pct}%`
		},
		isotherm: {
			regionReadout: ({ region }) => `当前领土:${region}`,
			crystalReadout: ({ summary }) => `${summary}`
		},
		cooling: {
			controlLabel: '温度 T',
			sliderAriaLabel: '给整锅盐水降温',
			readout: ({ temperatureC, kno3CrystalsG }) =>
				`${temperatureC} °C · 已析出纯 KNO₃ ${kno3CrystalsG} g`
		},
		filterJump: {
			filterButton: '过滤:收走晶体',
			resetButton: '重新装锅',
			waitingHint: '锅底已经落满硝酸钾晶体——按下按钮,把它们收进第一只瓶子。',
			harvestOutput: ({ crystalsG }) => `第一只瓶:纯 KNO₃ ${crystalsG} g。锅传送到母液点。`
		},
		evaporate: {
			controlLabel: '蒸发水量',
			sliderAriaLabel: '在 100 °C 下蒸发水分',
			readout: ({ waterRemovedG, nano3CrystalsG }) =>
				`已蒸发 ${waterRemovedG} g 水 · 析出纯 NaNO₃ ${nano3CrystalsG} g`
		},
		honestMap: {
			toggleLabel: '模型',
			idealButton: '理想共离子',
			calibratedButton: '实测校准',
			verdictIdeal: '理想模型:国界缩水,实测点被抛在界外;开头那锅会被误判为双盐混晶。',
			verdictCalibrated: '校准模型:25 °C 与 90 °C 两个实测共饱和点被精确钉住,分身术的预言成立。'
		}
	},
	triView: {
		defaultAriaLabel: '水盐三元体系三重表征舞台',
		liveSummary: ({ temperatureC, liquidKno3G, liquidNano3G, region }) =>
			`当前状态:${temperatureC} °C,液相溶有硝酸钾 ${liquidKno3G} 克、硝酸钠 ${liquidNano3G} 克,${region}。`,
		synchronizedState: '同一锅汤 · 三种表征',
		temperature: '温度',
		liquidKno3: '液相 KNO₃',
		liquidNano3: '液相 NaNO₃',
		region: '领土',
		gramsValue: ({ grams }) => `${grams} g`,
		regionNames: {
			unsaturated: '不饱和溶液',
			kno3: '析出 KNO₃',
			nano3: '析出 NaNO₃',
			both: '双盐共析',
			dry: '无水全固'
		},
		pot: {
			ariaLabel: '结晶烧杯视图',
			viewName: '宏观 · 烧杯',
			caption: '液面与晶堆为解释性示意;析出何种晶体、析出多少由计算判断。',
			temperatureLabel: ({ temperatureC }) => `${temperatureC} °C`,
			dissolvedLabel: ({ kno3G, nano3G }) => `液相 KNO₃ ${kno3G} g · NaNO₃ ${nano3G} g`,
			kno3CrystalsLabel: ({ grams }) => `KNO₃ 晶体 ${grams} g`,
			nano3CrystalsLabel: ({ grams }) => `NaNO₃ 晶体 ${grams} g`,
			waterLabel: ({ grams }) => `水 ${grams} g`
		},
		ions: {
			ariaLabel: '离子视图',
			viewName: '微观 · 离子',
			caption: '离子数目按液相组成等比例缩放;位置为示意,不是分子动力学。',
			potassium: 'K⁺',
			sodium: 'Na⁺',
			nitrate: 'NO₃⁻',
			dissolvedTag: '溶液',
			latticeTag: '晶格'
		},
		triangle: {
			ariaLabel: ({ temperatureC, region }) =>
				`水—硝酸钾—硝酸钠三元相图,${temperatureC} °C 等温线,当前处于${region}`,
			waterVertex: 'H₂O',
			kno3Vertex: 'KNO₃',
			nano3Vertex: 'NaNO₃',
			isothermLabel: ({ temperatureC }) => `${temperatureC} °C 等温线`,
			regions: {
				unsaturated: '不饱和溶液',
				kno3Field: 'KNO₃ 结晶场',
				nano3Field: 'NaNO₃ 结晶场',
				bothField: '双盐之谷'
			},
			eutonicPoint: '共饱和点 E',
			totalPoint: '总组成',
			liquidPoint: '母液',
			tieLine: '结线',
			trajectory: '操作轨迹',
			experimentPoints: '文献实测点',
			curvesXAxis: '温度 T / °C',
			curvesYAxis: '溶解度 / g·(100 g 水)⁻¹',
			caption: {
				curves: '两条纯盐溶解度曲线由表格锚点在范托夫坐标内插得到;锚点本身逐点复现。',
				map: '等温线由溶解度数据与共离子平衡逐点计算;质量分数坐标。',
				calibrated: '校准模型:经验盐效应项由 25 °C 与 90 °C 实测共饱和点解出。',
				ideal: '理想模型:活度系数取 1,只保留共离子耦合——注意国界比实测缩进多少。'
			},
			captionKind: '模型'
		}
	},
	edge: {
		eyebrow: 'THE INDUSTRIAL CUT',
		heading: {
			lines: ['把分身术开到', '四种离子。']
		},
		body: '工业不满足于分开两种盐——它用分身术凭空造盐。转化法制硝酸钾:把智利硝石与氯化钾溶进同一锅水,K⁺、Na⁺、Cl⁻、NO₃⁻ 四种离子重新洗牌;沸腾浓缩时氯化钠的溶解度几乎不动,率先析出、趁热滤走,降温后硝酸钾大批落下。1950 年代以前,世界的硝酸钾几乎都这样从一锅四离子的汤里“变”出来。察尔汗盐湖的梯级盐田是同一张地图的露天版本:晒掉氯化钠,浮选出钾盐,尾液再去提锂。而这门手艺的黄金时代终结于另一场化学革命——哈伯合成氨让人类不再从地图上挖硝。',
		industryFacts: [
			{ label: '转化反应', value: 'NaNO₃ + KCl → KNO₃ + NaCl' },
			{ label: '热端', value: '沸腾母液中 NaCl 先析出,趁热过滤' },
			{ label: '冷端', value: '滤液降温,KNO₃ 结晶收获' },
			{ label: '吨耗', value: '约 0.96 t KCl + 0.86 t NaNO₃ → 1 t KNO₃' }
		],
		figureCaption: '转化法流程与吨耗为工业文献典型值;盐田事实来自察尔汗公开报道。'
	},
	conceptCheck: {
		question:
			'经典顺序是“先降温析 KNO₃,再蒸发析 NaNO₃”。如果反过来,一开始就在 100 °C 蒸发,会发生什么?',
		options: [
			{ label: '什么也析不出——必须先降温' },
			{ label: '先析出的换成 NaNO₃;但这条直线离双盐之谷不远,蒸过头两种晶体就会一起出来' },
			{ label: '依然先析出 KNO₃,操作顺序无关紧要' },
			{ label: '立即析出两种盐的混晶' }
		],
		correctIndex: 1,
		explanation:
			'蒸发让总组成沿背离水顶点的直线远行,先撞上的是 NaNO₃ 的国界——但这条射线很快逼近共饱和点,继续失水就进谷。先降温则是让 KNO₃ 的国界主动扫过你的锅,而 NaNO₃ 边界全程不接触。操作顺序,就是在地图上选路线。'
	},
	sandbox: {
		eyebrow: 'FREE PLAY · 带着问题离开故事线',
		title: '整套分身术交给你。',
		introduction:
			'温度、蒸发、加水、过滤,四个操作都在你手里。看轨迹在三角地图上怎么走,两只瓶子各收获多少,双盐之谷躲没躲开。',
		controls: {
			temperature: '温度 T',
			temperatureAriaLabel: '设定锅的温度',
			evaporate: '蒸发 10 g 水',
			evaporateAriaLabel: '蒸发 10 克水',
			addWater: '加水 10 g',
			addWaterAriaLabel: '加入 10 克水',
			filterButton: '过滤:收走晶体',
			resetButton: '重新装锅 (100/100/100)'
		},
		harvest: {
			label: '瓶中收获',
			kno3: ({ grams }) => `KNO₃ ${grams} g`,
			nano3: ({ grams }) => `NaNO₃ ${grams} g`,
			water: ({ grams }) => `已蒸水 ${grams} g`
		},
		challengeLabel: '试试看',
		challenge:
			'从 100/100/100 出发,把两种盐都以九成以上的收率各自收进瓶里——全程你最少要蒸发多少克水?',
		triViewAriaLabel: '自由探索三重表征实验室'
	},
	modelCard: {
		eyebrow: 'MODEL CARD · V0.1',
		heading: {
			lines: ['这张三角地图知道什么,', '又不知道什么。']
		},
		items: [
			{
				title: '骨架:溶解度表 + 范托夫坐标插值',
				body: [
					{
						text: '两种盐 0–100 °C 的溶解度表(硝酸钾取自人教版教材的经典表格,与 Seidell 1919 评估曲线逐字一致;硝酸钠取自 CRC 手册系列值——注意现代评估把它 100 °C 的溶解度定在约 176 克,而不是老表格流传的 180)在 ln Ksp 对 1/T 坐标下做单调三次插值;计算出的纯盐曲线精确复现每一个表格锚点,单元测试逐点钉住。'
					}
				],
				openByDefault: true
			},
			{
				title: '耦合:共离子模型 + 经验盐效应校准',
				body: [
					{
						text: '两盐通过共享的 NO₃⁻ 耦合(理想共离子模型),再乘上经验盐效应项 (1+β·m)。β 不是拟合参数的黑箱:它由 25 °C 与 90 °C 两个实测共饱和点直接解出,故两端等温线钉在实测上。把模型开关拨回“理想”,就能看到不加校准会错多远。'
					}
				],
				openByDefault: true
			},
			{
				title: '对照:实测卤水与支线',
				body: [
					{
						text: '90 °C 等温线上叠出的 17 组数据来自 Carroll、Craig 与 Wolery 的逆向潮解实验(浓度 ±2%),校准模型对它们的均方差约 9%。25 °C 的叠加点是 Reinders 1915 年的等温线——它的 KNO₃ 支真实地先降后升(共离子先赢、盐效应后赢),单参数校准抹平了这个浅谷,支线中段偏差最大约一成;本卡如实申报而不是隐藏。作为参照:Yucca Mountain 项目的专业 Pitzer 数据库,在 90 °C 共饱和点上低估浓度近两倍。'
					}
				],
				openByDefault: true,
				links: [
					{
						label: 'Carroll et al. 2005, Geochem. Trans. 6:19 ↗',
						href: 'https://geochemicaltransactions.biomedcentral.com/articles/10.1186/1467-4866-6-19'
					},
					{
						label: '国际关键表 vol. IV(1928 扫描本)↗',
						href: 'https://archive.org/details/international-critical-tables_1928_4'
					}
				]
			},
			{
				title: '不能据此推断的内容',
				body: [
					{
						text: '本页模型只对 H₂O–KNO₃–NaNO₃ 有效:0–100 °C 内两盐都不生成水合物或复盐,这正是它作为教学体系的干净之处;换一对盐,边界形状与固相种类都会不同。经验盐效应项不可外推到其他体系。地图不含结晶动力学——“多久析出、晶粒多大”是另一个问题。饱和硝酸盐溶液的沸点在 115–165 °C(Rard 2006),故 100 °C 的锅仍是液体;真实车间的蒸发在沸腾下进行,这里按等温近似处理。'
					}
				],
				openByDefault: false,
				links: [
					{
						label: 'Rard et al. 2006 沸点实测(OSTI 开放文本)↗',
						href: 'https://www.osti.gov/servlets/purl/898040'
					}
				]
			}
		]
	},
	ending: {
		lead: '两种盐,从头到尾谁也没有消失。',
		heading: {
			lines: ['你只是带着一锅汤,', '在三角地图上走完了一个来回。']
		},
		catalogLink: '回到故事目录',
		sourceLink: '查看计算与源代码 ↗'
	}
} satisfies SaltSplitStoryContent;

export default zhCNSaltSplitContent;
