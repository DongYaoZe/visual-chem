import type { CatalystStoryContent } from '../../types';

export const zhCNCatalystContent = {
	locale: 'zh-CN',
	seo: {
		title: '捷径不改终点 — VisualChem',
		description:
			'同样一瓶过氧化氢,为什么滴入碘化物会冒泡,遇到过氧化氢酶却近乎喷发?沿着 73、56、14 kJ/mol 三条能量路径,看催化剂如何降低山口而不移动山谷,为何正逆反应同倍加速、平衡常数丝毫不变。',
		path: '/stories/catalyst/',
		alternateLocalePath: '/en/stories/catalyst/',
		type: 'article',
		image: '/og-catalyst.png',
		imageAlt: '过氧化氢冒泡实验、催化循环与三条反应能量路径组成的 VisualChem 叙事封面',
		publishedTime: '2026-07-23',
		modifiedTime: '2026-07-23'
	},
	hero: {
		eyebrow: 'KINETICS · STORY 10',
		title: ['捷径不改', '终点'],
		subtitle: '催化剂削低山口,却从不搬动山谷。快慢改变了,平衡没有。',
		heroTag: '73 → 56 → 14 kJ·mol⁻¹ · 同一对山谷'
	},
	readingNote:
		'右侧舞台由同一条反应路径驱动:宏观实验台用气泡显示速率,微观表面把吸附、转化、脱附串成循环,符号面板叠起未催化与催化能量曲线。三个面板讲的是同一件事——催化剂换了路,没有换起点和终点。',
	stage: {
		dialogAriaLabel: '当前叙事幕图形',
		closeGraphicAriaLabel: '关闭当前图形',
		openGraphicButton: '查看当前图',
		shortStateAriaLabel: '当前图形状态'
	},
	scenes: [
		{
			id: 'hook',
			prose: `三只烧杯,各装同样浓度、同样温度的过氧化氢。第一杯什么也不加,第二杯滴入碘化钾,第三杯加入一点过氧化氢酶。

反应完全相同:

$$2\\,\\mathrm{H_2O_2(aq) \\to 2\\,H_2O(l) + O_2(g)}$$

第一杯只零星冒泡,第二杯不断放出氧气,第三杯几乎立刻涌起泡沫。**明明起点、终点都一样,中间加的一点东西凭什么把时间改写十个数量级?**

先下注。`
		},
		{
			id: 'the-pass',
			prose: `这个反应的焓变约为

$$\\Delta_r H = -98\\ \\mathrm{kJ\\,mol^{-1}}\\quad\\text{(每摩尔 }\\mathrm{H_2O_2}\\text{)}$$

产物山谷比反应物低得多——热力学说它值得发生。可 H₂O₂ 分子不能从起点直坠终点:旧键必须拉长,电子必须重排,要先爬过一个约 **73 kJ/mol** 的过渡态山口。

上一幕的阿伦尼乌斯定律给出门票比例 $e^{-E_a/RT}$。在室温下,73 kJ/mol 是一道极苛刻的门槛。**下坡回答“往哪去”,山口回答“多久到”。**这就是过氧化氢在瓶中能暂时安静的原因。`
		},
		{
			id: 'lower-pass',
			prose: `催化剂不把分子“推”过原来的山口。它提供一条**不同的反应机理**。

在这幅教学能量图里:

- 无催化路径:$E_a \\approx 73\\ \\mathrm{kJ/mol}$
- 碘化物路径:$E_a \\approx 56\\ \\mathrm{kJ/mol}$
- 过氧化氢酶路径:$E_a \\approx 14\\ \\mathrm{kJ/mol}$

碘离子先与 H₂O₂ 反应、再在后续步骤中再生;酶的血红素活性中心则把底物固定在恰当构型,稳定沿途的高能状态。新路往往有多个小山包和中间体,但**最高的山口变低了**。

室温下,Ea 每降低 5.7 kJ/mol,阿伦尼乌斯因子就大约放大十倍。拖动三档按钮:你改的不是终点,而是能赶到终点的分子比例。`
		},
		{
			id: 'both-ways',
			prose: `把能量图从右往左读,一个常见误会会自行瓦解。

未催化时,正向山口是 73 kJ/mol;因为产物低 98 kJ/mol,逆向要爬 **171 kJ/mol**。若催化路径把正向山口降到 56,逆向也随之降到 **154 kJ/mol**——两边都少爬 17。换成酶路径,两边都少爬 59。

因此在同一温度、同一可逆路径的模型中:

$$\\frac{k_f'}{k_f}=\\frac{k_r'}{k_r}=e^{\\Delta E_a/RT}$$

而

$$K=\\frac{k_f}{k_r}=\\frac{k_f'}{k_r'}$$

**催化剂让正反应和逆反应同倍加速。**它缩短抵达平衡的时间,不改变平衡组成。把平衡“推向产物”的从来不是催化剂,而是温度、压强或移走产物。`
		},
		{
			id: 'unconsumed',
			prose: `为什么一点点催化剂能处理许多底物?看微观面板的一整圈:

$$\\mathrm{Cat + R \\rightleftharpoons Cat\\!\\cdot\\!R \\to Cat\\!\\cdot\\!P \\rightleftharpoons Cat + P}$$

催化剂先参与、形成中间体,最后被**再生**。所以它不出现在总反应式里,也不按产物的化学计量数被消耗。衡量它的两个实用数字是周转频率(每个活性位点每秒做几轮)与周转数(失活前一共做几轮)。

但“不消耗”不是“不变化”。表面会被杂质**毒化**,纳米颗粒会烧结,积碳会堵住孔道,酶会变性。工业装置要再生或更换催化剂,正因为真实循环并不永生。`
		},
		{
			id: 'enzymes',
			prose: `酶把“换路”做到近乎精密工程。

过氧化氢酶的活性口袋不是一块只会降山的魔法石:通道筛选能进入的分子,弱相互作用把 H₂O₂ 摆到正确姿势,血红素铁暂时接管电子,酸碱残基接力质子,水与氧气离开后活性中心复原。

这解释了酶的两种本领:

- **高活性**:把有效路径的最高能垒压低
- **高选择性**:只为特定底物、特定键和特定立体方向铺路

选择性尤其重要。一个工业反应若快了百倍,却多生出难分离的副产物,未必是进步;能把每个原子送到想要的产物,往往比单纯“更快”更值钱。`
		},
		{
			id: 'no-free-lunch',
			prose: `催化没有免费的午餐。

它**不能**让热力学不允许的反应凭空变得有利,不能改变 $\\Delta G^\\circ$ 或 $K$,也不能提供反应所需的净能量。它能做的是把本来可走的路变得可用,让工厂在更低温度、更低压力下达到实用速率——由此间接节省能源。

现实中的选择题远比“谁的 Ea 最低”复杂:

- 活性:单位时间做多少轮
- 选择性:多少原料走向目标产物
- 稳定性:耐不耐热、毒物、积碳与机械磨损
- 可得性:是否依赖稀贵金属,能否回收再生
- 传递:反应物能否穿过孔道,热量能否及时带走

哈柏–博施合成氨需要铁催化剂,汽车尾气净化依赖铂族金属,生物体依靠酶。催化剂不是魔法捷径;它是**化学、材料、流动与经济共同设计的一条路**。`
		},
		{
			id: 'sandbox',
			prose: `山口交给你。

	固定未催化路径为 73 kJ/mol、碘化物路径为 56 kJ/mol,只拖动温度。两条路径的 $k/A$ 都随升温而增大,但高能垒的未催化路径增长得更快,所以碘化物的**相对催化倍率反而下降**。实验台、溶液介体循环与能量图同步作答;起点和终点始终钉在 0 与 −98 kJ/mol。

	**挑战**:记录 25 °C 时约 951 倍的相对优势,再升到 100 °C。确认两条绝对速率都上升,同时相对优势缩到约 240 倍——催化没有“失效”,只是高山对升温更敏感。`
		}
	],
	kickers: {
		hook: '00',
		'the-pass': '01',
		'lower-pass': '02',
		'both-ways': '03',
		unconsumed: '04',
		enzymes: '05',
		'no-free-lunch': '06',
		sandbox: '07'
	},
	interactions: {
		hook: {
			question: '先预测:催化剂让反应变快,最准确的原因是',
			options: [
				{ id: 'heat', label: '它给分子持续供热' },
				{ id: 'path', label: '它提供更低能垒的新路径' },
				{ id: 'equilibrium', label: '它把平衡推向产物' }
			],
			explanation:
				'它提供更低能垒的新路径。反应物和产物的能级、ΔG° 与平衡常数都不动;变的是抵达终点所需跨过的最高山口。接下来三幅同步图会把这一区别钉牢。'
		},
		lowerPass: {
			catalystLabel: '反应路径',
			catalystNames: ['无催化 · 73', '碘化物 · 56', '过氧化氢酶 · 14'],
			readout: ({ ea, boost }) => `Ea = ${ea} kJ/mol · 相对无催化加速 ${boost}×`
		},
		bothWays: {
			readout: ({ forwardBoost, reverseBoost }) =>
				`正向 ${forwardBoost}× · 逆向 ${reverseBoost}× · K 不变`
		},
		sandbox: {
			eaLabel: '固定碘化物路径 Ea',
			temperatureLabel: '温度 T',
			readout: ({ boost, ea, uncatalyzedFactor, catalyzedFactor }) =>
				`Ea = ${ea} kJ/mol · 无催化 k/A = ${uncatalyzedFactor} · 碘化物 k/A = ${catalyzedFactor} · 相对 ${boost}×`
		}
	},
	triView: {
		defaultAriaLabel: '过氧化氢催化分解的三重表征舞台',
		liveSummary: ({ ea, boost }) => `当前路径活化能 ${ea} kJ/mol,相对无催化加速 ${boost} 倍。`,
		synchronizedState: '同一条路径 · 三种表征',
		bench: {
			ariaLabel: '过氧化氢分解实验台视图',
			viewName: '宏观 · 实验台',
			caption: '气泡频率按阿伦尼乌斯加速因子压缩映射;只表达相对快慢,不是流量计。',
			plainTag: '无催化',
			catalyzedTag: '当前路径',
			bubbleRate: ({ boost }) => `相对速率 ${boost}×`
		},
		surface: {
			viewName: '微观 · 催化循环',
			states: {
				none: {
					ariaLabel: '无催化过氧化氢分解的分子路径示意图',
					caption: '没有催化介体或活性位点;分子只能尝试高能垒的直接路径。',
					catalystLabel: '无催化介体',
					reactantLabel: '2 H₂O₂',
					productLabel: '2 H₂O + O₂',
					cycleTag: '直接路径 · 缓慢'
				},
				iodide: {
					ariaLabel: '溶液中碘离子介体催化过氧化氢分解的循环示意图',
					caption: '均相介体示意:I⁻ 在溶液中暂变为 IO⁻,随后再生;不是固体表面。',
					catalystLabel: 'I⁻ ⇌ IO⁻',
					reactantLabel: '2 H₂O₂ 进入',
					productLabel: '2 H₂O + O₂ 离开',
					cycleTag: 'I⁻ → IO⁻ → I⁻'
				},
				catalase: {
					ariaLabel: '过氧化氢酶血红素活性口袋与底物选择性示意图',
					caption: '酶活性口袋示意:形状与血红素中心共同选择、定位并转化 H₂O₂。',
					catalystLabel: '过氧化氢酶 · 血红素',
					reactantLabel: '2 H₂O₂ 依次进入',
					productLabel: '2 H₂O + O₂',
					cycleTag: '识别 → 定位 → 转化 → 再生'
				}
			}
		},
		profile: {
			ariaLabel: ({ ea }) => `反应能量剖面,当前催化路径活化能 ${ea} 千焦每摩尔`,
			viewName: '符号 · 能量路径',
			caption: '曲线由分段余弦路径生成;起点 0、终点 −98 kJ/mol 始终不动。',
			xAxis: '反应坐标',
			yAxis: '相对能量 / kJ·mol⁻¹',
			plainCurve: '未催化路径 · Ea 73',
			catalyzedCurve: '催化路径',
			eaMarker: '正向活化能 Ea',
			deltaHMarker: 'ΔH'
		}
	},
	edge: {
		eyebrow: 'THE PASSKEEPER',
		title: '山口管理员手册',
		facts: [
			{
				term: '换路,不搬山谷',
				definition:
					'催化剂通过新的基元步骤降低有效活化能;反应物与产物的状态函数能级不变,所以 ΔG°、ΔH° 与 K 不变。'
			},
			{
				term: '正逆同倍加速',
				definition:
					'同一可逆催化路径的山口降低 ΔEa,正逆势垒都降低 ΔEa;两边的 Arrhenius 因子同乘 e^(ΔEa/RT),kf/kr 不变。'
			},
			{
				term: '循环与周转',
				definition:
					'催化剂参与中间步骤并在一轮末再生;周转频率量速度,周转数量寿命。毒化、烧结、积碳和变性让真实催化剂失活。'
			},
			{
				term: '选择性',
				definition:
					'催化剂同时在多条竞争路径中“选路”。工业价值由活性、选择性、稳定性、可回收性与传质传热共同决定。'
			}
		]
	},
	conceptCheck: {
		question: '某可逆反应已经达到平衡。加入只改变速率的催化剂后,最准确的描述是?',
		options: [
			{ label: '平衡向产物移动,因为正反应变快' },
			{ label: '平衡向反应物移动,因为逆反应也被催化' },
			{ label: '组成保持不变;正逆反应速率同时增大且仍彼此相等' },
			{ label: 'ΔG° 变小,但 K 不变' }
		],
		correctIndex: 2,
		explanation:
			'平衡时正逆速率原本相等。催化剂为两个方向提供同一条较低能垒的可逆路径,两者同倍加速,所以仍相等;反应物和产物的自由能差没动,ΔG° 与 K 都不动。若体系尚未平衡,它只会更快抵达原来的平衡组成。'
	},
	sandboxIntro: {
		eyebrow: 'FREE PLAY · 带着问题离开故事线',
		title: '山口设计室',
		description: '固定 73/56 kJ/mol 两条路径,只改变温度;同时追踪两条绝对速率与相对催化优势。'
	},
	modelCard: {
		title: '模型卡 · V0.1',
		items: [
			{
				term: '体系与数值锚点',
				value:
					'反应为 2 H₂O₂(aq) → 2 H₂O(l) + O₂(g)。教学锚点按每摩尔 H₂O₂ 记:ΔrH = −98 kJ/mol;有效正向势垒取无催化 73、碘化物 56、过氧化氢酶 14 kJ/mol。它们用于同尺比较,真实表观 Ea 会随 pH、浓度、离子强度、酶来源与拟合区间变化。'
			},
			{
				term: '能量曲线',
				value:
					'未催化路径为单峰,催化路径为含中间体的双峰分段余弦示意;最高峰等于所选 Ea,反应物固定为 0,产物固定为 −98 kJ/mol。曲线连续平滑,但横向反应坐标没有时间或距离单位,峰形不用于反推真实过渡态结构。'
			},
			{
				term: '速率映射',
				value:
					'相对加速按 exp[(Ea,未催化 − Ea,当前)/(RT)] 计算,默认假定频率因子 A 相同,以隔离能垒效应。Sandbox 固定 73/56 kJ/mol:升温使两条 k/A 都增大,但高能垒路径增长更快,故相对倍率下降。真实催化会同时改变 A、覆盖度与控速步骤;倍数不是工艺预测。气泡密度和速度用 log₁₀ 压缩,可见倍数读数始终保留真实值。'
			},
			{
				term: '平衡不变的边界',
				value:
					'热力学一致的可逆机理满足微观可逆性:催化剂不改变 ΔG° 或 K。页面用“正逆同倍”展示同一过渡路径的理想化结论;复杂多步网络的表观正逆速率未必能各自归成一个常数倍,但它们必须收敛到同一个平衡。'
			},
			{
				term: '未纳入的现实',
				value:
					'页面不模拟 Michaelis–Menten 饱和、表面吸附等温线、传质传热、诱导期、催化剂毒化动力学或副反应网络。酶与碘化物循环仅为机理示意;基元反应、TST/RRKM、表面 KMC 与反应器模型属于后端待办。'
			}
		]
	},
	ending: {
		summary: '催化剂没有改写热力学的结局。它只是把一条等不到的路,改造成今天就能走完的路。',
		invitation: '第三季结束:浓度给出时钟,温度打开山门,催化剂重画路径。',
		backToHome: '回到故事目录'
	}
} satisfies CatalystStoryContent;

export default zhCNCatalystContent;
