import type { CO2InfraredStoryContent, LocaleCode } from '../../types';
import en from './en';
import zhCN from './zh-CN';

export { en as enCO2InfraredContent, zhCN as zhCNCO2InfraredContent };

export const co2InfraredContentByLocale: Readonly<Record<LocaleCode, CO2InfraredStoryContent>> = {
	'zh-CN': zhCN,
	en
};

export function getCO2InfraredContent(locale: LocaleCode): CO2InfraredStoryContent {
	return co2InfraredContentByLocale[locale];
}
