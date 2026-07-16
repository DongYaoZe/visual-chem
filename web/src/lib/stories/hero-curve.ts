import { ATM_BAR, ETHANOL_WATER, buildTxyCurve, findAzeotrope } from '$lib/chem';

/**
 * Real T-x-y geometry for the decorative hero curves.
 *
 * The landing page and the story hero used to sketch the phase envelope with
 * hand-tuned béziers. On a site whose whole argument is "the map is
 * computed, not drawn", the first curve a reader sees must come from the
 * same calibrated model as the interactive diagram — so this projects
 * buildTxyCurve output into an arbitrary SVG box instead.
 */

export interface HeroCurveBox {
	width: number;
	height: number;
	insetLeft: number;
	insetRight: number;
	insetTop: number;
	insetBottom: number;
}

export interface HeroCurveGeometry {
	/** Bubble line (liquid composition) as an SVG polyline path. */
	bubblePath: string;
	/** Dew line (vapor composition) as an SVG polyline path. */
	dewPath: string;
	/** Ideal-Raoult envelope on the same scale — the map with no fixed point. */
	idealBubblePath: string;
	idealDewPath: string;
	/** Where the two calibrated branches pinch shut, in SVG pixels. */
	azeotrope: { px: number; py: number };
	/** y of the domain floor — where a composition drop-line should land. */
	baselineY: number;
}

const SAMPLES = 161;
/** Fraction of the temperature span kept clear under the azeotrope pinch. */
const FLOOR_PADDING = 0.12;

export function heroCurveGeometry(box: HeroCurveBox): HeroCurveGeometry {
	const curve = buildTxyCurve(ATM_BAR, SAMPLES, ETHANOL_WATER, 1);
	const idealCurve = buildTxyCurve(ATM_BAR, SAMPLES, ETHANOL_WATER, 0);
	const azeotrope = findAzeotrope(ATM_BAR, ETHANOL_WATER, 1);
	if (!azeotrope) throw new Error('Ethanol–water model lost its azeotrope');

	const temperatures = curve.map((point) => point.temperatureC);
	const maxC = Math.max(...temperatures);
	const minC = Math.min(...temperatures) - (maxC - Math.min(...temperatures)) * FLOOR_PADDING;

	const plotWidth = box.width - box.insetLeft - box.insetRight;
	const plotHeight = box.height - box.insetTop - box.insetBottom;
	const px = (composition: number) => box.insetLeft + composition * plotWidth;
	const py = (temperatureC: number) =>
		box.insetTop + ((maxC - temperatureC) / (maxC - minC)) * plotHeight;

	const pathFor = (points: typeof curve, key: 'x' | 'y') =>
		points
			.map(
				(point, index) =>
					`${index === 0 ? 'M' : 'L'}${px(point[key]).toFixed(1)},${py(point.temperatureC).toFixed(1)}`
			)
			.join(' ');

	return {
		bubblePath: pathFor(curve, 'x'),
		dewPath: pathFor(curve, 'y'),
		idealBubblePath: pathFor(idealCurve, 'x'),
		idealDewPath: pathFor(idealCurve, 'y'),
		azeotrope: { px: px(azeotrope.x), py: py(azeotrope.temperatureC) },
		baselineY: box.height - box.insetBottom
	};
}
