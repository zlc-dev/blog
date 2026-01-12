type SiteConfig = {
    site: string;
    base: string;
    cdn: string;
    giscus: {
        data_repo: string;
        data_repo_id: string;
        data_category: string;
        data_category_id: string;
    };
    apperance: {
        banner_background: {
            url: string;
            credit: string;
        },
    };
}

export const SITE_CONFIG = {
    site: "https://zlc-dev.github.io",
    base: "/blog",
    cdn: "https://assets.h4zptr.top",
    giscus: {
        data_repo: "zlc-dev/blog",
        data_repo_id: "R_kgDOQvQ5cA",
        data_category: "Announcements",
        data_category_id: "DIC_kwDOQvQ5cM4C0Qvk",
    },
    apperance: {
        banner_background: {
            url: 'url("https://cn.bing.com/th?id=OHR.WiltshireDawn_ZH-CN2887906329_1920x1080.jpg")',
            credit: "© Bing"
        }
    }
} as const satisfies SiteConfig;
