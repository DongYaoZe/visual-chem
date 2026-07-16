import { describe, expect, it } from 'vitest';
import { ATM_BAR, bubblePointAt, buildTxyCurve, simpleDistillationStages } from './ethanol-water';
import { thermoFrame } from './thermo-frame';

describe('thermoFrame', () => {
	it('narrates the point after the last equilibrium stage', () => {
		const frame = thermoFrame({ composition: 0.1, stage: 7 });
		const stages = simpleDistillationStages(0.1, 7);
		expect(frame.stages).toHaveLength(8);
		expect(frame.current).toEqual(stages[stages.length - 1]);
		expect(frame.current.stage).toBe(7);
	});

	it('defaults to one atmosphere, zero stages, and the calibrated model', () => {
		const frame = thermoFrame({ composition: 0.25 });
		expect(frame.pressureBar).toBe(ATM_BAR);
		expect(frame.stage).toBe(0);
		expect(frame.interactionScale).toBe(1);
		expect(frame.current).toEqual({ ...bubblePointAt(0.25), ...frame.current });
		expect(frame.current.x).toBeCloseTo(0.25, 12);
	});

	it('keeps the azeotrope in the calibrated model and loses it in the ideal one', () => {
		const calibrated = thermoFrame({ composition: 0.1, interactionScale: 1 });
		const ideal = thermoFrame({ composition: 0.1, interactionScale: 0 });
		expect(calibrated.azeotrope).not.toBeNull();
		expect(calibrated.azeotrope?.x).toBeCloseTo(0.895, 3);
		expect(ideal.azeotrope).toBeNull();
	});

	it('spans both reference envelopes so axes hold still while λ moves', () => {
		const frame = thermoFrame({ composition: 0.5, interactionScale: 0.4 });
		for (const interactionScale of [0, 1]) {
			for (const point of buildTxyCurve(ATM_BAR, 101, undefined, interactionScale)) {
				expect(point.temperatureC).toBeGreaterThanOrEqual(frame.temperatureExtent.minC);
				expect(point.temperatureC).toBeLessThanOrEqual(frame.temperatureExtent.maxC);
			}
		}
	});

	it('returns the identical frame object for identical inputs', () => {
		const input = { composition: 0.37, stage: 3, interactionScale: 0.8 };
		expect(thermoFrame(input)).toBe(thermoFrame({ ...input }));
	});

	it('distinguishes frames by every input dimension', () => {
		const base = thermoFrame({ composition: 0.3 });
		expect(thermoFrame({ composition: 0.31 })).not.toBe(base);
		expect(thermoFrame({ composition: 0.3, stage: 1 })).not.toBe(base);
		expect(thermoFrame({ composition: 0.3, interactionScale: 0.5 })).not.toBe(base);
	});
});
