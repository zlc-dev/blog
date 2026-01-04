export const THEME_NAMES = ["light", "dark"];

export type ThemeName = typeof THEME_NAMES[number];

export const DEFAULT_THEME: ThemeName = "light";

export interface ThemeTokens {
    bg: {
        page: string;
        surface: string;
        dialog: string;
    };
    text: {
        primary: string;
        muted: string;
    };
    accent: {
        primary: string;
    };
    state: {
        selected: string;
        activated: string;
        disabled: string;
    };
    misc: {
        menuText: string;
        bannerText: string;
    };
}

export const THEMES: Record<ThemeName, ThemeTokens> = {
    light: {
        bg: {
            page: "rgb(221, 232, 233)",
            surface: "white",
            dialog: "rgb(222, 222, 222)",
        },
        text: {
            primary: "rgb(38, 38, 38)",
            muted: "#262626",
        },
        accent: {
            primary: "rgb(218, 168, 80)",
        },
        state: {
            selected: "rgb(191, 191, 191)",
            activated: "rgb(215, 215, 215)",
            disabled: "rgb(145, 145, 145)",
        },
        misc: {
            menuText: "white",
            bannerText: "white",
        },
    },

    dark: {
        bg: {
            page: "rgb(97, 131, 135)",
            surface: "rgb(38, 38, 38)",
            dialog: "rgb(83, 83, 83)",
        },
        text: {
            primary: "rgb(255, 255, 255)",
            muted: "#d9d9d9",
        },
        accent: {
            primary: "rgb(89, 226, 233)",
        },
        state: {
            selected: "rgb(158, 158, 158)",
            activated: "rgb(160, 160, 160)",
            disabled: "rgb(145, 145, 145)",
        },
        misc: {
            menuText: "white",
            bannerText: "white",
        },
    },
};

function checkTheme(name: string | null): ThemeName | undefined {
    switch(name) {
        case "light": return name;
        case "dark": return name;
    }
}

export function switchTheme() {
    let cur = getTheme() ?? DEFAULT_THEME;
    let idx = THEME_NAMES.indexOf(cur);
    let theme = THEME_NAMES[(idx + 1) % THEME_NAMES.length];
    setTheme(theme);
}

export function getTheme() {
    return checkTheme(localStorage.getItem("theme"));
}

export function setTheme(theme: ThemeName) {
    localStorage.setItem("theme", theme);
    document.documentElement.dataset.theme = theme;
}

export function firstSetTheme() {
    var theme = localStorage.getItem("theme");
    if (!(theme && theme in THEMES)) {
        theme = matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
    }
    localStorage.setItem("theme", theme);
    document.documentElement.dataset.theme = theme;
};
