export type LocaleCode = 'zh-CN' | 'en';

export type DisplayValue = string | number;

export type ContentMessage<Params extends object = Record<string, never>> = (
	params: Params
) => string;

export interface SeoContent {
	title: string;
	description: string;
	path: string;
	alternateLocalePath: string;
	type: 'website' | 'article';
	image: string;
	imageAlt: string;
	modifiedTime: string;
	publishedTime?: string;
}

export interface InlineTextSegment {
	text: string;
	emphasis?: 'strong' | 'em' | 'subscript';
}

export type InlineText = readonly InlineTextSegment[];

export interface SplitHeading {
	lines: readonly string[];
	emphasis?: string;
}

export interface HeaderContent {
	brand: string;
	tagline: string;
	homeAriaLabel: string;
	navigationAriaLabel: string;
	storyLink: string;
	catalogLink: string;
	githubLink: string;
}

export interface MotionControlContent {
	pause: string;
	resume: string;
}

export interface ConceptCheckChromeContent {
	eyebrow: string;
	verifyButton: string;
	correctFeedback: string;
	incorrectFeedback: string;
}

export interface TriViewContent {
	defaultAriaLabel: string;
	liveSummary: ContentMessage<{
		liquidComposition: DisplayValue;
		vaporComposition: DisplayValue;
		bubblePointC: DisplayValue;
		stage: DisplayValue;
	}>;
	synchronizedState: string;
	liquidComposition: string;
	vaporComposition: string;
	bubblePoint: string;
	experimentalAzeotrope: string;
	modelLimit: string;
	massPercent: ContentMessage<{ value: DisplayValue }>;
}

export interface ApparatusContent {
	ariaLabel: string;
	stillLiquid: ContentMessage<{ composition: DisplayValue }>;
	distillate: ContentMessage<{ composition: DisplayValue }>;
	equilibriumStage: ContentMessage<{ stage: DisplayValue }>;
	viewName: string;
	caption: string;
}

export interface ParticleContent {
	vaporPhase: string;
	liquidPhase: string;
	ethanol: string;
	water: string;
	viewName: string;
	caption: string;
}

export interface DiagramContent {
	accessibleReconstruction: ContentMessage<{
		totalPoints: DisplayValue;
		selectedPoints: DisplayValue;
		liquidComposition: DisplayValue;
		vaporComposition: DisplayValue;
		temperatureC: DisplayValue;
	}>;
	accessibleModel: ContentMessage<{
		liquidComposition: DisplayValue;
		vaporComposition: DisplayValue;
		bubblePointC: DisplayValue;
		modelStrength: DisplayValue;
		withExperimentalData: boolean;
		totalPoints: DisplayValue;
	}>;
	captions: {
		reconstruction: string;
		comparison: ContentMessage<{ modelStrength: DisplayValue }>;
		ideal: string;
		margules: ContentMessage<{ modelStrength: DisplayValue }>;
	};
	modelFixedPoint: string;
	laiExperimentalAzeotrope: string;
	xAxis: string;
	yAxis: string;
	regions: {
		vapor: string;
		liquid: string;
		twoPhase: string;
	};
	legend: {
		modelLiquid: string;
		modelVapor: string;
		experiment: string;
		reconstruction: string;
	};
	captionKind: {
		evidence: string;
		model: string;
	};
}

export interface VisualizationContent {
	triView: TriViewContent;
	apparatus: ApparatusContent;
	particles: ParticleContent;
	diagram: DiagramContent;
}

export interface SharedUiContent extends VisualizationContent {
	seo: {
		defaultImageAlt: string;
	};
	header: HeaderContent;
	motionControl: MotionControlContent;
	conceptCheck: ConceptCheckChromeContent;
}

export interface HomeStoryCardContent {
	number: string;
	status: string;
	title: string;
	description: string;
	action: string;
}

export interface HomeContent {
	seo: SeoContent;
	hero: {
		eyebrow: string;
		heading: SplitHeading;
		lead: string;
		primaryAction: {
			label: string;
			symbol: string;
		};
		methodAction: string;
		proofs: readonly { value: string; label: string }[];
		previewAriaLabel: string;
		limitLabel: string;
		limitValue: string;
		limitUnit: string;
		limitContext: string;
		unreachableValue: string;
		fixedPointLabel: string;
		azeotropeCompositionLabel: string;
		storyPreview: string;
	};
	method: {
		eyebrow: string;
		heading: SplitHeading;
		body: string;
		controls: {
			initialComposition: string;
			initialCompositionAriaLabel: string;
			equilibriumStages: string;
			equilibriumStagesAriaLabel: string;
			hint: string;
			triViewAriaLabel: string;
		};
	};
	season: {
		eyebrow: string;
		title: string;
		introduction: string;
		stories: readonly [
			HomeStoryCardContent,
			HomeStoryCardContent,
			HomeStoryCardContent,
			HomeStoryCardContent
		];
	};
	seasonTwo: {
		eyebrow: string;
		title: string;
		introduction: string;
		stories: readonly [HomeStoryCardContent, HomeStoryCardContent, HomeStoryCardContent];
	};
	seasonThree: {
		eyebrow: string;
		title: string;
		introduction: string;
		stories: readonly [HomeStoryCardContent, HomeStoryCardContent, HomeStoryCardContent];
	};
	seasonFour: {
		eyebrow: string;
		title: string;
		introduction: string;
		stories: readonly [HomeStoryCardContent, HomeStoryCardContent];
	};
	principles: {
		eyebrow: string;
		heading: SplitHeading;
		items: readonly {
			number: string;
			title: string;
			body: string;
		}[];
	};
	footer: {
		tagline: string;
		sourceCodeLink: string;
		firstStoryLink: string;
	};
}

export interface SiteContent {
	locale: LocaleCode;
	htmlLang: string;
	shared: SharedUiContent;
	home: HomeContent;
}

export type EthanolDistillationSceneId =
	| 'hook'
	| 'composition-language'
	| 'first-bubble'
	| 'tie-line'
	| 'build-the-map'
	| 'equilibrium-cascade'
	| 'nonideal-model'
	| 'fixed-point'
	| 'change-the-operation';

