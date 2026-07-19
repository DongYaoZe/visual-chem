import type { LocaleCode, NernstStoryContent } from '../../types';
import en from './en';
import zhCN from './zh-CN';

export { en as enNernstContent, zhCN as zhCNNernstContent };

export const nernstContentByLocale: Readonly<Record<LocaleCode, NernstStoryContent>> = {
	'zh-CN': zhCN,
	en
};

export function getNernstContent(locale: LocaleCode): NernstStoryContent {
	return nernstContentByLocale[locale];
}
