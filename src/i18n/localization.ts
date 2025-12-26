import type I18nKey from "./i18nKey.ts"
import { type SupportedLanguages, DEFAULT_LANGUAGE, FALLBACK_LAN } from "../i18n_config.ts";
import { en } from "./localizations/en";
import { zh } from "./localizations/zh";

export type Localization = {
    [K in I18nKey]?: string
};

export type DefaultLocalization = {
    [K in I18nKey]: string
};

type Lan2LocalMapType = {
    [L in typeof DEFAULT_LANGUAGE]: Localization & DefaultLocalization;
} & {
    [L in Exclude<SupportedLanguages, typeof DEFAULT_LANGUAGE>]?: Localization;
};

const LAN_TO_LOCAL_MAP: Lan2LocalMapType = {
    "zh-cn": zh,
    en: en
};

const DEFAULT_LOCALIZATION = LAN_TO_LOCAL_MAP[DEFAULT_LANGUAGE];

export function getDefaultLocalization(): DefaultLocalization {
	return DEFAULT_LOCALIZATION;
}

export function getLocalization(lang: SupportedLanguages): Localization | undefined {
    return LAN_TO_LOCAL_MAP[lang];
}

export function i18n(lang: SupportedLanguages, key: I18nKey): string {
    if (lang == DEFAULT_LANGUAGE) {
        return getDefaultLocalization()[key];
    }
    const loc = getLocalization(lang);
    if (loc?.[key] !== undefined) {
        return loc[key]!;
    }

    const fb = FALLBACK_LAN[lang] ?? DEFAULT_LANGUAGE;
    return i18n(fb, key);
}
