import { describe, expect, it } from 'vitest';
import { saltFrame } from './salt-frame';

describe('saltFrame', () => {
	it('resolves the equilibrium, compositions, and isotherm for one pot', () => {
		const frame = saltFrame({ temperatureC: 25, waterG: 100, kno3G: 100, nano3G: 100 });
		expect(frame.interactionScale).toBe(1);
		expect(frame.region).toBe('kno3');
		expect(frame.composition).not.toBeNull();
		expect(frame.liquidComposition).not.toBeNull();
		// The liquid holds less KNO3 than the pot: crystals sit outside the liquid.
		expect(frame.liquidComposition!.kno3Frac).toBeLessThan(1 / 3);
		expect(frame.isotherm.temperatureC).toBe(25);
	});

	it('returns the identical object for the identical input (memoized)', () => {
		const a = saltFrame({ temperatureC: 40, waterG: 100, kno3G: 30, nano3G: 30 });
		const b = saltFrame({ temperatureC: 40, waterG: 100, kno3G: 30, nano3G: 30 });
		expect(b).toBe(a);
	});

	it('shares one isotherm object across different pots at the same temperature', () => {
		const a = saltFrame({ temperatureC: 50, waterG: 100, kno3G: 10, nano3G: 10 });
		const b = saltFrame({ temperatureC: 50, waterG: 80, kno3G: 60, nano3G: 20 });
		expect(b.isotherm).toBe(a.isotherm);
	});

	it('distinguishes every input dimension', () => {
		const base = saltFrame({ temperatureC: 30, waterG: 100, kno3G: 40, nano3G: 40 });
		expect(saltFrame({ temperatureC: 31, waterG: 100, kno3G: 40, nano3G: 40 })).not.toBe(base);
		expect(saltFrame({ temperatureC: 30, waterG: 99, kno3G: 40, nano3G: 40 })).not.toBe(base);
		expect(saltFrame({ temperatureC: 30, waterG: 100, kno3G: 41, nano3G: 40 })).not.toBe(base);
		expect(saltFrame({ temperatureC: 30, waterG: 100, kno3G: 40, nano3G: 41 })).not.toBe(base);
		expect(
			saltFrame({ temperatureC: 30, waterG: 100, kno3G: 40, nano3G: 40, interactionScale: 0 })
		).not.toBe(base);
	});

	it('handles the dry pot without a liquid composition', () => {
		const frame = saltFrame({ temperatureC: 25, waterG: 0, kno3G: 10, nano3G: 5 });
		expect(frame.region).toBe('dry');
		expect(frame.liquidComposition).toBeNull();
		expect(frame.composition).not.toBeNull();
	});
});
