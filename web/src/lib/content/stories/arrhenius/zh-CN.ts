import type { ArrheniusStoryContent } from '../../types';

export const zhCNArrheniusContent = {
	locale: 'zh-CN',
	seo: {
		title: '翻山的分子 — VisualChem',
		description:
			'为什么降温 21 °C 能把一个典型过程放慢近十倍？从麦克斯韦—玻尔兹曼分布的高能尾巴，到 k = Ae^(−Ea/RT)、十度口诀与两点法：每个读数都在浏览器里由同一温度和能垒算出。',
		path: '/stories/arrhenius/',
		alternateLocalePath: '/en/stories/arrhenius/',
		type: 'article',
		image: '/og-arrhenius.png',
		imageAlt: '分子速率分布、能垒线与冷热双杯组成的 VisualChem 叙事封面',
		publishedTime: '2026-07-23',
		modifiedTime: '2026-07-23'
	},
	hero: {
		eyebrow: 'KINETICS · STORY 09',
		title: ['翻山的', '分子'],
		subtitle: '平均速度只挪了一点，高能尾巴却可以翻倍。温度拨快秒表的秘密藏在尾巴里。',
		heroTag: 'k = A e^(−Ea/RT) · 由温度与能垒逐点算出'
	},
	readingNote:
		'右侧舞台由同一个温度驱动：宏观双杯呈现同一过程的冷热对照，微观碰撞室突出高能分子，符号面板叠加两条麦克斯韦—玻尔兹曼速率分布与能垒线。分布尾巴给出直觉，阿伦尼乌斯指数给出本页的定量模型；二者不会被冒充成同一个精确积分。',
	stage: {
		dialogAriaLabel: '当前叙事幕图形',
		closeGraphicAriaLabel: '关闭当前图形',
		openGraphicButton: '查看当前图',
		shortStateAriaLabel: '当前图形状态'
	},
	scenes: [
		{
			id: 'hook',
			prose: `同一盒牛奶，分成两杯：一杯留在 25 °C 的桌上，一杯放进 4 °C 的冰箱。

假设桌上那杯所经历的某个关键变质过程，一天走完同样一段路。**冰箱里的那一杯，大致需要多久？**

温度只差 21 °C，开尔文温度只降了 7%。答案却可能不是“多撑 7%”。

先下一个判断。`
		},
		{
			id: 'two-populations',
			prose: `上一季留了一个悬案：金刚石变成石墨是下坡路（ΔG < 0），你的钻戒却安然无恙。

**因为下坡路上横着一座山。**反应物要先拉伸旧键、调整构型，经过高能的过渡态，才有机会滑向产物。山口相对反应物的高度叫**活化能** $E_a$。

同一温度下的分子也不是一支匀速行军的队伍：有的慢，有的快，速率铺成一张麦克斯韦—玻尔兹曼分布。升温不会把每个分子整齐地加速，而会让整张分布变宽、向高速侧移动。**需要看的不是平均值，而是能垒之外还剩多少尾巴。**`
		},
		{
			id: 'the-tail',
			prose: `能越过山口的碰撞来自分布右端那条几乎看不见的**高能尾巴**。在本页的最小阿伦尼乌斯模型里，能垒带来的指数惩罚写成

$$\\frac{k}{A} = e^{-E_a/RT}$$

取 $E_a = 50\\ \\mathrm{kJ\\,mol^{-1}}$、$T = 298.15\\ \\mathrm{K}$，得到 $k/A = 1.74\\times10^{-9}$。这不是在宣称“十亿次碰撞恰有 1.74 次反应”：碰撞频率、取向与透射概率都还收在 $A$ 里。它说的是，**仅仅翻越这座能垒，就带来十亿分之一量级的指数压低。**

拖动温度：分布主体看似只动一点，指数因子却成倍增长。小小的温差，专门放大在尾巴上。`
		},
		{
			id: 'arrhenius-law',
			prose: `1889 年，阿伦尼乌斯把温度密码写成

$$k = A\\,e^{-E_a/RT}$$

$k$ 是速率常数，$A$ 是频率因子；在一段温区内把 $A$ 和 $E_a$ 近似看作常量，取对数便有

$$\\ln k = \\ln A - \\frac{E_a}{R}\\frac{1}{T}$$

以 $\\ln k$ 对 $1/T$ 作图，曲线站成直线，斜率是 $-E_a/R$。这是本系列第三次使用同一招：**找对坐标，规律自己站直。**

直线也给出一条实验路线：在若干温度测量 $k$，由斜率反推表观活化能；如果点不再成线，反而可能是在提醒你机理或控速步骤变了。`
		},
		{
			id: 'rule-of-thumb',
			prose: `课堂口诀说：“温度每升高 10 °C，反应速率约变为 2～4 倍。”现在让它接受公式的审判。

从 298.15 K 升到 308.15 K：

- $E_a = 53\\ \\mathrm{kJ\\,mol^{-1}}$：$k_2/k_1 = 2.00$，恰好翻倍
- $E_a = 20\\ \\mathrm{kJ\\,mol^{-1}}$：只有 $1.30$ 倍
- $E_a = 120\\ \\mathrm{kJ\\,mol^{-1}}$：达到 $4.81$ 倍

**十度翻倍不是定律，而是约 53 kJ/mol 的能垒在室温附近制造的巧合。**同一起点温度下，山越高，速率对升温越敏感；换一个温区，倍数也会再变。`
		},
		{
			id: 'life-runs-on-it',
			prose: `这条指数从实验台伸进了日常生活，但每个例子都有自己的边界：

- **冰箱**：若用 $E_a = 75\\ \\mathrm{kJ\\,mol^{-1}}$ 代表一个关键过程，从 25 °C 降到 4 °C，模型给出 $k_{4}/k_{25}=0.101$，特征时间约拉长 **9.9 倍**。这回答开头的数量级，不是牛奶保质期或食品安全承诺——真实变质还牵涉微生物生长、包装与多条反应
- **雪树蟋蟀**：鸣叫频率随环境温度变化。页面采用 Dolbear 经验换算；20 °C 对应约 112 次/分，25 °C 对应约 148 次/分。它是有限温区内的生物温度计，不是从鸣声直接测得一个 $E_a$
- **萤火虫**：发光依赖酶促反应，温度会改变闪烁节律；物种、昼夜节律和生理调控也同时参与

共同主线不是“万物都严格服从一条直线”，而是：**变温动物与生化过程会把温度敏感性活生生地演给你看。**`
		},
		{
			id: 'two-point',
			prose: `没有整条直线，只有两个温度，也能先估一座山：

$$\\ln\\frac{k_2}{k_1}=\\frac{E_a}{R}\\left(\\frac{1}{T_1}-\\frac{1}{T_2}\\right)$$

例如同一反应在 293.15 K 测得 $k_1=1.20\\times10^{-3}\\ \\mathrm{s^{-1}}$，在 313.15 K 测得 $k_2=6.09\\times10^{-3}\\ \\mathrm{s^{-1}}$。代入得到 $E_a\\approx62.0\\ \\mathrm{kJ\\,mol^{-1}}$。

两点法很快，却没有多余的点替你检查“直线是否真的成立”。温度误差、速率误差、机理切换都会被压进一个**表观活化能**。所以两点适合估算，多点回归才适合审判模型。`
		},
		{
			id: 'sandbox',
			prose: `温控台交给你。

温度与活化能两个旋钮共同重算分布、能垒因子、十度翻倍尺度与蟋蟀读数；冷热双杯和碰撞室同步响应。

**挑战**：先找出室温下“恰好升 10 K 翻倍”的能垒；再保持温度不变，把能垒升高到让 $k/A$ 跌破 $10^{-12}$；最后解释为什么“高能垒反应升温更敏感”不等于“高能垒反应本来更快”。`
		}
	],
	kickers: {
		hook: '00',
		'two-populations': '01',
		'the-tail': '02',
		'arrhenius-law': '03',
		'rule-of-thumb': '04',
		'life-runs-on-it': '05',
		'two-point': '06',
		sandbox: '07'
	},
	interactions: {
		hook: {
			question: '先预测：冰箱里的关键变质过程大约会慢到',
			options: [
				{ id: 'seven-percent', label: '只慢 7%' },
				{ id: 'twice', label: '约慢 2 倍' },
				{ id: 'tenfold', label: '约慢 10 倍' }
			],
			explanation:
				'若取典型的 75 kJ/mol 表观活化能，25 → 4 °C 使 k 降到 0.101 倍，也就是特征时间拉长约 9.9 倍。这里估算的是单一过程，不是对真实牛奶保质期的承诺。'
		},
		theTail: {
			temperatureLabel: '温度 T',
			temperatureScale: { start: '冷 · 0 °C', end: '热 · 80 °C' },
			readout: ({ tailShare, boost }) => `能垒因子 k/A = ${tailShare} · 相对 25 °C：${boost}×`
		},
		ruleOfThumb: {
			eaLabel: '活化能 Eₐ',
			readout: ({ ea, rise }) => `Eₐ = ${ea} kJ/mol · 翻倍所需升温 ${rise} K`
		},
		twoPoint: {
			readout: ({ ea }) => `两点反推：Eₐ = ${ea} kJ/mol`
		},
		sandbox: {
			temperatureLabel: '温度 T',
			eaLabel: '活化能 Eₐ',
			readout: ({ tailShare, doubling, chirps }) =>
				`k/A = ${tailShare} · 翻倍需升温 ${doubling} K · 蟋蟀约 ${chirps} 次/分`
		}
	},
	triView: {
		defaultAriaLabel: '温度与反应速率的三重表征舞台',
		liveSummary: ({ temperatureC, eaKJPerMol, tailShare }) =>
			`当前温度 ${temperatureC} 摄氏度，活化能 ${eaKJPerMol} 千焦每摩尔，阿伦尼乌斯能垒因子 k/A 为 ${tailShare}。`,
		synchronizedState: '同一温度 · 三种表征',
		scene: {
			ariaLabel: ({ coldTemperatureC, hotTemperatureC }) =>
				`冷热双杯对照：左侧较冷，为 ${coldTemperatureC} 摄氏度；右侧较热，为 ${hotTemperatureC} 摄氏度。`,
			viewName: '宏观 · 冷热双杯',
			caption:
				'左侧始终显示较低温度，右侧显示较高温度；变化快慢由同一阿伦尼乌斯模型驱动，不代表食品安全时限。',
			coldTag: '较冷',
			hotTag: '较热',
			temperatureLabel: ({ temperatureC }) => `${temperatureC} °C`
		},
		collisions: {
			ariaLabel: ({ temperatureC, eaKJPerMol, tailShare, highlighted, total }) =>
				`分子碰撞与能垒示意：温度 ${temperatureC} 摄氏度，活化能 ${eaKJPerMol} 千焦每摩尔，实际能垒因子 ${tailShare}；对数压缩后高亮 ${highlighted}/${total} 个指示粒子。`,
			viewName: '微观 · 碰撞',
			caption:
				'位置与速度为确定性示意；高亮数量按 k/A 的数量级作对数压缩，不是有限粒子样本中的真实反应次数。',
			slowLabel: '低能',
			fastLabel: '越障指示',
			barrierTag: 'Eₐ',
			crossingReadout: ({ tailShare, highlighted, total }) =>
				`高亮 ${highlighted}/${total} · 实际 k/A ${tailShare} · 对数压缩`
		},
		distribution: {
			ariaLabel: ({ temperatureC }) => `${temperatureC} 摄氏度下的分子速率分布与能垒`,
			viewName: '符号 · 高能尾巴',
			caption:
				'曲线是归一化的约化速率分布；尾部读数使用阿伦尼乌斯因子 e^(−Eₐ/RT)，并非曲线的精确三维积分。',
			xAxis: '约化速率 v/vₚ',
			yAxis: '概率密度',
			tailLabel: '高能尾部',
			thresholdLabel: '能垒 Eₐ',
			coldCurve: '低温',
			hotCurve: '高温'
		}
	},
	edge: {
		eyebrow: 'THE MOUNTAIN PASS',
		title: '山口守则',
		facts: [
			{
				term: '阿伦尼乌斯指数',
				definition: 'k/A = e^(−Eₐ/RT)：温度进入指数，小温差会在高能尾巴上放大成大倍率。'
			},
			{
				term: '直线的斜率',
				definition: 'ln k 对 1/T 的斜率为 −Eₐ/R；弯曲或折线可能在报告机理变化，而不只是坏数据。'
			},
			{
				term: '十度口诀',
				definition: '53 kJ/mol、298.15 → 308.15 K 时恰为 2.00 倍；能垒或温区一换，口诀就换答案。'
			},
			{
				term: '两点法',
				definition: '两个 k–T 点可估表观 Eₐ，却无法独立检验直线；多点数据才能暴露弯曲与机理切换。'
			}
		]
	},
	conceptCheck: {
		question: '在相同起始温度、相同 10 K 升温且都服从阿伦尼乌斯模型时，哪一个反应的 k₂/k₁ 更大？',
		options: [
			{ label: '活化能更高的反应——指数对温度更敏感' },
			{ label: '活化能更低的反应——它在升温前通常更快' },
			{ label: '两者相同——都是升温 10 K' },
			{ label: '只看频率因子 A 才能比较这个倍率' }
		],
		correctIndex: 0,
		explanation:
			'倍率 k₂/k₁ = exp[(Eₐ/R)(1/T₁−1/T₂)]，在同一 T₁、T₂ 下随 Eₐ 增大。A 在比值里消掉。注意“升温倍率更大”不等于“原来的 k 更大”：高山可以更敏感，同时仍然更难翻。'
	},
	sandboxIntro: {
		eyebrow: 'FREE PLAY · 带着问题离开故事线',
		title: '分子温控台',
		description: '温度与活化能都在你手里；双杯、碰撞室和高能尾巴同步作答。'
	},
	modelCard: {
		title: '模型卡 · V0.1',
		items: [
			{
				term: '速率模型',
				value:
					'页面计算 k/A = exp(−Eₐ/RT) 与同一反应的速率比；默认 A、Eₐ 在所选温区内不变。所有 Eₐ 以 kJ/mol 输入、在内核中换算为 J/mol，R = 8.314462618 J/(mol·K)。'
			},
			{
				term: '分布与尾巴',
				value:
					'符号图用 f(x) ∝ x²exp(−x²/τ) 绘制并数值归一化的约化麦克斯韦—玻尔兹曼速率分布。尾部数值另取阿伦尼乌斯能垒因子 exp(−Eₐ/RT)；真实三维速率尾积分带有前因子，真实反应还受取向与透射概率影响，页面不把两者冒充为严格相等。'
			},
			{
				term: '生活锚点',
				value:
					'冰箱示例取表观 Eₐ = 75 kJ/mol，仅给出单一过程的 9.9 倍时间尺度估算，不预测食品保质期或安全性。雪树蟋蟀采用页面内 Dolbear 经验式 T(°F)=50+(N₆₀−40)/4；只在适用物种与温区内作教学近似。萤火虫仅作定性生物锚点。'
			},
			{
				term: '两点反演',
				value:
					'eaFromTwoPoints 直接由两个正的 k–T 点求表观 Eₐ；示例 293.15/313.15 K 与 1.20×10⁻³/6.09×10⁻³ s⁻¹ 返回约 62.0 kJ/mol。两点没有残差，无法检验 Arrhenius 线性。'
			},
			{
				term: '不能据此推断的内容',
				value:
					'本页不解析反应机理、过渡态熵或量子隧穿，也不保证跨越宽温区仍有同一 A 与 Eₐ。扩散控制、酶失活、相变和控速步骤切换都可产生非 Arrhenius 行为；此时“表观 Eₐ”只是一段温区的斜率。'
			}
		]
	},
	ending: {
		summary: '平均速度只挪一点，尾巴就能翻倍；温度没有拆掉山，只是把更多分子送到山口。',
		invitation: '下一站：如果不升温，能不能另开一条更低的山路？',
		backToHome: '回到故事目录'
	}
} satisfies ArrheniusStoryContent;

export default zhCNArrheniusContent;