export type BoilingMapSceneId =
	| 'hook'
	| 'invisible-race'
	| 'draw-the-curve'
	| 'boiling-defined'
	| 'straighten-the-curve'
	| 'complete-the-map'
	| 'altitude-travel'
	| 'freeze-dry-detour'
	| 'pressure-cooker';

export type SaltSplitSceneId =
	| 'hook'
	| 'two-curves'
	| 'shared-water'
	| 'triangle-map'
	| 'isotherm'
	| 'cooling'
	| 'filter-jump'
	| 'evaporate'
	| 'honest-map';

export interface StorySceneContent<Id extends string = EthanolDistillationSceneId> {
	id: Id;
	kicker: string;
	title: string;
	paragraphs: readonly string[];
	formula?: string;
}

export type StoryScenes = readonly [
	StorySceneContent,
	StorySceneContent,
	StorySceneContent,
	StorySceneContent,
	StorySceneContent,
	StorySceneContent,
	StorySceneContent,
	StorySceneContent,
	StorySceneContent
];

export type BoilingMapScenes = readonly [
	StorySceneContent<BoilingMapSceneId>,
	StorySceneContent<BoilingMapSceneId>,
	StorySceneContent<BoilingMapSceneId>,
	StorySceneContent<BoilingMapSceneId>,
	StorySceneContent<BoilingMapSceneId>,
	StorySceneContent<BoilingMapSceneId>,
	StorySceneContent<BoilingMapSceneId>,
	StorySceneContent<BoilingMapSceneId>,
	StorySceneContent<BoilingMapSceneId>
];

export type SaltSplitScenes = readonly [
	StorySceneContent<SaltSplitSceneId>,
	StorySceneContent<SaltSplitSceneId>,
	StorySceneContent<SaltSplitSceneId>,
	StorySceneContent<SaltSplitSceneId>,
	StorySceneContent<SaltSplitSceneId>,
	StorySceneContent<SaltSplitSceneId>,
	StorySceneContent<SaltSplitSceneId>,
	StorySceneContent<SaltSplitSceneId>,
	StorySceneContent<SaltSplitSceneId>
];

export interface ChoiceContent {
	label: string;
}

/** Endpoint captions rendered under a slider track. */
export interface SliderScaleContent {
	start: string;
	end: string;
}

export interface StoryInteractionsContent {
	hook: {
		prompt: string;
		choices: readonly [ChoiceContent, ChoiceContent];
		addStageButton: string;
		resetButton: string;
		stageOutput: ContentMessage<{ stage: DisplayValue; composition: DisplayValue }>;
		evidence: string;
	};
	firstBubble: {
		prompt: string;
		choices: readonly [ChoiceContent, ChoiceContent, ChoiceContent];
		evidence: string;
	};
	experiment: {
		controlLabel: string;
		sampleStripLabel: string;
		sampleStripAriaLabel: string;
		sampleButtonAriaLabel: ContentMessage<{
			index: DisplayValue;
			liquidComposition: DisplayValue;
		}>;
		sliderAriaLabel: string;
		sliderValueText: ContentMessage<{
			index: DisplayValue;
			liquidComposition: DisplayValue;
		}>;
		measurement: ContentMessage<{
			temperatureC: DisplayValue;
			temperatureUncertaintyC: DisplayValue;
			vaporComposition: DisplayValue;
		}>;
		addButton: string;
		addedButton: string;
		clearButton: string;
		selectionOutput: ContentMessage<{ selected: DisplayValue; total: DisplayValue }>;
		coverageLabel: string;
		coverageBands: readonly [string, string, string];
		coverageHint: ContentMessage<{ covered: DisplayValue; total: DisplayValue }>;
		coverageComplete: string;
		incompleteEvidence: string;
		completeEvidence: string;
	};
	idealCascade: {
		controlLabel: string;
		sliderAriaLabel: string;
	};
	nonidealModel: {
		controlLabel: string;
		sliderAriaLabel: string;
		scale: SliderScaleContent;
	};
	azeotropeSearch: {
		controlLabel: string;
		sliderAriaLabel: string;
		compositionOutput: ContentMessage<{
			liquidComposition: DisplayValue;
			vaporComposition: DisplayValue;
		}>;
		nearEvidence: ContentMessage<{
			modelComposition: DisplayValue;
			modelTemperatureC: DisplayValue;
			experimentalComposition: DisplayValue;
			experimentalCompositionUncertainty: DisplayValue;
			experimentalTemperatureC: DisplayValue;
			experimentalTemperatureUncertaintyC: DisplayValue;
		}>;
	};
}

export interface ConceptQuestionContent {
	question: string;
	options: readonly [ChoiceContent, ChoiceContent, ChoiceContent, ChoiceContent];
	correctIndex: number;
	explanation: string;
}

export interface EthanolDistillationStoryContent {
	locale: LocaleCode;
	seo: SeoContent;
	hero: {
		eyebrow: string;
		metadata: readonly string[];
		heading: SplitHeading;
		ledeLines: readonly string[];
		scrollCue: string;
		curveEvidence: string;
	};
	readingNote: {
		eyebrow: string;
		body: InlineText;
	};
	stage: {
		dialogAriaLabel: string;
		closeGraphicAriaLabel: string;
		triViewAriaLabel: string;
		shortStateAriaLabel: string;
		openGraphicButton: string;
		shortState: {
			liquid: ContentMessage<{ composition: DisplayValue }>;
			vapor: ContentMessage<{ composition: DisplayValue }>;
			temperature: ContentMessage<{ temperatureC: DisplayValue }>;
		};
	};
	scenes: StoryScenes;
	interactions: StoryInteractionsContent;
	escape: {
		eyebrow: string;
		heading: SplitHeading;
		body: string;
		controlLabel: string;
		controlAriaLabel: string;
		percentOutput: ContentMessage<{ percent: DisplayValue }>;
		figureCaption: string;
		beforeLabel: string;
		beforeValue: ContentMessage<{ molePercent: DisplayValue }>;
		sieveLabelLines: readonly [string, string];
		afterLabel: string;
		afterValue: ContentMessage<{ molePercent: DisplayValue }>;
	};
	conceptCheck: ConceptQuestionContent;
	sandbox: {
		eyebrow: string;
		title: string;
		introduction: string;
		controls: {
			initialComposition: string;
			initialCompositionAriaLabel: string;
			equilibriumStages: string;
			equilibriumStagesAriaLabel: string;
			nonidealStrength: string;
			nonidealStrengthAriaLabel: string;
			nonidealStrengthScale: SliderScaleContent;
		};
		challengeLabel: string;
		challenge: string;
		triViewAriaLabel: string;
	};
	modelCard: {
		eyebrow: string;
		heading: SplitHeading;
		items: readonly {
			title: string;
			body: InlineText;
			openByDefault: boolean;
			links?: readonly {
				label: string;
				href: string;
			}[];
		}[];
	};
	ending: {
		lead: string;
		heading: SplitHeading;
		catalogLink: string;
		sourceLink: string;
	};
}

