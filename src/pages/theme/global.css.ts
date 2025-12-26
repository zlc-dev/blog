import type { APIRoute } from "astro";
import { THEMES } from "../../theme.ts";

function generateCSS() {
    return Object.entries(THEMES)
        .map(([name, t]) => `
:root[data-theme="${name}"] {
    --color-bg-page: ${t.bg.page};
    --color-bg-surface: ${t.bg.surface};
    --color-bg-dialog: ${t.bg.dialog};

    --color-text-primary: ${t.text.primary};
    --color-text-muted: ${t.text.muted};

    --color-accent: ${t.accent.primary};
    --color-selected: ${t.state.selected};
    --color-activated: ${t.state.activated};
    --color-disabled: ${t.state.disabled};

    --color-menu-text: ${t.misc.menuText};
    --color-banner-text: ${t.misc.bannerText};
}
`).join("\n");
}

export const GET: APIRoute = () =>
    new Response(generateCSS(), {
        headers: {
            "Content-Type": "text/css",
            "Cache-Control": "public, max-age=31536000",
        },
    });
