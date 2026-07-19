import type { NernstStoryContent } from '../../types';

export const zhCNNernstContent = {
	locale: 'zh-CN',
	seo: {
		title: '电池里的势能地形 — VisualChem',
		description:
			'一块锌、一块铜、两杯盐溶液,1.10 V 从哪里来?电极电势的天梯、能斯特方程的坡度、放电曲线的平台与雪崩——丹尼尔电池的每个数字都在浏览器里由标准电势逐点算出。',
		path: '/stories/nernst/',
		alternateLocalePath: '/en/stories/nernst/',
		type: 'article',
		image: '/og-nernst.png',
		imageAlt: '丹尼尔电池、离子视图与电极电势天梯组成的 VisualChem 叙事封面',
		publishedTime: '2026-07-18',
		modifiedTime: '2026-07-18'
	},
	hero: {
		eyebrow: 'THERMODYNAMICS · STORY 07',
		title: ['电池里的', '势能地形'],
		subtitle: '1.10 V 不是魔法。它是两级台阶的高度差,可以逐位算出来。',
		heroTag: 'E = E° − (RT/nF)·ln Q · 由标准电势逐点算出'
	},
	readingNote:
		'右侧舞台由同一个电池状态驱动:宏观的电池显示电极、盐桥与电压表读数,微观的离子解释电子为什么想走这条路,符号面板画出电极电势的天梯——两级台阶的高度差,就是表上的伏特数。',
	stage: {
		dialogAriaLabel: '当前叙事幕图形',
		closeGraphicAriaLabel: '关闭当前图形',
		openGraphicButton: '查看当前图',
		shortStateAriaLabel: '当前图形状态'
	},
	scenes: [
		{
			id: 'hook',
			prose: `锌片插进硫酸锌溶液,铜片插进硫酸铜溶液,盐桥一搭,电压表亮出:

$$1.10\\ \\mathrm{V}$$

不多不少。换成两杯更浓的溶液,还是约 1.10 V;把电池做大十倍,仍然 1.10 V。

**这个数字是从哪里来的?**为什么不是 2 V,不是 0.5 V?

先下一个判断。`
		},
		{
			id: 'two-heights',
			prose: `拆开来看,这是**两个**半反应:

- 锌那边:$\\mathrm{Zn \\to Zn^{2+} + 2e^-}$ —— 锌"愿意"抛下电子溶解
- 铜那边:$\\mathrm{Cu^{2+} + 2e^- \\to Cu}$ —— 铜离子"愿意"接住电子沉积

"愿意"的程度可以量化:让每个半反应对同一把标尺(标准氢电极)比高度,得到**标准电极电势**:

$$E^\\circ(\\mathrm{Cu^{2+}/Cu}) = +0.34\\ \\mathrm{V} \\qquad E^\\circ(\\mathrm{Zn^{2+}/Zn}) = -0.76\\ \\mathrm{V}$$

电子从低台阶跳向高台阶,高度差就是电压:$0.34 - (-0.76) = 1.10\\ \\mathrm{V}$。**谜底不是魔法,是一张表。**`
		},
		{
			id: 'the-ladder',
			prose: `把常见电对全部挂上这把梯子,你得到电化学的**天梯**——教科书里的标准电极电势表,竖过来看:

- 顶端 $\\mathrm{F_2/F^-}$(+2.87 V):最贪电子的氧化剂
- 中段 $\\mathrm{Cu^{2+}/Cu}$、$\\mathrm{H^+/H_2}$(定义为 0)、$\\mathrm{Zn^{2+}/Zn}$
- 底部 $\\mathrm{Li^+/Li}$(−3.04 V):最慷慨的还原剂

任取两级,高度差就是那对组合的标准电压。锂电池 3–4 V 的秘密,不过是**从梯子的两端取材**。天梯不是背诵材料——它是所有电池的价目表。`
		},
		{
			id: 'nernst-slope',
			prose: `但 1.10 V 只在**标准浓度**(1 mol/L)下成立。浓度一动,台阶就滑动——能斯特方程给出滑动的精确坡度:

$$E = E^\\circ - \\frac{RT}{nF}\\ln\\frac{[\\mathrm{Zn^{2+}}]}{[\\mathrm{Cu^{2+}}]}$$

$n=2$ 时,室温下的坡度是每个数量级 **29.6 mV**:锌离子浓十倍,电压掉 29.6 mV;铜离子浓十倍,电压涨 29.6 mV。

拖动两个浓度滑块,看电压表毫伏级响应。这条对数坡度和上一个故事的 $RT\\ln Q$ 是**同一项**——电池是吉布斯山谷的电学读数:$\\Delta G = -nFE$。`
		},
		{
			id: 'discharge',
			prose: `让电池干活。放电时,锌溶解、铜沉积:$[\\mathrm{Zn^{2+}}]$ 涨、$[\\mathrm{Cu^{2+}}]$ 落,Q 增大,电压顺着能斯特坡度**下滑**。

按下放电,看曲线:前 80% 的行程电压几乎不动(消耗四倍浓度差才掉一个 29.6 mV),最后一段却**雪崩**——对数在浓度趋零时坠落。

这就是电池"平台期"的由来,也是电量计难做的原因:**电压在平台上几乎不携带电量信息。**`
		},
		{
			id: 'dead-battery',
			prose: `电压滑到零,电池"死"了。死在哪里?

$$E = 0 \\iff \\ln Q = \\frac{nFE^\\circ}{RT} \\iff Q = K \\approx 10^{37}$$

电池死亡 = 反应抵达吉布斯山谷的**谷底**。只是这条山谷深得惊人:K ≈ 10³⁷ 意味着谷底几乎贴着"铜离子耗尽"的悬崖。

上一个故事说"没有反应真正进行到底"——严格仍然成立,但 10³⁷ 的谷底,和"到底"在任何仪器眼里都无法区分。**热力学从不撒谎,它只是偶尔把余量写得很小。**`
		},
		{
			id: 'concentration-cell',
			prose: `最后一个魔术:**两个半电池完全相同**,都是铜,只是浓度一杯浓一杯稀。

有电压吗?**有。**

$$E = \\frac{RT}{nF}\\ln\\frac{c_{\\text{浓}}}{c_{\\text{稀}}}$$

浓度比 10:1 给出 29.6 mV——不大,但真实存在,而且没有任何"化学反应"发生,只有铜离子从浓处往稀处搬家。

**纯粹的混合熵,直接读成了伏特。**神经细胞的静息电位、盐差发电,都是这只"浓差电池"的亲戚。熵不是抽象概念——你的每一次心跳都在给它计费。`
		},
		{
			id: 'sandbox',
			prose: `电池台交给你。

两个浓度滑块、一个温度旋钮,电压表与天梯实时作答;放电按钮走完整条曲线。

**挑战**:只动浓度,把电压推到 1.20 V 以上;再配一只 59 mV 的浓差电池;最后算算你手机电池 3.8 V 需要天梯上多大的跨度。`
		}
	],
	kickers: {
		hook: '00',
		'two-heights': '01',
		'the-ladder': '02',
		'nernst-slope': '03',
		discharge: '04',
		'dead-battery': '05',
		'concentration-cell': '06',
		sandbox: '07'
	},
	interactions: {
		hook: {
			question: '先预测:1.10 V 由什么决定',
			options: [
				{ id: 'size', label: '电池的大小' },
				{ id: 'pair', label: '两种金属是谁' },
				{ id: 'wire', label: '导线的粗细' }
			],
			explanation:
				'由两种金属(及其离子)决定——每个电对在"天梯"上有自己的台阶高度,高度差就是电压。大小决定容量,不决定电压;这正是故事接下来要拆的账。'
		},
		nernstSlope: {
			zincLabel: '[Zn²⁺] / mol·L⁻¹',
			copperLabel: '[Cu²⁺] / mol·L⁻¹',
			readout: ({ emf, deltaG }) => `E = ${emf} V · ΔG = ${deltaG} kJ/mol`
		},
		discharge: {
			playButton: '⏵ 放电',
			pauseButton: '⏸ 暂停',
			resetButton: '↻ 换新电池',
			readout: ({ depth, emf }) => `已放电 ${depth}% · E = ${emf} V`
		},
		concentrationCell: {
			ratioLabel: '浓稀比 c₂/c₁',
			readout: ({ ratio, emf }) => `浓度比 ${ratio}:1 → E = ${emf} mV`
		},
		sandbox: {
			zincLabel: '[Zn²⁺] / mol·L⁻¹',
			copperLabel: '[Cu²⁺] / mol·L⁻¹',
			temperatureLabel: '温度 T',
			readout: ({ emf, deltaG }) => `E = ${emf} V · ΔG = −nFE = ${deltaG} kJ/mol`
		}
	},
	triView: {
		defaultAriaLabel: '丹尼尔电池的三重表征舞台',
		liveSummary: ({ emf }) => `当前电压 ${emf} V。`,
		synchronizedState: '同一电池 · 三种表征',
		cell: {
			ariaLabel: '电池视图',
			viewName: '宏观 · 电池',
			caption: '电极溶解/沉积的厚度为示意;电压表读数由能斯特方程逐点计算。',
			zincLabel: 'Zn',
			copperLabel: 'Cu',
			bridgeLabel: '盐桥',
			voltmeterLabel: ({ emf }) => `${emf} V`,
			zincConcLabel: ({ molar }) => `Zn²⁺ ${molar} M`,
			copperConcLabel: ({ molar }) => `Cu²⁺ ${molar} M`
		},
		ions: {
			ariaLabel: '离子视图',
			viewName: '微观 · 界面',
			caption: '离子数目按浓度等比例缩放;电子流向由电势差的符号决定。',
			zincIon: 'Zn²⁺',
			copperIon: 'Cu²⁺',
			electronTag: 'e⁻',
			dissolveTag: '溶解',
			depositTag: '沉积'
		},
		ladder: {
			ariaLabel: ({ emf }) => `电极电势天梯,当前电池电压 ${emf} 伏`,
			viewName: '符号 · 电势天梯',
			caption: '台阶高度取 CRC/IUPAC 标准电极电势;工作位置由能斯特方程滑动。',
			yAxis: 'E vs SHE / V',
			zincRung: 'Zn²⁺/Zn',
			copperRung: 'Cu²⁺/Cu',
			gapLabel: ({ emf }) => `ΔE = ${emf} V`,
			sheLabel: 'H⁺/H₂ (0 V)'
		}
	},
	edge: {
		eyebrow: 'THE PRICE LIST',
		title: '天梯上的价目表',
		facts: [
			{
				term: '标准电极电势',
				definition:
					'每个半反应对标准氢电极的台阶高度;任意两级之差即该组合的标准电压。CRC/IUPAC 表值。'
			},
			{
				term: '能斯特坡度',
				definition:
					'每个数量级浓度比 59.2/n mV(298 K):n=2 时 29.6 mV。对数项与吉布斯山谷的 RT ln Q 是同一项。'
			},
			{
				term: 'ΔG = −nFE',
				definition: '电压就是摩尔吉布斯能的电学读数:1.10 V × 2F = 213 kJ/mol 下坡。'
			},
			{
				term: '浓差电池',
				definition: '零化学反应、纯混合熵的电压:E = (RT/nF)·ln(c₂/c₁)。神经静息电位与盐差能的原型。'
			}
		]
	},
	conceptCheck: {
		question: '给丹尼尔电池的铜半池加水稀释十倍([Cu²⁺] 从 1 M 到 0.1 M),电压如何变化?',
		options: [
			{ label: '不变——E° 只由金属种类决定' },
			{ label: '下降约 29.6 mV——Q 增大,能斯特项吃掉一格' },
			{ label: '上升约 29.6 mV——溶液变稀,电阻变小' },
			{ label: '下降一半——浓度砍到十分之一' }
		],
		correctIndex: 1,
		explanation:
			'E° 确实不变,但工作电压 E 跟随能斯特项:稀释铜离子使 Q = [Zn²⁺]/[Cu²⁺] 增大十倍,ln Q 涨一格,E 下降 (RT/2F)·ln 10 ≈ 29.6 mV。电阻影响电流与功率,不影响开路电压。'
	},
	sandboxIntro: {
		eyebrow: 'FREE PLAY · 带着问题离开故事线',
		title: '电池工作台',
		description: '浓度、温度、放电,全在你手里;电压表、离子界面与天梯同步作答。'
	},
	modelCard: {
		title: '模型卡 · V0.1',
		items: [
			{
				term: '体系与数据',
				value:
					'丹尼尔电池 Zn | Zn²⁺ ‖ Cu²⁺ | Cu,标准电极电势取 CRC/IUPAC(298.15 K):E°(Cu²⁺/Cu)=+0.3419 V、E°(Zn²⁺/Zn)=−0.7618 V,E°cell=1.1037 V。单元测试钉住 29.58 mV/decade 坡度、ΔG°=−213 kJ/mol 与 K≈10³⁷。'
			},
			{
				term: '教学近似',
				value:
					'浓度代替活度(γ=1)。真实 ZnSO₄/CuSO₄ 在 1 M 下活度系数约 0.04–0.05,实测开路电压与理想值有数十毫伏偏差;Debye–Hückel/Pitzer 修正属后端待办(docs/后端待办.md)。液接电势与盐桥不对称电势也未建模。'
			},
			{
				term: '放电曲线',
				value:
					'等体积双半池的物料守恒推进([Zn²⁺]+[Cu²⁺] 守恒),每步用能斯特方程重算 E,至截止电压停止。未含内阻、极化与传质限制——那些决定"能放多快",本页只回答"能放到哪"。'
			},
			{
				term: '不能据此推断的内容',
				value:
					'电极动力学(过电位、交换电流密度)、真实电池的容量衰减与自放电、以及锂离子等嵌入型电池的电压曲线形状(由固相活度而非溶液浓度主导)都超出本模型;天梯只报热力学高度,不报到达速度。'
			}
		]
	},
	ending: {
		summary:
			'1.10 V 是两级台阶的差,29.6 mV 是对数的坡,10³⁷ 是谷底的深。电池不制造能量——它只是给下坡路装了水表。',
		invitation: '第二季·热力学的骨架,还在继续搭建。',
		backToHome: '回到故事目录'
	}
} satisfies NernstStoryContent;

export default zhCNNernstContent;
