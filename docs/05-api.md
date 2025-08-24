# API — Supabase Edge Functions (Deno)

All endpoints expect a valid Supabase JWT (from the frontend) unless reading a public/shared map.

## Endpoints

### POST `/ingest/web`
**Body**
```json
{ "projectId": "uuid", "url": "https://example.com/article" }
```
**Response**
```json
{ "extraction": { "title": "...", "text": "...", "sections": [...] } }
```
Notes: Fetch HTML, sanitize, extract with a Readability-like algorithm; return preview.

### POST `/ingest/youtube`
**Body**
```json
{ "projectId": "uuid", "videoUrl": "https://youtu.be/ID" }
```
**Response**
```json
{ "title": "...", "transcript": [{ "start": 12.3, "dur": 4.2, "text": "..." }], "chapters": [...] }
```

### POST `/ingest/pdf`
**Body** (upload to Storage first; then call function)
```json
{ "projectId": "uuid", "storagePath": "uploads/abc.pdf" }
```
**Response**
```json
{ "title": "Extracted or filename", "text": "...", "pages": [{ "n":1, "text":"..." }] }
```

### POST `/ingest/doc`
```json
{ "projectId": "uuid", "storagePath": "uploads/abc.docx" }
```

### POST `/ai/outline`
**Body**
```json
{
  "projectId": "uuid",
  "sourceType": "web|youtube|pdf|doc|text",
  "payload": { "text": "...", "sections": [], "transcript": [] },
  "options": { "maxDepth": 3, "maxSiblings": 6, "mode": "extract|summarize" }
}
```
**Response**
```json
{ "map": { /* mind map JSON */ }, "confidence": 0.86, "notes": "..." }
```

### POST `/maps`
Create a blank map.
```json
{ "projectId": "uuid", "title": "New Map" }
```

### GET `/maps/:id`
Returns map JSON and metadata.

### PATCH `/maps/:id`
Partial updates (title, theme, map_json diffs).

### POST `/export/opml`
Input: map JSON; Output: OPML as file in Storage with signed URL.

## Errors
- 400 invalid input
- 401 auth required
- 403 forbidden (RLS)
- 429 rate limited
- 500 internal error

## Edge Function Scaffold (Deno)
```ts
// supabase/functions/ai-outline/index.ts
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const { payload, options } = await req.json();
    // 1) chunk text  2) call LLM  3) assemble outline
    // return Response.json({ map, confidence: 0.82 });
    return new Response(JSON.stringify({ ok: true }), { headers: { "content-type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { "content-type": "application/json" } });
  }
});
```

