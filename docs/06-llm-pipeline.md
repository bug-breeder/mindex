# LLM Pipeline — Ingestion → Outline

## Design Goals
- **Faithful** to source when in *Extract* mode; **helpfully concise** in *Summarize*.
- **Hierarchical**: headings → sections → bullets → sub-bullets become tree nodes.
- **Grounded**: include `meta.sourceSpan` or timestamps for traceability.
- **Cost-aware**: chunking + map-reduce + cache by content hash.

## Steps
1. **Normalize**: collapse whitespace, strip boilerplate, remove nav/ads.
2. **Segment**:
   - Web/PDF/DOC: detect headings (H1–H6 or size/weight), build section spans.
   - YouTube: use transcript chunks and chapters; merge small utterances.
3. **Chunk**: size to token budget with overlap. Preserve section boundaries.
4. **Outline (Map Phase)**: for each chunk, ask the model to propose nodes, preserving quotes (extract) or concise paraphrase (summarize).
5. **Merge (Reduce Phase)**: deduplicate and reconcile headings; limit siblings and depth based on `options`.
6. **Post-process**: assign branch colors, compute initial layout, attach source spans/timecodes.
7. **Confidence**: compute heuristics (coverage %, overlap conflicts, # of quotes kept).

## Prompt Templates (sketch)
**System**
```
You convert structured content into a hierarchical mind map JSON.
Return valid JSON only. Do not invent facts. Preserve quotes where marked.
Schema: {id, title, root:{id,topic,children[],notes,url,tags,expanded,meta:{timecode,sourceSpan}}}
```
**User (extract)**
```
Title: {{title}}
Mode: extract (quote exact phrases when possible)
Depth: {{maxDepth}}  Max siblings per level: {{maxSiblings}}

Sections:
{{#each sections}}
[{{start}}..{{end}}] {{heading}}
{{text}}
{{/each}}
```
**User (summarize)** is the same but asks for concise paraphrase and de-duplication.

## Hallucination Controls
- Provide explicit **source spans**; require that every node map to a span or timecode.
- Disallow new proper nouns unless present in the span.
- Temperature low; top_p low; enforce JSON schema via response validation.
- Surface a **confidence** banner in the UI with “Review Sources” CTA.

## Multi-Source Merge
- When multiple sources are provided, create top-level branches per source and optionally a synthesized “Unified Summary” branch (explicitly labeled).

## Evaluation
- Spot checks: coverage (#source tokens represented), fidelity (exact quotes), structure quality.
- Human-in-the-loop: “Promote to root”, “Merge similar nodes”, “Split branch” actions instrumented.

