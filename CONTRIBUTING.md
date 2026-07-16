# Contributing to VisualChem

VisualChem accepts code, scientific review, translation, teaching feedback, and new story proposals. The standard is not “the animation looks plausible”; every contribution must make the scientific argument easier to inspect.

## Local setup

```powershell
npm --prefix web install
npx --prefix web playwright install chromium
npm --prefix web run validate
npm --prefix web run test:e2e
```

Production-path verification uses the same subpath as GitHub Pages:

```powershell
$env:BASE_PATH = '/visual-chem'
npm --prefix web run test:e2e
```

## Evidence vocabulary

Keep these layers visually and verbally distinct:

- **Measurement**: a cited experimental value with provenance, units, conditions, and uncertainty where available;
- **Reader reconstruction**: a subset or visual guide made from measurements, never a second experiment;
- **Teaching model**: a calculation with named assumptions and a model card;
- **Explanatory metaphor**: motion or geometry that supports interpretation but is not quantitatively simulated.

Do not call a model-generated value “measured,” “real,” or “ground truth.” Do not imply that an illustrative particle animation is molecular dynamics.

## Adding scientific data

A redistributable data asset must include:

1. original source and article/archive DOI;
2. license or public-domain basis;
3. experimental conditions and component definitions;
4. original dataset/table identifiers;
5. transformation date and every transformation performed;
6. checksum when the upstream source provides a stable downloadable artifact;
7. an integrity test for row count, ordering, units, endpoints, and independently reported special points.

Keep calibration and validation datasets separate. Never merge measurements from different laboratories and present them as one original curve.

## Story and component rules

- One thermodynamic state must drive the macroscopic, particulate, and symbolic views.
- A scene should introduce one main new degree of freedom.
- Ask for a prediction before revealing the decisive evidence.
- Keep author-controlled scrolling reversible; provide a clearly marked free-play section afterward.
- Use shapes, line styles, labels, and accessible summaries in addition to color.
- All user-facing text, including ARIA labels and dynamic feedback, belongs in the typed locale content layer.
- English and Chinese routes share state and calculation components; do not copy interactive logic into a locale-specific page.

## Required checks

Before opening a pull request:

```powershell
npm --prefix web run format
npm --prefix web run validate
npm --prefix web run test:e2e
npm --prefix web run audit:visual
```

For numerical changes, regenerate or independently verify the reference fixture and explain the physical meaning of changed outputs. A passing snapshot is not evidence that the underlying model is appropriate.

For interface changes, inspect at least desktop, `412×915`, and `320×568`; complete the keyboard flow; and verify reduced-motion behavior. Automated Axe checks supplement rather than replace a screen-reader review.

## New story proposal

Open an issue containing:

- the real-world hook and target course level;
- the misconception or representation gap being addressed;
- the macroscopic, particulate, and symbolic views;
- the quantitative model and validation source;
- the prediction–operation–evidence loop;
- the explicit boundary between calculation and metaphor;
- the smallest reusable component the story would add to `story-kit`.

## Licensing

Code contributions are accepted under the repository's MIT license. Original prose, story scripts, and explanatory graphics are accepted under CC BY 4.0. Third-party data and assets retain their own terms; contributors must document compatible reuse rights.
