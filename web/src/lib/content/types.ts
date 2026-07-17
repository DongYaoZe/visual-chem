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
		stories: readonly [HomeStoryCardContent, HomeStoryCardContent, HomeStoryCardContent];
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
