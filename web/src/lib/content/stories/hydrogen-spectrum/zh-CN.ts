import type { HydrogenSpectrumStoryContent } from '../../types';

export const zhCNHydrogenSpectrumContent = {
	locale: 'zh-CN',
	seo: {
		title: '原子为什么只唱几颗音 — VisualChem',
		description:
			'把氢放电管的光拆开：不是一条彩虹，而是几根亮线。沿着 Balmer 线反推量子化能级，再用 Rydberg 公式逐条算出原子的光谱指纹。',
		path: '/stories/hydrogen-spectrum/',
		alternateLocalePath: '/en/stories/hydrogen-spectrum/',
		type: 'article',
		image: '/og-hydrogen-spectrum.png',
		imageAlt: '氢放电管、量子化能级与 Balmer 谱线组成的 VisualChem 叙事封面',
		publishedTime: '2026-07-24',
		modifiedTime: '2026-07-24'
	},
	hero: {
		eyebrow: 'ATOMIC STRUCTURE · STORY 11',
		title: ['原子为什么', '只唱几颗音'],
		subtitle: '白光铺开一条彩虹，氢原子却只亮起几根细线。第四季，从这份缺席的颜色开始。',
		heroTag: 'λ = 656.5 · 486.3 · 434.2 · 410.3 nm（真空近似）'
	},
	readingNote:
		'右侧舞台始终锁住同一次跃迁：放电管与光栅告诉你实验室里看见什么，能级梯说明电子失去了多少能量，谱线尺把同一能量差翻译成波长。改变 n，一束光、一道箭头和一根谱线必须同时移动。',
	stage: {
		dialogAriaLabel: '当前氢原子光谱叙事图形',
		closeGraphicAriaLabel: '关闭当前图形',
		openGraphicButton: '查看当前图',
		shortStateAriaLabel: '当前跃迁状态'
	},
	scenes: [
		{
			id: 'hook',
			prose: `给低压氢气两端加上高压，玻璃管泛起粉紫色。现在让这束光穿过光栅，投到黑屏上。

你会看见什么？一条从紫到红的完整彩虹，还是**几根孤零零的亮线**？

先别背答案。连续彩虹意味着“什么能量都能发”；几根亮线意味着原子只肯交出**几份指定的能量**。`
		},
		{
			id: 'split-the-light',
			prose: `光栅像一把梳子，把混在一起的波长分开。白炽灯把屏幕涂满，氢气却留下大片黑暗，只在约 656、486、434、410 nm 亮起。

这不是四种颜料。每根线都是一批同样能量的光子：

$$E_{\\mathrm{photon}} = h\\nu = \\frac{hc}{\\lambda}$$

红线波长最长、每个光子能量最低；越往紫端，单个光子越“昂贵”。`
		},
		{
			id: 'measure-the-lines',
			prose: `把光谱仪的准星依次对准四根线。拖动上能级 n，读数不是从图上量出来的——浏览器用同一条 Rydberg 关系重新计算。

- $3\\to2$：Hα，红色，约 656.5 nm
- $4\\to2$：Hβ，蓝绿色，约 486.3 nm
- $5\\to2$：Hγ，蓝紫色，约 434.2 nm
- $6\\to2$：Hδ，紫色，约 410.3 nm

它们共享同一个终点 $n=2$，所以组成 **Balmer 系**。越高的起点挤出的谱线越靠近紫外端。`
		},
		{
			id: 'energy-steps',
			prose: `为什么中间的颜色全都缺席？因为电子的能量不是一条可以随意站立的斜坡，而是一架台阶：

$$E_n = -\\frac{hcR_{\\mathrm H}}{n^2}$$

电子可以在 $n=5$，也可以在 $n=2$，却不能停在两级之间。它落下时，台阶差必须完整交给一个光子：

$$\\Delta E = E_{n_u}-E_{n_l}=\\frac{hc}{\\lambda}$$

所以不是原子从彩虹里“挑颜色”；是**允许的能量差先离散，波长随后被锁定**。`
		},
		{
			id: 'rydberg-key',
			prose: `1885 年，Balmer 在量子力学诞生前就从可见线里猜到一把数字钥匙。对氢原子，写成：

$$\\frac{1}{\\lambda}=R_{\\mathrm H}\\left(\\frac{1}{n_l^2}-\\frac{1}{n_u^2}\\right),\\qquad n_u>n_l$$

代入 $n_u=3, n_l=2$，得到约 656.5 nm 的真空波长；能级图的差、光子能量和谱线位置同时给出同一个答案。

一根红线不再只是“被观察到”。它变成了**原子内部台阶间距的尺子**。`
		},
		{
			id: 'three-families',
			prose: `把共同终点换掉，整族谱线就搬家：

- 落到 $n=1$：Lyman 系，主要在**紫外**，人眼看不见
- 落到 $n=2$：Balmer 系，四根强线落在**可见光**
- 落到 $n=3$：Paschen 系，在**红外**，人眼也看不见

切换下能级时，虚线光路只表示仪器会在那个方向接收到辐射，不把紫外或红外伪装成可见颜色。**“看不见”不等于“不存在”**；探测器把眼睛之外的家族也记录下来。`
		},
		{
			id: 'fingerprint',
			prose: `如果台阶来自原子的内部结构，那么换一种元素，台阶间距就会换，谱线组合也随之换——这就是**原子指纹**。

太阳里氦的存在，先由一根地球实验室里没有的黄线被发现；恒星光穿过冷气体留下的暗线，也用同一套能量差反查元素。

再把分辨率拧高：我们画成“一根”的 Hα，在 NIST 空气波长表里其实分成约 656.271–656.285 nm 的多条精细结构分量。**成功的简单模型仍不是终点**；它先抓住主结构，再把残差交给更精细的理论。

但要守住边界：本页的简单公式只属于单电子氢原子。氦、钠、铁的多电子相互作用必须用更完整的量子模型计算，不能把 Rydberg 式硬套上去。`
		},
		{
			id: 'sandbox',
			prose: `现在把原子当成一架能量乐器。

先选落点 $n_l$，再选更高的起点 $n_u$。舞台会把能级差换成光子能量、真空波长和光谱区域；三幅图共享一个计算帧。

**挑战**：找出一条可见的红线、一条紫外线和一条红外线。再解释为什么提高 $n_u$ 时，同一谱系的线会越来越挤。`
		}
	],
	kickers: {
		hook: '00',
		'split-the-light': '01',
		'measure-the-lines': '02',
		'energy-steps': '03',
		'rydberg-key': '04',
		'three-families': '05',
		fingerprint: '06',
		sandbox: '07'
	},
	interactions: {
		hook: {
			question: '先预测：光栅后会出现',
			options: [
				{ id: 'rainbow', label: '完整彩虹' },
				{ id: 'lines', label: '几根亮线' },
				{ id: 'dark', label: '完全漆黑' }
			],
			explanation:
				'几根亮线。氢原子只发出与允许能级差匹配的光子；大片黑暗正是能量量子化留下的证据。'
		},
		measure: {
			upperLevelLabel: '上能级 nᵤ',
			readout: ({ upperN, wavelengthNm, photonEnergyEv }) =>
				`n=${upperN}→2：λ=${wavelengthNm} nm，光子能量 ${photonEnergyEv} eV`
		},
		series: {
			lowerLevelLabel: '共同下能级 nₗ',
			readout: ({ series, wavelengthNm, region }) =>
				`${series} 系首线：λ=${wavelengthNm} nm，位于${region}`
		},
		sandbox: {
			upperLevelLabel: '起点 nᵤ',
			lowerLevelLabel: '落点 nₗ',
			readout: ({ transition, wavelengthNm, photonEnergyEv, region }) =>
				`${transition}：λ=${wavelengthNm} nm，ΔE=${photonEnergyEv} eV，${region}`
		}
	},
	triView: {
		defaultAriaLabel: '氢放电管、电子能级和线光谱的三重表征舞台',
		liveSummary: ({ upperN, lowerN, wavelengthNm, region }) =>
			`当前氢原子从 n=${upperN} 跃迁到 n=${lowerN}，计算真空波长 ${wavelengthNm} 纳米，位于${region}。`,
		synchronizedState: '同一次跃迁 · 三种表征',
		transitionLabel: '跃迁',
		wavelengthLabel: '真空波长',
		photonEnergyLabel: '光子能量',
		regionNames: { ultraviolet: '紫外区', visible: '可见区', infrared: '红外区' },
		tube: {
			ariaLabel: ({ wavelengthNm, region }) =>
				`氢放电管与光栅，选中辐射真空波长 ${wavelengthNm} 纳米，位于${region}；紫外和红外只用虚线指示，不冒充可见光。`,
			viewName: '宏观 · 放电管',
			caption: '光栅把波长分开；虚线只指示不可见辐射方向，亮度不代表真实强度。',
			tubeLabel: '低压 H₂ 放电管',
			gratingLabel: '光栅',
			lightLabel: '分开的辐射'
		},
		levels: {
			ariaLabel: ({ upperN, lowerN, energyEv, wavelengthNm, region, isVisible }) =>
				`氢原子能级图，电子从 n=${upperN} 落到 n=${lowerN}，能量差 ${energyEv} 电子伏，发出 ${wavelengthNm} 纳米光子，位于${region}，${isVisible ? '人眼可见' : '人眼不可见'}。`,
			viewName: '微观 · 能级',
			caption: '横线是允许能级，不是电子绕核运行的空间轨道；箭头表示能量差。',
			energyAxis: '能量 E / eV',
			electronLabel: '电子',
			photonLabel: ({ wavelengthNm }) => `光子 ${wavelengthNm} nm`
		},
		spectrum: {
			ariaLabel: ({ upperN, lowerN, wavelengthNm, region, isVisible }) =>
				`氢原子线光谱，选中 n=${upperN} 到 n=${lowerN}，真空波长 ${wavelengthNm} 纳米，位于${region}，${isVisible ? '可见色带中的实线' : '不可见区域的灰色线'}。`,
			viewName: '符号 · 谱线',
			caption: '谱线位置由 Rydberg 公式计算；可见渐变只是方位参考，不表示连续发射。',
			xAxis: '真空波长 λ / nm',
			selectedLine: '选中',
			seriesNames: { Lyman: 'Lyman', Balmer: 'Balmer', Paschen: 'Paschen', other: '其他谱系' }
		}
	},
	edge: {
		eyebrow: 'THE ATOMIC SCORE',
		title: '原子的乐谱',
		facts: [
			{
				term: '谱线是能量差',
				definition: 'ΔE = hc/λ：屏幕上一根线，对应原子内部两级台阶之间的一种固定差值。'
			},
			{
				term: '终点定义谱系',
				definition: '落到 n=1、2、3，分别组成 Lyman、Balmer、Paschen 系；多数不在人眼可见范围。'
			},
			{
				term: '线会向极限聚拢',
				definition: 'n 越大，相邻能级越密；同一谱系的波长因此向一个短波极限挤在一起。'
			},
			{
				term: '元素各有指纹',
				definition:
					'核电荷与电子相互作用改变能级结构；光谱组合可反查元素，但多电子原子需要更完整模型。'
			}
		]
	},
	conceptCheck: {
		question: '同样落到 n=2，哪次跃迁发出的光子波长更短？',
		options: [
			{ label: '3→2，因为起点离 n=2 更近' },
			{ label: '4→2，因为能量差更大' },
			{ label: '两者相同，因为终点相同' },
			{ label: '无法判断，必须先知道光强' }
		],
		correctIndex: 1,
		explanation:
			'4→2 的能级差更大，因此光子能量更高；由 E=hc/λ，能量越高，波长越短。计算得到约 486.3 nm，而 3→2 约为 656.5 nm。光强只关系到光子数量，不决定单个光子的波长。'
	},
	sandboxIntro: {
		eyebrow: 'FREE PLAY · 把能级当成琴键',
		title: '氢原子光谱台',
		description: '选择一次向下跃迁；能级差、真空波长、光谱区域与三幅图同步重算。'
	},
	modelCard: {
		title: '模型卡 · V0.1',
		items: [
			{
				term: '计算口径',
				value:
					'采用 2022 CODATA R∞ = 10,973,731.568157 m⁻¹ 与质子/电子质量比 1836.152673426，先做约化质量修正得到 R_H；能级 E_n = −hcR_H/n² 与波长均从同一 R_H 派生。页面报告真空近似波长。'
			},
			{
				term: '为什么与 NIST 空气线略有不同',
				value:
					'简单模型给 Hα 真空中心趋势约 656.47 nm。NIST Hydrogen Strong Lines 表列出的 656.27–656.29 nm 是空气波长并解析成多条精细结构分量；空气折射率、精细结构与 Lamb 位移等都不在本页轻量模型中，二者不可直接混作同一口径。'
			},
			{
				term: '装置与强度',
				value:
					'放电管示意低压氢气被碰撞激发后级联退激。光路只表达“哪些波长存在”；线宽、相对强度、选择定则、碰撞动力学与仪器响应均未建模，动画不是单原子的真实时间轨迹。'
			},
			{
				term: '适用边界',
				value:
					'Rydberg/Bohr 单电子模型适用于氢和类氢离子的主结构教学。多电子元素的“指纹”概念仍成立，但其能级不能用本页公式计算；教学颜色只是冗余视觉编码，UV/IR 不被涂成可见颜色。'
			},
			{
				term: '核验来源',
				value:
					'常数来自 NIST 2022 CODATA Rydberg constant 与 proton-electron mass ratio；少量空气强线只作核验锚点，引用 NIST Atomic Spectra Database v5.12（DOI 10.18434/T4W30F）的 Hydrogen Strong Lines 查询页，未镜像整表。访问日期：2026-07-23。'
			}
		]
	},
	ending: {
		summary: '一根谱线是一份能量收据，一组谱线是一张原子指纹。颜色只是表面，台阶差才是旋律。',
		invitation: '下一站：CO₂ 为什么吸收红外——会唱歌的分子。',
		backToHome: '回到故事目录'
	}
} satisfies HydrogenSpectrumStoryContent;

export default zhCNHydrogenSpectrumContent;
