import { describe, expect, it } from 'vitest';
import { heroCurveGeometry } from './hero-curve';

describe('hero curve geometry', () => {
	const box = {
		width: 1000,
		height: 300,
		insetLeft: 20,
		insetRight: 40,
		insetTop: 20,
		insetBottom: 24
	};
	const geometry = heroCurveGeometry(box);

	function coordinates(path: string): Array<{ px: number; py: number }> {
		return [...path.matchAll(/([ML])([\d.]+),([\d.]+)/g)].map((match) => ({
			px: Number(match[2]),
			py: Number(match[3])
		}));
	}

	it('keeps every sampled point inside the plot box', () => {
		for (const path of [
			geometry.bubblePath,
			geometry.dewPath,
			geometry.idealBubblePath,
			geometry.idealDewPath
		]) {
			const points = coordinates(path);
			expect(points.length).toBeGreaterThan(100);
			for (const { px, py } of points) {
				expect(px).toBeGreaterThanOrEqual(box.insetLeft);
				expect(px).toBeLessThanOrEqual(box.width - box.insetRight);
				expect(py).toBeGreaterThanOrEqual(box.insetTop);
				expect(py).toBeLessThanOrEqual(box.height - box.insetBottom);
			}
		}
	});

	it('pinches the calibrated branches shut at the azeotrope marker', () => {
		const bubble = coordinates(geometry.bubblePath);
		const dew = coordinates(geometry.dewPath);
		const nearestVerticalGap = (points: typeof bubble) =>
			Math.min(
				...points
					.filter(({ px }) => Math.abs(px - geometry.azeotrope.px) < 12)
					.map(({ py }) => Math.abs(py - geometry.azeotrope.py))
			);
		expect(nearestVerticalGap(bubble)).toBeLessThan(2);
		expect(nearestVerticalGap(dew)).toBeLessThan(2);
	});

	it('leaves the azeotrope marker above the baseline with room for the drop-line', () => {
		expect(geometry.azeotrope.py).toBeLessThan(geometry.baselineY - 8);
		expect(geometry.baselineY).toBe(box.height - box.insetBottom);
	});

	it('keeps the ideal envelope clear of any pinch before pure ethanol', () => {
		// Raoult's law admits no interior azeotrope: away from the pure-component
		// endpoints the ideal dew line must stay measurably above the bubble line
		// (above = hotter = smaller py). The two paths are parametrized by x and
		// y respectively, so compare at shared horizontal positions by linearly
		// interpolating the bubble polyline.
		const bubble = coordinates(geometry.idealBubblePath);
		const dew = coordinates(geometry.idealDewPath);
		const bubblePyAt = (px: number): number => {
			const upper = bubble.findIndex((point) => point.px >= px);
			if (upper <= 0) return bubble[Math.max(upper, 0)].py;
			const a = bubble[upper - 1];
			const b = bubble[upper];
			const t = (px - a.px) / (b.px - a.px);
			return a.py + t * (b.py - a.py);
		};
		const plotWidth = box.width - box.insetLeft - box.insetRight;
		let checked = 0;
		for (const { px, py } of dew) {
			const composition = (px - box.insetLeft) / plotWidth;
			if (composition < 0.05 || composition > 0.9) continue;
			expect(py, `composition ${composition.toFixed(2)}`).toBeLessThan(bubblePyAt(px) - 1);
			checked += 1;
		}
		expect(checked).toBeGreaterThan(50);
	});
});
