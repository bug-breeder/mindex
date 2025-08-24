# Mindex - Development Guide for Claude

## 🎯 Project Overview

**Mindex** is an AI-powered mind mapping application that converts web pages, documents, and videos into beautiful, interactive mind maps. The project follows a strategic two-milestone approach.

## 📋 Development Milestones

### ✅ **Milestone M1: Complete Mind Mapping Application** (IMPLEMENTED)

**Status**: ✅ **COMPLETED** - Fully functional mind mapping app with all core features

**Core Features Implemented:**
- **🎨 Interactive Mind Maps**
  - Mind-Elixir canvas integration (`src/components/canvas/MindCanvas.tsx`)
  - Real-time mind map rendering and editing
  - Node creation, editing, deletion with keyboard shortcuts
  - Visual themes with magenta primary color
  
- **🔐 User Authentication System**
  - Supabase Auth integration (`src/stores/authStore.ts`)
  - Sign up, sign in, sign out functionality
  - Protected routes and user sessions
  - Profile management

- **💾 Data Persistence & Management**
  - PostgreSQL database with Supabase (`supabase/migrations/001_initial_schema.sql`)
  - Real-time data synchronization
  - Mind map CRUD operations (`src/stores/mapStore.ts`)
  - User profile and settings storage

- **📤 Export Capabilities**
  - Multiple export formats (`src/utils/export.ts`):
    - JSON (structured data)
    - OPML (outline format)
    - Markdown (hierarchical text)
    - PNG (image export)
    - SVG (vector graphics)

- **⌨️ Keyboard Shortcuts**
  - XMind-compatible shortcuts (`src/components/keyboard/KeyboardHandler.tsx`)
  - Tab → Add child node
  - Enter → Add sibling node
  - Delete → Remove node
  - Arrow keys → Navigate nodes

- **🎭 Theme System**
  - Light/dark mode switching (`src/components/theme/ThemeSwitch.tsx`)
  - Magenta primary color scheme
  - System theme detection
  - Persistent theme preferences

- **📱 Responsive Design**
  - HeroUI component library
  - Tailwind CSS styling
  - Mobile-friendly interface
  - Adaptive layouts

### 🔮 **Milestone M2: AI Integration** (PLANNED)

**Status**: 📋 **PLANNED** - AI-powered content processing features

**Planned Features:**
- **🤖 AI Content Processing**
  - Web page to mind map conversion
  - Content analysis and summarization
  - Intelligent node hierarchy generation

- **📹 YouTube Integration**
  - Video transcript extraction
  - Key points identification
  - Timeline-based mind maps

- **📄 Document Processing**
  - PDF parsing and analysis
  - Document structure recognition
  - Multi-format import support

- **🧠 Smart Features**
  - Auto-categorization
  - Duplicate detection
  - Smart suggestions

## 🏗 Architecture Overview

### **Technology Stack**
```
Frontend:
├── React 18 (UI framework)
├── TypeScript (type safety)
├── Vite (build tool)
├── HeroUI v2 (component library)
├── Tailwind CSS (styling)
├── Mind-Elixir (mind mapping canvas)
└── Framer Motion (animations)

State Management:
├── Zustand (client state)
├── TanStack React Query (server state)
└── Supabase (real-time sync)

Backend & Database:
├── Supabase (BaaS)
├── PostgreSQL (database)
├── Row Level Security (RLS)
└── Real-time subscriptions

Testing:
├── Vitest (test runner)
├── Testing Library (component testing)
└── 54 comprehensive tests
```

### **Project Structure**
```
src/
├── components/          # Reusable UI components
│   ├── canvas/         # Mind mapping functionality
│   │   ├── MindCanvas.tsx          # Main canvas component
│   │   └── MindCanvas.test.tsx     # Canvas tests
│   ├── export/         # Export functionality
│   │   └── ExportDialog.tsx        # Export modal
│   ├── keyboard/       # Keyboard shortcuts
│   │   ├── KeyboardHandler.tsx     # Shortcuts logic
│   │   └── KeyboardHandler.test.tsx # Shortcuts tests
│   └── theme/          # Theme switching
│       ├── ThemeSwitch.tsx         # Theme toggle
│       └── ThemeSwitch.test.tsx    # Theme tests
├── stores/             # State management
│   ├── authStore.ts    # Authentication state
│   ├── mapStore.ts     # Mind map data & operations
│   ├── uiStore.ts      # UI state (theme, etc.)
│   └── *.test.ts       # Store tests
├── pages/              # Route components
│   ├── index.tsx       # Landing page
│   ├── maps/           # Mind map pages
│   │   ├── index.tsx   # Maps list
│   │   └── [id].tsx    # Map editor
│   ├── import.tsx      # Content import
│   └── settings.tsx    # User settings
├── utils/              # Utility functions
│   ├── export.ts       # Export functionality
│   └── export.test.ts  # Export tests
├── api/                # API layer
│   ├── auth.ts         # Auth operations
│   └── maps.ts         # Map operations
├── providers/          # Context providers
│   ├── QueryProvider.tsx  # React Query setup
│   └── ThemeProvider.tsx  # Theme context
└── styles/             # Global styles
    └── globals.css     # Tailwind + custom styles
```

## 🗄 Database Schema

### **Core Tables**
```sql
-- User management
profiles (id, email, full_name, avatar_url, created_at, updated_at)

-- Mind maps
mind_maps (
  id, title, description, root, theme, metadata,
  created_by, created_at, updated_at, is_public, tags
)

-- Collaboration
mind_map_shares (id, mind_map_id, shared_with, permission, created_at)

-- Import tracking
import_history (
  id, user_id, source_url, source_type, content_title,
  mind_map_id, status, error_message, created_at
)

-- Templates
templates (
  id, title, description, root, theme, category, tags,
  created_by, is_featured, usage_count
)
```

