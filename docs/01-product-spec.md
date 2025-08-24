# Product Spec — MindCanvas

## Vision
Turn any long-form content into a **clear, editable mind map**. Start with a world‑class mind map **renderer/editor**; add **AI ingestion + outlining** that respects the source and keeps users in control.

## Target Users & Personas
- **Students & Researchers** — Convert articles/lectures/papers into study maps.
- **Knowledge Workers** — Summarize reports, briefings, strategy docs.
- **Content Creators** — Outline scripts from web pages and video transcripts.
- **Consultants/PMs** — Turn mixed source decks/pdfs into meeting-ready maps.

## Primary Jobs-to-be-Done
1. Import content (URL, YouTube, PDF, DOCX) and get a **draft mind map** quickly.
2. **Edit**: add/rename nodes, reorder branches, attach notes/links, images.
3. **Organize**: collapse/expand, colorize, tag, mark progress/priority.
4. **Share/Export**: link sharing, export as JSON/OPML/Markdown/PNG/SVG.
5. **Iterate AI**: refine sections, merge/split branches, “explain like I’m 5,” etc.

## Non-Goals (initial)
- Real-time multi-user cursors (collaboration can come next).
- Offline-first; local cache is fine but full offline sync is later.
- Advanced diagram types (fishbone, org chart). Stick to classic mind mapping.

## Key Workflows
### 1) Create → Import → Draft Map
- Choose source: **Web URL / YouTube / PDF / DOCX / Paste text**
- Show **Extraction Preview** (title, sections, transcript with timestamps)
- AI creates a **hierarchical outline** → Render in canvas

### 2) Edit & Organize
- Node operations: add sibling/child, rename, delete, move, duplicate
- Node attributes: notes, URL, tags, priority, progress, color, icon
- Canvas: pan, zoom, fit to screen, auto-layout (left/right/balance), theme
- Inspector: node metadata & AI actions

### 3) Save & Share
- Auto-save to Supabase; **version snapshots** on major changes
- Export: JSON (internal), OPML, Markdown, PNG/SVG (via client render)
- Share link with **view/comment** roles (edit later)

## Functional Requirements (MVP)
- Supabase Auth (email + OAuth) and RLS-protected storage
- Project dashboard; create/edit/delete mind maps
- Mind map renderer using **Mind‑Elixir** with custom theming + gestures
- Local import: PDF/DOCX/TXT; URL and YouTube ingestion (Edge Function)
- LLM outline generation with configurable levels (depth/width caps)
- Deterministic “Extract” mode (quote-only) vs. “Summarize” mode (paraphrase)
- Export JSON/OPML/Markdown/PNG
- Basic sharing (private, link view, invite editors)

## KPIs
- **Render TTI** under perf budget; smooth pan/zoom at 60fps for 1k nodes
- **First map success rate** (draft map created without error)
- **Edit adoption** (avg. node edits per session)
- **Export/Share rate**
- **User satisfaction (CSAT) and re-use**

## Risks
- Inconsistent transcripts / paywalled content → fallbacks & user prompts
- Token costs for large files → chunking + map-reduce + caching
- Hallucinations → extraction-first, source links, confidence labels

