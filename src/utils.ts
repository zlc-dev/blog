import { SITE_CONFIG } from "./site_config";

export function getRelativePath(path: string): string {
    return new URL(path, SITE_CONFIG.base).toString();
}
