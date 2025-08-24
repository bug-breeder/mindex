# Design System — Material 3 (Expressive) via Tailwind

## Principles
- **Legible** content-first canvas, minimal chrome
- **Direct manipulation**: nodes feel tactile with subtle motion/elevation
- **Expressive color** accents for branches; accessible by default

## Tailwind Token Mapping
Define CSS variables (light/dark) then map to Tailwind theme.

```css
:root {
  --md-sys-color-primary: #6750A4;
  --md-sys-color-on-primary: #FFFFFF;
  --md-sys-color-surface: #FFFBFE;
  --md-sys-color-on-surface: #1D1B20;
  --md-sys-color-outline: #79747E;
  --md-sys-elevation-1: 0 1px 2px rgba(0,0,0,.08);
  --radius-l: 16px;
}
[data-theme="dark"] {
  --md-sys-color-primary: #D0BCFF;
  --md-sys-color-on-primary: #371E73;
  --md-sys-color-surface: #1C1B1F;
  --md-sys-color-on-surface: #E6E1E5;
  --md-sys-color-outline: #938F99;
}
```

```js
// tailwind.config.js (excerpt)
export default {
  theme: {
    extend: {
      colors: {
        primary: "var(--md-sys-color-primary)",
        surface: "var(--md-sys-color-surface)",
        on: {
          primary: "var(--md-sys-color-on-primary)",
          surface: "var(--md-sys-color-on-surface)",
        },
        outline: "var(--md-sys-color-outline)",
      },
      boxShadow: {
        m1: "var(--md-sys-elevation-1)",
      },
      borderRadius: {
        lg: "var(--radius-l)",
      }
    }
  }
}
```

## Components (HeroUI + Custom)
- **AppBar**: title, account menu, actions (Import, New Map, Export)
- **NavRail/Drawer**: Projects, Recent, Templates
- **Canvas**: Mind‑Elixir with custom theme; branch colors, rounded pills
- **Inspector**: Node title, notes, tags, link, AI actions, color picker
- **Floating Toolbar**: add sibling/child, collapse/expand, auto-layout, delete
- **Dialogs/Sheets**: Import, Share, Export, Settings
- **Toasts/Snackbars**: action confirmations
- **Empty States**: friendly prompts with CTA

## Canvas Interactions
- Zoom (Ctrl/Cmd + scroll), Pan (Space + drag), Fit (F), Center (C)
- Node drag’n’drop reorder; hover handles for precise drop targets
- Keyboard: Enter (sibling), Tab (child), Shift+Tab (outdent), Delete (remove)

## Accessibility
- Contrast AA minimums, focus rings, ARIA labels on controls
- Keyboard parity for node operations; tooltips disclose shortcuts
- Reduced motion option

## Theming
- Branch palettes choose accessible contrasting colors automatically.
- “Expressive” title typography and rounded, soft shapes on nodes.

