# Test Plan — QA, Performance, Accessibility

## Functional
- CRUD maps, import sources, preview extraction, run AI outline, export formats
- Error states for missing transcripts, blocked fetches, oversize files

## Performance Budgets
- Renderer: 60fps pan/zoom @ 1k nodes on a mid-tier laptop
- Initial load TTI under a reasonable threshold; tree diffing avoids full rerenders
- Edge functions < reasonable compute time; retries with exponential backoff

## Accessibility
- Keyboard parity for all editing operations
- Screen reader labels on toolbar actions
- Contrast AA checks on themes

## Security
- RLS policies validated; attempts to access others’ maps are denied
- Signed URLs for Storage; tokens expire
- Rate limits on ingestion and AI endpoints

## Regression Suite
- Snapshot maps: import → AI → edit → export → re-import → identical structure
- JSON schema validation on every map save

