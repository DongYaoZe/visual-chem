import type { BoilingMapStoryContent } from '../../types';

export const zhCNBoilingMapContent = {
	locale: 'zh-CN',
	seo: {
		title: '沸腾的地图 — VisualChem',
		description:
			'从拉萨的一锅面到冻干草莓与高压锅:水的压力—温度相图由 IAPWS 公式在浏览器里逐点算出,同一张地图上规划三次旅行。',
		path: '/stories/boiling-map/',
		alternateLocalePath: '/en/stories/boiling-map/',
		type: 'article',
		image: '/og-boiling-map.png',
		imageAlt: '水的压力—温度相图、灶台锅具与分子竞赛视图组成的 VisualChem 叙事封面',
		publishedTime: '2026-07-17',
		modifiedTime: '2026-07-17'
	},
	hero: {
		eyebrow: 'PHASE EQUILIBRIUM · STORY 02',
		metadata: ['约 10 分钟', '单组分相平衡', '可交互 Alpha'],
		heading: {
			lines: ['沸腾的'],
			emphasis: '地图'
		},
		ledeLines: ['在拉萨,水不到 90 °C 就翻滚。', '一张会计算的地图,能解释厨房里的一切例外。'],
		scrollCue: '向下滚动,先留下你的预测',
		curveEvidence: '拉萨 3650 m · 约 88 °C 沸腾'
	},
	readingNote: {
		eyebrow: 'HOW TO READ',
		body: [
			{ text: '右侧舞台由同一个 (T, p) 状态驱动:' },
			{ text: '宏观', emphasis: 'strong' },
			{ text: '的灶台告诉你水在做什么,' },
			{ text: '微观', emphasis: 'strong' },
			{ text: '的液面解释它为什么这样做,' },
			{ text: '符号', emphasis: 'strong' },
			{ text: '的相图给出整片领土的地图。' }
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
			pressure: ({ pressureKPa }) => `p ${pressureKPa} kPa`,
			phase: ({ phase }) => `${phase}`
		}
	},
	scenes: [
		{
			id: 'hook',
			kicker: '00 · 钩子',
			title: '在拉萨,水不到 90 °C 就滚了。',
			paragraphs: [
				'海拔 3650 米的拉萨,一锅水大约 88 °C 就翻滚起来。面条久煮不熟,不是火不够旺,而是“滚水”本身不够热。',
				'先下一个判断:同样的水、同样的火,高原上的沸水比海平面的更热、一样热,还是更凉?然后我们去听水自己的说法。'
			]
		},
		{
			id: 'invisible-race',
			kicker: '01 · 看不见的竞赛',
			title: '液面上方,一场双向的奔跑。',
			paragraphs: [
				'任何温度下,都有分子挣脱液面逃入气相,同时也有气相分子被抓回液面。密闭容器里,两股流量迟早打平——液面上方稳定下来的蒸气压强,就是饱和蒸气压。',
				'它只取决于温度:升温给逃逸的一方撑腰,平衡点上移。25 °C 的水,饱和蒸气压约 3.2 kPa——远低于大气压,所以水面安静,但蒸发从未停止。'
			],
			formula: String.raw`p^*=p^*(T)`
		},
		{
			id: 'draw-the-curve',
			kicker: '02 · 把点连成线',
			title: '每个温度,水都报出一个压强。',
			paragraphs: [
				'把“温度—饱和蒸气压”一对对记下来,p–T 平面上就浮出一条曲线。它不是手绘的示意:IAPWS 工业标准公式正在你的浏览器里逐点算出这条线。',
				'拖动温度,看状态点沿曲线爬升。压强的增长越来越陡——这条曲线近乎指数,第 4 幕会给出它藏起来的直线。'
			]
		},
		{
			id: 'boiling-defined',
			kicker: '03 · 沸腾的定义',
			title: '沸腾,是蒸气压追上外压的那一刻。',
			paragraphs: [
				'液体内部想长出气泡,气泡里只有水蒸气,撑起它的压强是 p*(T);外界用大气压把它往回压。p* < P 时气泡当场坍缩,水只能表面蒸发;p*(T) = P 的瞬间,气泡第一次站得住脚——整锅水开始翻滚。',
				'所以“沸点”从来不是一个数,而是一场谈判的结果:外压说了算。移动纵轴上那条外压线,交点就沿着曲线滑动。'
			],
			formula: String.raw`p^*(T_b)=P`
		},
		{
			id: 'straighten-the-curve',
			kicker: '04 · 把曲线拉直',
			title: '换一双坐标,指数变成直线。',
			paragraphs: [
				'以 ln p 对 1/T 作图,陡峭的曲线几乎成为直线——这是 Clausius–Clapeyron 方程的承诺:斜率等于 −ΔH·R⁻¹。',
				'曲线的“陡”里藏着一个可测的物理量:汽化焓,约 41 kJ/mol——把一摩尔水全部送离液面的能量代价。这条近似把蒸气当理想气体,在 100 °C 附近约偏高 1.5%;诚实的地图连自己的误差一起标出。'
			],
			formula: String.raw`\ln p=-\frac{\Delta H_{\mathrm{vap}}}{R}\cdot\frac{1}{T}+C`
		},
		{
			id: 'complete-the-map',
			kicker: '05 · 地图完整了',
			title: '三条边界,一张领土地图。',
			paragraphs: [
				'汽化线不是孤例:冰与蒸气之间有升华线,冰与液态水之间有熔化线。三条线在 0.01 °C、611.657 Pa 相遇——三相点,冰、水、汽唯一能共存的状态,国际温标曾拿它定义开尔文。',
				'注意熔化线:近乎垂直,而且向左倾——加压反而帮冰融化,这是水的反常。汽化线的另一端停在 373.95 °C、22.06 MPa 的临界点,“液”与“气”的分别到此为止。'
			],
			formula: String.raw`\frac{\mathrm{d}p}{\mathrm{d}T}=\frac{\Delta H}{T\,\Delta V}`
		},
		{
			id: 'altitude-travel',
			kicker: '06 · 沿海拔旅行',
			title: '把地图带去旅行。',
			paragraphs: [
				'海拔升高,外压沿标准大气模型下降;水平的外压线随之下移,与汽化线的交点向低温滑动。丹佛约 95 °C,拉萨约 88 °C,珠峰营地约 70 °C——茶还烫嘴,却已经在沸腾。',
				'开头的预测此刻有了答案:高原的“滚水”确实更凉。烹饪要补的不是火力,是压强。'
			]
		},
		{
			id: 'freeze-dry-detour',
			kicker: '07 · 冻干的绕行',
			title: '不路过液态,也能失去水分。',
			paragraphs: [
				'冻干草莓的秘密是一条绕行路线:先常压冷冻,再抽真空到几十帕,最后缓缓加热。状态点绕到三相点之下,冰直接变成蒸气,从不融化。',
				'这正是把相图当“地图”读的意义:同样的起点与终点,可以规划不同的路线;路线穿过哪条边界,决定材料经历什么。细胞结构不被液态水拉垮,冻干食品复水后才认得自己。'
			]
		},
		{
			id: 'pressure-cooker',
			kicker: '08 · 反向操作',
			title: '压力锅:把交点推向高温。',
			paragraphs: [
				'高原的问题反过来就是厨房的方案:锅盖锁住蒸气,让锅内压强升到约两个大气压,沸点被推到约 120 °C,炖煮的反应快上数倍——同一张地图上朝另一个方向的旅行。',
				'从拉萨的一锅面到厨房的高压锅,你用的是同一句话:沸点是 p*(T) 与外压的交点。地图不是背下来的,是算出来的。'
			]
		}
	],
	interactions: {
		hook: {
			prompt: '先预测:高原上的沸水',
			choices: [{ label: '更热' }, { label: '一样 100 °C' }, { label: '更凉' }],
			evidence:
				'标准大气下,3650 m 处外压约 64 kPa,水约 88 °C 就沸腾。“100 °C”不是水的天性,而是海平面的巧合。'
		},
		drawTheCurve: {
			controlLabel: '温度 T',
			sliderAriaLabel: '沿饱和线选择温度',
			readout: ({ temperatureC, pressureKPa }) => `T = ${temperatureC} °C · p* = ${pressureKPa} kPa`
		},
		boilingDefined: {
			controlLabel: '外压 P',
			sliderAriaLabel: '设定外界压强',
			scale: {
				start: '5 kPa · 近真空',
				end: '250 kPa · 高压锅'
			},
			readout: ({ pressureKPa, temperatureC }) =>
				`外压 ${pressureKPa} kPa 下,沸点 ${temperatureC} °C`
		},
		straighten: {
			toggleLabel: '坐标',
			mapButton: 'p–T 地图',
			linearizedButton: 'ln p — 1/T',
			enthalpyReadout: ({ enthalpyKJ }) => `直线斜率给出 ΔH ≈ ${enthalpyKJ} kJ/mol`
		},
		altitude: {
			controlLabel: '海拔',
			sliderAriaLabel: '选择海拔高度',
			landmarks: {
				'sea-level': '海平面',
				denver: '丹佛',
				lhasa: '拉萨',
				everest: '珠峰'
			},
			readout: ({ altitudeM, pressureKPa, temperatureC }) =>
				`${altitudeM} m · 外压 ${pressureKPa} kPa · 沸点 ${temperatureC} °C`
		},
		freezeDry: {
			controlLabel: '冻干程序进度',
			sliderAriaLabel: '推进冻干程序',
			stages: ['① 常压冷冻', '② 抽真空', '③ 升华干燥'],
			readout: ({ temperatureC, pressureKPa }) => `T = ${temperatureC} °C · p = ${pressureKPa} kPa`
		},
		pressureCooker: {
			controlLabel: '锅内压强',
			sliderAriaLabel: '设定压力锅内压强',
			scale: {
				start: '101 kPa · 敞口锅',
				end: '250 kPa · 上限阀'
			},
			readout: ({ pressureKPa, temperatureC }) => `${pressureKPa} kPa → 沸点 ${temperatureC} °C`
		}
	},
	triView: {
		defaultAriaLabel: '水的压力—温度三重表征舞台',
		liveSummary: ({ temperatureC, pressureKPa, phase }) =>
			`当前状态:温度 ${temperatureC} °C,压强 ${pressureKPa} kPa,${phase}。`,
		synchronizedState: '同一状态 · 三种表征',
		temperature: '温度',
		pressure: '压强',
		phase: '相态',
		boilingPoint: '此压强下沸点',
		phaseNames: {
			solid: '冰',
			liquid: '液态水',
			vapor: '水蒸气',
			supercritical: '超临界'
		},
		kitchen: {
			ariaLabel: '灶台锅具视图',
			viewName: '宏观 · 灶台',
			caption: '火焰与气泡为解释性示意;是否沸腾由计算判断。',
			altitudeLabel: ({ altitudeM }) => `海拔 ${altitudeM} m`,
			boilingLabel: ({ temperatureC }) => `沸点 ${temperatureC} °C`,
			waterState: ({ temperatureC }) => `水温 ${temperatureC} °C`
		},
		race: {
			ariaLabel: '液面分子竞赛视图',
			viewName: '微观 · 液面上方',
			caption: '逃逸与回落的流量比例来自蒸气压计算;粒子运动为示意,不是分子动力学。',
			escapeLabel: '逃逸',
			returnLabel: '回落'
		},
		map: {
			ariaLabel: ({ temperatureC, pressureKPa, phase }) =>
				`水的压力—温度相图,当前状态 ${temperatureC} °C、${pressureKPa} kPa,处于${phase}区`,
			xAxis: '温度 T / °C',
			xAxisLinearized: '1000 / T · K⁻¹',
			yAxis: '压强 p / kPa · 对数',
			yAxisLinearized: 'ln (p / kPa)',
			regions: {
				solid: '冰',
				liquid: '液态水',
				vapor: '水蒸气'
			},
			triplePoint: '三相点',
			criticalPoint: '临界点',
			boilingLine: '汽化线',
			sublimationLine: '升华线',
			meltingLine: '熔化线',
			externalPressure: '外压',
			caption: {
				map: '三条相界由 IAPWS 公式逐点计算;纵轴为对数坐标。',
				linearized: 'ln p 对 1/T:汽化线近乎直线,斜率等于 −ΔH·R⁻¹。'
			},
			captionKind: '模型'
		}
	},
	edge: {
		eyebrow: 'THE EDGE OF THE MAP',
		heading: {
			lines: ['地图的尽头,', '“液”与“气”失去分别。']
		},
		body: '沿汽化线一路向右,液体越来越轻,蒸气越来越密,到临界点两者密度相等,界面消失。此后的水是超临界流体——发电厂锅炉与绿色萃取工艺的工作区。汽化线到此为止,不是画图的人累了,而是再没有两个相可以分界。',
		criticalFacts: [
			{ label: '临界温度', value: '373.95 °C' },
			{ label: '临界压力', value: '22.064 MPa ≈ 218 atm' },
			{ label: '三相点', value: '0.01 °C · 611.657 Pa' }
		],
		figureCaption: '临界点与三相点数值来自 IAPWS-IF97;相界在浏览器内逐点计算。'
	},
	conceptCheck: {
		question: '冻干为什么能让冰直接变成水蒸气、全程不出现液态水?',
		options: [
			{ label: '真空破坏了水分子之间的氢键' },
			{ label: '腔压低于三相点压强,加热路径从升华线下方穿过,不经过液态区' },
			{ label: '冰其实先融化了,只是速度太快看不见' },
			{ label: '冻干机的温度低到让液态水无法存在' }
		],
		correctIndex: 1,
		explanation:
			'液态水的领土有一条底线:三相点压强 611.657 Pa。腔压低于它时,水平的加热路径只会与升华线相交,固体直接进入气相。'
	},
	sandbox: {
		eyebrow: 'FREE PLAY · 带着问题离开故事线',
		title: '整张地图交给你。',
		introduction:
			'温度与压强两个旋钮都在你手里。看状态点落进哪个相区,沸点读数如何跟随压强移动,哪条边界挡在你想去的方向上。',
		controls: {
			temperature: '温度 T',
			temperatureAriaLabel: '自由探索的温度',
			pressure: '压强 p · 对数',
			pressureAriaLabel: '自由探索的压强',
			pressureScale: {
				start: '0.1 kPa',
				end: '10 MPa'
			}
		},
		challengeLabel: '试试看',
		challenge: '让 25 °C 的水沸腾:压强要降到多少?实验室的旋转蒸发仪每天都在做这件事。',
		triViewAriaLabel: '自由探索三重表征实验室'
	},
	modelCard: {
		eyebrow: 'MODEL CARD · V0.1',
		heading: {
			lines: ['这幅图知道什么,', '又不知道什么。']
		},
		items: [
			{
				title: '汽化线:IAPWS-IF97 区域 4',
				body: [
					{
						text: '饱和压强与饱和温度采用工业标准 IAPWS-IF97 区域 4 的解析公式,正反两个方向完全一致;单元测试钉住官方验证值(300 K → 3.536 59 kPa 等三组)与常压沸点 100 °C。'
					}
				],
				openByDefault: true,
				links: [
					{
						label: 'IAPWS R7-97(2012) 发布文档 ↗',
						href: 'https://iapws.org/documents/release/IF97-Rev'
					}
				]
			},
			{
				title: '固相边界:IAPWS R14-08(2011)',
				body: [
					{
						text: '冰 Ih 的熔化线与升华线来自 IAPWS 2011 年修订版;测试钉住官方值(260 K 熔化压 138.268 MPa、230 K 升华压 8.947 Pa),并核对三条线在三相点处相接。高压冰 III/V/VI/VII 的领土不在这张地图上。'
					}
				],
				openByDefault: true,
				links: [
					{
						label: 'IAPWS R14-08(2011) 发布文档 ↗',
						href: 'https://iapws.org/documents/release/MeltSub2011'
					}
				]
			},
			{
				title: '海拔与大气:国际标准大气',
				body: [
					{
						text: '海拔—压强换算采用国际标准大气 0–11 km 段。真实天气的气压有百分之几的波动,山上的沸点也随天气小幅漂移;正文数字取标准大气的典型值。'
					}
				],
				openByDefault: false
			},
			{
				title: '不能据此推断的内容',
				body: [
					{
						text: 'Clausius–Clapeyron 的斜率读数把蒸气当理想气体、忽略液体体积,在 100 °C 附近约偏高 1.5%。地图不含盐等溶质带来的沸点升高与凝固点降低,也不涉及传热速率——“多久烧开”是另一个问题。'
					}
				],
				openByDefault: false
			}
		]
	},
	ending: {
		lead: '你刚刚没有只去“背一张相图”。',
		heading: {
			lines: ['你算出了它的每条边界,', '然后在上面规划了三次旅行。']
		},
		catalogLink: '回到故事目录',
		sourceLink: '查看计算与源代码 ↗'
	}
} satisfies BoilingMapStoryContent;

export default zhCNBoilingMapContent;
