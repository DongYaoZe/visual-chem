import type { LocaleCode } from '../../types';
import { enCoolingCurveContent } from './en';
import { zhCNCoolingCurveContent } from './zh-CN';

export { enCoolingCurveContent, zhCNCoolingCurveContent };

export function getCoolingCurveContent(locale: LocaleCode) {
	return locale === 'en' ? enCoolingCurveContent : zhCNCoolingCurveContent;
}
