import type { EthanolDistillationStoryContent } from '../../types';

export const zhCNEthanolDistillationContent = {
	locale: 'zh-CN',
	seo: {
		title: '永远到不了的 100% — VisualChem',
		description:
			'从第一颗气泡到乙醇—水共沸点：用宏观装置、粒子比例和 T-x-y 相图同步讲清普通精馏为何停在约 95.5 wt%。',
		path: '/stories/ethanol-distillation/',
		alternateLocalePath: '/en/stories/ethanol-distillation/',
		type: 'article',
		image: '/og-ethanol-distillation.png',
		imageAlt: '乙醇—水 T-x-y 相图、蒸馏装置与粒子视图组成的 VisualChem 叙事封面',
		publishedTime: '2026-07-16',
		modifiedTime: '2026-07-16'
	},
	hero: {
		eyebrow: 'PHASE EQUILIBRIUM · STORY 01',
		metadata: ['约 12 分钟', '本科物理化学', '可交互 Alpha'],
		heading: {
			lines: ['永远到不了的'],
			emphasis: '100%'
		},
		ledeLines: ['一座塔可以让酒精越来越浓。', '为什么再高的塔，也会在最后一点水面前失去方向？'],
		scrollCue: '向下滚动，先留下你的预测',
		curveEvidence: '约 95.5 wt% · 常压实验'
	},
	readingNote: {
		eyebrow: 'HOW TO READ',
		body: [
			{ text: '右侧舞台不是三张互不相干的插图。它们由同一个热力学状态驱动：' },
			{ text: '宏观', emphasis: 'strong' },
			{ text: '告诉你发生了什么，' },
			{ text: '微观', emphasis: 'strong' },
			{ text: '帮你建立解释，' },
			{ text: '符号', emphasis: 'strong' },
			{ text: '给出可计算的地图。' }
		]
	},
	stage: {
		dialogAriaLabel: '当前叙事幕图形',
		closeGraphicAriaLabel: '关闭当前图形',
		triViewAriaLabel: '当前叙事幕的三重表征舞台',
		shortStateAriaLabel: '当前图形状态',
		openGraphicButton: '查看当前图',
		shortState: {
			liquid: ({ composition }) => `x ${composition}`,
			vapor: ({ composition }) => `y ${composition}`,
			temperature: ({ temperatureC }) => `${temperatureC} °C`
		}
	},
	scenes: [
		{
			id: 'hook',
			kicker: '00 · 钩子',
			title: '再加一级，会到 100% 吗？',
			paragraphs: [
				'蒸一次，酒精浓一点；再蒸一次，还是浓一点。直觉说：只要把这样的步骤重复得足够多，终点就该是纯乙醇。',
				'先别接受答案。给这座每一级都恰好达到气液平衡的“理论级塔”继续加级，看看顶部组成自己会停在哪里。'
			]
		},
		{
			id: 'composition-language',
			kicker: '01 · 统一语言',
			title: '“一成酒精”究竟是哪一成？',
			paragraphs: [
				'体积分数、质量分数、摩尔分数都可以叫“浓度”，但它们不是同一把尺。相图的横轴采用乙醇摩尔分数。',
				'橙色代表乙醇，蓝绿色代表水；相图的两条支线都在记录乙醇组成，因此改用实线/虚线与圆/三角区分液相 x 和气相 y。'
			],
			formula: String.raw`z_E=\frac{n_E}{n_E+n_W}`
		},
		{
			id: 'first-bubble',
			kicker: '02 · 第一颗气泡',
			title: '沸腾是一场“合力追上外压”。',
			paragraphs: [
				'水和乙醇一直都在贡献蒸气压。只有当两者的分压之和追上外压，第一颗气泡才能在液体内部存活。',
				'易挥发只意味着乙醇在气相里更富集，并不意味着水停止挥发。这里先用理想溶液作可计算的起点；第 4 幕会用实验数据检查它。'
			],
			formula: String.raw`x_Ep_E^*+(1-x_E)p_W^*=P`
		},
		{
			id: 'tie-line',
			kicker: '03 · 一条结线',
			title: '同一个温度，为什么有两个组成？',
			paragraphs: [
				'锅里的液体组成记作 x，刚形成的平衡蒸气组成记作 y。它们温度相同、压力相同，组成却可以不同。',
				'把这股蒸气完全冷凝，只改变相态，不改变样品的总组成：新液滴的组成正是刚才的 y。'
			],
			formula: String.raw`y_E=\frac{x_Ep_E^*}{P}`
		},
		{
			id: 'build-the-map',
			kicker: '04 · 地图成形',
			title: '把实验表重新变回一张地图。',
			paragraphs: [
				'Lai 等人在 101.3 kPa 下报告了 16 组乙醇—水 x–T–y 平衡数据。每一行同时给出液相组成、平衡温度和气相组成；这些点来自测量，不是方程画出的曲线。',
				'从表中逐组选点：把圆形 (x,T) 放在液相支，把三角形 (y,T) 放在气相支，再用虚线连成你对相界的草图。',
				'同一行的圆与三角由水平结线相连；结线两端给出两相组成，总组成 z 在其间的位置才决定两相各有多少。'
			],
			formula: String.raw`\beta=\frac{z_E-x_E}{y_E-x_E}`
		},
		{
			id: 'equilibrium-cascade',
			kicker: '05 · 平衡级联',
			title: '理想模型给出一架组成的梯子。',
			paragraphs: [
				'暂时把实验点留作参照，看看理想 Raoult 模型会预测什么：让一锅液体达到平衡，取走蒸气并完全冷凝；新液体再重复同一步。',
				'理想模型里，阶梯越往右，每一级带来的增量越小，但方向始终朝向纯乙醇。'
			],
			formula: String.raw`x_{n+1}=y(x_n)`
		},
		{
			id: 'nonideal-model',
			kicker: '06 · 理想模型失手',
			title: '混合以后，分子“逃跑”的意愿变了。',
			paragraphs: [
				'空心圆/三角是 Lai 2014 的实验数据，平滑实线/虚线是模型。λ=0 是理想 Raoult 基线，λ=1 是按常压共沸点校准的 Margules 教学模型。',
				'模型的价值不是替代实验，而是用少量参数解释趋势；它贴不住实验点的地方同样重要。0<λ<1 只是讲解用形变，不是可测物性，也不是逐点回归。'
			],
			formula: String.raw`p_i=x_i\gamma_i p_i^*`
		},
		{
			id: 'fixed-point',
			kicker: '07 · 不动点',
			title: '墙不是一根线，是 y = x 的一刻。',
			paragraphs: [
				'当平衡蒸气与液体组成完全相同，蒸发—冷凝不再改变组成。这个共沸组成是精馏映射的不动点。',
				'从低组成一侧出发，y−x 为正；从高组成一侧出发，y−x 为负。两边的级联都向同一个点靠近，而不会穿过。实验与教学模型给出的数值接近，但不是同一个结果。'
			],
			formula: String.raw`\Delta(x)=y(x)-x=0`
		},
		{
			id: 'change-the-operation',
			kicker: '08 · 换一条路',
			title: '不要把同一步做得更狠，要换一步。',
			paragraphs: [
				'共沸点限制的是固定条件下反复进行的气液平衡分离，并不是自然界禁止无水乙醇存在。',
				'选择性脱水会直接拿走水，改变物料衡算路径；它不再沿着 x→y(x) 的蒸馏阶梯，自然可以跨过原来的不动点。'
			],
			formula: String.raw`x_E(q)=\frac{n_E}{n_E+(1-q)n_W}`
		}
	],
	interactions: {
		hook: {
			prompt: '先预测',
			choices: [{ label: '会到 100%' }, { label: '会停在某处' }],
			addStageButton: '+ 再加一级',
			resetButton: '重置',
			stageOutput: ({ stage, composition }) => `第 ${stage} 级：x = ${composition}`,
			evidence:
				'级数继续增加，读数仍在变化，却越来越慢。先保留你的判断；第 7 幕会解释“停”的精确定义。'
		},
		firstBubble: {
			prompt: '第一泡会是',
			choices: [{ label: '纯乙醇' }, { label: '乙醇更丰富' }, { label: '与液体相同' }],
			evidence: '理想模型在 x = 0.10 时给出 y ≈ 0.20：气泡更富乙醇，但水的贡献并不为零。'
		},
		experiment: {
			controlLabel: '文献样品 · 液相 x',
			sliderAriaLabel: '选择 Lai 2014 文献实验样品',
			sliderValueText: ({ index, liquidComposition }) =>
				`第 ${index} 组，液相乙醇摩尔分数 ${liquidComposition}`,
			measurement: ({ temperatureC, temperatureUncertaintyC, vaporComposition }) =>
				`测得 T = ${temperatureC} ± ${temperatureUncertaintyC} °C · 气相 y = ${vaporComposition}`,
			addButton: '加入这组文献实验数据',
			addedButton: '这一组已加入',
			clearButton: '清空选择',
			selectionOutput: ({ selected, total }) => `已选 ${selected} / ${total} 组`,
			incompleteEvidence:
				'换一组组成再加入。圆、三角来自同一个平衡状态的液相 x 与气相 y；选满 5 组后再与完整 16 组实验表核对。',
			completeEvidence:
				'粗虚线只是你依据已选数据画出的草图。现在其余文献点也已展开：看看哪些区段刚才仍缺证据，以及模型稍后会怎样解释整条趋势。'
		},
		idealCascade: {
			controlLabel: '理想 Raoult 模型 · 平衡级数 N',
			sliderAriaLabel: '理论平衡级数'
		},
		nonidealModel: {
			controlLabel: '教学模型拨杆 λ',
			sliderAriaLabel: '教学模型的非理想强度'
		},
		azeotropeSearch: {
			controlLabel: '在 Margules 模型中寻找 y − x = 0',
			sliderAriaLabel: '寻找共沸点的乙醇摩尔分数',
			compositionOutput: ({ liquidComposition, vaporComposition }) =>
				`x = ${liquidComposition} · y = ${vaporComposition}`,
			nearEvidence: ({
				modelComposition,
				modelTemperatureC,
				experimentalComposition,
				experimentalCompositionUncertainty,
				experimentalTemperatureC,
				experimentalTemperatureUncertaintyC
			}) =>
				`当前模型给出 x≈${modelComposition}、T≈${modelTemperatureC}°C；Lai 实验给出 x=y=${experimentalComposition}±${experimentalCompositionUncertainty}、T=${experimentalTemperatureC}±${experimentalTemperatureUncertaintyC}°C。接近不等于相同。`
		}
	},
	escape: {
		eyebrow: 'CHANGE THE OPERATION',
		heading: {
			lines: ['把水拿走，', '而不是再蒸一次。']
		},
		body: '从共沸组成出发，3A 分子筛等脱水过程选择性移除水。它改变的是过程约束，不是让气液平衡定律“失效”。',
		controlLabel: '移除剩余水的比例 q',
		controlAriaLabel: '选择性移除水的比例',
		percentOutput: ({ percent }) => `${percent}%`,
		figureCaption: '分子筛选择性移除水的物料衡算示意',
		beforeLabel: '共沸馏出物',
		beforeValue: ({ molePercent }) => `${molePercent} mol%`,
		sieveLabelLines: ['3A', '分子筛'],
		afterLabel: '脱水后',
		afterValue: ({ molePercent }) => `${molePercent} mol%`
	},
	conceptCheck: {
		question: '为什么分子筛脱水不与“普通精馏不能跨过共沸点”矛盾？',
		options: [
			{ label: '分子筛把共沸点的热力学定律暂时关闭了' },
			{ label: '它选择性移除水，已经不是又一个气液平衡级' },
			{ label: '分子筛让乙醇的沸点突然变成零度' },
			{ label: '只要过程足够慢，任何共沸点都会自动消失' }
		],
		correctIndex: 1,
		explanation:
			'共沸约束的是给定条件下 x→y(x) 这一气液平衡映射。选择性移除水使用了另一条物料衡算路径，因此可以越过原来的固定点。'
	},
	sandbox: {
		eyebrow: 'FREE PLAY · 带着问题离开故事线',
		title: '现在，把控制权交给你。',
		introduction:
			'作者控镜到这里结束。改变初始组成、非理想强度和理论级数，观察哪些量一起变化，哪些关系始终不变。',
		controls: {
			initialComposition: '初始乙醇摩尔分数 x₀',
			initialCompositionAriaLabel: '自由探索的初始乙醇摩尔分数',
			equilibriumStages: '理论平衡级 N',
			equilibriumStagesAriaLabel: '自由探索的理论平衡级数',
			nonidealStrength: '非理想强度 λ',
			nonidealStrengthAriaLabel: '自由探索的非理想强度'
		},
		challengeLabel: '试试看',
		challenge: '从 x₀ = 0.95 出发反复蒸馏，阶梯会向左还是向右？它最终靠近哪里？',
		triViewAriaLabel: '自由探索三重表征实验室'
	},
	modelCard: {
		eyebrow: 'MODEL CARD · V0.1',
		heading: {
			lines: ['这幅图知道什么，', '又不知道什么。']
		},
		items: [
			{
				title: '实验层：16 组公开测量',
				body: [
					{
						text: '空心圆和三角来自 Lai 等人 2014 年在 101.3 kPa 下报告的 x–T–y 数据；温度和气相组成的不确定度来自 NIST ThermoML 的 95% 扩展不确定度。点间连线只作视觉引导，不制造新的测量值。'
					}
				],
				openByDefault: true,
				links: [
					{
						label: '原论文 DOI ↗',
						href: 'https://doi.org/10.1016/j.jct.2013.08.020'
					},
					{
						label: 'NIST ThermoML 数据页 ↗',
						href: 'https://trc.nist.gov/ThermoML/10.1016/j.jct.2013.08.020.html'
					}
				]
			},
			{
				title: '模型层：可解释，但不是测量本身',
				body: [
					{
						text: '气相按理想气体处理，纯组分蒸气压用 Antoine 方程，液相采用三后缀 Margules 活度模型。参数校准到常压共沸点 x'
					},
					{ text: 'E', emphasis: 'subscript' },
					{
						text: '≈0.895、T≈78.15°C（模型计算为 95.61 wt% 乙醇）。相对 Lai 16 点，当前模型的温度 RMS 约 0.57 K，气相组成 RMS 约 0.016；实验文献给出约 95.4–95.6 wt%，正文因此写“约 95.5 wt%”。'
					}
				],
				openByDefault: true
			},
			{
				title: '不能据此推断的内容',
				body: [
					{
						text: '这不是温度相关 NRTL 的完整实验数据回归，也不模拟塔板效率、回流比、传质速率或批式蒸馏时间。压力外推和工业设计不应使用这套教学参数。'
					}
				],
				openByDefault: false
			},
			{
				title: '微观动画的证据边界',
				body: [
					{
						text: '两相中的乙醇/水比例来自平衡计算；圆点的位置、碰撞、气泡形状与运动时间均为解释性隐喻，不是实时分子动力学。'
					}
				],
				openByDefault: false
			}
		]
	},
	ending: {
		lead: '你刚刚没有只去“读懂一张相图”。',
		heading: {
			lines: ['你把一张实验表重建成了地图，', '再用模型解释了它的墙。']
		},
		catalogLink: '回到故事目录',
		sourceLink: '查看计算与源代码 ↗'
	}
} satisfies EthanolDistillationStoryContent;

export default zhCNEthanolDistillationContent;
