import type { SiteContent } from '../types';

export const zhCNSiteContent = {
	locale: 'zh-CN',
	htmlLang: 'zh-CN',
	shared: {
		seo: {
			defaultImageAlt: 'VisualChem：用图和计算一起学化学'
		},
		header: {
			brand: 'VisualChem',
			tagline: '把化学现象讲清楚',
			homeAriaLabel: 'VisualChem 首页',
			navigationAriaLabel: '主导航',
			storyLink: '开始第一篇故事',
			githubLink: 'GitHub'
		},
		motionControl: {
			pause: '暂停动画',
			resume: '继续动画'
		},
		conceptCheck: {
			eyebrow: 'CONCEPT CHECK · 先预测，再验证',
			verifyButton: '验证我的预测',
			correctFeedback: '这条因果链成立。',
			incorrectFeedback: '再看一眼三幅图的共同证据。'
		},
		triView: {
			defaultAriaLabel: '化学三联动视图',
			liveSummary: ({ liquidComposition, vaporComposition, bubblePointC, stage }) =>
				`当前状态：液相乙醇摩尔分数 ${liquidComposition}，气相 ${vaporComposition}，泡点温度 ${bubblePointC} 摄氏度，理论平衡级 ${stage}。`,
			synchronizedState: '同步状态',
			liquidComposition: '液 x',
			vaporComposition: '气 y',
			bubblePoint: '泡点',
			experimentalAzeotrope: '实验共沸',
			modelLimit: '模型极限',
			massPercent: ({ value }) => `≈${value} wt%`
		},
		apparatus: {
			ariaLabel: '烧瓶、冷凝器和接收瓶同步展示气液组成',
			stillLiquid: ({ composition }) => `釜液 x = ${composition}`,
			distillate: ({ composition }) => `馏出 y = ${composition}`,
			equilibriumStage: ({ stage }) => `平衡级 ${stage}`,
			viewName: '宏观',
			caption: '理论平衡级示意，不代表真实塔板效率'
		},
		particles: {
			vaporPhase: '气相',
			liquidPhase: '液相',
			ethanol: '乙醇',
			water: '水',
			viewName: '微观',
			caption: '比例定量；位置、碰撞与轨迹仅为解释性示意'
		},
		diagram: {
			accessibleReconstruction: ({
				totalPoints,
				selectedPoints,
				liquidComposition,
				vaporComposition,
				temperatureC
			}) =>
				`乙醇水恒压温度组成相图重建，Lai 2014 文献共有 ${totalPoints} 组实验数据，已选择 ${selectedPoints} 组。当前液相 x ${liquidComposition}，气相 y ${vaporComposition}，温度 ${temperatureC} 摄氏度。平滑教学模型未显示。`,
			accessibleModel: ({
				liquidComposition,
				vaporComposition,
				bubblePointC,
				modelStrength,
				withExperimentalData,
				totalPoints
			}) =>
				`乙醇水恒压温度组成相图，当前液相 x ${liquidComposition}，气相 y ${vaporComposition}，泡点 ${bubblePointC} 摄氏度。当前显示 Margules 教学模型，非理想强度 ${modelStrength}${withExperimentalData ? `，并叠加 ${totalPoints} 组 Lai 2014 文献实验数据` : ''}。`,
			captions: {
				reconstruction: 'Lai 2014 在 101.3 kPa 下的文献实验；虚线只是依据已选点绘制的视觉引导',
				comparison: ({ modelStrength }) =>
					`对照 · 空心符号为 Lai 2014 实验；平滑线为 Margules 教学模型 λ=${modelStrength}`,
				ideal: '理想 Raoult 基线（γ = 1），不是实验测量曲线',
				margules: ({ modelStrength }) =>
					`三后缀 Margules 教学模型（λ=${modelStrength}），不是实验数据回归`
			},
			modelFixedPoint: '模型不动点',
			laiExperimentalAzeotrope: 'Lai 实验共沸',
			xAxis: '乙醇摩尔分数 · x（液）/ y（气）',
			yAxis: '温度 / °C',
			regions: {
				vapor: '气相',
				liquid: '液相',
				twoPhase: '液 + 气'
			},
			legend: {
				modelLiquid: '模型实线 · 液相 x',
				modelVapor: '模型虚线 · 气相 y',
				experiment: '○ x / △ y · 文献实验',
				reconstruction: '粗虚线 · 你的重建'
			},
			captionKind: {
				evidence: '证据',
				model: '模型'
			}
		}
	},
	home: {
		seo: {
			title: 'VisualChem — 用故事看懂化学',
			description:
				'把实验现象、粒子变化和公式放在同一页里，边看边算。VisualChem 是一个面向大学化学的开源学习网站。',
			path: '/',
			alternateLocalePath: '/en/',
			type: 'website',
			image: '/og-home.png',
			imageAlt: 'VisualChem 首页：宏观、微观与符号三重表征围绕乙醇—水相图同步',
			modifiedTime: '2026-07-24'
		},
		hero: {
			eyebrow: 'OPEN CHEMISTRY · 从现象开始',
			heading: {
				lines: ['先看现象，', '再把它算出来。'],
				emphasis: ''
			},
			lead: '先看到烧杯、放电管或一条曲线，再把它和粒子、公式对上。页面里的图会跟着你的操作一起变，算出来的数也会显示出来。',
			primaryAction: {
				label: '进入第一篇故事',
				symbol: '↗'
			},
			methodAction: '怎么学',
			proofs: [
				{ value: '3', label: '种表征同步' },
				{ value: '0', label: '服务器计算依赖' },
				{ value: 'MIT', label: '代码开放许可' }
			],
			previewAriaLabel: '第一篇故事的共沸点视觉预告',
			limitLabel: '普通常压精馏的路标',
			limitValue: '≈95.5',
			limitUnit: '%',
			limitContext: '乙醇质量分数 · 常压实验约值',
			unreachableValue: '100%',
			fixedPointLabel: 'y = x',
			azeotropeCompositionLabel: '共沸组成',
			storyPreview: '第一篇 · 永远到不了的 100%'
		},
		method: {
			eyebrow: 'THE JOHNSTONE TRIANGLE, IN MOTION',
			heading: {
				lines: ['同一个状态，', '从三个尺度看。']
			},
			body: '课本可能把装置图、粒子图和公式分开讲。这里让它们共用一个状态：你改乙醇组成，烧瓶里的标记、粒子比例和相图上的点会一起换位置。这样可以直接检查三幅图是不是在说同一件事。',
			controls: {
				initialComposition: '初始釜液 · 乙醇摩尔分数',
				initialCompositionAriaLabel: '初始釜液乙醇摩尔分数',
				equilibriumStages: '重复平衡级',
				equilibriumStagesAriaLabel: '重复平衡级数',
				hint: '拖动旋钮，看看三幅图怎样同时改变。',
				triViewAriaLabel: '首页三重表征同步演示'
			}
		},
		season: {
			eyebrow: 'SEASON 01 · PHASE EQUILIBRIUM',
			title: '相平衡四部曲',
			introduction: '先从相平衡开始。每篇都先给一个现象，再用数据和计算把它解释清楚。',
			stories: [
				{
					number: '01',
					status: '可交互原型 · 约 12 分钟',
					title: '永远到不了的 100%',
					description: '为什么酒精越蒸越浓，却会在最后 4.4% 前停下？',
					action: '开始阅读 ↗'
				},
				{
					number: '02',
					status: '可交互 Alpha · 约 10 分钟',
					title: '沸腾的地图',
					description: '高原上的一锅水，如何带我们走进压力—温度地图？',
					action: '开始阅读 ↗'
				},
				{
					number: '03',
					status: '可交互 Alpha · 约 12 分钟',
					title: '一锅盐水的分身术',
					description: '两种盐溶进同一锅水，三角地图教你一种一种请出来。',
					action: '开始阅读 ↗'
				},
				{
					number: '04',
					status: '可交互 Alpha · 约 10 分钟',
					title: '冷却曲线侦探',
					description: '一支合金、一根温度计，从一条降温记录倒推出整张相图。',
					action: '开始阅读 ↗'
				}
			]
		},
		seasonTwo: {
			eyebrow: 'SEASON 02 · THERMODYNAMICS',
			title: '热力学的骨架',
			introduction:
				'相图告诉你平衡在哪里，热力学继续问它为什么在那里。从微观状态数起，再看反应的自由能和电池电压。',
			stories: [
				{
					number: '05',
					status: '可交互 Alpha · 约 10 分钟',
					title: '熵不是混乱',
					description: '不靠比喻：逐个数微观状态，看赔率宣判不可逆。',
					action: '开始阅读 ↗'
				},
				{
					number: '06',
					status: '可交互 Alpha · 约 11 分钟',
					title: '化学反应的下坡路',
					description: 'ΔG° 是正的，反应照样发生——山谷与坡度说了算。',
					action: '开始阅读 ↗'
				},
				{
					number: '07',
					status: '可交互 Alpha · 约 10 分钟',
					title: '电池里的势能地形',
					description: '1.10 V 是两级台阶的差；放电平台与雪崩都在能斯特坡上。',
					action: '开始阅读 ↗'
				}
			]
		},
		seasonThree: {
			eyebrow: 'SEASON 03 · KINETICS',
			title: '给反应装上秒表',
			introduction:
				'热力学告诉你反应愿不愿意发生，动力学告诉你它要等多久。这里从浓度、温度和催化剂三个实验读数入手。',
			stories: [
				{
					number: '08',
					status: '可交互 Alpha · 约 10 分钟',
					title: '浓度的倒计时',
					description: '速率是曲线此刻的坡度；连续半衰期把反应级数敲成可听见的指纹。',
					action: '开始阅读 ↗'
				},
				{
					number: '09',
					status: '可交互 Alpha · 约 11 分钟',
					title: '翻山的分子',
					description: '升温没有把每个分子都推快一点；真正被放大的，是越过能垒的那条稀薄尾巴。',
					action: '开始阅读 ↗'
				},
				{
					number: '10',
					status: '可交互 Alpha · 约 10 分钟',
					title: '捷径不改终点',
					description: '催化剂削低山口，却不搬动两侧山谷：正逆一起加速，平衡位置纹丝不动。',
					action: '开始阅读 ↗'
				}
			]
		},
		seasonFour: {
			eyebrow: 'SEASON 04 · STRUCTURE & SPECTRA',
			title: '用光认出物质',
			introduction:
				'光谱能告诉我们原子和分子内部发生了什么。第一篇先看氢原子的可见谱线，后面再谈红外振动和核磁共振。',
			stories: [
				{
					number: '11',
					status: '可交互 Alpha · 约 11 分钟',
					title: '氢原子为什么只发出几根线',
					description:
						'氢气发光时只出现几根线。调节能级，算出它们的波长，再看这些线怎样对应原子的能量差。',
					action: '开始阅读 ↗'
				}
			]
		},
		principles: {
			eyebrow: '我们怎样检查结果',
			heading: {
				lines: ['图用来帮助理解，', '数字必须算得出来。']
			},
			items: [
				{
					number: '01',
					title: '每个读数都有来处',
					body: '相界、速率、能量路径和谱线位置都由浏览器里的计算代码给出。测试会检查关键数值、守恒关系和模型适用范围。'
				},
				{
					number: '02',
					title: '示意图不冒充实验',
					body: '粒子数量和比例会跟着计算变化，位置和运动只是帮助你读图的示意。页面不会把动画说成真实的分子轨迹。'
				},
				{
					number: '03',
					title: '先猜一次，再动手试',
					body: '每篇先让你选一个答案，再拖动控制器。你可以从装置、粒子和公式三处核对自己的判断。'
				}
			]
		},
		footer: {
			tagline: 'VisualChem · 用图、数字和操作把化学讲清楚。',
			sourceCodeLink: '源代码',
			firstStoryLink: '第一篇故事'
		}
	}
} satisfies SiteContent;

export default zhCNSiteContent;
