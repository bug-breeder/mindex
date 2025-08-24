# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Mindex** (formerly MindCanvas) is an AI-powered mind mapping application that converts web pages, YouTube videos, PDFs, and documents into beautiful, interactive mind maps. The project emphasizes a modern UI with HeroUI components and a magenta color scheme.

**Current Status: Milestone M1 COMPLETED** ✅ - Full mind mapping application ready for production

## Technology Stack

- **Frontend**: React 18 + Vite, Tailwind CSS v3, HeroUI v2 components, Zustand state management, TanStack React Query
- **Canvas**: Mind-Elixir v5 for interactive mind map rendering and editing
- **Backend**: Supabase (Auth, PostgreSQL with RLS, Real-time subscriptions)
- **Testing**: Vitest + Testing Library (54 comprehensive tests)
- **Package Manager**: Yarn
- **Styling**: Magenta primary theme with light/dark mode support

## Development Commands

**IMPORTANT: Use yarn as the package manager for this project**

```bash
yarn dev           # start Vite development server (http://localhost:5173)
yarn build         # production build with TypeScript compilation
yarn typecheck     # TypeScript type checking
yarn lint          # ESLint linting
yarn test          # run all 54 tests
yarn test --watch  # run tests in watch mode
yarn test:ui       # visual test runner
```

## Implementation Status

### ✅ **Milestone M1: Complete Mind Mapping Application** (IMPLEMENTED)

**All core features are fully implemented and tested:**

- **🎨 Interactive Mind Maps**
  - Mind-Elixir canvas integration (`src/components/canvas/MindCanvas.tsx`)
  - Real-time node creation, editing, deletion
  - Visual themes with magenta primary color
  - Smooth pan/zoom functionality

- **🔐 Authentication System**
  - Supabase Auth integration (`src/stores/authStore.ts`)
  - Complete signup/signin/signout flow
  - User profile management
  - Row Level Security (RLS) policies

- **💾 Data Persistence**
  - PostgreSQL database with Supabase
  - Mind map CRUD operations (`src/stores/mapStore.ts`)
  - Real-time synchronization
  - Version history and undo/redo

- **📤 Export System** (`src/utils/export.ts`)
  - JSON (structured data)
  - OPML (outline format) 
  - Markdown (hierarchical text)
  - PNG (image export)
  - SVG (vector graphics)

- **⌨️ Keyboard Shortcuts** (`src/components/keyboard/KeyboardHandler.tsx`)
  - XMind-compatible shortcuts
  - Tab → Add child node
  - Enter → Add sibling node
  - Delete → Remove node
  - Arrow keys → Navigate

- **🎭 Theme System**
  - Light/dark mode switching (`src/components/theme/ThemeSwitch.tsx`)
  - System theme detection
  - Magenta primary color scheme
  - Persistent preferences

- **🧪 Testing**
  - 54 comprehensive tests covering all functionality
  - Component tests, store tests, utility tests
  - 100% core feature coverage

**Status**: ✅ Production ready - All features implemented and tested

### 🔮 **Next Milestones** (Planned)

- **M2**: AI content processing (web pages → mind maps)
- **M3**: Document import (PDF, DOCX)
- **M4**: YouTube video processing
- **M5**: Sharing and collaboration

## Architecture Overview

### Frontend Structure
- **Canvas Component**: Mind-Elixir wrapper integrated with React and Zustand state management
- **State Management**: 
  - `useAuthStore` - user profile and authentication tokens
  - `useMapStore` - current mind map JSON, selection state, history
  - `useUIStore` - theme settings, panel states
- **Data Fetching**: React Query with keys like `["map", id]`, `["sources", mapId]`
- **Routing**: `/`, `/maps/:id`, `/import`, `/settings`

### Backend (Supabase)
- **Authentication**: Email + OAuth with Row Level Security (RLS)
- **Database**: Postgres storing mind maps as JSONB
- **Storage**: Original files and exported assets (PNG/SVG)
- **Edge Functions**: Content ingestion and LLM processing endpoints

