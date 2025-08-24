# MindCanvas — Product Docs
**Date:** 2025-08-24

These documents define the product specs, architecture, design system, data model, APIs, LLM pipeline, roadmap, and acceptance criteria for **MindCanvas** — a web app that converts web pages, YouTube videos, PDFs, and DOC/DOCX into editable mind maps. The app emphasizes a **beautiful, simple, modern UI** inspired by **Material 3 (Expressive)** and an implementation stack of **React + Vite**, **Tailwind CSS**, **HeroUI**, **Zustand**, **TanStack React Query**, **Mind‑Elixir**, **Yarn**, and a **Supabase** backend (Auth, Postgres, Storage, Edge Functions).

> Strategy: build a robust **renderer/editor** first (feature‑complete, delightful interactions), then layer in AI ingestion and outlining.

## What’s included
- `01-product-spec.md` — goals, personas, UX, requirements, KPIs
- `02-architecture.md` — system architecture, flows, sequences, security
- `03-design-system.md` — Material 3 Expressive tokens mapped to Tailwind + component specs
- `04-data-model.md` — Postgres schema (Supabase), JSON schemas, RLS
- `05-api.md` — Edge Function endpoints + payload contracts
- `06-llm-pipeline.md` — ingestion → chunking → outline construction → confidence
- `07-implementation-roadmap.md` — milestones, deliverables, tracked risks
- `08-acceptance-criteria.md` — user stories and testable acceptance criteria
- `09-repo-structure.md` — monorepo layout, envs, scripts, CI guardrails
- `10-keyboard-shortcuts.md` — editor hotkeys (XMind‑like)
- `11-test-plan.md` — QA scenarios, perf budgets, accessibility checks

## Quick Start (dev)
1. Create a Supabase project; note `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
2. Copy schemas from `04-data-model.md` into SQL editor; apply RLS policies.
3. Create Edge Functions from `05-api.md` scaffolds.
4. Clone web app and install with `yarn` (Vite + React + Tailwind + HeroUI + Zustand + React Query).
5. Configure Tailwind tokens from `03-design-system.md` and the `.env` variables from `09-repo-structure.md`.
6. Run `yarn dev` and open the Editor. Import a local PDF to test renderer (AI off).

## Naming
“MindCanvas” is a codename. Rename freely—no code identifiers are coupled to this name.
