export const SUPPORTED_LANGUAGES = [
    "zh-cn", 
    "en",
] as const;

export const DEFAULT_LANGUAGE = "zh-cn" satisfies SupportedLanguages;

export type SupportedLanguages =
    typeof SUPPORTED_LANGUAGES[number];

type FallbackMapType = {
    [L in typeof DEFAULT_LANGUAGE]?: undefined;
} & {
    [L in Exclude<SupportedLanguages, typeof DEFAULT_LANGUAGE>]?: Exclude<SupportedLanguages, L>
};

export const FALLBACK_LAN: FallbackMapType = {
    en: "zh-cn",
};
