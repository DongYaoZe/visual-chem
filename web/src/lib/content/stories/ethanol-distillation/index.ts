import type { EthanolDistillationStoryContent, LocaleCode } from '../../types';
import en from './en';
import zhCN from './zh-CN';

export { en as enEthanolDistillationContent, zhCN as zhCNEthanolDistillationContent };

export const ethanolDistillationContentByLocale: Readonly<
	Record<LocaleCode, EthanolDistillationStoryContent>
> = {
	'zh-CN': zhCN,
	en
};

export function getEthanolDistillationContent(locale: LocaleCode): EthanolDistillationStoryContent {
	return ethanolDistillationContentByLocale[locale];
}
