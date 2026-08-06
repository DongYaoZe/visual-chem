# VisualChem

**让大学化学原理成为可以走进去的故事。**

VisualChem 是一个开源的大学化学叙事可视化项目。它不把图表、分子动画和实验装置当成彼此独立的插图，而是用同一个可计算状态同时驱动：

- **宏观**：烧瓶、电池、放电管、光栅与操作过程；
- **微观**：粒子比例、碰撞、界面、能级与解释性动画；
- **符号**：公式、相图、概率分布、自由能地形、动力学曲线与光谱。

滚动负责作者控镜，交互负责预测—操作—验证。项目希望在“开放源码、作者控镜、三重表征严格同步的大学化学交互长文”这一可验证品类中做到最好。

## 当前成果

站点现有四季、十一篇中英双语交互长文；第四季已经开篇，后两篇仍在计划中：

| 季 | 主题 | 故事 |
| --- | --- | --- |
| 01 | 相平衡 | 《永远到不了的 100%》《沸腾的地图》《一锅盐水的分身术》《冷却曲线侦探》 |
| 02 | 热力学 | 《熵不是混乱》《化学反应的下坡路》《电池里的势能地形》 |
| 03 | 动力学 | 《浓度的倒计时》《翻山的分子》《捷径不改终点》 |
| 04 | 光与结构 | 《原子为什么只唱几颗音》；后续：《会唱歌的分子》《磁场里的结构拼图》 |

每篇都从一个需要先下注的反常问题出发，以滚动叙事控制镜头，把宏观、微观、符号三幅图锁在同一计算状态；故事末尾再把模型交给读者自由操作。曲线、相界、概率分布、能量路径和谱线位置均由浏览器内核计算，不用预先画好的图片冒充模型输出。

第一篇仍是数据证据最完整的样板：它引入 Lai 2014 的 16 组带来源与不确定度的常压 VLE 数据，让读者亲手重建相界，再用 Kamihama 2012 的另一实验室 21 点作独立验证。连续 Margules 教学模型只校准共沸点，并非整条实验曲线的统计回归。

> 当前仍是 Alpha。GitHub Pages、双语 SEO、离线/无 JavaScript 降级和自动无障碍门禁均已上线；公开 Beta 仍需真实学生出声思维测试、物理化学教师审校、真实读屏器和多浏览器人工验收。详见 [落地进展](docs/落地进展.md) 与 [学习测试与教师审校方案](docs/学习测试与教师审校方案.md)。

## 快速开始

### 叙事站点（主产品）

需要 Node.js 22+：

```powershell
npm --prefix web install
npm --prefix web run dev -- --open
```

静态构建：

```powershell
npm --prefix web run build
```

### 旧 Streamlit 相图原型（参考实现）

`app.py` 保留了早期 VLE、SLE、三元水盐与理论页，用于追溯原型和比对功能，不再作为 2.0 产品主入口：

```powershell
pip install -r requirements.txt
streamlit run app.py
```

旧版乙醇—水单参数 Margules 预设会把常压共沸点算到约 `89.0 wt%`，不能用作真实酒精精馏极限。新故事没有沿用这个参数。

## 工程结构

```text
visual-chem/
├─ web/                            # SvelteKit 叙事站点
│  ├─ src/lib/chem/                # TypeScript 化学计算内核与 Vitest
│  ├─ src/lib/components/          # 三联动视图和教学组件
│  ├─ src/routes/                  # 首页和故事
│  └─ scripts/capture-audit.mjs    # 桌面/移动端视觉截图
├─ validation/                     # 独立 Python/SciPy 数值参考
├─ docs/                           # 蓝图、调研、模型卡、实施状态
├─ app.py                          # 旧 Streamlit 原型
└─ .github/workflows/              # GitHub Pages 构建部署
```

## 数值验证

浏览器引擎从相平衡延伸到热力学、动力学与原子光谱：Antoine/IAPWS 蒸气压、活度系数、泡露点、共沸与杠杆规则；盐水与共晶相界；微观状态计数、Gibbs 山谷、Nernst 电势；0/1/2 级积分速率方程、Arrhenius 温度依赖、Maxwell–Boltzmann 分布和催化能量路径；约化质量修正的氢原子 Rydberg 能级、光子能量与谱系极限。每个故事另有场景—中英双语对齐测试，防止文案、舞台和计算状态悄悄分叉。

乙醇—水实验参考层来自 Lai 2014 的 NIST ThermoML 常压 `x–T–y` 表，保留 16 行数据、逐点不确定度、来源 DOI、转换记录和校验和。

独立 SciPy 脚本生成 10 个覆盖 `x=0…1` 的 golden points，TypeScript 测试对温度与气相组成验证到 `1e-6` 以内；另有实验数据完整性和模型残差测试：

```powershell
python validation\generate_ethanol_water_reference.py
npm --prefix web run test:unit -- --run
```

完整质量门：

```powershell
npm --prefix web run validate
npx --prefix web playwright install chromium
npm --prefix web run test:e2e
```

## 设计与研究依据

- [化学叙事可视化蓝图](docs/化学叙事可视化蓝图.md)：愿景、Johnstone 三角、技术架构和内容路线；
- [第二轮定向调研](docs/第二轮定向调研.md)：PhET、Labster、ChemTube3D、MolView、JCE、The Pudding、Ciechanowski 与 pycalphad/WASM 核验；
- [乙醇—水数值模型卡](docs/乙醇水数值模型卡.md)：公式、参数、跨语言基准和适用边界；
- [第四季：光与结构](docs/第四季-光与结构设计.md)：`ΔE = hν` 季度主线、首篇计算契约、数据许可与后续故事；
- [落地进展](docs/落地进展.md)：已经完成、仍未完成与公开 Beta 门槛。

调研已经确认：二元 VLE WebApp 和化学叙事教学都不是空白。VisualChem 的差异化不建立在“别人从未做过”的口号上，而建立在成品中可检查的叙事质量、三重表征同步、数值透明度和开放创作能力上。

## 许可

- 软件代码：仓库根目录 `LICENSE`（MIT）；
- 教学文字与原创图形：`LICENSE-CONTENT.md`（CC BY 4.0）；第三方材料仍服从其各自许可。

参与开发前请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)，尤其是“实验测量 / 读者重建 / 教学模型 / 解释性隐喻”四层证据规则。教学与研究引用信息见 [CITATION.cff](CITATION.cff)。

作者：[DongYaoZe](https://github.com/DongYaoZe)
