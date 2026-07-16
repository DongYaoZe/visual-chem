"""Generate independent SciPy reference values for the browser VLE engine."""

from __future__ import annotations

import json
import math
from dataclasses import asdict, dataclass

from scipy.optimize import brentq

MMHG_PER_BAR = 750.061683
PRESSURE_BAR = 1.01325
ETHANOL = {"a": 8.20417, "b": 1642.89, "c": 230.3, "molar_mass": 46.06844}
WATER = {"a": 8.07131, "b": 1730.63, "c": 233.426, "molar_mass": 18.01528}
A12 = 1.39081729
A21 = 0.95455763


@dataclass(frozen=True)
class Point:
    x: float
    y: float
    temperature_c: float
    gamma_ethanol: float
    gamma_water: float
    pressure_closure_bar: float


def vapor_pressure_bar(temperature_c: float, constants: dict[str, float]) -> float:
    return 10 ** (constants["a"] - constants["b"] / (temperature_c + constants["c"])) / MMHG_PER_BAR


def activity_coefficients(x: float) -> tuple[float, float]:
    x_water = 1.0 - x
    ln_gamma_ethanol = x_water**2 * (A12 + 2.0 * (A21 - A12) * x)
    ln_gamma_water = x**2 * (A21 + 2.0 * (A12 - A21) * x_water)
    return math.exp(ln_gamma_ethanol), math.exp(ln_gamma_water)


def bubble_point(x: float) -> Point:
    gamma_ethanol, gamma_water = activity_coefficients(x)

    def residual(temperature_c: float) -> float:
        return (
            x * gamma_ethanol * vapor_pressure_bar(temperature_c, ETHANOL)
            + (1.0 - x) * gamma_water * vapor_pressure_bar(temperature_c, WATER)
            - PRESSURE_BAR
        )

    temperature_c = brentq(residual, 40.0, 120.0, xtol=5e-15, rtol=1e-14)
    partial_ethanol = x * gamma_ethanol * vapor_pressure_bar(temperature_c, ETHANOL)
    partial_water = (1.0 - x) * gamma_water * vapor_pressure_bar(temperature_c, WATER)
    return Point(
        x=x,
        y=partial_ethanol / PRESSURE_BAR,
        temperature_c=temperature_c,
        gamma_ethanol=gamma_ethanol,
        gamma_water=gamma_water,
        pressure_closure_bar=partial_ethanol + partial_water,
    )


def main() -> None:
    compositions = [0.0, 0.05, 0.1, 0.25, 0.4, 0.6, 0.8, 0.895, 0.95, 1.0]
    points = [bubble_point(x) for x in compositions]
    azeotrope_x = brentq(lambda x: bubble_point(x).y - x, 0.8, 0.97, xtol=5e-15, rtol=1e-14)
    azeotrope = bubble_point(azeotrope_x)
    mass_fraction = (
        azeotrope_x * ETHANOL["molar_mass"]
        / (azeotrope_x * ETHANOL["molar_mass"] + (1.0 - azeotrope_x) * WATER["molar_mass"])
    )
    result = {
        "schema": "visual-chem/ethanol-water-reference@1",
        "generator": "validation/generate_ethanol_water_reference.py (SciPy brentq)",
        "pressure_bar": PRESSURE_BAR,
        "model": {
            "kind": "three-suffix-margules",
            "a12": A12,
            "a21": A21,
            "mmhg_per_bar": MMHG_PER_BAR,
        },
        "points": [asdict(point) for point in points],
        "azeotrope": {**asdict(azeotrope), "mass_fraction_ethanol": mass_fraction},
    }
    print(json.dumps(result, ensure_ascii=False, indent=2, allow_nan=False))


if __name__ == "__main__":
    main()
