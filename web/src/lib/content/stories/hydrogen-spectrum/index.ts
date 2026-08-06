import type { HydrogenSpectrumStoryContent, LocaleCode } from '../../types';
import en from './en';
import zhCN from './zh-CN';

export { en as enHydrogenSpectrumContent, zhCN as zhCNHydrogenSpectrumContent };

export const hydrogenSpectrumContentByLocale: Readonly<
	Record<LocaleCode, HydrogenSpectrumStoryContent>
> = {
	'zh-CN': zhCN,
	en
};

export function getHydrogenSpectrumContent(locale: LocaleCode): HydrogenSpectrumStoryContent {
	return hydrogenSpectrumContentByLocale[locale];
}