### **Security Model**
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Sharing system with view/edit/admin permissions
- Public mind maps accessible to all users

## 🧪 Testing Strategy

### **Test Coverage (54 tests)**
```
✓ Mind Canvas (6 tests)
  - Component rendering
  - Mind-Elixir initialization
  - Data binding and updates
  - Instance callbacks

✓ Keyboard Shortcuts (14 tests)
  - All shortcut combinations
  - Node operations (add, delete, navigate)
  - Focus management
  - Event handling

✓ Theme System (6 tests)
  - Light/dark switching
  - System theme detection
  - Persistence across sessions
  - CSS custom properties

✓ State Management (13 tests)
  - Authentication flows
  - Mind map operations
  - UI state changes
  - Store integrations

✓ Export Functionality (15 tests)
  - All export formats (JSON, OPML, MD, PNG, SVG)
  - File download mechanics
  - Error handling
  - Format validation
```

### **Test Commands**
```bash
yarn test              # Run all tests
yarn test --watch      # Watch mode
yarn test:ui          # Visual test runner
yarn test:coverage    # Coverage report
```

## 🎨 Design System

### **Color Scheme**
```css
/* Primary: Magenta */
--primary-50: #fdf4ff
--primary-500: #d946ef  (main brand color)
--primary-900: #701a75

/* Theme Support */
:root { /* light theme */ }
[data-theme="dark"] { /* dark theme */ }
```

### **Component System**
- **HeroUI Components**: Buttons, inputs, modals, navigation
- **Custom Components**: Mind canvas, export dialogs, keyboard handlers
- **Responsive Design**: Mobile-first approach with breakpoints
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

## 🛠 Development Commands

### **Core Development**
```bash
yarn dev          # Start development server (http://localhost:5173)
yarn build        # Production build
yarn preview      # Preview production build
yarn typecheck    # TypeScript checking
yarn lint         # ESLint + Prettier
```

### **Database Management**
```bash
# Supabase CLI commands
supabase login                        # Login to Supabase
supabase link --project-ref <id>      # Link to project
supabase db push                      # Apply migrations
supabase db diff                      # Show schema changes
supabase gen types typescript --local # Generate TypeScript types
```

### **Testing & Quality**
```bash
yarn test                    # Run all tests
yarn test src/stores/        # Test specific directory
yarn test --reporter verbose # Detailed test output
```

## 🚀 Deployment

### **Environment Variables**
```bash
# Required for production
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_NAME=mindex

# Development only
SUPABASE_DB_PASSWORD=your-db-password
```

### **Build Process**
1. **TypeScript compilation** (`tsc --project tsconfig.build.json`)
2. **Vite production build** (optimized bundles)
3. **Asset optimization** (images, fonts, CSS)
4. **Bundle analysis** (check chunk sizes)

### **Deployment Targets**
- **Vercel** (recommended): Automatic deployments from Git
- **Netlify**: Static site hosting with serverless functions
- **Traditional hosting**: Upload `dist/` folder

## 🔧 Key Implementation Details

### **Mind-Elixir Integration**
```typescript
// Canvas component with proper TypeScript integration
const MindCanvas = ({ data, onInstanceReady }) => {
  const instanceRef = useRef<any>(null)
  
  useEffect(() => {
    const me = new MindElixir({
      el: containerRef.current,
      direction: MindElixir.direction.RIGHT,
      theme: { /* magenta theme */ }
    })
    
    me.init(mindElixirData)
    instanceRef.current = me
    onInstanceReady?.(me)
  }, [])
}
```

### **State Management Pattern**
```typescript
// Zustand store with TypeScript
const useMapStore = create<MapState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      map: null,
      setMap: (map) => set({ map }),
      updateMap: (updater) => set((state) => ({
        map: updater(state.map)
      }))
    }))
  )
)
```

### **Export System**
```typescript
// Multi-format export with proper error handling
export const exportAsJSON = (map: MindMapJson) => {
  const blob = new Blob([JSON.stringify(map, null, 2)], {
    type: 'application/json'
  })
  downloadBlob(blob, `${map.title || 'mindmap'}.json`)
}
```

## 🤝 Development Guidelines

### **Code Style**
- **TypeScript**: Strict mode, explicit types
- **React**: Functional components with hooks
- **CSS**: Tailwind utility classes, no custom CSS
- **Testing**: Comprehensive coverage with meaningful tests

### **Performance**
- **Bundle optimization**: Code splitting, lazy loading
- **State efficiency**: Minimal re-renders, optimized selectors
- **Database queries**: Efficient RLS policies, proper indexing

### **Security**
- **Authentication**: Supabase Auth with RLS
- **Data validation**: Client and server-side validation
- **XSS prevention**: Proper input sanitization

## 🎯 Current Status Summary

**Milestone M1 is COMPLETE** ✅

The application is a fully functional mind mapping tool with:
- Complete user authentication system
- Interactive mind map canvas with Mind-Elixir
- Full CRUD operations for mind maps
- Export to 5 different formats
- Comprehensive keyboard shortcuts
- Beautiful theme system with light/dark modes
- Responsive design that works on all devices
- 54 comprehensive tests covering all functionality
- Production-ready build system

**Ready for production deployment and user testing!**

The foundation is solid and ready for Milestone M2 (AI integration) when desired.