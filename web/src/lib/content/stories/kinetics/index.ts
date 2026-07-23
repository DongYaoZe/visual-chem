import type { KineticsStoryContent, LocaleCode } from '../../types';
import en from './en';
import zhCN from './zh-CN';

export { en as enKineticsContent, zhCN as zhCNKineticsContent };

export const kineticsContentByLocale: Readonly<Record<LocaleCode, KineticsStoryContent>> = {
	'zh-CN': zhCN,
	en
};

export function getKineticsContent(locale: LocaleCode): KineticsStoryContent {
	return kineticsContentByLocale[locale];
}
