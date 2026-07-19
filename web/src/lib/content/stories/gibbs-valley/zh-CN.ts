import type { GibbsStoryContent } from '../../types';

export const zhCNGibbsContent = {
	locale: 'zh-CN',
	seo: {
		title: '化学反应的下坡路 — VisualChem',
		description:
			'ΔG° 是正的,反应却照样发生?一只装着 N₂O₄ 的琥珀色烧瓶,一条在浏览器里逐点算出的吉布斯能山谷:混合熵挖出谷底,ΔG 是坡度,平衡是谷底,勒夏特列是山谷的形变。',
		path: '/stories/gibbs-valley/',
		alternateLocalePath: '/en/stories/gibbs-valley/',
		type: 'article',
		image: '/og-gibbs-valley.png',
		imageAlt: 'N₂O₄/NO₂ 烧瓶与吉布斯能山谷组成的 VisualChem 叙事封面',
		publishedTime: '2026-07-18',
		modifiedTime: '2026-07-18'
	},
	hero: {
		eyebrow: 'THERMODYNAMICS · STORY 06',
		title: ['化学反应的', '下坡路'],
		subtitle: 'ΔG° 明明是正的,烧瓶却染上了棕色。地形图会解释一切。',
		heroTag: 'G(ξ) · 由标准数据逐点算出'
	},
	readingNote:
		'右侧舞台由同一个反应进度驱动:宏观的烧瓶用颜色报告 NO₂ 的含量,微观的分子显示二聚体的拆合,符号面板画出整条吉布斯能山谷——小球所在的位置,就是烧瓶此刻的状态。',
	stage: {
		dialogAriaLabel: '当前叙事幕图形',
		closeGraphicAriaLabel: '关闭当前图形',
		openGraphicButton: '查看当前图',
		shortStateAriaLabel: '当前图形状态'
	},
	scenes: [
		{
			id: 'hook',
			prose: `一只密封烧瓶,装着无色的 N₂O₄ 气体。查表:

$$\\mathrm{N_2O_4(g) \\to 2\\,NO_2(g)}\\qquad \\Delta_r G^\\circ = +4.7\\ \\mathrm{kJ/mol}$$

**正的。**按"ΔG 为正不自发"的口诀,瓶里什么都不该发生。

可室温下的烧瓶分明泛着**棕色**——NO₂ 的颜色。约五分之一的 N₂O₄ 已经拆开了。

口诀错了吗?先下一个判断。`
		},
		{
			id: 'two-forces',
			prose: `两股力量在瓶里角力。

**能量**偏向 N₂O₄:拆开一个二聚体要花 57.2 kJ/mol,焓在喊"别拆"。

**计数**偏向拆:一个分子变两个,粒子数从 1 涨到 1+ξ;更多粒子、更多混合方式——上一个故事数过的 W 在喊"拆"。

ΔG° 只裁决**纯反应物到纯产物**的整体较量。但反应从不需要走完全程——它可以停在**半路**。半路上发生了什么,ΔG° 一个字也没说。`
		},
		{
			id: 'the-valley',
			prose: `把半路画出来。横轴是反应进度 $\\xi$:0 是纯 N₂O₄,1 是完全拆开。对每个 ξ 逐点计算总吉布斯能:

$$G(\\xi) = \\xi\\,\\Delta_r G^\\circ + RT\\big[(1-\\xi)\\ln x_A + 2\\xi \\ln x_B\\big]$$

第一项是标准部分的直线——因为 ΔG° 为正,它**向上**倾斜。第二项是**混合熵**:混合物的 ln x 全为负,它把曲线中段**压下去**。

直线加下凹,得到一条**山谷**。谷底在 ξ ≈ 0.19——不在 0,也不在 1。烧瓶的棕色,就是谷底的颜色。`
		},
		{
			id: 'slope-is-deltaG',
			prose: `现在厘清那对易混的兄弟。

**ΔrG(不带 °)是山谷在当前位置的坡度**:

$$\\Delta_r G = \\left(\\frac{\\partial G}{\\partial \\xi}\\right)_{T,p} = \\Delta_r G^\\circ + RT\\ln Q$$

坡度为负,球向右滚(正向反应);为正,向左滚(逆向);**谷底坡度为零——平衡**。

而 ΔrG° 只是这条山谷的一个**建造参数**:它决定谷底偏向哪一侧,却不决定"有没有谷底"。混合熵保证:只要两种气体共存,山谷必然存在,谷底必然在中间某处。**没有反应真正"进行到底"。**`
		},
		{
			id: 'kp-position',
			prose: `谷底的位置有个名字:平衡常数。

$$\\Delta_r G^\\circ = -RT\\ln K \\qquad K_{298} = e^{-4700/RT} \\approx 0.15$$

K 不是另一个神秘量——它就是"谷底坐标"的换算。ΔG° = 0 对应 K = 1,谷底居中;ΔG° 每偏 5.7 kJ/mol,K 变化十倍,谷底向一侧滑一格。

+4.7 kJ/mol 换算出 K ≈ 0.15:偏向 N₂O₄,但远非"不发生"。**"ΔG° 为正"的真实含义只是:谷底在左半边。**`
		},
		{
			id: 'squeeze',
			prose: `捏一捏这只山谷:**加压**。

1 变 2 的反应,粒子数随进度增加;压强抬高时,"多粒子"一侧的混合项被抹平,山谷右壁隆起,**谷底左移**——NO₂ 被压回二聚体,棕色变淡。

拖动压强滑块,看谷底沿 $\\xi_{eq} = \\sqrt{K/(K+4p)}$ 滑动。勒夏特列原理不是一条独立的定律——它只是山谷在外力下的**形变几何**。`
		},
		{
			id: 'heat',
			prose: `再烤一烤:**升温**。

拆开二聚体吸热(ΔH° = +57.2 kJ/mol),范托夫方程说:温度升高,K 指数式增大,谷底**右移**。

冰水浴里的烧瓶几乎无色(0 °C:K ≈ 0.02),60 °C 热水里棕得发深(K ≈ 1.3)——课堂上最著名的变色演示,在这里是同一条山谷随温度的连续形变。拖动温度,看颜色与谷底一起走。`
		},
		{
			id: 'positive-deltaG0',
			prose: `回到开头的口诀,现在可以精确地修正它:

- "ΔG° > 0 则不自发" —— **错**。ΔG° 只定谷底位置;从纯反应物出发,坡度 ΔrG 起初总是 $-\\infty$(混合熵的对数在 ξ=0 处无底),**任何反应都至少走出第一步**
- "ΔG < 0 则自发" —— **对,但主语是坡度**:它说的是"从当前位置向前一小步",不是"走到底"
- 判断用 **Q 与 K 的比较**:Q < K 在谷底左侧,正向;Q > K 在右侧,逆向

一句话:**ΔG° 造山谷,ΔrG 读坡度,反应滚向谷底。**`
		},
		{
			id: 'sandbox',
			prose: `山谷交给你。

温度与压强两个旋钮,实时重算整条 G(ξ) 曲线;点击山谷任意位置放置小球,看坡度把它推向谷底;烧瓶颜色与分子面板同步作答。

**挑战**:找到让谷底恰好居中(ξ = 0.5)的温度;再用加压把它推回 0.3 以下。`
		}
	],
	kickers: {
		hook: '00',
		'two-forces': '01',
		'the-valley': '02',
		'slope-is-deltaG': '03',
		'kp-position': '04',
		squeeze: '05',
		heat: '06',
		'positive-deltaG0': '07',
		sandbox: '08'
	},
	interactions: {
		hook: {
			question: '先预测:ΔG° 为正,瓶里',
			options: [
				{ id: 'nothing', label: '什么都不发生' },
				{ id: 'partial', label: '反应走一部分就停' },
				{ id: 'complete', label: '反应彻底逆转' }
			],
			explanation:
				'走一部分就停——停在吉布斯能山谷的谷底。ΔG° 只决定谷底偏向哪边,不决定"有没有反应"。这个故事接下来就把这条山谷算出来。'
		},
		valley: {
			extentLabel: '反应进度 ξ'
		},
		squeeze: {
			pressureLabel: '总压 p',
			pressureScale: {
				start: '0.2 bar · 减压',
				end: '5 bar · 加压'
			}
		},
		heat: {
			temperatureLabel: '温度 T',
			temperatureScale: {
				start: '0 °C · 冰水浴',
				end: '80 °C · 热水浴'
			}
		},
		sandbox: {
			temperatureLabel: '温度 T',
			pressureLabel: '总压 p',
			ballButton: '把球放到当前 ξ',
			readout: ({ extent, kp, deltaG0 }) =>
				`谷底 ξ_eq = ${extent} · K = ${kp} · ΔG° = ${deltaG0} kJ/mol`
		}
	},
	triView: {
		defaultAriaLabel: 'N₂O₄/NO₂ 平衡的三重表征舞台',
		liveSummary: ({ extent, temperatureC }) => `当前状态:${temperatureC} °C,反应进度 ${extent}。`,
		synchronizedState: '同一进度 · 三种表征',
		flask: {
			ariaLabel: '烧瓶视图',
			viewName: '宏观 · 烧瓶',
			caption: '棕色深浅由计算的 NO₂ 摩尔分数驱动;瓶形为示意。',
			temperatureLabel: ({ temperatureC }) => `${temperatureC} °C`,
			no2Label: ({ percent }) => `NO₂ 占比 ${percent}%`,
			pressureLabel: ({ pressureBar }) => `p = ${pressureBar} bar`
		},
		molecules: {
			ariaLabel: '分子视图',
			viewName: '微观 · 分子',
			caption: '二聚体与单体数目按进度等比例缩放;位置为示意。',
			dimerLabel: 'N₂O₄',
			monomerLabel: 'NO₂'
		},
		valley: {
			ariaLabel: ({ extent }) => `吉布斯能山谷,当前进度 ${extent}`,
			viewName: '符号 · G(ξ) 山谷',
			caption: '山谷由标准生成数据与理想混合熵逐点计算;谷底即平衡。',
			xAxis: '反应进度 ξ',
			yAxis: 'G − G(0) / kJ·mol⁻¹',
			floorMarker: '谷底 (平衡)',
			ballMarker: '当前状态',
			slopeReadout: ({ deltaG }) => `坡度 ΔrG = ${deltaG} kJ/mol`
		}
	},
	edge: {
		eyebrow: 'THE SURVEYOR',
		title: '地形测量员手册',
		facts: [
			{
				term: 'G(ξ) 山谷',
				definition: '标准直线 + 混合熵下凹 = 必有谷底。只要产物与反应物共存,山谷就存在。'
			},
			{
				term: 'ΔrG 是坡度',
				definition:
					'∂G/∂ξ:负则正向,正则逆向,零即平衡。它随位置变化,ΔrG° 只是 ξ 标准态处的一个常数。'
			},
			{
				term: 'K 是谷底坐标',
				definition: 'ΔrG° = −RT ln K:每 5.7 kJ/mol 换一个数量级。K 从不"关闭"反应,只挪谷底。'
			},
			{
				term: '勒夏特列 = 形变',
				definition:
					'加压、升温都是给山谷施力;谷底的滑动方向由粒子数差与反应焓的符号决定,可逐点算出。'
			}
		]
	},
	conceptCheck: {
		question: '某反应 ΔrG° = +20 kJ/mol(K ≈ 3×10⁻⁴)。从纯反应物出发,最准确的说法是?',
		options: [
			{ label: '反应完全不发生——ΔG° 为正' },
			{ label: '反应少量正向进行,停在偏向反应物一侧的谷底' },
			{ label: '反应完全进行——只要等得够久' },
			{ label: '无法判断,需要知道活化能' }
		],
		correctIndex: 1,
		explanation:
			'从 ξ=0 出发,混合熵让起始坡度趋于 −∞,反应必然启动;但 K ≈ 3×10⁻⁴ 把谷底钉在很靠左的位置,正向只走一小段。活化能决定"多快",不决定"停在哪"——那是山谷的事。'
	},
	sandboxIntro: {
		eyebrow: 'FREE PLAY · 带着问题离开故事线',
		title: '山谷雕塑室',
		description: '温度、压强、小球位置,全在你手里;山谷实时重算,烧瓶同步变色。'
	},
	modelCard: {
		title: '模型卡 · V0.1',
		items: [
			{
				term: '体系与数据',
				value:
					'N₂O₄(g) ⇌ 2 NO₂(g),标准生成数据取 CODATA/NIST-JANAF(298.15 K):ΔfG°(NO₂)=51.3、ΔfG°(N₂O₄)=97.9、ΔfH°(NO₂)=33.2、ΔfH°(N₂O₄)=9.16 kJ/mol,故 ΔrG°=+4.7、ΔrH°=+57.2 kJ/mol。单元测试钉住 K(298)≈0.15 与 K=1 的温度 ≈325 K。'
			},
			{
				term: '山谷计算',
				value:
					'理想气体混合:G(ξ) 解析式逐点计算,谷底有闭式解 ξ_eq = √(K/(K+4p)),并与 ΔrG 的括根零点交叉验证到 1e-9。温度外推用常 ΔH° 的范托夫式;80 °C 内误差远小于线宽。'
			},
			{
				term: '颜色映射',
				value:
					'烧瓶棕色按计算的 NO₂ 摩尔分数线性调深。真实 NO₂ 吸收(400 nm 附近)对光程与浓度按比尔定律非线性,此处取教学线性——趋势正确,深浅非光度计。'
			},
			{
				term: '不能据此推断的内容',
				value:
					'理想气体近似在高压端(>5 bar)开始失真,NO₂ 二聚的实际气相还有 N₂O₃ 等次要物种,均未纳入;反应速率与活化能完全不在本页——山谷只回答"停在哪",不回答"多快到"。非理想修正与动力学模拟属后端待办(docs/后端待办.md)。'
			}
		]
	},
	ending: {
		summary: 'ΔG° 造山谷,混合熵挖谷底,ΔrG 读坡度,勒夏特列摆弄谷形。反应没有终点线,只有谷底。',
		invitation: '下一站:把这条下坡路接上导线,让它点亮一只灯泡。',
		backToHome: '回到故事目录'
	}
} satisfies GibbsStoryContent;

export default zhCNGibbsContent;
