import type { EntropyStoryContent } from '../../types';

export const zhCNEntropyContent = {
	locale: 'zh-CN',
	seo: {
		title: '熵不是混乱 — VisualChem',
		description:
			'撤掉隔板,气体为什么永不回头?不靠"混乱度"的比喻:在浏览器里逐个数微观状态,看 ln W 如何长成熵、√N 如何钉死涨落、2⁻¹⁰⁰ 如何宣判不可逆。',
		path: '/stories/entropy/',
		alternateLocalePath: '/en/stories/entropy/',
		type: 'article',
		image: '/og-entropy.png',
		imageAlt: '双球泡气体、微观状态直方图与 S = k ln W 组成的 VisualChem 叙事封面',
		publishedTime: '2026-07-18',
		modifiedTime: '2026-07-18'
	},
	hero: {
		eyebrow: 'THERMODYNAMICS · STORY 05',
		title: ['熵不是', '混乱'],
		subtitle: '它是一次诚实的计数。撤掉隔板的那一刻,数字接管了一切。',
		heroTag: 'W = C(N, n) · 逐个数出'
	},
	readingNote:
		'右侧舞台由同一组粒子驱动:宏观的双球泡告诉你气体在做什么,中间的直方图数出每种分法有多少种走法,右侧的 S = k ln W 把计数变成热力学。三个面板永远同步——熵不是另一个世界的量,它就是这次计数。',
	stage: {
		dialogAriaLabel: '当前叙事幕图形',
		closeGraphicAriaLabel: '关闭当前图形',
		openGraphicButton: '查看当前图',
		shortStateAriaLabel: '当前图形状态'
	},
	scenes: [
		{
			id: 'hook',
			prose: `两只玻璃球泡,中间一道阀门。左边充着气体,右边抽成真空。

打开阀门——气体轰然涌入右球,几秒后两边各占一半。你等一整天、一整年、一亿年,它都不会自己缩回左球。

**没有任何一条力学定律禁止它回去。**每一次分子碰撞倒放都完全合法。那么,是谁在拦着它?

先下一个判断。`
		},
		{
			id: 'count-the-ways',
			prose: `不谈"混乱",我们来**数数**。

给每个分子发一枚硬币:正面=左球,反面=右球。$N$ 个分子的每一种正反组合,是一个**微观状态**;左边恰好 $n$ 个分子的分法共有

$$W(n) = \\binom{N}{n} = \\frac{N!}{n!\\,(N-n)!}$$

种。$N=4$ 时:全在左边只有 **1** 种走法,二二平分有 **6** 种。拖动粒子数,看这场计数如何起飞——到 $N=100$,平分已有约 $10^{29}$ 种走法,而"全在左边"永远只有那孤零零的 1 种。`
		},
		{
			id: 'the-spike',
			prose: `把 $W(n)$ 画出来,你得到的不是一座缓坡,而是一根**针**。

$N$ 越大,针越尖:峰的宽度只按 $\\sqrt{N}$ 生长,而横轴按 $N$ 伸展。$N=100$ 时,±10 个分子的窗口已揽下 95% 以上的微观状态;到 $N=10^{23}$,占比 99.9999…% 的窗口窄得**画不出来**——比一根原子还细。

宏观世界只看得见针尖。所谓"平衡态",就是这根针的名字。`
		},
		{
			id: 'boltzmann',
			prose: `玻尔兹曼把这场计数刻成了公式——也刻在了他的墓碑上:

$$S = k \\ln W$$

取对数,是因为独立系统的 $W$ 相乘、而热力学要求熵相加;乘上 $k = 1.38\\times 10^{-23}\\ \\mathrm{J/K}$,是把"计数"换算成量热计的单位。

一摩尔气体体积翻倍,每个分子的走法翻倍,$W$ 变成 $2^{N_A}$ 倍:

$$\\Delta S = N_A k \\ln 2 = R\\ln 2 = 5.76\\ \\mathrm{J\\,K^{-1}\\,mol^{-1}}$$

这个数字不是比喻——它能在量热实验里被测出来。`
		},
		{
			id: 'irreversible',
			prose: `现在回答开头的问题:气体为什么不回去?

按下按钮,把 100 个分子全部塞回左球,松手。每一步随机挑一个分子换边(Ehrenfest 之瓮),看着计数落向针尖——然后**被钉在那里抖动**。

回到"全在左边"并未被禁止,它的概率是 $2^{-100} \\approx 10^{-30}$:每纳秒试一次,宇宙年龄的 $10^{4}$ 倍也等不到一回。一摩尔分子时,这个指数变成 $-10^{23}$。

**不可逆,不是禁令,而是赔率。**`
		},
		{
			id: 'fluctuations',
			prose: `但小系统里,赔率并不悬殊——看直方图左右,计数一直在**抖**。

$N=100$ 时,±10% 的偏离时时发生;胶体粒子的布朗运动、临界乳光,都是熵的涨落在显形。涨落幅度按 $\\sqrt{N}/N = 1/\\sqrt{N}$ 缩小:粒子数扩大一万倍,相对涨落缩小一百倍。

热力学"定律"的斩钉截铁,是 $N\\to 10^{23}$ 时统计学送的礼物。`
		},
		{
			id: 'not-disorder',
			prose: `最后清算那个流行的比喻:**熵不是"乱"。**

- 弹匣里整齐排列的油和水,分层("整齐")恰恰是熵**更高**的状态——疏水效应里,是水分子的走法数在做主
- 硬球晶体在高密度下**自发结晶**:整齐的晶格反而给每个球更多的活动空间,$W_{\\text{晶体}} > W_{\\text{无序}}$
- 一副"看起来乱"的牌,和一副按花色排好的牌,微观状态数完全一样——**乱不乱是人的审美,熵只认计数**

"混乱度"帮你猜对过很多次,但它猜错的每一次,都是因为它不是定义。定义只有一个:$S = k\\ln W$。`
		},
		{
			id: 'sandbox',
			prose: `计数器交给你。

拖动粒子数,看针如何变尖;框一个窗口,看它揽下多少微观状态;把分子全部赶回左边,再看赔率把它们押回针尖。

**挑战**:找到一个 $N$,让 ±5% 窗口恰好包住 99% 的微观状态——然后想象把它推到 $10^{23}$。`
		}
	],
	kickers: {
		hook: '00',
		'count-the-ways': '01',
		'the-spike': '02',
		boltzmann: '03',
		irreversible: '04',
		fluctuations: '05',
		'not-disorder': '06',
		sandbox: '07'
	},
	interactions: {
		hook: {
			question: '先预测:拦住气体回头的是',
			options: [
				{ id: 'force', label: '某种未知的力' },
				{ id: 'law', label: '一条力学禁令' },
				{ id: 'odds', label: '纯粹的概率' }
			],
			explanation:
				'是概率。每条微观路径都可逆,但"回去"的走法太少——少到 2⁻ᴺ。这个故事接下来就是把这句话数出来。'
		},
		countTheWays: {
			particlesLabel: '粒子数 N'
		},
		irreversible: {
			releaseButton: '⏵ 全部塞回左球,松手',
			resetButton: '↻ 重置',
			runningHint: '随机换边中——看计数落向针尖。'
		},
		sandbox: {
			particlesLabel: '粒子数 N',
			windowLabel: '窗口半宽 ±',
			windowReadout: ({ percent, window }) => `±${window} 的窗口包住 ${percent}% 的微观状态`
		}
	},
	triView: {
		defaultAriaLabel: '双球泡气体的三重表征舞台',
		liveSummary: ({ leftCount, total }) => `当前状态:左球 ${leftCount} / ${total} 个粒子。`,
		synchronizedState: '同一组粒子 · 三种表征',
		bulbs: {
			ariaLabel: '双球泡视图',
			viewName: '宏观 · 双球泡',
			caption: '粒子位置为示意;左右计数与所有统计量严格一致。',
			leftLabel: '左球',
			rightLabel: '右球',
			valveOpen: '阀门开',
			valveClosed: '阀门关'
		},
		histogram: {
			ariaLabel: ({ total }) => `${total} 个粒子的微观状态直方图`,
			viewName: '统计 · 走法计数',
			caption: 'W(n) 由二项式系数逐点计算;纵轴为概率。',
			xAxis: '左球粒子数 n',
			yAxis: 'P(n)',
			currentMarker: '当前',
			allLeftMarker: '全在左'
		},
		entropy: {
			ariaLabel: '熵读数视图',
			viewName: '符号 · S = k ln W',
			caption: 'ln W 以自然对数计;熵以 k 为单位报出。',
			lnWLabel: 'ln W',
			entropyReadout: ({ lnW }) => `S / k = ln W = ${lnW}`,
			oddsReadout: ({ exponent }) => `全部回左球的概率 ≈ 10^${exponent}`
		}
	},
	edge: {
		eyebrow: 'THE LEDGER',
		title: '计数者的账本',
		facts: [
			{
				term: '微观状态 W',
				definition: '实现同一宏观外观的微观走法数;双球泡里 W(n) = C(N, n),逐个数得出来。'
			},
			{
				term: '玻尔兹曼公式',
				definition:
					'S = k ln W:对数让独立系统的熵相加,k 把计数换算进量热单位。刻在维也纳中央公墓他的碑上。'
			},
			{
				term: '√N 定律',
				definition: '涨落的绝对幅度按 √N 生长,相对幅度按 1/√N 消失——热力学的确定性是大数的礼物。'
			},
			{
				term: 'R ln 2',
				definition: '一摩尔气体体积翻倍的熵增 5.76 J/(K·mol):从计数推出,可在量热实验中验证。'
			}
		]
	},
	conceptCheck: {
		question: '恒温下把一摩尔理想气体压回原来体积的一半,系统的熵如何变化?',
		options: [
			{ label: '不变——温度没变,熵只与温度有关' },
			{ label: '减少 R ln 2——每个分子的走法数减半,但环境的熵至少增加同样多' },
			{ label: '增加——压缩做功给了气体能量' },
			{ label: '减少,且整个宇宙的熵也随之减少' }
		],
		correctIndex: 1,
		explanation:
			'体积减半,每个分子的位置走法减半,系统熵减少 R ln 2 ≈ 5.76 J/(K·mol)。这不违反第二定律:压缩放出的热进入环境,环境熵至少增加同样多。局部的熵可以下降——生命每天都在做这件事——账本合计永不减少。'
	},
	sandboxIntro: {
		eyebrow: 'FREE PLAY · 带着问题离开故事线',
		title: '计数实验室',
		description: '粒子数、观察窗口、释放实验,全在你手里;三个面板同步作答。'
	},
	modelCard: {
		title: '模型卡 · V0.1',
		items: [
			{
				term: '体系',
				value:
					'双等容球泡格点气体:N 个可分辨粒子、每粒等概率处于左/右,W(n) = C(N, n)。这是教学中"数微观状态"的最小模型;真实气体的平动微观状态还含动量维度,计数比这更庞大——结论只会更悬殊。'
			},
			{
				term: '计算',
				value:
					'全部统计量在 ln 空间计算(Stirling 带 1/(12n) 修正,n≥32,相对误差 <1e-10),N 可到数百无溢出;直方图逐点归一化,单元测试钉住归一化、对称性、2⁻ᴺ 尾概率与 R ln 2 = 5.763 J/(K·mol)。'
			},
			{
				term: '释放动画',
				value:
					'Ehrenfest 之瓮:每步随机挑一个粒子换边,种子固定的 LCG 保证可复现。它是趋衡的卡通,不是分子动力学;真实弛豫由碰撞频率决定。'
			},
			{
				term: '"整齐反而熵高"的案例来源',
				value:
					'疏水效应(水的构型数主导分层)与硬球结晶(Alder 转变,1957 计算机实验首证)是统计力学标准结果;本页只作定性引用,数值模拟属于后端待办(见 docs/后端待办.md)。'
			},
			{
				term: '不能据此推断的内容',
				value:
					'本页不涉及能量交换的熵(温度、热容、第三定律),也不涉及信息熵与热力学熵的关系——那是另一个故事。粒子可分辨性的 Gibbs 佯谬在混合同种气体时需要修正,模型卡如实声明。'
			}
		]
	},
	ending: {
		summary: '熵不是一种物质,不是一种力,也不是"乱"。它是走法的数目——而大数从不讲情面。',
		invitation: '下一站:让这场计数推动化学反应下坡。',
		backToHome: '回到故事目录'
	}
} satisfies EntropyStoryContent;

export default zhCNEntropyContent;
