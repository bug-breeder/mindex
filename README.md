# Mindex

AI-powered mind mapping application that converts web pages, YouTube videos, PDFs, and documents into beautiful, interactive mind maps.

## 🏗️ Project Status

**Current Status**: Project structure initialized and ready for TDD development

### ✅ Completed
- **Documentation Updated**: All docs reflect new name (Mindex), UI frameworks (Ant Design + Aceternity UI), and TDD methodology
- **Project Structure**: Proper monorepo structure with `apps/web` setup
- **Technology Stack**: Vite + React + TypeScript + Ant Design + Aceternity UI + Tailwind CSS
- **Theme System**: Hydrangea color palette configured (minimal overrides)
- **Testing Setup**: Vitest + Testing Library + Playwright configured for TDD
- **Dependencies**: All required packages installed

## 🎨 Design System

- **Main Application**: Ant Design 5.x with defaults-first approach
- **Landing Page**: Aceternity UI components with animations
- **Color Palette (Hydrangea)**: `#FF8DA1`, `#FFC2BA`, `#FF9CE9`, `#AD56C4`
- **Typography**: Inter font family
- **Dark Mode**: Full light/dark theme support

## 🧪 Testing Strategy (TDD)

**CRITICAL**: All development follows Test Driven Development principles:
1. **Red**: Write failing tests first
2. **Green**: Write minimal code to pass tests  
3. **Refactor**: Clean up while keeping tests green

### Test Coverage Requirements
- **Unit Tests**: >90% coverage for critical paths
- **Integration Tests**: Complete API and component integration
- **E2E Tests**: All critical user journeys
- **Accessibility**: WCAG 2.1 AA compliance

## 🏛️ Architecture

```
mindex/
├── apps/web/                 # Main React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── canvas/       # Mind-Elixir integration
│   │   │   ├── inspector/    # Node editing (Ant Design)
│   │   │   ├── toolbar/      # Canvas controls (Ant Design)
│   │   │   ├── landing/      # Landing page (Aceternity UI)
│   │   │   └── ui/           # Shared components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── stores/           # Zustand state management
│   │   ├── providers/        # Context providers
│   │   ├── config/           # Theme & app configuration
│   │   └── test/             # Test utilities
│   └── tests/                # Test files
├── packages/                 # Shared packages (future)
├── supabase/                 # Backend (future)
└── docs/                     # Complete documentation
```

## 🚀 Development Commands

**Prerequisites**: Node.js >=18, Yarn >=1.22

```bash
# From project root
yarn dev           # Start development server
yarn build         # Production build  
yarn test          # Run all tests
yarn test:watch    # TDD development mode
yarn test:e2e      # Run E2E tests
yarn lint          # Code linting
yarn typecheck     # TypeScript checking
```

## 🎯 Next Steps (TDD Development)

1. **Start with Tests**: Begin M1 implementation following TDD methodology
2. **Authentication System**: Write auth tests first, then implement
3. **Canvas Integration**: Test Mind-Elixir wrapper, then build
4. **Component Library**: Use Ant Design defaults; add minimal Tailwind utilities
5. **Landing Page**: Use Aceternity UI sections with Hydrangea accents

## 📚 Key Documentation

- `docs/00-README.md` - Project overview and quick start
- `docs/01-product-spec.md` - Product requirements and vision
- `docs/03-design-system.md` - UI framework usage and Hydrangea palette
- `docs/11-test-plan.md` - Comprehensive TDD testing strategy
- `docs/07-implementation-roadmap.md` - Development milestones
- `CLAUDE.md` - AI development guidelines

## 🛠️ Technology Stack

- **Frontend**: React 18 + Vite + TypeScript
- **UI Framework**: Ant Design 5.x + Aceternity UI
- **Styling**: Tailwind CSS with Hydrangea palette
- **State Management**: Zustand + TanStack React Query
- **Canvas**: Mind-Elixir v5
- **Backend**: Supabase (Auth, PostgreSQL, Edge Functions)
- **Testing**: Vitest + Testing Library + Playwright
- **Package Manager**: Yarn (monorepo with workspaces)

## 📄 License

MIT License - see LICENSE file for details
