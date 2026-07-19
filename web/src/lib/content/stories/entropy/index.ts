import type { EntropyStoryContent, LocaleCode } from '../../types';
import en from './en';
import zhCN from './zh-CN';

export { en as enEntropyContent, zhCN as zhCNEntropyContent };

export const entropyContentByLocale: Readonly<Record<LocaleCode, EntropyStoryContent>> = {
	'zh-CN': zhCN,
	en
};

export function getEntropyContent(locale: LocaleCode): EntropyStoryContent {
	return entropyContentByLocale[locale];
}
