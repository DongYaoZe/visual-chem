/**
 * Perceptual mixture color for the ethanol–water visuals.
 *
 * The macro view encodes composition as a water-teal → ethanol-orange sweep.
 * Interpolating that sweep in sRGB collapses through a muddy gray-brown at
 * mid compositions; interpolating lightness, chroma, and hue in OKLCH keeps
 * every mixture as saturated as its endpoints, so "half ethanol" reads as a
 * color of its own instead of dishwater.
 *
 * OKLab conversion matrices from Björn Ottosson's reference implementation.
 */

const WATER_RGB: readonly [number, number, number] = [32, 127, 140];
const ETHANOL_RGB: readonly [number, number, number] = [214, 107, 50];

interface Oklch {
	lightness: number;
	chroma: number;
	/** Hue in radians. */
	hue: number;
}

function srgbChannelToLinear(channel: number): number {
	const c = channel / 255;
	return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function linearChannelToSrgb(channel: number): number {
	const c = Math.min(1, Math.max(0, channel));
	return Math.round(255 * (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055));
}

function srgbToOklch([red, green, blue]: readonly [number, number, number]): Oklch {
	const r = srgbChannelToLinear(red);
	const g = srgbChannelToLinear(green);
	const b = srgbChannelToLinear(blue);
	const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
	const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
	const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
	const labA = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
	const labB = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
	return {
		lightness: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
		chroma: Math.hypot(labA, labB),
		hue: Math.atan2(labB, labA)
	};
}

function oklchToSrgb({ lightness, chroma, hue }: Oklch): [number, number, number] {
	const labA = chroma * Math.cos(hue);
	const labB = chroma * Math.sin(hue);
	const l = (lightness + 0.3963377774 * labA + 0.2158037573 * labB) ** 3;
	const m = (lightness - 0.1055613458 * labA - 0.0638541728 * labB) ** 3;
	const s = (lightness - 0.0894841775 * labA - 1.291485548 * labB) ** 3;
	return [
		linearChannelToSrgb(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
		linearChannelToSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
		linearChannelToSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s)
	];
}

const WATER = srgbToOklch(WATER_RGB);
const ETHANOL = srgbToOklch(ETHANOL_RGB);
/** Shorter arc from teal to orange — the sweep passes through green, not gray. */
const HUE_DELTA =
	((ETHANOL.hue - WATER.hue + 3 * Math.PI) % (2 * Math.PI)) - Math.PI;

/** Color for a liquid or vapor of the given ethanol mole fraction. */
export function mixtureColor(composition: number): string {
	const x = Math.min(1, Math.max(0, composition));
	const [red, green, blue] = oklchToSrgb({
		lightness: WATER.lightness + (ETHANOL.lightness - WATER.lightness) * x,
		chroma: WATER.chroma + (ETHANOL.chroma - WATER.chroma) * x,
		hue: WATER.hue + HUE_DELTA * x
	});
	return `rgb(${red},${green},${blue})`;
}