/** Water tri-view: the shared chrome around the boiling-map panels. */
export interface WaterTriViewContent {
	defaultAriaLabel: string;
	liveSummary: ContentMessage<{
		temperatureC: DisplayValue;
		pressureKPa: DisplayValue;
		phase: string;
	}>;
	synchronizedState: string;
	temperature: string;
	pressure: string;
	phase: string;
	boilingPoint: string;
	phaseNames: Record<'solid' | 'liquid' | 'vapor' | 'supercritical', string>;
	kitchen: {
		ariaLabel: string;
		viewName: string;
		caption: string;
		altitudeLabel: ContentMessage<{ altitudeM: DisplayValue }>;
		boilingLabel: ContentMessage<{ temperatureC: DisplayValue }>;
		waterState: ContentMessage<{ temperatureC: DisplayValue }>;
	};
	race: {
		ariaLabel: string;
		viewName: string;
		caption: string;
		escapeLabel: string;
		returnLabel: string;
	};
	map: {
		ariaLabel: ContentMessage<{
			temperatureC: DisplayValue;
			pressureKPa: DisplayValue;
			phase: string;
		}>;
		xAxis: string;
		xAxisLinearized: string;
		yAxis: string;
		yAxisLinearized: string;
		regions: {
			solid: string;
			liquid: string;
			vapor: string;
		};
		triplePoint: string;
		criticalPoint: string;
		boilingLine: string;
		sublimationLine: string;
		meltingLine: string;
		externalPressure: string;
		caption: {
			map: string;
			linearized: string;
		};
		captionKind: string;
	};
}

export interface BoilingMapInteractionsContent {
	hook: {
		prompt: string;
		choices: readonly [ChoiceContent, ChoiceContent, ChoiceContent];
		evidence: string;
	};
	drawTheCurve: {
		controlLabel: string;
		sliderAriaLabel: string;
		readout: ContentMessage<{ temperatureC: DisplayValue; pressureKPa: DisplayValue }>;
	};
	boilingDefined: {
		controlLabel: string;
		sliderAriaLabel: string;
		scale: SliderScaleContent;
		readout: ContentMessage<{ pressureKPa: DisplayValue; temperatureC: DisplayValue }>;
	};
	straighten: {
		toggleLabel: string;
		mapButton: string;
		linearizedButton: string;
		enthalpyReadout: ContentMessage<{ enthalpyKJ: DisplayValue }>;
	};
	altitude: {
		controlLabel: string;
		sliderAriaLabel: string;
		landmarks: Record<'sea-level' | 'denver' | 'lhasa' | 'everest', string>;
		readout: ContentMessage<{
			altitudeM: DisplayValue;
			pressureKPa: DisplayValue;
			temperatureC: DisplayValue;
		}>;
	};
	freezeDry: {
		controlLabel: string;
		sliderAriaLabel: string;
		stages: readonly [string, string, string];
		readout: ContentMessage<{ temperatureC: DisplayValue; pressureKPa: DisplayValue }>;
	};
	pressureCooker: {
		controlLabel: string;
		sliderAriaLabel: string;
		scale: SliderScaleContent;
		readout: ContentMessage<{ pressureKPa: DisplayValue; temperatureC: DisplayValue }>;
	};
}

/** Salt tri-view: the shared chrome around the salt-split panels. */
export interface SaltTriViewContent {
	defaultAriaLabel: string;
	liveSummary: ContentMessage<{
		temperatureC: DisplayValue;
		liquidKno3G: DisplayValue;
		liquidNano3G: DisplayValue;
		region: string;
	}>;
	synchronizedState: string;
	temperature: string;
	liquidKno3: string;
	liquidNano3: string;
	region: string;
	gramsValue: ContentMessage<{ grams: DisplayValue }>;
	regionNames: Record<'unsaturated' | 'kno3' | 'nano3' | 'both' | 'dry', string>;
	pot: {
		ariaLabel: string;
		viewName: string;
		caption: string;
		temperatureLabel: ContentMessage<{ temperatureC: DisplayValue }>;
		dissolvedLabel: ContentMessage<{ kno3G: DisplayValue; nano3G: DisplayValue }>;
		kno3CrystalsLabel: ContentMessage<{ grams: DisplayValue }>;
		nano3CrystalsLabel: ContentMessage<{ grams: DisplayValue }>;
		waterLabel: ContentMessage<{ grams: DisplayValue }>;
	};
	ions: {
		ariaLabel: string;
		viewName: string;
		caption: string;
		potassium: string;
		sodium: string;
		nitrate: string;
		dissolvedTag: string;
		latticeTag: string;
	};
	triangle: {
		ariaLabel: ContentMessage<{
			temperatureC: DisplayValue;
			region: string;
		}>;
		waterVertex: string;
		kno3Vertex: string;
		nano3Vertex: string;
		isothermLabel: ContentMessage<{ temperatureC: DisplayValue }>;
		regions: {
			unsaturated: string;
			kno3Field: string;
			nano3Field: string;
			bothField: string;
		};
		eutonicPoint: string;
		totalPoint: string;
		liquidPoint: string;
		tieLine: string;
		trajectory: string;
		experimentPoints: string;
		curvesXAxis: string;
		curvesYAxis: string;
		caption: {
			curves: string;
			map: string;
			calibrated: string;
			ideal: string;
		};
		captionKind: string;
	};
}

