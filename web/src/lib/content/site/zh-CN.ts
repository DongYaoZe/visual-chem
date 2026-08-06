import type { SiteContent } from '../types';

export const zhCNSiteContent = {
	locale: 'zh-CN',
	htmlLang: 'zh-CN',
	shared: {
		seo: {
			defaultImageAlt: 'VisualChem：把大学化学原理讲成可以走进去的故事'
		},
		header: {
			brand: 'VisualChem',
			tagline: '化学叙事可视化',
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
				'把宏观现象、微观粒子与化学符号锁进同一个可操纵故事。VisualChem 是面向大学化学的开源叙事可视化项目。',
			path: '/',
			alternateLocalePath: '/en/',
			type: 'website',
			image: '/og-home.png',
			imageAlt: 'VisualChem 首页：宏观、微观与符号三重表征围绕乙醇—水相图同步',
			modifiedTime: '2026-07-24'
		},
		hero: {
			eyebrow: 'OPEN CHEMISTRY · EXPLORABLE STORIES',
			heading: {
				lines: ['不是把相图', '画出来。'],
				emphasis: '是让它开口。'
			},
			lead: '宏观现象、微观粒子、符号图景不再各讲各的。滚动是一架摄影机，手指是实验旋钮；每一张图都在论证链里出现。',
			primaryAction: {
				label: '进入第一篇故事',
				symbol: '↗'
			},
			methodAction: '我们的讲法',
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
			body: '教材常把烧杯、分子和公式分散在三页。学生真正困难的不是“看见”三幅图，而是在它们之间完成转译。VisualChem 用一个状态源同时驱动三幅图：当组成改变，装置、粒子比例和相图状态点必须一起改变。',
			controls: {
				initialComposition: '初始釜液 · 乙醇摩尔分数',
				initialCompositionAriaLabel: '初始釜液乙醇摩尔分数',
				equilibriumStages: '重复平衡级',
				equilibriumStagesAriaLabel: '重复平衡级数',
				hint: '拖动任一旋钮，观察三幅图是否讲出同一件事。',
				triViewAriaLabel: '首页三重表征同步演示'
			}
		},
		season: {
			eyebrow: 'SEASON 01 · PHASE EQUILIBRIUM',
			title: '相平衡四部曲',
			introduction: '先从最适合“三角联动”的概念开始。每篇都从反常现象出发，最后抵达可计算的模型。',
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
				'相图回答"在哪里平衡"；第二季追问"为什么"。从数微观状态开始，到吉布斯山谷，再把下坡路接上导线。',
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
				'热力学告诉我们路往哪边下坡，动力学追问要走多久。先听浓度的倒计时，再看温度怎样放大分布尾巴，最后让催化剂改路、不改终点。',
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
			title: '让物质开口唱歌',
			introduction:
				'第四季从光追问结构：先把氢原子的几根亮线还原成量子化能级，再走向分子的红外振动与核磁共振。光谱不是条形码图库，而是物质内部运动留下的证词。',
			stories: [
				{
					number: '11',
					status: '可交互 Alpha · 约 11 分钟',
					title: '原子为什么只唱几颗音',
					description: '氢放电管没有铺开彩虹；四根 Balmer 线把量子化能级写成一张可计算的原子指纹。',
					action: '开始阅读 ↗'
				}
			]
		},
		principles: {
			eyebrow: 'WHAT COUNTS AS TRUE',
			heading: {
				lines: ['图可以有诗意，', '数字不能靠想象。']
			},
			items: [
				{
					number: '01',
					title: '计算可核验',
					body: '相界、速率、能量路径与谱线位置都由浏览器内核计算，并用单元测试锁住数据锚点、守恒关系和模型边界。'
				},
				{
					number: '02',
					title: '隐喻有边界',
					body: '粒子比例可以定量同步，粒子轨迹则明确标成示意；我们不把动画包装成分子动力学。'
				},
				{
					number: '03',
					title: '先预测后验证',
					body: '读者先留下判断，再操纵模型，最后从三个尺度寻找共同证据，而不是被动观看答案。'
				}
			]
		},
		footer: {
			tagline: 'VisualChem · 让化学原理成为可以走进去的故事。',
			sourceCodeLink: '源代码',
			firstStoryLink: '第一篇故事'
		}
	}
} satisfies SiteContent;

export default zhCNSiteContent;
