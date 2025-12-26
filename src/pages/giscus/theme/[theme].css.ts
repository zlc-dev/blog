import type { APIRoute } from "astro";
import { THEMES, type ThemeName } from "../../../theme.ts";

export function getStaticPaths() {
  return Object.keys(THEMES).map(theme => ({
    params: { theme },
  }));
}

export const GET: APIRoute = ({ params }) => {
  const theme = params.theme as ThemeName;
  const t = THEMES[theme];

  const css = `
main {
  --color-canvas-default: ${t.bg.surface};
  --color-canvas-overlay: ${t.bg.dialog};
  --color-canvas-subtle: ${t.bg.page};

  --color-fg-default: ${t.text.primary};
  --color-fg-muted: ${t.text.muted};

  --color-border-default: ${t.state.selected};

  --color-accent-fg: ${t.accent.primary};
  --color-accent-emphasis: ${t.accent.primary};
  --color-accent-subtle: ${t.state.selected};

  --color-btn-text: ${t.text.primary};
  --color-btn-bg: transparent;
  --color-btn-hover-bg: ${t.state.selected};
  --color-btn-active-bg: ${t.state.activated};
}

:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px ${t.accent.primary};
}
`;

  return new Response(css, {
    headers: {
      "Content-Type": "text/css",
      "Cache-Control": "public, max-age=31536000",
    },
  });
};