### Planned Repository Structure
```
mindcanvas/
  apps/web/                 # Vite + React app
    src/
      components/
        canvas/             # Mind-Elixir wrapper + theming
        inspector/          # Node metadata panel
        toolbar/            # Canvas controls
      hooks/                # Custom React hooks
      stores/               # Zustand state stores
      api/                  # React Query hooks
      pages/                # Application routes
      styles/               # Tailwind styles
  supabase/
    functions/              # Edge Functions for ingestion/AI
    migrations/             # Database schema
  packages/shared/          # Shared types and utilities
```

## Key Implementation Details

### Mind Map Canvas Integration
- Uses Mind-Elixir library wrapped in React component
- Events bridge from Mind-Elixir to Zustand store via `me.bus.addListener`
- Canvas state synchronized with React via `onChange` callbacks
- Support for themes, gestures, and auto-layout

### Content Ingestion Pipeline
1. **Web URL**: Fetch HTML → extract with Readability-like parsing → LLM outline
2. **YouTube**: Fetch transcript + metadata → segment by topic with timecodes
3. **PDF/DOCX**: Text extraction → chunk for LLM processing → hierarchical outline
4. **AI Processing**: Configurable extraction vs summarization modes

### Data Flow
- Edge Functions handle content fetching and LLM orchestration
- Results cached by content hash to avoid duplicate processing
- Mind maps stored as JSONB in Postgres with RLS protection
- Export formats: JSON, OPML, Markdown, PNG/SVG

## Environment Configuration

Key environment variables:
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_APP_NAME=MindCanvas

# LLM Provider (Edge Functions)
LLM_PROVIDER=openai
LLM_API_KEY=
```

## Development Strategy

The project follows a **renderer-first** approach:
1. Build robust mind map editor with full feature set
2. Add AI ingestion and content processing
3. Focus on smooth 60fps performance for 1k+ nodes
4. Implement sharing and collaboration features

## Testing Guidelines

**IMPORTANT: Always write tests alongside implementation - never commit code without tests**

### Testing Strategy
1. **Unit Tests**: Test individual functions and utilities (Vitest)
2. **Integration Tests**: Test component interactions and API endpoints
3. **E2E Tests**: Test complete user workflows (Playwright)
4. **Test Coverage**: Aim for >80% coverage on critical paths

### Testing Requirements
- **AI/LLM functions**: Must have comprehensive unit tests for reliability
- **UI Components**: Test user interactions and error states
- **Canvas Integration**: Test Mind-Elixir wrapper and state synchronization
- **Error Handling**: Test failure modes and edge cases
- **Content Ingestion**: Test all supported file types and URL formats

## Git Workflow

**IMPORTANT: Always use feature branches and Pull Requests - never push directly to main**

### Development Workflow
1. **Create a new branch** for any changes:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   # or  
   git checkout -b docs/documentation-update
   ```

2. **Make your changes and commit**:
   ```bash
   git add .
   git commit -m "descriptive commit message"
   ```

3. **Push branch to GitHub**:
   ```bash
   git push -u origin feature/your-feature-name
   ```

4. **Create Pull Request using GitHub CLI**:
   ```bash
   gh pr create --title "Your PR Title" --body "PR description"
   ```

5. **Never push directly to main** - all changes must go through PR review

### Branch Naming Convention
- `feat/` - New features
- `fix/` - Bug fixes  
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions/updates
- `chore/` - Maintenance tasks

## Development Notes

- **Package Manager**: Always use `yarn` for consistency across the project
- **Testing**: Write comprehensive tests for every feature before committing code
- **Performance**: Focus on 60fps canvas performance for 1000+ nodes
- **AI Integration**: Implement extraction-first approach with confidence labels to avoid hallucinations
- **Caching**: Cache extraction results by content hash to optimize LLM usage

## Key Performance Requirements

- Render time-to-interactive under performance budget
- Smooth pan/zoom at 60fps for 1000+ nodes
- Efficient canvas re-rendering via map JSON diffing
- Chunked processing for large content to manage LLM token limits