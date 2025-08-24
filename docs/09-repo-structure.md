# Repo Structure, Env, and Scripts

## Layout
```
mindcanvas/
  apps/web/                 # Vite + React app
    src/
      components/
        canvas/             # Mind‑Elixir wrapper + theme
        inspector/
        toolbar/
      hooks/
      stores/               # Zustand stores
      api/                  # React Query hooks
      pages/
      styles/
    index.html
    vite.config.ts
    tailwind.config.js
  supabase/
    functions/
      ingest-web/
      ingest-youtube/
      ingest-pdf/
      ingest-doc/
      ai-outline/
      export-opml/
    migrations/
  packages/shared/          # shared types, schema guards
  .env.example
```

## Env Vars (`.env`)
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_APP_NAME=MindCanvas

# LLM Provider (Edge Functions)
LLM_PROVIDER=openai
LLM_API_KEY=
```

## Scripts
```
yarn dev         # start Vite
yarn build       # production build
yarn typecheck   # ts
yarn lint        # eslint
yarn format      # prettier
```

## Minimal Mind‑Elixir Wrapper (sketch)
```tsx
import { useEffect, useRef } from "react";
import MindElixir from "mind-elixir";
import "mind-elixir/dist/mind-elixir.css";

export function MindCanvas({ data, onChange }) {
  const ref = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const me = new MindElixir({
      el: ref.current,
      direction: MindElixir.direction.RIGHT,
      data,
    });
    me.init();
    me.bus.addListener("operation", () => onChange(me.getData()));
    instanceRef.current = me;
    return () => me.destroy();
  }, []);

  useEffect(() => {
    if (instanceRef.current) instanceRef.current.refresh(data);
  }, [data]);

  return <div ref={ref} className="h-full w-full" />;
}
```

## Zustand Store Shape (excerpt)
```ts
type MapState = {
  map: MindMapJson;
  selectedId?: string;
  history: MindMapJson[];
  setMap: (m: MindMapJson) => void;
  select: (id?: string) => void;
  undo: () => void;
  redo: () => void;
};
```

