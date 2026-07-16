import type { LocaleCode, SiteContent } from '../types';
import en from './en';
import zhCN from './zh-CN';

export { en as enSiteContent, zhCN as zhCNSiteContent };

export const siteContentByLocale: Readonly<Record<LocaleCode, SiteContent>> = {
	'zh-CN': zhCN,
	en
};

export function getSiteContent(locale: LocaleCode): SiteContent {
	return siteContentByLocale[locale];
}
