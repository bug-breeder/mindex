# Acceptance Criteria — User Stories

## Create & Edit
- [ ] User can create a blank map and see a **named root** node.
- [ ] Pressing **Enter** creates a sibling; **Tab** creates a child; **Shift+Tab** outdents.
- [ ] Drag-and-drop reorders nodes with clear indicators.
- [ ] Undo/redo reverts structural and content edits.
- [ ] Export to JSON reproduces the on-screen structure exactly.

## Import & Preview
- [ ] User can paste a **URL** and see a text preview (title + sections).
- [ ] User can paste a **YouTube URL** and see available transcript or a notice if unavailable.
- [ ] Uploading a **PDF/DOCX** shows extracted text by page/section.
- [ ] User can select which sections to include before AI runs.

## AI Outline
- [ ] In **Extract** mode, nodes contain direct quotes (where available) with **source spans/timecodes**.
- [ ] In **Summarize** mode, nodes paraphrase concisely and avoid duplication.
- [ ] Depth and sibling caps are respected.
- [ ] Confidence score appears; low scores show a review prompt.

## Sharing & Export
- [ ] Share links work for viewers without accounts (if enabled) but cannot edit.
- [ ] OPML/Markdown exports validate against standard readers.
- [ ] PNG/SVG exports match the visible theme and layout.

## Performance & A11y
- [ ] Panning/zooming remains smooth with 1,000 nodes.
- [ ] All controls are reachable by keyboard; focus states are visible.
- [ ] Color contrast ≥ AA for text and key UI elements.

