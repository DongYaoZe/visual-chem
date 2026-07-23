import type { ArrheniusStoryContent, LocaleCode } from '../../types';
import en from './en';
import zhCN from './zh-CN';

export { en as enArrheniusContent, zhCN as zhCNArrheniusContent };

export const arrheniusContentByLocale: Readonly<Record<LocaleCode, ArrheniusStoryContent>> = {
	'zh-CN': zhCN,
	en
};

export function getArrheniusContent(locale: LocaleCode): ArrheniusStoryContent {
	return arrheniusContentByLocale[locale];
}
