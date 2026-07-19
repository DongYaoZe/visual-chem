import type { GibbsStoryContent, LocaleCode } from '../../types';
import en from './en';
import zhCN from './zh-CN';

export { en as enGibbsContent, zhCN as zhCNGibbsContent };

export const gibbsContentByLocale: Readonly<Record<LocaleCode, GibbsStoryContent>> = {
	'zh-CN': zhCN,
	en
};

export function getGibbsContent(locale: LocaleCode): GibbsStoryContent {
	return gibbsContentByLocale[locale];
}
