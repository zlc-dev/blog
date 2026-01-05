import { getCollection, type CollectionEntry } from "astro:content";
import { DEFAULT_LANGUAGE, FALLBACK_LANG, SUPPORTED_LANGUAGES, type SupportedLanguages } from "../i18n_config";

export type ParticalPostType = {
    main?: CollectionEntry<"posts">,
    i18n: {
        [L in SupportedLanguages]?: CollectionEntry<"posts">
    }
};

export type PostType = {
    main: CollectionEntry<"posts">,
    i18n: {
        [L in SupportedLanguages]?: CollectionEntry<"posts">
    }
};

export function str2locale(s: string): SupportedLanguages {
    return (SUPPORTED_LANGUAGES as readonly string[]).includes(s) 
                ? s as SupportedLanguages : DEFAULT_LANGUAGE;
}

export function langFallbackResult<T>(
    locale: SupportedLanguages,
    f: (locale: SupportedLanguages) => T | null
): T | null {
    const visited = new Set<SupportedLanguages>();
    let current: SupportedLanguages | undefined = locale;

    while (current !== undefined) {
        if (visited.has(current)) {
            break;
        }
        visited.add(current);

        const res = f(current);
        if (res !== null) {
            return res;
        }

        current = FALLBACK_LANG[current];
    }

    return null;
}

export async function getPosts(): Promise<PostType[]> {
    const posts_collection = await getCollection("posts");
    const map = new Map<string, ParticalPostType>();
    posts_collection.forEach(post => {
        let lang: SupportedLanguages;
        let id: string;
        let lang_id = post.id.split("/", 2);
        if (lang_id.length < 2) {
            lang = post.data.locale;
            id = post.id;
        } else {
            lang = str2locale(lang_id[0]);
            id = lang_id[1];
        }
        let entry = map.get(id);
        if (!entry) {
            entry = { i18n: {} };
            map.set(id, entry);
        }
        if (lang_id.length < 2) {
            entry.main = post;
        }
        entry.i18n[lang] = post;
    });
    return [...map.values()].filter(raw_post => raw_post.main !== undefined).map(rawPost => {
        const filled: PostType = {main: rawPost.main!, i18n: {}};

        for (const lang of SUPPORTED_LANGUAGES) {
            filled.i18n[lang] = langFallbackResult(
                lang,
                l => rawPost.i18n[l] ?? null
            ) ?? undefined;
        }

        return filled;
    });
}