export interface SaltSplitInteractionsContent {
	hook: {
		prompt: string;
		choices: readonly [ChoiceContent, ChoiceContent, ChoiceContent];
		evidence: string;
	};
	twoCurves: {
		controlLabel: string;
		sliderAriaLabel: string;
		readout: ContentMessage<{
			temperatureC: DisplayValue;
			kno3Solubility: DisplayValue;
			nano3Solubility: DisplayValue;
		}>;
	};
	sharedWater: {
		controlLabel: string;
		sliderAriaLabel: string;
		scale: SliderScaleContent;
		readout: ContentMessage<{
			nano3G: DisplayValue;
			kno3CapacityG: DisplayValue;
			soloCapacityG: DisplayValue;
		}>;
	};
	triangleMap: {
		kno3ControlLabel: string;
		kno3SliderAriaLabel: string;
		nano3ControlLabel: string;
		nano3SliderAriaLabel: string;
		readout: ContentMessage<{
			waterPct: DisplayValue;
			kno3Pct: DisplayValue;
			nano3Pct: DisplayValue;
		}>;
	};
	isotherm: {
		regionReadout: ContentMessage<{ region: string }>;
		crystalReadout: ContentMessage<{ summary: string }>;
	};
	cooling: {
		controlLabel: string;
		sliderAriaLabel: string;
		readout: ContentMessage<{ temperatureC: DisplayValue; kno3CrystalsG: DisplayValue }>;
	};
	filterJump: {
		filterButton: string;
		resetButton: string;
		waitingHint: string;
		harvestOutput: ContentMessage<{ crystalsG: DisplayValue }>;
	};
	evaporate: {
		controlLabel: string;
		sliderAriaLabel: string;
		readout: ContentMessage<{ waterRemovedG: DisplayValue; nano3CrystalsG: DisplayValue }>;
	};
	honestMap: {
		toggleLabel: string;
		idealButton: string;
		calibratedButton: string;
		verdictIdeal: string;
		verdictCalibrated: string;
	};
}

export interface SaltSplitStoryContent {
	locale: LocaleCode;
	seo: SeoContent;
	hero: {
		eyebrow: string;
		metadata: readonly string[];
		heading: SplitHeading;
		ledeLines: readonly string[];
		scrollCue: string;
		curveEvidence: string;
	};
	readingNote: {
		eyebrow: string;
		body: InlineText;
	};
	stage: {
		dialogAriaLabel: string;
		closeGraphicAriaLabel: string;
		triViewAriaLabel: string;
		shortStateAriaLabel: string;
		openGraphicButton: string;
		shortState: {
			temperature: ContentMessage<{ temperatureC: DisplayValue }>;
			liquid: ContentMessage<{ kno3G: DisplayValue; nano3G: DisplayValue }>;
			solids: ContentMessage<{ summary: string }>;
		};
	};
	scenes: SaltSplitScenes;
	interactions: SaltSplitInteractionsContent;
	triView: SaltTriViewContent;
	edge: {
		eyebrow: string;
		heading: SplitHeading;
		body: string;
		industryFacts: readonly { label: string; value: string }[];
		figureCaption: string;
	};
	conceptCheck: ConceptQuestionContent;
	sandbox: {
		eyebrow: string;
		title: string;
		introduction: string;
		controls: {
			temperature: string;
			temperatureAriaLabel: string;
			evaporate: string;
			evaporateAriaLabel: string;
			addWater: string;
			addWaterAriaLabel: string;
			filterButton: string;
			resetButton: string;
		};
		harvest: {
			label: string;
			kno3: ContentMessage<{ grams: DisplayValue }>;
			nano3: ContentMessage<{ grams: DisplayValue }>;
			water: ContentMessage<{ grams: DisplayValue }>;
		};
		challengeLabel: string;
		challenge: string;
		triViewAriaLabel: string;
	};
	modelCard: {
		eyebrow: string;
		heading: SplitHeading;
		items: readonly {
			title: string;
			body: InlineText;
			openByDefault: boolean;
			links?: readonly {
				label: string;
				href: string;
			}[];
		}[];
	};
	ending: {
		lead: string;
		heading: SplitHeading;
		catalogLink: string;
		sourceLink: string;
	};
}

export interface BoilingMapStoryContent {
	locale: LocaleCode;
	seo: SeoContent;
	hero: {
		eyebrow: string;
		metadata: readonly string[];
		heading: SplitHeading;
		ledeLines: readonly string[];
		scrollCue: string;
		curveEvidence: string;
	};
	readingNote: {
		eyebrow: string;
		body: InlineText;
	};
	stage: {
		dialogAriaLabel: string;
		closeGraphicAriaLabel: string;
		triViewAriaLabel: string;
		shortStateAriaLabel: string;
		openGraphicButton: string;
		shortState: {
			temperature: ContentMessage<{ temperatureC: DisplayValue }>;
			pressure: ContentMessage<{ pressureKPa: DisplayValue }>;
			phase: ContentMessage<{ phase: string }>;
		};
	};
	scenes: BoilingMapScenes;
	interactions: BoilingMapInteractionsContent;
	triView: WaterTriViewContent;
	edge: {
		eyebrow: string;
		heading: SplitHeading;
		body: string;
		criticalFacts: readonly { label: string; value: string }[];
		figureCaption: string;
	};
	conceptCheck: ConceptQuestionContent;
	sandbox: {
		eyebrow: string;
		title: string;
		introduction: string;
		controls: {
			temperature: string;
			temperatureAriaLabel: string;
			pressure: string;
			pressureAriaLabel: string;
			pressureScale: SliderScaleContent;
		};
		challengeLabel: string;
		challenge: string;
		triViewAriaLabel: string;
	};
	modelCard: {
		eyebrow: string;
		heading: SplitHeading;
		items: readonly {
			title: string;
			body: InlineText;
			openByDefault: boolean;
			links?: readonly {
				label: string;
				href: string;
			}[];
		}[];
	};
	ending: {
		lead: string;
		heading: SplitHeading;
		catalogLink: string;
		sourceLink: string;
	};
}

