# VisualChem 协作规则

## 环境与读取

- 工作区位于 Windows 中文路径；读取中文文本时显式指定正确编码，PowerShell 优先使用 `Get-Content -Encoding UTF8`，发现乱码先核对源文件编码。
- PDF 优先转成图片后目检，不用 Python 直接抽取来替代版面阅读。

## 产品与科学原则

- 站训是 “the map is computed, not drawn”：曲线、状态点和读数必须由 `web/src/lib/chem/` 的计算内核驱动，不能用手绘结果冒充模型输出。
- 宏观、微观、符号三幅图必须共享同一状态；场景 id、中英文内容和舞台定义由对齐测试锁定。
- 粒子位置使用确定性索引散列，运行时不用 `Math.random()`；解释性动画不得冒充分子动力学或真实反应次数。
- 所有用户可见文字、动态反馈和 ARIA 文案进入类型化中英文内容层。
- 重型计算可记录到 `docs/后端待办.md`，但浏览器内仍保留足以支撑叙事结论的可检验轻量内核。

## 发布边界

- 未经用户明确要求，不创建 Git tag 或 GitHub Release；不 force-push，不输出任何凭据或凭据助手内容。
- `.claude/` 保持忽略，不进入仓库。
- 自动化门禁通过不等于 Public Beta。真实学生出声思维测试、物理化学教师审校、真实读屏器与多浏览器人工验收仍是硬门槛。

## 提交前验证

```powershell
$env:BASE_PATH = '/visual-chem'
$env:NODE_OPTIONS = '--max-old-space-size=768 --max-semi-space-size=8'
npm.cmd --prefix web run format
npm.cmd --prefix web run validate
npm.cmd --prefix web run test:e2e
npm.cmd --prefix web audit --omit=dev --audit-level=high
git diff --check
```

视觉审计应针对 Pages 语义的生产产物：启动 `npm.cmd --prefix web run serve:pages`，再把 `VISUAL_CHEM_ORIGIN` 设为 `http://127.0.0.1:4173/visual-chem` 后运行 `npm.cmd --prefix web run audit:visual`。
