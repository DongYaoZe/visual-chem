# VisualChem Web

SvelteKit 5 + TypeScript 的大学化学叙事站点。主入口为首页和 `/stories/ethanol-distillation`。

## 开发

```powershell
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

视觉审计：

```powershell
npm run dev -- --host 127.0.0.1
npm run audit:visual
```

截图输出至被忽略的 `test-results/`，覆盖首页/故事首屏、第 04 幕文献数据重建前后、第 06 幕实验—模型对照及移动端舞台。

## GitHub Pages

生产构建通过 `BASE_PATH` 支持仓库子路径：

```powershell
$env:BASE_PATH = '/visual-chem'
npm run build
```

根目录 `.github/workflows/deploy-pages.yml` 会在 `main` 的 `web/**` 更新后运行质量门并部署 `web/build`。
