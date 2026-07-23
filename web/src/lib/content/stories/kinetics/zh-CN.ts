import type { KineticsStoryContent } from '../../types';

export const zhCNKineticsContent = {
	locale: 'zh-CN',
	seo: {
		title: '浓度的倒计时 — VisualChem',
		description:
			'一瓶双氧水多快变完?速率不是一个数,是一条随浓度滑落的曲线。半衰期是反应级数的指纹:等距是一级,倍增是二级——曲线在浏览器里逐点算出,同一套数学一路通到碳-14 断代。',
		path: '/stories/kinetics/',
		alternateLocalePath: '/en/stories/kinetics/',
		type: 'article',
		image: '/og-kinetics.png',
		imageAlt: '气泡烧杯与半衰期阶梯组成的 VisualChem 叙事封面',
		publishedTime: '2026-07-23',
		modifiedTime: '2026-07-23'
	},
	hero: {
		eyebrow: 'KINETICS · STORY 08',
		title: ['浓度的', '倒计时'],
		subtitle: '热力学许诺了下坡,却没说要走多久。第三季,我们给反应装上秒表。',
		heroTag: 'c(t) = c₀e^(−kt) · 逐点算出'
	},
	readingNote:
		'右侧舞台由同一场分解驱动:宏观烧杯的气泡快慢跟着此刻的速率,微观分子按剩余分数逐个消失,符号面板画出整条浓度-时间曲线与半衰期的阶梯。三个面板共享一只时钟——速率不是背出来的公式,是曲线的坡度。',
	stage: {
		dialogAriaLabel: '当前叙事幕图形',
		closeGraphicAriaLabel: '关闭当前图形',
		openGraphicButton: '查看当前图',
		shortStateAriaLabel: '当前图形状态'
	},
	scenes: [
		{
			id: 'hook',
			prose: `药箱里那瓶双氧水,开盖后咕嘟咕嘟地放出氧气:

$$\\mathrm{2\\,H_2O_2 \\to 2\\,H_2O + O_2}$$

上一季说过,这是一条彻底的下坡路(ΔG ≪ 0)。可它没有一泻而下——气泡是**一颗一颗**冒的。

盯着它看十分钟。**气泡会越冒越快、匀速地冒,还是越冒越慢?**

先下一个判断。`
		},
		{
			id: 'watch-it-fall',
			prose: `按下播放,看浓度掉落。

曲线**开头陡、后来缓**——因为速率跟着浓度走:分子多,碰头多,反应快;分子少了,速率也退潮。写成式子:

$$v = -\\frac{\\mathrm{d}c}{\\mathrm{d}t} = k\\,c$$

速率不是一个数,是**曲线在每一点的坡度**。k 才是常数——它是这场倒计时的**节拍器**,单位 s⁻¹,与浓度无关。`
		},
		{
			id: 'half-life',
			prose: `这条曲线藏着一个漂亮的节律。

从 $c_0$ 掉到 $c_0/2$,用了一段时间;再从 $c_0/2$ 掉到 $c_0/4$,用时**一模一样**;再减半,还是一样。

$$t_{1/2} = \\frac{\\ln 2}{k}$$

半衰期与"还剩多少"无关——这是**一级反应的指纹**。看图上的阶梯记号:等距的鼓点,一路敲到浓度归零(渐近地)。`
		},
		{
			id: 'fingerprints',
			prose: `但不是所有反应都按这个节拍。切换反应级数,看指纹变化:

- **零级**:速率与浓度无关(酶饱和、表面反应)——连续半衰期**逐次减半**,曲线是一条撞向零的直线
- **一级**:半衰期**恒定**——放射性衰变;固定催化剂浓度且处在适用浓度区间的双氧水分解
- **二级**:速率 ∝ c²——半衰期**逐次翻倍**,末尾拖着长长的尾巴

**测连续半衰期,就是在给反应验指纹。**这是不做任何拟合就能读出级数的侦探法。`
		},
		{
			id: 'rate-law',
			prose: `把指纹写成数学。对一级反应积分:

$$c = c_0 e^{-kt} \\qquad \\ln c = \\ln c_0 - kt$$

取对数,曲线**拉成直线**——斜率就是 −k。这一招和第二篇里"拉直汽化线"是同一招:**找对坐标,规律自己站直。**

速率方程 $v = k c^m$ 里的级数 m 只能由**实验**读出,不能从化学计量数抄来——$\\mathrm{2\\,H_2O_2}$ 前面的 2 与"一级"没有关系。`
		},
		{
			id: 'carbon-clock',
			prose: `同一套数学,把秒表换成万年历。

碳-14 是宇宙射线在大气里造的放射性碳,活着的生物不断补充它;死亡那一刻,补充停止,**倒计时开始**——半衰期 5730 年,雷打不动。

$$t = 5730 \\cdot \\log_2\\frac{c_0}{c}$$

冰人奥茨体内还剩约 53% 的碳-14,倒推约 5300 年前;死海古卷、马王堆帛书,都是这条指数曲线断的案。**一级反应的秒表,从来不看瓶子有多大。**`
		},
		{
			id: 'not-all-equal',
			prose: `诚实条款:

- 双氧水的"一级"是**有条件的实验事实**,不是从方程式看出来的:固定碘化物浓度时可得到对 H₂O₂ 的伪一级行为;酶催化只在低底物、远未饱和区近似一级
- k 强烈依赖温度(下一篇的主角)与催化剂(下下篇的主角)——本页所有曲线都固定在同一温度
- 真实反应可能改级:酶在底物过量时从一级滑向零级;级数甚至可以是分数

速率定律是**测出来的经验律**,机理藏在它背后——那是更深一层的侦探故事。`
		},
		{
			id: 'sandbox',
			prose: `秒表交给你。

级数、速率常数、起始浓度三个旋钮,曲线与半衰期阶梯实时重算;烧杯气泡与分子室同步作答。

**挑战**:调出一条 200 秒内恰好敲三次半衰期鼓点的一级曲线;再找出为什么二级反应"永远死不透"。`
		}
	],
	kickers: {
		hook: '00',
		'watch-it-fall': '01',
		'half-life': '02',
		fingerprints: '03',
		'rate-law': '04',
		'carbon-clock': '05',
		'not-all-equal': '06',
		sandbox: '07'
	},
	interactions: {
		hook: {
			question: '先预测:气泡会',
			options: [
				{ id: 'faster', label: '越冒越快' },
				{ id: 'steady', label: '匀速地冒' },
				{ id: 'slower', label: '越冒越慢' }
			],
			explanation:
				'越冒越慢。速率正比于还剩多少双氧水——分子越少,碰头越少。这条"跟着浓度退潮"的曲线,就是本篇的主角。'
		},
		watchItFall: {
			playButton: '⏵ 开始计时',
			pauseButton: '⏸ 暂停',
			resetButton: '↻ 重新倒满'
		},
		fingerprints: {
			orderLabel: '反应级数',
			orderNames: ['零级', '一级', '二级'],
			readout: ({ first, second, third }) => `连续半衰期:${first} s → ${second} s → ${third} s`
		},
		carbonClock: {
			fractionLabel: '样品剩余碳-14',
			readout: ({ percent, years }) => `剩余 ${percent}% → 距今约 ${years} 年`
		},
		sandbox: {
			orderLabel: '反应级数',
			kLabel: '速率常数 k',
			kUnit: ({ order }) =>
				Number(order) === 0 ? 'mol L⁻¹ s⁻¹' : Number(order) === 1 ? 's⁻¹' : 'L mol⁻¹ s⁻¹',
			c0Label: '起始浓度 c₀',
			readout: ({ halfLife }) => `首个半衰期 t½ = ${halfLife} s`
		}
	},
	triView: {
		defaultAriaLabel: '双氧水分解的三重表征舞台',
		liveSummary: ({ concentration, timeS }) =>
			`当前状态:t = ${timeS} 秒,剩余浓度分数 ${concentration}。`,
		synchronizedState: '同一只时钟 · 三种表征',
		beaker: {
			ariaLabel: ({ concentration, normalizedRate }) =>
				`烧杯视图,剩余浓度分数 ${concentration},瞬时速率为初始速率的 ${normalizedRate}。`,
			viewName: '宏观 · 烧杯',
			caption: '气泡快慢跟随计算出的瞬时速率;烧杯为示意。',
			bubbleTag: 'O₂',
			concentrationLabel: ({ concentration }) => `c/c₀ = ${concentration}`,
			timeLabel: ({ timeS }) => `t = ${timeS} s`
		},
		molecules: {
			ariaLabel: ({ reactantCount, waterCount, oxygenCount }) =>
				`分子视图:${reactantCount} 个 H₂O₂、${waterCount} 个 H₂O、${oxygenCount} 个 O₂;遵守 2 比 2 比 1 的化学计量。`,
			viewName: '微观 · 分子',
			caption: '每消耗 2 个 H₂O₂ 生成 2 个 H₂O 与 1 个 O₂;位置为示意。',
			reactantLabel: 'H₂O₂',
			waterLabel: 'H₂O',
			oxygenLabel: 'O₂'
		},
		clock: {
			ariaLabel: ({ order }) => `浓度-时间曲线,当前为${order}反应`,
			viewName: '符号 · 浓度时钟',
			caption: '曲线由积分速率方程逐点计算;竖线是连续半衰期的鼓点。',
			xAxis: '时间 t / s',
			yAxis: 'c / c₀',
			halfLifeMarker: 't½',
			currentMarker: '当前',
			orderTag: ({ order }) => `${order}反应`
		}
	},
	edge: {
		eyebrow: 'THE STOPWATCH',
		title: '计时员手册',
		facts: [
			{
				term: '速率是坡度',
				definition: 'v = −dc/dt:曲线每一点的切线斜率,随浓度一路退潮;k 才是那个不变的节拍器。'
			},
			{
				term: '半衰期指纹',
				definition: '连续半衰期等距=一级、翻倍=二级、减半=零级——不拟合就能验出级数的侦探法。'
			},
			{
				term: '级数是测的',
				definition: '速率方程 v = kc^m 的 m 只能由实验读出;化学计量数说了不算。'
			},
			{
				term: '碳-14 时钟',
				definition: 't½ = 5730 年的一级衰变:同一条指数曲线,从药箱一路断案到考古现场。'
			}
		]
	},
	conceptCheck: {
		question: '某反应测得连续半衰期为 100 s、200 s、400 s。它最可能是几级反应?',
		options: [
			{ label: '零级——半衰期在变' },
			{ label: '一级——只要有半衰期就是一级' },
			{ label: '二级——半衰期逐次翻倍' },
			{ label: '无法判断——还需要温度数据' }
		],
		correctIndex: 2,
		explanation:
			'半衰期逐次翻倍(t½ ∝ 1/c)正是二级反应的指纹:浓度减半后,分子碰头难上一倍。一级的指纹是半衰期恒定;零级是逐次减半。温度会改 k 的大小,但不改这套指纹的形状。'
	},
	sandboxIntro: {
		eyebrow: 'FREE PLAY · 带着问题离开故事线',
		title: '倒计时实验台',
		description: '级数、速率常数、起始浓度全在你手里;曲线、气泡与分子同步作答。'
	},
	modelCard: {
		title: '模型卡 · V0.1',
		items: [
			{
				term: '体系',
				value:
					'H₂O₂ 分解(2H₂O₂ → 2H₂O + O₂)是经典课堂体系。页面的一级曲线只代表明确条件下的近似:碘化物浓度固定时对 H₂O₂ 可呈伪一级;过氧化氢酶在低底物、远未饱和区近似一级,底物升高后会转向零级。速率常数是自由旋钮,不锚定具体催化条件;无催化的常温分解极慢。'
			},
			{
				term: '计算',
				value:
					'0/1/2 级积分速率方程解析计算;连续半衰期由各级公式逐段推进(0 级 c₀/2k、1 级 ln2/k、2 级 1/kc₀),单测钉住"等距/减半/翻倍"三种指纹与曲线-鼓点对齐。'
			},
			{
				term: '碳-14',
				value:
					'取剑桥半衰期 5730 年;年代 = 5730·log₂(c₀/c)。真实考古断代还需大气 ¹⁴C 校准曲线(IntCal)修正,本页为教学未校准年代,误差世纪量级。'
			},
			{
				term: '不能据此推断的内容',
				value:
					'速率定律是经验律:级数不来自化学计量数,机理(基元步骤、中间体)不在本页;温度依赖见故事九,催化见故事十。气泡动画节奏正比于计算速率,但不是气体体积计量。'
			}
		]
	},
	ending: {
		summary: '速率是坡度,k 是节拍器,半衰期是指纹。热力学画好了地形,动力学才开始报时。',
		invitation: '下一站:温度如何拨快这只秒表——分子要翻的那座山。',
		backToHome: '回到故事目录'
	}
} satisfies KineticsStoryContent;

export default zhCNKineticsContent;