/** Cooling-curve detective story scene IDs, in narrative order. */
export type CoolingCurveSceneId =
	| 'hook'
	| 'pure-metal'
	| 'first-crystal'
	| 'eutectic-arrest'
	| 'read-the-map'
	| 'phase-rule'
	| 'real-anchors'
	| 'cooling-rate'
	| 'sandbox';

/** One prose-driven scene; blocks are separated by blank lines, display math
 * lives on its own $$...$$ block, **bold** and inline $...$ are parsed. */
export interface CoolingSceneContent {
	id: CoolingCurveSceneId;
	prose: string;
}

/** Tri-view content for the cooling-curve story. */
export interface CoolingTriViewContent {
	defaultAriaLabel: string;
	liveSummary: ContentMessage<{ region: string; melt: string }>;
	synchronizedState: string;
	crucible: {
		ariaLabel: string;
		viewName: string;
		caption: string;
		temperatureLabel: ContentMessage<{ temperatureC: DisplayValue }>;
		liquidLabel: ContentMessage<{ percent: DisplayValue }>;
		solidALabel: ContentMessage<{ percent: DisplayValue }>;
		solidBLabel: ContentMessage<{ percent: DisplayValue }>;
		clockLabel: ContentMessage<{ minutes: DisplayValue }>;
	};
	melt: {
		ariaLabel: string;
		viewName: string;
		caption: string;
		bismuth: string;
		cadmium: string;
		liquidTag: string;
		crystalTag: string;
	};
	diagram: {
		ariaLabel: ContentMessage<{ temperatureC: DisplayValue; region: string }>;
		xAxis: string;
		curveXAxis: string;
		yAxis: string;
		bismuthVertex: string;
		cadmiumVertex: string;
		liquidusLine: string;
		eutecticPoint: string;
		breakMarker: string;
		arrestMarker: string;
		caption: {
			map: string;
			curve: string;
		};
	};
	regionNames: {
		liquid: string;
		'liquid+A': string;
		'liquid+B': string;
		'eutectic-arrest': string;
		'solid-mixture': string;
	};
}

export interface CoolingCurveInteractionsContent {
	hook: {
		question: string;
		options: readonly { id: string; label: string; correct?: boolean }[];
		correctExplanation: string;
	};
	firstCrystal: {
		compositionLabel: string;
		compositionUnit: string;
		showLiquidusButton: string;
	};
	eutecticArrest: {
		compositionLabel: string;
		compositionUnit: string;
		showSolidusButton: string;
	};
	readTheMap: {
		showCurveButton: string;
	};
	sandbox: {
		compositionLabel: string;
		compositionUnit: string;
		playButton: string;
		pauseButton: string;
		resetButton: string;
		challenge: string;
	};
}

export interface CoolingCurveStoryContent {
	locale: LocaleCode;
	seo: SeoContent;
	hero: {
		eyebrow: string;
		title: readonly string[];
		subtitle: string;
	};
	readingNote: string;
	stage: {
		dialogAriaLabel: string;
		closeGraphicAriaLabel: string;
		openGraphicButton: string;
		shortStateAriaLabel: string;
	};
	shortState: {
		temperature: ContentMessage<{ temperatureC: DisplayValue }>;
		time: ContentMessage<{ timeS: DisplayValue }>;
		phase: string;
	};
	scenes: readonly CoolingSceneContent[];
	interactions: CoolingCurveInteractionsContent;
	triView: CoolingTriViewContent;
	edge: {
		title: string;
		facts: readonly { term: string; definition: string }[];
	};
	conceptCheck: ConceptQuestionContent;
	sandbox: {
		title: string;
		description: string;
		compositionLabel: string;
		compositionUnit: string;
		controls: {
			play: string;
			pause: string;
			reset: string;
		};
		challenge: string;
	};
	modelCard: {
		title: string;
		items: readonly { term: string; value: string }[];
	};
	ending: {
		summary: string;
		invitation: string;
		backToHome: string;
	};
}

/* ------------------------------------------------------------------ */
/* Season 2 · the prose-driven story format                            */
/* ------------------------------------------------------------------ */

/** A season-2 scene: prose micro-format (see $lib/stories/prose). */
export interface ProseSceneContent<Id extends string = string> {
	id: Id;
	prose: string;
}

/**
 * Season-2 story shell: everything a prose story shares. Stories add their
 * own `interactions` and `triView` on top of this.
 */
export interface ProseStoryContent<Id extends string = string> {
	locale: LocaleCode;
	seo: SeoContent;
	hero: {
		eyebrow: string;
		title: readonly string[];
		subtitle: string;
		heroTag: string;
	};
	readingNote: string;
	stage: {
		dialogAriaLabel: string;
		closeGraphicAriaLabel: string;
		openGraphicButton: string;
		shortStateAriaLabel: string;
	};
	scenes: readonly ProseSceneContent<Id>[];
	kickers: Readonly<Record<Id, string>>;
	edge: {
		eyebrow: string;
		title: string;
		facts: readonly { term: string; definition: string }[];
	};
	conceptCheck: ConceptQuestionContent;
	sandboxIntro: {
		eyebrow: string;
		title: string;
		description: string;
	};
	modelCard: {
		title: string;
		items: readonly { term: string; value: string }[];
	};
	ending: {
		summary: string;
		invitation: string;
		backToHome: string;
	};
}

/* --- Story 5 · Entropy is not disorder ----------------------------- */

export type EntropySceneId =
	| 'hook'
	| 'count-the-ways'
	| 'the-spike'
	| 'boltzmann'
	| 'irreversible'
	| 'fluctuations'
	| 'not-disorder'
	| 'sandbox';

export interface EntropyTriViewContent {
	defaultAriaLabel: string;
	liveSummary: ContentMessage<{ leftCount: DisplayValue; total: DisplayValue }>;
	synchronizedState: string;
	bulbs: {
		ariaLabel: string;
		viewName: string;
		caption: string;
		leftLabel: string;
		rightLabel: string;
		valveOpen: string;
		valveClosed: string;
	};
	histogram: {
		ariaLabel: ContentMessage<{ total: DisplayValue }>;
		viewName: string;
		caption: string;
		xAxis: string;
		yAxis: string;
		currentMarker: string;
		allLeftMarker: string;
	};
	entropy: {
		ariaLabel: string;
		viewName: string;
		caption: string;
		lnWLabel: string;
		entropyReadout: ContentMessage<{ lnW: DisplayValue }>;
		oddsReadout: ContentMessage<{ exponent: DisplayValue }>;
	};
}

