import { SITE_CONFIG } from "./site_config";

export function joinPath(...parts: string[]): string {
    return (
        "/" +
        parts
            .filter(Boolean)
            .map(p => p.replace(/^\/+|\/+$/g, ""))
            .join("/")
    );
}

export function getRelativePath(path: string): string {
    return joinPath(SITE_CONFIG.base, path);
}
