# Changelog

All notable public changes to VisualChem are recorded here. Versions follow Semantic Versioning while the project is in prerelease.

## [Unreleased] - target `0.1.0-alpha.1`

### Added

- SvelteKit narrative site with a project home page and the nine-scene story _The unreachable 100%_;
- linked macroscopic apparatus, particulate composition, and symbolic `T-x-y` views driven by one thermodynamic state;
- browser-side Antoine, three-suffix Margules, bubble/dew-point, azeotrope, flash, lever-rule, and equilibrium-stage calculations;
- independent SciPy golden reference and Vitest numerical checks;
- Lai 2014 NIST ThermoML atmospheric ethanol-water `x-T-y` measurements with pointwise uncertainty and provenance;
- reader-led reconstruction of the experimental phase envelope before the teaching model appears;
- explicit experimental/model azeotrope comparison and model-residual reporting;
- selective molecular-sieve dehydration balance, concept check, and free-play laboratory;
- keyboard-accessible controls, reduced-motion support, global animation pause, short-screen graphic dialog, and automated Axe coverage;
- GitHub Pages static deployment, production subpath support, branded share assets, citation metadata, PWA cache, no-JavaScript notice, and static 404 page;
- typed Chinese and English content layers with shared interaction logic;
- season one phase-equilibrium stories covering boiling maps, ternary salt separation, and eutectic cooling-curve reconstruction;
- season two stories connecting microstate counting, Gibbs-energy landscapes, and the Nernst equation;
- season three kinetics stories linking integrated rate laws, Arrhenius/Maxwell–Boltzmann reasoning, and catalytic energy pathways;
- the opening season-four story _Why atoms sing only a few notes_, linking a hydrogen discharge tube, one computed energy-level transition, and its Rydberg line spectrum;
- the second season-four story on CO₂ infrared absorption, linking molecular vibration, dipole-moment change, and computed wavenumber/wavelength readouts while distinguishing IR-active and silent modes;
- twelve bilingual story routes, each with synchronized macroscopic, particulate or microscopic, and symbolic views, prediction prompts, concept checks, and a free-play bench;
- a canonical story manifest that now drives catalogue routing, sitemap generation, and minimum visual-audit coverage for every live story.

### Changed

- flagship mobile scrollytelling now defaults to a text-first synchronized state strip with the full graphic available on demand; the compact global motion control no longer covers as much reading space on phones;
- story-page header navigation now points back to the story catalogue instead of incorrectly advertising the first story from every deep route;
- the ethanol-water literature reconstruction now lets readers select the 16 Lai 2014 measurements directly and reports low/mid/high composition coverage before the full evidence table is revealed;
- the flagship ethanol-water story now links the apparatus to the `T-x-y` map with a computed x→y spatial relay, unlocks a bounded auto demonstration after three manual equilibrium stages, and turns the azeotrope search into a visible `x = y` fixed-point lock;
- the azeotrope scene now keeps its composition control, apparatus, particle view, symbolic map, and `y-x` readout on one equilibrium state instead of silently applying a ten-stage transform;
- the CO₂ story now carries one visible causal chain from normal mode through dipole-moment change and IR response to the resulting band, with silent modes visibly blocked at `Δμ = 0`;
- CO₂ display equations are rendered through the shared KaTeX component and covered by an end-to-end rendering contract;
- production audit is reproducible at the GitHub Pages `/visual-chem` base path and covers every live story on desktop and mobile, including the flagship x→y key scene; the three flagship stories additionally receive every-scene 320×568 compact screenshots with the same horizontal-overflow hard gate;
- short-screen flagship heroes preserve their large editorial titles while removing empty vertical space; hydrogen-spectrum and CO₂ evidence panels return to document flow on very short phones instead of being pinned to the viewport bottom.

### Evidence boundaries

- The Margules parameters are calibrated to one atmospheric azeotrope, not regressed over the complete experimental table.
- Particle proportions are quantitative; particle positions, collisions, and timing are explanatory illustrations rather than molecular dynamics.
- Equilibrium stages are idealized composition mappings, not a model of tray efficiency, reflux, mass transfer, or batch-distillation time.