export interface EntropyInteractionsContent {
	hook: {
		question: string;
		options: readonly { id: string; label: string }[];
		explanation: string;
	};
	countTheWays: {
		particlesLabel: string;
	};
	irreversible: {
		releaseButton: string;
		resetButton: string;
		runningHint: string;
	};
	sandbox: {
		particlesLabel: string;
		windowLabel: string;
		windowReadout: ContentMessage<{ percent: DisplayValue; window: DisplayValue }>;
	};
}

export interface EntropyStoryContent extends ProseStoryContent<EntropySceneId> {
	interactions: EntropyInteractionsContent;
	triView: EntropyTriViewContent;
}

/* --- Story 6 · The downhill road of a reaction ---------------------- */

export type GibbsSceneId =
	| 'hook'
	| 'two-forces'
	| 'the-valley'
	| 'slope-is-deltaG'
	| 'kp-position'
	| 'squeeze'
	| 'heat'
	| 'positive-deltaG0'
	| 'sandbox';

export interface GibbsTriViewContent {
	defaultAriaLabel: string;
	liveSummary: ContentMessage<{ extent: DisplayValue; temperatureC: DisplayValue }>;
	synchronizedState: string;
	flask: {
		ariaLabel: string;
		viewName: string;
		caption: string;
		temperatureLabel: ContentMessage<{ temperatureC: DisplayValue }>;
		no2Label: ContentMessage<{ percent: DisplayValue }>;
		pressureLabel: ContentMessage<{ pressureBar: DisplayValue }>;
	};
	molecules: {
		ariaLabel: string;
		viewName: string;
		caption: string;
		dimerLabel: string;
		monomerLabel: string;
	};
	valley: {
		ariaLabel: ContentMessage<{ extent: DisplayValue }>;
		viewName: string;
		caption: string;
		xAxis: string;
		yAxis: string;
		floorMarker: string;
		ballMarker: string;
		slopeReadout: ContentMessage<{ deltaG: DisplayValue }>;
	};
}

export interface GibbsInteractionsContent {
	hook: {
		question: string;
		options: readonly { id: string; label: string }[];
		explanation: string;
	};
	valley: {
		extentLabel: string;
	};
	squeeze: {
		pressureLabel: string;
		pressureScale: SliderScaleContent;
	};
	heat: {
		temperatureLabel: string;
		temperatureScale: SliderScaleContent;
	};
	sandbox: {
		temperatureLabel: string;
		pressureLabel: string;
		ballButton: string;
		readout: ContentMessage<{
			extent: DisplayValue;
			kp: DisplayValue;
			deltaG0: DisplayValue;
		}>;
	};
}

export interface GibbsStoryContent extends ProseStoryContent<GibbsSceneId> {
	interactions: GibbsInteractionsContent;
	triView: GibbsTriViewContent;
}

/* --- Story 7 · The potential landscape inside a battery ------------- */

export type NernstSceneId =
	| 'hook'
	| 'two-heights'
	| 'the-ladder'
	| 'nernst-slope'
	| 'discharge'
	| 'dead-battery'
	| 'concentration-cell'
	| 'sandbox';

export interface NernstTriViewContent {
	defaultAriaLabel: string;
	liveSummary: ContentMessage<{ emf: DisplayValue }>;
	synchronizedState: string;
	cell: {
		ariaLabel: string;
		viewName: string;
		caption: string;
		zincLabel: string;
		copperLabel: string;
		bridgeLabel: string;
		voltmeterLabel: ContentMessage<{ emf: DisplayValue }>;
		zincConcLabel: ContentMessage<{ molar: DisplayValue }>;
		copperConcLabel: ContentMessage<{ molar: DisplayValue }>;
	};
	ions: {
		ariaLabel: string;
		viewName: string;
		caption: string;
		zincIon: string;
		copperIon: string;
		electronTag: string;
		dissolveTag: string;
		depositTag: string;
	};
	ladder: {
		ariaLabel: ContentMessage<{ emf: DisplayValue }>;
		viewName: string;
		caption: string;
		yAxis: string;
		zincRung: string;
		copperRung: string;
		gapLabel: ContentMessage<{ emf: DisplayValue }>;
		sheLabel: string;
	};
}

export interface NernstInteractionsContent {
	hook: {
		question: string;
		options: readonly { id: string; label: string }[];
		explanation: string;
	};
	nernstSlope: {
		zincLabel: string;
		copperLabel: string;
		readout: ContentMessage<{ emf: DisplayValue; deltaG: DisplayValue }>;
	};
	discharge: {
		playButton: string;
		pauseButton: string;
		resetButton: string;
		readout: ContentMessage<{ depth: DisplayValue; emf: DisplayValue }>;
	};
	concentrationCell: {
		ratioLabel: string;
		readout: ContentMessage<{ ratio: DisplayValue; emf: DisplayValue }>;
	};
	sandbox: {
		zincLabel: string;
		copperLabel: string;
		temperatureLabel: string;
		readout: ContentMessage<{ emf: DisplayValue; deltaG: DisplayValue }>;
	};
}

export interface NernstStoryContent extends ProseStoryContent<NernstSceneId> {
	interactions: NernstInteractionsContent;
	triView: NernstTriViewContent;
}

/* --- Story 8 · The concentration countdown -------------------------- */

export type KineticsSceneId =
	| 'hook'
	| 'watch-it-fall'
	| 'half-life'
	| 'fingerprints'
	| 'rate-law'
	| 'carbon-clock'
	| 'not-all-equal'
	| 'sandbox';

