import type { LocaleCode, SaltSplitStoryContent } from '../../types';
import en from './en';
import zhCN from './zh-CN';

export { en as enSaltSplitContent, zhCN as zhCNSaltSplitContent };

export const saltSplitContentByLocale: Readonly<Record<LocaleCode, SaltSplitStoryContent>> = {
	'zh-CN': zhCN,
	en
};

export function getSaltSplitContent(locale: LocaleCode): SaltSplitStoryContent {
	return saltSplitContentByLocale[locale];
}
