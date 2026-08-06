# VisualChem Web

SvelteKit 5 + TypeScript 的大学化学叙事站点。当前包含相平衡、热力学、动力学，以及已经开篇的“光与结构”第四季，共十一篇中英双语故事；路由由首页目录进入，中文位于 `/stories/*`，英文镜像位于 `/en/stories/*`。

## 开发

```powershell
$env:NODE_OPTIONS = '--max-old-space-size=768 --max-semi-space-size=8'
npm install
npm run dev -- --open
```

## 质量门

```powershell
npm run validate
npx playwright install chromium
npm run test:e2e
```

`validate` 顺序执行 Prettier/ESLint、`svelte-check`、Vitest 和静态构建。

视觉审计优先针对 Pages 语义的生产产物。先设置与线上一致的子路径并构建：

```powershell
$env:BASE_PATH = '/visual-chem'
$env:NODE_OPTIONS = '--max-old-space-size=768 --max-semi-space-size=8'
npm run build
npm run serve:pages
```

保持服务器运行，在另一个终端执行：

```powershell
$env:VISUAL_CHEM_ORIGIN = 'http://127.0.0.1:4173/visual-chem'
npm run audit:visual
```

截图输出至被忽略的 `test-results/`。除首篇故事的文献重建与模型对照外，脚本还覆盖第三季三篇故事和第四季《氢原子为什么只发出几根线》的桌面/手机首屏与关键三联动舞台。

## GitHub Pages

生产构建通过 `BASE_PATH` 支持仓库子路径：

```powershell
$env:BASE_PATH = '/visual-chem'
npm run build
```

根目录 `.github/workflows/deploy-pages.yml` 会在 `main` 的 `web/**` 更新后运行质量门并部署 `web/build`。