export interface KineticsTriViewContent {
	defaultAriaLabel: string;
	liveSummary: ContentMessage<{ concentration: DisplayValue; timeS: DisplayValue }>;
	synchronizedState: string;
	beaker: {
		ariaLabel: ContentMessage<{
			concentration: DisplayValue;
			normalizedRate: DisplayValue;
		}>;
		viewName: string;
		caption: string;
		bubbleTag: string;
		concentrationLabel: ContentMessage<{ concentration: DisplayValue }>;
		timeLabel: ContentMessage<{ timeS: DisplayValue }>;
	};
	molecules: {
		ariaLabel: ContentMessage<{
			reactantCount: DisplayValue;
			waterCount: DisplayValue;
			oxygenCount: DisplayValue;
		}>;
		viewName: string;
		caption: string;
		reactantLabel: string;
		waterLabel: string;
		oxygenLabel: string;
	};
	clock: {
		ariaLabel: ContentMessage<{ order: DisplayValue }>;
		viewName: string;
		caption: string;
		xAxis: string;
		yAxis: string;
		halfLifeMarker: string;
		currentMarker: string;
		orderTag: ContentMessage<{ order: DisplayValue }>;
	};
}

export interface KineticsInteractionsContent {
	hook: {
		question: string;
		options: readonly { id: string; label: string }[];
		explanation: string;
	};
	watchItFall: {
		playButton: string;
		pauseButton: string;
		resetButton: string;
	};
	fingerprints: {
		orderLabel: string;
		orderNames: readonly [string, string, string];
		readout: ContentMessage<{ first: DisplayValue; second: DisplayValue; third: DisplayValue }>;
	};
	carbonClock: {
		fractionLabel: string;
		readout: ContentMessage<{ percent: DisplayValue; years: DisplayValue }>;
	};
	sandbox: {
		orderLabel: string;
		kLabel: string;
		kUnit: ContentMessage<{ order: DisplayValue }>;
		c0Label: string;
		readout: ContentMessage<{ halfLife: DisplayValue }>;
	};
}

export interface KineticsStoryContent extends ProseStoryContent<KineticsSceneId> {
	interactions: KineticsInteractionsContent;
	triView: KineticsTriViewContent;
}

/* --- Story 9 · Molecules over the mountain --------------------------- */

export type ArrheniusSceneId =
	| 'hook'
	| 'two-populations'
	| 'the-tail'
	| 'arrhenius-law'
	| 'rule-of-thumb'
	| 'life-runs-on-it'
	| 'two-point'
	| 'sandbox';

export interface ArrheniusTriViewContent {
	defaultAriaLabel: string;
	liveSummary: ContentMessage<{
		temperatureC: DisplayValue;
		eaKJPerMol: DisplayValue;
		tailShare: DisplayValue;
	}>;
	synchronizedState: string;
	scene: {
		ariaLabel: ContentMessage<{
			coldTemperatureC: DisplayValue;
			hotTemperatureC: DisplayValue;
		}>;
		viewName: string;
		caption: string;
		coldTag: string;
		hotTag: string;
		temperatureLabel: ContentMessage<{ temperatureC: DisplayValue }>;
	};
	collisions: {
		ariaLabel: ContentMessage<{
			temperatureC: DisplayValue;
			eaKJPerMol: DisplayValue;
			tailShare: DisplayValue;
			highlighted: DisplayValue;
			total: DisplayValue;
		}>;
		viewName: string;
		caption: string;
		slowLabel: string;
		fastLabel: string;
		barrierTag: string;
		crossingReadout: ContentMessage<{
			tailShare: DisplayValue;
			highlighted: DisplayValue;
			total: DisplayValue;
		}>;
	};
	distribution: {
		ariaLabel: ContentMessage<{ temperatureC: DisplayValue }>;
		viewName: string;
		caption: string;
		xAxis: string;
		yAxis: string;
		tailLabel: string;
		thresholdLabel: string;
		coldCurve: string;
		hotCurve: string;
	};
}

export interface ArrheniusInteractionsContent {
	hook: {
		question: string;
		options: readonly { id: string; label: string }[];
		explanation: string;
	};
	theTail: {
		temperatureLabel: string;
		temperatureScale: SliderScaleContent;
		readout: ContentMessage<{ tailShare: DisplayValue; boost: DisplayValue }>;
	};
	ruleOfThumb: {
		eaLabel: string;
		readout: ContentMessage<{ ea: DisplayValue; rise: DisplayValue }>;
	};
	twoPoint: {
		readout: ContentMessage<{ ea: DisplayValue }>;
	};
	sandbox: {
		temperatureLabel: string;
		eaLabel: string;
		readout: ContentMessage<{
			tailShare: DisplayValue;
			doubling: DisplayValue;
			chirps: DisplayValue;
		}>;
	};
}

export interface ArrheniusStoryContent extends ProseStoryContent<ArrheniusSceneId> {
	interactions: ArrheniusInteractionsContent;
	triView: ArrheniusTriViewContent;
}

/* --- Story 10 · The shortcut that moves no valley --------------------- */

export type CatalystSceneId =
	| 'hook'
	| 'the-pass'
	| 'lower-pass'
	| 'both-ways'
	| 'unconsumed'
	| 'enzymes'
	| 'no-free-lunch'
	| 'sandbox';

export type CatalystKind = 'none' | 'iodide' | 'catalase';

export interface CatalystTriViewContent {
	defaultAriaLabel: string;
	liveSummary: ContentMessage<{ ea: DisplayValue; boost: DisplayValue }>;
	synchronizedState: string;
	bench: {
		ariaLabel: string;
		viewName: string;
		caption: string;
		plainTag: string;
		catalyzedTag: string;
		bubbleRate: ContentMessage<{ boost: DisplayValue }>;
	};
	surface: {
		viewName: string;
		states: Readonly<
			Record<
				CatalystKind,
				{
					ariaLabel: string;
					caption: string;
					catalystLabel: string;
					reactantLabel: string;
					productLabel: string;
					cycleTag: string;
				}
			>
		>;
	};
	profile: {
		ariaLabel: ContentMessage<{ ea: DisplayValue }>;
		viewName: string;
		caption: string;
		xAxis: string;
		yAxis: string;
		plainCurve: string;
		catalyzedCurve: string;
		eaMarker: string;
		deltaHMarker: string;
	};
}

