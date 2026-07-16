# VisualChem

**让大学化学原理成为可以走进去的故事。**

VisualChem 是一个开源的大学化学叙事可视化项目。它不把相图、分子动画和实验装置当成三张彼此独立的插图，而是用同一个热力学状态同时驱动：

- **宏观**：烧瓶、液面、沸腾、冷凝和分离流程；
- **微观**：两相中的粒子比例与解释性动画；
- **符号**：公式、T-x-y 相图、结线、杠杆规则和精馏阶梯。

滚动负责作者控镜，交互负责预测—操作—验证。项目希望在“开放源码、作者控镜、三重表征严格同步的大学化学交互长文”这一可验证品类中做到最好。

## 当前成果

第一篇 Alpha：《永远到不了的 100%》

它从“不断增加塔板能否得到 100% 乙醇”开始，依次讲清：

```text
组成 z
→ 第一颗气泡
→ 液相 x 与气相 y
→ T-x-y 地图
→ 理论平衡级 x(n+1)=y(xn)
→ 活度系数与非理想性
→ 共沸不动点 y=x
→ 更换分离机制
```

页面包含九幕滚动叙事、宏观—微观—符号三联动舞台、NIST 文献实验点重建、实验—模型对照、共沸点搜索、选择性脱水物料衡算、概念题和自由探索区，并适配桌面与手机。

> 当前仍是 Alpha：页面已经引入 16 组带来源与不确定度的常压实验 VLE 数据，并用第二实验室 21 点作独立验证；连续 Margules 教学模型仍只校准共沸点，并非整条实验曲线的统计回归。发布 Beta 前还需要真实学生测试、教师审校、读屏器人工验收和真实 Pages 发布回归。详见 [落地进展](docs/落地进展.md) 与 [数值模型卡](docs/乙醇水数值模型卡.md)。

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
│  ├─ src/lib/chem/                # TypeScript 热力学内核与 Vitest
│  ├─ src/lib/components/          # 三联动视图和教学组件
│  ├─ src/routes/                  # 首页和故事
│  └─ scripts/capture-audit.mjs    # 桌面/移动端视觉截图
├─ validation/                     # 独立 Python/SciPy 数值参考
├─ docs/                           # 蓝图、调研、模型卡、实施状态
├─ app.py                          # 旧 Streamlit 原型
└─ .github/workflows/              # GitHub Pages 构建部署
```

## 数值验证

浏览器引擎包含 Antoine 蒸气压、三后缀 Margules 活度系数、泡点、露点、共沸点、flash/杠杆规则和理想平衡级联。实验参考层来自 Lai 2014 的 NIST ThermoML 常压 `x–T–y` 表，保留 16 行数据、逐点不确定度、来源 DOI、转换记录和校验和。

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
- [落地进展](docs/落地进展.md)：已经完成、仍未完成与公开 Beta 门槛。

调研已经确认：二元 VLE WebApp 和化学叙事教学都不是空白。VisualChem 的差异化不建立在“别人从未做过”的口号上，而建立在成品中可检查的叙事质量、三重表征同步、数值透明度和开放创作能力上。

## 许可

- 软件代码：仓库根目录 `LICENSE`（MIT）；
- 教学文字与原创图形：`LICENSE-CONTENT.md`（CC BY 4.0）；第三方材料仍服从其各自许可。

参与开发前请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)，尤其是“实验测量 / 读者重建 / 教学模型 / 解释性隐喻”四层证据规则。教学与研究引用信息见 [CITATION.cff](CITATION.cff)。

作者：[DongYaoZe](https://github.com/DongYaoZe)
