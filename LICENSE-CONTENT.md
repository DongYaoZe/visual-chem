# Creative Commons Attribution 4.0 International

Unless a file or page states otherwise, the original educational prose, story scripts, and original explanatory graphics in this repository are licensed under the **Creative Commons Attribution 4.0 International License (CC BY 4.0)**.

Copyright (c) 2026 DongYaoZe

You are free to share and adapt this material for any purpose, including commercially, provided that you give appropriate credit, link to the license, and indicate whether changes were made.

Full legal code: <https://creativecommons.org/licenses/by/4.0/legalcode>

This content license does not replace third-party licenses, the MIT software license in `LICENSE`, or the terms attached to cited datasets and external assets.

## NIST ThermoML data

`web/src/lib/chem/data/ethanol-water-lai-2014.ts` is derived from the NIST ThermoML Data Archive, archive DOI [10.18434/mds2-2422](https://doi.org/10.18434/mds2-2422), and the article data identified by DOI [10.1016/j.jct.2013.08.020](https://doi.org/10.1016/j.jct.2013.08.020). NIST data is provided under the [NIST Open License](https://www.nist.gov/open/license).

Transformation on 2026-07-16: ThermoML datasets 9 and 10 were joined by liquid ethanol mole fraction, kelvin values were converted to degrees Celsius, and datasets 11 and 12 were recorded separately as the reported azeotrope. Values were not interpolated or smoothed.

`web/src/lib/chem/data/ethanol-water-kamihama-2012.ts` is independently derived from the same NIST archive and the article data identified by DOI [10.1021/je2008704](https://doi.org/10.1021/je2008704). ThermoML datasets 4 and 5 were joined by liquid ethanol mole fraction and kelvin values were converted to degrees Celsius on 2026-07-16; values were not interpolated or smoothed in the stored asset. This second-laboratory dataset is distributed only as validation evidence and is not merged into the story's canonical Lai curve.

The NIST material is provided **AS IS**. NIST makes no warranties and does not guarantee the accuracy, completeness, or usefulness of the material. Identification of NIST as the source does not imply endorsement of this project by NIST.
