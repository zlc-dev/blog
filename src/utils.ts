import { SITE_CONFIG } from "./site_config";

export function joinPath(...parts: string[]): string {
    return (
        parts
            .filter(Boolean)
            .map(p => p.replace(/^\/+|\/+$/g, ""))
            .join("/")
    );
}

export function getRelativePath(path: string): string {
    return "/" + joinPath(SITE_CONFIG.base, path);
}

export function getAbsolutePath(path: string): string {
    return joinPath(SITE_CONFIG.site, getRelativePath(path));
}

export function getCDNPath(path: string): string {
    return joinPath(SITE_CONFIG.cdn, path);
}

export function getLocaleFromUrl(url: string, base: string = SITE_CONFIG.base): string | null {
    const u = new URL(url);
    base = base.replaceAll('/', '');
    const segments = u.pathname.split('/').filter(Boolean);
    if (base) {
        if (segments[0] !== base) return null;
        return segments[1] ?? null;
    }

    return segments[0] ?? null;
}
