# Mindex - AI-Powered Mind Mapping

Convert web pages, documents, and videos into beautiful mind maps with AI assistance.

![Mindex Screenshot](./docs/images/mindex-hero.png)

## 🚀 Features

### ✅ **Milestone M1 - Complete Mind Mapping Application**
- **🎨 Beautiful Mind Maps** - Interactive canvas with Mind-Elixir integration
- **🔐 User Authentication** - Secure signup/signin with Supabase
- **💾 Data Persistence** - Cloud storage with real-time sync
- **📤 Export Formats** - JSON, OPML, Markdown, PNG, SVG
- **⌨️ Keyboard Shortcuts** - XMind-compatible shortcuts for power users
- **🎭 Theme System** - Light/dark modes with magenta accent
- **📱 Responsive Design** - Works on desktop, tablet, and mobile
- **⚡ Performance** - Fast loading and smooth interactions

### 🔮 **Milestone M2 - AI Integration** (Planned)
- **🤖 AI Content Processing** - Convert web pages to mind maps
- **📹 YouTube Integration** - Transform videos into structured maps  
- **📄 Document Processing** - Import PDFs and documents
- **🧠 Smart Summarization** - AI-powered content analysis
- **🔗 URL Import** - One-click web page conversion

## 🛠 Technologies Used

- **Frontend**: [React 18](https://reactjs.org) + [Vite](https://vitejs.dev)
- **UI Library**: [HeroUI v2](https://heroui.com) + [Tailwind CSS](https://tailwindcss.com)
- **Mind Mapping**: [Mind-Elixir](https://mind-elixir.com) - Interactive canvas library
- **Backend**: [Supabase](https://supabase.com) - PostgreSQL + Auth + Real-time
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs) + [TanStack Query](https://tanstack.com/query)
- **TypeScript**: Full type safety throughout the application
- **Testing**: [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Yarn package manager
- Supabase account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/mindex.git
cd mindex/apps/web
```

2. **Install dependencies**
```bash
yarn install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

4. **Set up Supabase**
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-id

# Apply database migrations
supabase db push
```

5. **Start development server**
```bash
yarn dev
```

Visit http://localhost:5173 to see Mindex in action! 🎉

## 📖 Development

### Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production  
- `yarn preview` - Preview production build
- `yarn test` - Run tests
- `yarn test:ui` - Run tests with UI
- `yarn lint` - Lint code
- `yarn typecheck` - Type checking

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── canvas/         # Mind mapping canvas components
│   ├── export/         # Export functionality
│   ├── keyboard/       # Keyboard shortcuts handler
│   └── theme/          # Theme switching components
├── stores/             # Zustand state management
│   ├── authStore.ts    # Authentication state
│   ├── mapStore.ts     # Mind map data and operations
│   └── uiStore.ts      # UI state (theme, etc.)
├── pages/              # Route components
│   ├── index.tsx       # Landing page
│   ├── maps/           # Mind maps pages
│   ├── import.tsx      # Content import page
│   └── settings.tsx    # Settings page
├── utils/              # Utility functions
│   └── export.ts       # Export functionality
└── styles/             # Global styles
```

## 🧪 Testing

Run the comprehensive test suite:

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test --watch

# Run tests with coverage
yarn test:coverage
```

### Test Coverage
- **54 tests** covering all major functionality
- **Components**: Canvas, keyboard shortcuts, theme switching
- **Stores**: Authentication, mind maps, UI state
- **Utils**: Export functionality in all formats

## 🎨 Design System

Mindex uses a carefully crafted design system:

- **Colors**: Magenta primary with semantic color scales
- **Typography**: Clean, readable typography hierarchy
- **Spacing**: Consistent spacing based on 4px grid
- **Components**: Accessible, responsive HeroUI components
- **Themes**: Light and dark mode support

## 🗃 Database Schema

Mindex uses a robust PostgreSQL schema with:

- **Users & Profiles** - User management with Supabase Auth
- **Mind Maps** - Hierarchical mind map data storage
- **Sharing** - Collaborative mind mapping
- **Import History** - Track content imports
- **Templates** - Reusable mind map templates

See `supabase/migrations/` for the complete schema.

## 🚢 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on every push

### Manual Build

```bash
yarn build
# Upload ./dist folder to your hosting provider
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Submit a pull request

## 📄 License

Licensed under the [MIT License](./LICENSE).

## 🙋‍♂️ Support

- 📧 Email: support@mindex.app
- 💬 Discord: [Join our community](https://discord.gg/mindex)
- 📖 Documentation: [docs.mindex.app](https://docs.mindex.app)
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/mindex/issues)

---

**Made with ❤️ by the Mindex team**
