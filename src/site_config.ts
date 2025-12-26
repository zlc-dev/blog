type SiteConfig = {
    site: string;
    base: string;
    giscus: {
        data_repo: string,
        data_repo_id: string,
        data_category: string,
        data_category_id: string
    }
}

export const SITE_CONFIG = {
    site: "https://zlc-dev.github.io",
    base: "/blog",
    giscus: {
        data_repo: "zlc-dev/blog",
        data_repo_id: "R_kgDOQvQ5cA",
        data_category: "Announcements",
        data_category_id: "DIC_kwDOQvQ5cM4C0Qvk",
    }
} as const satisfies SiteConfig;
