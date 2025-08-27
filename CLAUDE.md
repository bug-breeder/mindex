# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Mindex** is an AI-powered mind mapping application that converts web pages, YouTube videos, PDFs, and documents into beautiful, interactive mind maps.

## Technology Stack

- **Frontend**: React 18 + Vite, Tailwind CSS v3, HeroUI v2 components, Zustand state management, TanStack React Query
- **Canvas**: Mind-Elixir v5 for interactive mind map rendering and editing
- **Backend**: Supabase (Auth, PostgreSQL with RLS, Real-time subscriptions)
- **Testing**: Vitest + Testing Library
- **Package Manager**: Yarn
- **Styling**: Magenta primary theme with responsive design and light/dark mode support

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

## Key Features

- Interactive mind map canvas with Mind-Elixir integration
- Authentication system with Supabase Auth
- Data persistence with PostgreSQL and real-time sync
- Export system (JSON, OPML, Markdown, PNG, SVG)
- Keyboard shortcuts for efficient editing
- Responsive theme system with light/dark modes

## Architecture

- **Frontend**: React + Zustand stores (`useAuthStore`, `useMapStore`, `useUIStore`)
- **Backend**: Supabase with Auth, PostgreSQL, and Edge Functions
- **Canvas**: Mind-Elixir wrapper with React integration

## Canvas Integration

- Mind-Elixir library wrapped in React component
- Events bridge from Mind-Elixir to Zustand store via `me.bus.addListener`
- Canvas state synchronized with React via `onChange` callbacks

## Environment Configuration

Required environment variables:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_NAME=Mindex
```

## Testing Guidelines

**IMPORTANT: Always write tests alongside implementation - never commit code without tests**

- Use Vitest + Testing Library for component and utility tests
- Test user interactions, error states, and edge cases
- Test Mind-Elixir wrapper and state synchronization
- Aim for comprehensive coverage on critical paths

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

## Development Requirements

- **Package Manager**: Always use `yarn`
- **Testing**: Write tests before committing code
- **Performance**: 60fps canvas performance for 1000+ nodes
- **Responsive Design**: All UI components must be fully responsive across all device sizes (mobile, tablet, desktop)
- **Accessibility**: Follow WCAG guidelines for inclusive design
- **Theme Support**: Maintain light/dark mode compatibility
- **State Management**: Use Zustand stores consistently