export interface CatalystInteractionsContent {
	hook: {
		question: string;
		options: readonly { id: string; label: string }[];
		explanation: string;
	};
	lowerPass: {
		catalystLabel: string;
		catalystNames: readonly [string, string, string];
		readout: ContentMessage<{ ea: DisplayValue; boost: DisplayValue }>;
	};
	bothWays: {
		readout: ContentMessage<{ forwardBoost: DisplayValue; reverseBoost: DisplayValue }>;
	};
	sandbox: {
		eaLabel: string;
		temperatureLabel: string;
		readout: ContentMessage<{
			boost: DisplayValue;
			ea: DisplayValue;
			uncatalyzedFactor: DisplayValue;
			catalyzedFactor: DisplayValue;
		}>;
	};
}

export interface CatalystStoryContent extends ProseStoryContent<CatalystSceneId> {
	interactions: CatalystInteractionsContent;
	triView: CatalystTriViewContent;
}

/* --- Story 11 · The atomic fingerprint ------------------------------ */

export type HydrogenSpectrumSceneId =
	| 'hook'
	| 'split-the-light'
	| 'measure-the-lines'
	| 'energy-steps'
	| 'rydberg-key'
	| 'three-families'
	| 'fingerprint'
	| 'sandbox';

export type CO2InfraredSceneId =
	| 'hook'
	| 'three-motions'
	| 'silent-stretch'
	| 'dipole-rule'
	| 'read-the-spectrum'
	| 'fingerprint-region'
	| 'sandbox';

export interface CO2InfraredTriViewContent {
	defaultAriaLabel: string;
	liveSummary: ContentMessage<{
		mode: string;
		wavenumberCm: DisplayValue;
		wavelengthUm: DisplayValue;
		irActive: boolean;
	}>;
	synchronizedState: string;
	modeLabel: string;
	wavenumberLabel: string;
	wavelengthLabel: string;
	activityLabel: string;
	activityNames: { active: string; silent: string };
	instrument: {
		ariaLabel: ContentMessage<{ mode: string; wavenumberCm: DisplayValue; irActive: boolean }>;
		viewName: string;
		caption: string;
		beamLabel: string;
		sampleLabel: string;
		detectorLabel: string;
	};
	molecule: {
		ariaLabel: ContentMessage<{ mode: string; amplitude: DisplayValue }>;
		viewName: string;
		caption: string;
		carbonLabel: string;
		oxygenLabel: string;
		bondLabel: string;
		modeNames: Record<
			CO2InfraredSceneId | 'symmetric-stretch' | 'bend' | 'asymmetric-stretch',
			string
		>;
	};
	spectrum: {
		ariaLabel: ContentMessage<{ mode: string; wavenumberCm: DisplayValue; irActive: boolean }>;
		viewName: string;
		caption: string;
		xAxis: string;
		yAxis: string;
		selectedBand: string;
		activeBand: string;
		silentBand: string;
	};
}

export interface CO2InfraredInteractionsContent {
	hook: {
		question: string;
		options: readonly { id: string; label: string }[];
		explanation: string;
	};
	mode: {
		label: string;
		ariaLabel: string;
		readout: ContentMessage<{
			mode: string;
			wavenumberCm: DisplayValue;
			wavelengthUm: DisplayValue;
			irActive: boolean;
		}>;
	};
	amplitude: {
		label: string;
		ariaLabel: string;
	};
}

export interface CO2InfraredStoryContent extends ProseStoryContent<CO2InfraredSceneId> {
	interactions: CO2InfraredInteractionsContent;
	triView: CO2InfraredTriViewContent;
}

export interface HydrogenSpectrumTriViewContent {
	defaultAriaLabel: string;
	liveSummary: ContentMessage<{
		upperN: DisplayValue;
		lowerN: DisplayValue;
		wavelengthNm: DisplayValue;
		region: DisplayValue;
	}>;
	synchronizedState: string;
	transitionLabel: string;
	wavelengthLabel: string;
	photonEnergyLabel: string;
	regionNames: Record<'ultraviolet' | 'visible' | 'infrared', string>;
	tube: {
		ariaLabel: ContentMessage<{ wavelengthNm: DisplayValue; region: DisplayValue }>;
		viewName: string;
		caption: string;
		tubeLabel: string;
		gratingLabel: string;
		lightLabel: string;
	};
	levels: {
		ariaLabel: ContentMessage<{
			upperN: DisplayValue;
			lowerN: DisplayValue;
			energyEv: DisplayValue;
			wavelengthNm: DisplayValue;
			region: DisplayValue;
			isVisible: boolean;
		}>;
		viewName: string;
		caption: string;
		energyAxis: string;
		electronLabel: string;
		photonLabel: ContentMessage<{ wavelengthNm: DisplayValue }>;
	};
	spectrum: {
		ariaLabel: ContentMessage<{
			upperN: DisplayValue;
			lowerN: DisplayValue;
			wavelengthNm: DisplayValue;
			region: DisplayValue;
			isVisible: boolean;
		}>;
		viewName: string;
		caption: string;
		xAxis: string;
		selectedLine: string;
		seriesNames: Record<'Lyman' | 'Balmer' | 'Paschen' | 'other', string>;
	};
}

export interface HydrogenSpectrumInteractionsContent {
	hook: {
		question: string;
		options: readonly { id: string; label: string }[];
		explanation: string;
	};
	measure: {
		upperLevelLabel: string;
		readout: ContentMessage<{
			upperN: DisplayValue;
			wavelengthNm: DisplayValue;
			photonEnergyEv: DisplayValue;
		}>;
	};
	series: {
		lowerLevelLabel: string;
		readout: ContentMessage<{
			series: DisplayValue;
			wavelengthNm: DisplayValue;
			region: DisplayValue;
		}>;
	};
	sandbox: {
		upperLevelLabel: string;
		lowerLevelLabel: string;
		readout: ContentMessage<{
			transition: DisplayValue;
			wavelengthNm: DisplayValue;
			photonEnergyEv: DisplayValue;
			region: DisplayValue;
		}>;
	};
}

export interface HydrogenSpectrumStoryContent extends ProseStoryContent<HydrogenSpectrumSceneId> {
	interactions: HydrogenSpectrumInteractionsContent;
	triView: HydrogenSpectrumTriViewContent;
}
