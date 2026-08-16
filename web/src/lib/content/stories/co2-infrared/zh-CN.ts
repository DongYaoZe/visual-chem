import type { CO2InfraredStoryContent } from '../../types';

export const zhCNCO2InfraredContent = {
	locale: 'zh-CN',
	seo: {
		title: '为什么有些分子振动吸收红外光 — VisualChem',
		description:
			'CO₂ 有三类基本振动，红外谱上却看不到全部。比较键的运动、偶极矩变化和计算峰位，读懂红外选择定则。',
		path: '/stories/co2-infrared/',
		alternateLocalePath: '/en/stories/co2-infrared/',
		type: 'article',
		image: '/og-hydrogen-spectrum.png',
		imageAlt: '红外光束、二氧化碳分子振动与吸收谱组成的 VisualChem 故事封面',
		publishedTime: '2026-08-07',
		modifiedTime: '2026-08-07'
	},
	hero: {
		eyebrow: 'MOLECULAR VIBRATION · STORY 12',
		title: ['为什么有些振动', '红外光看不见'],
		subtitle: 'CO₂ 的原子一直在动。红外谱只记录其中一部分运动，因为吸收光还要满足一个条件。',
		heroTag: 'ν₂ = 667 · ν₁ = 1333 · ν₃ = 2349 cm⁻¹'
	},
	readingNote:
		'右边三幅图共用一个振动模式。光路显示样品是否吸收，分子图放大正常坐标，谱图标出对应波数。切换模式时，三个读数会一起更新。',
	stage: {
		dialogAriaLabel: '当前二氧化碳红外吸收故事图形',
		closeGraphicAriaLabel: '关闭当前图形',
		openGraphicButton: '查看当前图',
		shortStateAriaLabel: '当前振动模式状态'
	},
	scenes: [
		{
			id: 'hook',
			prose: `让一束红外光穿过 CO₂ 气体，再比较进入样品前后的光强。探测器会在约 667 和 2349 cm⁻¹ 附近记录明显吸收。

CO₂ 还有约 1333 cm⁻¹ 的对称伸缩。它为什么没有出现在基本红外吸收带里？

先选一个答案，再看分子运动和偶极矩怎样变化。`
		},
		{
			id: 'three-motions',
			prose: `线形 CO₂ 有三个原子，因此有四个振动自由度。弯曲可以在两个互相垂直的平面发生，二者频率相同，所以通常合在一个简并模式里讨论。

本页比较三类基本振动：

- $\nu_1$ 对称伸缩，约 1333 cm⁻¹
- $\nu_2$ 弯曲，约 667 cm⁻¹，二重简并
- $\nu_3$ 反对称伸缩，约 2349 cm⁻¹

拖动模式控制器，原子位移、波数和谱线位置来自同一个模式记录。`
		},
		{
			id: 'silent-stretch',
			prose: `对称伸缩时，两侧 C=O 键同时变长，再同时变短。两个氧原子的位移彼此对称，分子在整个过程中保持零净偶极矩。

运动确实发生了，红外光却不能靠电场把这个正常模激发出来。于是谱图在 1333 cm⁻¹ 的基本频率处不画吸收峰。

这个振动可以用拉曼光谱等方法观察；“红外静默”只说明它不满足本页讨论的红外选择定则。`
		},
		{
			id: 'dipole-rule',
			prose: String.raw`红外吸收要求振动过程中偶极矩随正常坐标改变：

$$\left(\frac{\partial \mu}{\partial Q}\right)_0 \neq 0$$

弯曲让线形分子暂时偏离直线，反对称伸缩让一侧键变长时另一侧变短。两种运动都会产生随时间变化的偶极矩，因此能与红外光的电场耦合。

判断一个振动是否红外活性，要看偶极矩有没有变化，不能只看原子有没有移动。`
		},
		{
			id: 'read-the-spectrum',
			prose: String.raw`红外谱常把波数从高到低排列。波数与波长互为倒数：

$$\lambda(\mu\mathrm m)=\frac{10^4}{\tilde\nu(\mathrm{cm}^{-1})}$$

因此 2349 cm⁻¹ 对应约 4.26 μm，667 cm⁻¹ 对应约 15.0 μm。波数更高，单个光子的能量也更高。

本页只标出教学所需的基本模式位置，不计算转动细结构、峰宽和真实吸收强度。`
		},
		{
			id: 'fingerprint-region',
			prose: `真实分子的红外谱通常比 CO₂ 复杂。不同键的伸缩和弯曲会重叠，低波数区还会出现许多对分子骨架很敏感的吸收带。

化学家会先看官能团常见波数，再把整段谱图与候选结构比较。一个峰通常不够定结构，峰的位置、形状和组合要一起使用。

CO₂ 的例子先把最关键的判据讲清楚。分子有某个振动，不代表红外谱一定记录它。`
		},
		{
			id: 'sandbox',
			prose: `选择一种正常模，再调节示意振幅。页面会重算波长与光子能量，并在三个视图中显示同一模式。

**试试看**：找出红外静默的模式，再比较弯曲和反对称伸缩的波长。说明为什么波数较大的吸收带反而出现在更短的波长。`
		}
	],
	kickers: {
		hook: '00',
		'three-motions': '01',
		'silent-stretch': '02',
		'dipole-rule': '03',
		'read-the-spectrum': '04',
		'fingerprint-region': '05',
		sandbox: '06'
	},
	interactions: {
		hook: {
			question: '哪种振动在基本红外谱中静默？',
			options: [
				{ id: 'symmetric-stretch', label: '对称伸缩' },
				{ id: 'bend', label: '弯曲' },
				{ id: 'asymmetric-stretch', label: '反对称伸缩' }
			],
			explanation:
				'对称伸缩。它让两根键同时伸缩，CO₂ 的净偶极矩仍为零，因此不满足基本红外吸收的选择定则。'
		},
		mode: {
			label: '正常模',
			ariaLabel: '选择二氧化碳振动模式',
			readout: ({ mode, wavenumberCm, wavelengthUm, irActive }) =>
				`${mode}：${wavenumberCm} cm⁻¹，${wavelengthUm} μm，${irActive ? '红外活性' : '红外静默'}`
		},
		amplitude: {
			label: '示意振幅',
			ariaLabel: '调节分子振动示意振幅'
		}
	},
	triView: {
		defaultAriaLabel: '红外光路、二氧化碳正常模和吸收谱的三重表征舞台',
		liveSummary: ({ mode, wavenumberCm, wavelengthUm, irActive }) =>
			`当前模式为${mode}，波数 ${wavenumberCm} 每厘米，波长 ${wavelengthUm} 微米，${irActive ? '红外活性' : '红外静默'}。`,
		synchronizedState: '同一个正常模 · 三种表征',
		modeLabel: '模式',
		wavenumberLabel: '波数',
		wavelengthLabel: '波长',
		activityLabel: '红外活性',
		activityNames: { active: '可吸收', silent: '静默' },
		causal: {
			modeLabel: '正常模',
			dipoleLabel: '偶极矩',
			dipoleChanges: 'Δμ ≠ 0',
			dipoleStatic: 'Δμ = 0',
			responseLabel: '红外响应',
			absorbed: '发生吸收',
			notAbsorbed: '基本频率不吸收',
			resultLabel: '谱图结果',
			band: ({ wavenumberCm }) => `${wavenumberCm} cm⁻¹ 峰`,
			noFundamentalBand: '无基本吸收峰'
		},
		instrument: {
			ariaLabel: ({ mode, wavenumberCm, irActive }) =>
				`红外光穿过二氧化碳样品，当前${mode}位于 ${wavenumberCm} 每厘米，${irActive ? '探测器记录吸收' : '基本频率不产生红外吸收'}。`,
			viewName: '宏观 · 红外仪',
			caption: '探测器比较入射光和透射光；光束亮度只表示是否吸收，不预测真实强度。',
			beamLabel: '红外光',
			sampleLabel: 'CO₂ 气体池',
			detectorLabel: '探测器'
		},
		molecule: {
			ariaLabel: ({ mode, amplitude }) =>
				`二氧化碳${mode}示意，显示振幅为 ${amplitude}%；位移被放大，不代表真实键长或分子动力学轨迹。`,
			viewName: '微观 · 正常模',
			caption: '箭头表示正常坐标方向，位移被放大；动画不是分子的真实时间轨迹。',
			carbonLabel: 'C',
			oxygenLabel: 'O',
			bondLabel: 'C=O',
			modeNames: {
				hook: '反对称伸缩',
				'three-motions': '弯曲',
				'silent-stretch': '对称伸缩',
				'dipole-rule': '反对称伸缩',
				'read-the-spectrum': '反对称伸缩',
				'fingerprint-region': '弯曲',
				sandbox: '弯曲',
				'symmetric-stretch': '对称伸缩',
				bend: '弯曲',
				'asymmetric-stretch': '反对称伸缩'
			}
		},
		spectrum: {
			ariaLabel: ({ mode, wavenumberCm, irActive }) =>
				`二氧化碳红外吸收谱，选中${mode} ${wavenumberCm} 每厘米，${irActive ? '显示吸收带' : '基本频率位置无红外吸收带'}。`,
			viewName: '符号 · IR 谱',
			caption: '峰位来自模式数据与波数换算；纵轴只表达活性，不是实验吸光度。',
			xAxis: '波数 / cm⁻¹',
			yAxis: '吸收',
			selectedBand: '选中模式',
			activeBand: '红外活性',
			silentBand: '基本频率静默'
		}
	},
	edge: {
		eyebrow: '读谱时要记住',
		title: '运动还要改变偶极矩',
		facts: [
			{ term: '模式数', definition: '线形三原子分子有 3N−5 = 4 个振动自由度；两个弯曲方向简并。' },
			{
				term: '选择定则',
				definition: '振动过程中偶极矩必须随正常坐标改变，基本红外吸收才会出现。'
			},
			{ term: '位置换算', definition: '波长以微米计时，λ = 10⁴/ṽ；2349 cm⁻¹ 对应约 4.26 μm。' },
			{
				term: '模型边界',
				definition: '本页只处理三个基本模式，不计算转动细结构、强度、峰宽、泛频与组合带。'
			}
		]
	},
	conceptCheck: {
		question: '为什么 CO₂ 的对称伸缩在基本红外谱中静默？',
		options: [
			{ label: '振动频率太低' },
			{ label: '振动过程中净偶极矩不变' },
			{ label: '两个氧原子没有移动' },
			{ label: 'CO₂ 不能吸收红外光' }
		],
		correctIndex: 1,
		explanation:
			'对称伸缩时两个氧原子都在移动，但位移保持对称，分子的净偶极矩仍为零。红外吸收要求偶极矩随正常坐标改变，因此这个基本模式红外静默。'
	},
	sandboxIntro: {
		eyebrow: 'FREE PLAY · 切换正常模',
		title: 'CO₂ 红外实验台',
		description: '选择振动模式并调节示意振幅。波数、波长、红外活性和三幅图使用同一帧结果。'
	},
	modelCard: {
		title: '模型卡 · V0.1',
		items: [
			{
				term: '数据锚点',
				value:
					'采用 NIST Chemistry WebBook 中 12C16O2 的近似基本频率：弯曲 667 cm⁻¹、对称伸缩 1333 cm⁻¹、反对称伸缩 2349 cm⁻¹。'
			},
			{
				term: '红外活性',
				value:
					'页面按偶极矩是否随正常坐标变化区分活性。对称伸缩标为红外静默；弯曲和反对称伸缩标为活性。'
			},
			{
				term: '谱图范围',
				value:
					'只画基本模式的教学位置。真实气相谱包含转动振动结构，也可能出现泛频、组合带和 Fermi 共振，本模型不预测这些细节。'
			},
			{
				term: '动画边界',
				value:
					'振幅控制器只缩放示意位移。原子位置是确定性的正常模插图，不表示热运动幅度、单分子轨迹或真实振动次数。'
			},
			{
				term: '来源',
				value:
					'频率和红外活性核验自 NIST Chemistry WebBook 的 Carbon dioxide (12C16O2) vibrational and/or electronic energy levels，访问日期 2026-08-07。'
			}
		]
	},
	ending: {
		summary:
			'红外谱记录的是能与电场耦合的振动。先看原子怎样移动，再检查偶极矩是否变化，谱峰才有物理含义。',
		invitation: '下一站：用核磁共振拼回分子结构。',
		backToHome: '回到故事目录'
	}
} satisfies CO2InfraredStoryContent;

export default zhCNCO2InfraredContent;
