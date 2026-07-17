import type { BoilingMapStoryContent, LocaleCode } from '../../types';
import en from './en';
import zhCN from './zh-CN';

export { en as enBoilingMapContent, zhCN as zhCNBoilingMapContent };

export const boilingMapContentByLocale: Readonly<Record<LocaleCode, BoilingMapStoryContent>> = {
	'zh-CN': zhCN,
	en
};

export function getBoilingMapContent(locale: LocaleCode): BoilingMapStoryContent {
	return boilingMapContentByLocale[locale];
}
