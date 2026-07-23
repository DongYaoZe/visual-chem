import type { CatalystStoryContent, LocaleCode } from '../../types';
import en from './en';
import zhCN from './zh-CN';

export { en as enCatalystContent, zhCN as zhCNCatalystContent };

export const catalystContentByLocale: Readonly<Record<LocaleCode, CatalystStoryContent>> = {
	'zh-CN': zhCN,
	en
};

export function getCatalystContent(locale: LocaleCode): CatalystStoryContent {
	return catalystContentByLocale[locale];
}
