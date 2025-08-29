# Design System — Clean, Modern, Minimalist (Tailwind + HeroUI)

## Principles
- **Clean**: content-first canvas with minimal chrome
- **Modern**: subtle motion, consistent spacing, clear hierarchy
- **Minimalist**: restrained color, purposeful typography
- **Responsive**: mobile-first layouts that scale gracefully

## Tailwind Token Mapping
Define CSS variables (light/dark) then map to Tailwind theme.

```css
:root {
  --color-primary: #7C3AED;
  --color-on-primary: #FFFFFF;
  --color-surface: #FFFFFF;
  --color-on-surface: #0F172A;
  --color-outline: #CBD5E1;
  --elevation-1: 0 1px 2px rgba(2,6,23,.06);
  --radius-l: 12px;
}
[data-theme="dark"] {
  --color-primary: #A78BFA;
  --color-on-primary: #1E1B4B;
  --color-surface: #0B1020;
  --color-on-surface: #E2E8F0;
  --color-outline: #334155;
}
```

```js
// tailwind.config.js (excerpt)
export default {
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        surface: "var(--color-surface)",
        on: {
          primary: "var(--color-on-primary)",
          surface: "var(--color-on-surface)",
        },
        outline: "var(--color-outline)",
      },
      boxShadow: {
        m1: "var(--elevation-1)",
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
- Neutral surfaces, clear contrast, gentle rounded corners.

