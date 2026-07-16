export interface AntoineConstants {
	a: number;
	b: number;
	c: number;
	validRangeC: readonly [number, number];
}

export interface Component {
	id: 'ethanol' | 'water';
	name: string;
	formula: string;
	molarMass: number;
	antoine: AntoineConstants;
}

export interface Margules3Parameters {
	a12: number;
	a21: number;
}

export interface BinarySystem {
	id: string;
	componentA: Component;
	componentB: Component;
	interaction: Margules3Parameters;
	referencePressureBar: number;
}

export interface EquilibriumPoint {
	x: number;
	y: number;
	temperatureC: number;
	pressureBar: number;
}

export interface AzeotropePoint extends EquilibriumPoint {
	massFractionA: number;
}

export type PhaseRegion = 'liquid' | 'vapor' | 'two-phase' | 'azeotrope';

export interface FlashState {
	region: PhaseRegion;
	overallComposition: number;
	liquidComposition: number;
	vaporComposition: number;
	liquidFraction: number;
	vaporFraction: number;
	bubbleTemperatureC: number;
	dewTemperatureC: number;
}

export interface DistillationStage extends EquilibriumPoint {
	stage: number;
	liquidMassFractionA: number;
	vaporMassFractionA: number;
}
