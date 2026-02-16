# Next.js Starter Template

A modern, production-ready Next.js starter template featuring the latest web technologies and best practices.

## ✨ Features

- **Next.js 15** - Latest version with App Router and Server Components
- **React 19** - Cutting-edge React features
- **TypeScript** - Full type safety throughout the application
- **shadcn/ui** - Beautiful, accessible component library
- **Redux Toolkit** - Powerful state management
- **Tailwind CSS 4** - Utility-first CSS framework
- **Comprehensive Theming** - Multiple theme options with light/dark mode
- **Command Palette** - Built-in kbar command menu
- **Rich Text Editor** - TipTap editor integration
- **Form Handling** - React Hook Form with Zod validation
- **Data Tables** - Advanced table components with TanStack Table
- **Authentication Ready** - Auth provider structure included
- **Linting & Formatting** - ESLint, Prettier, and Husky pre-configured

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Git

### Installation

1. **Clone or download this template**

```bash
git clone <your-repo-url>
cd nextjs-starter-template
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

4. **Run the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## 📁 Project Structure

```
├── public/                 # Static assets
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── (authenticated)/  # Protected routes
│   │   │   └── dashboard/    # Dashboard pages
│   │   ├── (auth)/          # Authentication pages
│   │   ├── globals.css      # Global styles
│   │   ├── theme.css        # Theme variables
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   ├── components/        # React components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── layout/       # Layout components
│   │   ├── kbar/         # Command palette
│   │   └── ...           # Other reusable components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   ├── providers/        # Context providers
│   ├── store/            # Redux store and slices
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Helper functions
├── .env.example          # Environment variables template
├── components.json       # shadcn/ui configuration
├── next.config.ts        # Next.js configuration
├── package.json          # Dependencies and scripts
├── tailwind.config.ts    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## 🎨 Theming

This template includes a comprehensive theming system with multiple pre-built themes:

- **Light/Dark Mode**: Automatic system preference detection
- **Multiple Themes**: Choose from various color schemes
- **Theme Scaling**: Adjustable UI density
- **Custom Themes**: Easy to add your own themes

Access the theme selector via the command palette (Cmd/Ctrl + K) or the theme toggle button.

## 🧩 Available Components

### UI Components (shadcn/ui)

All shadcn/ui components are pre-installed and ready to use:

- Accordion, Alert, Avatar, Badge, Button, Card, Checkbox, Dialog, Dropdown Menu, Form, Input, Label, Popover, Progress, Radio Group, Scroll Area, Select, Separator, Slider, Switch, Tabs, Toast, Toggle, Tooltip, and more...

### Custom Components

- **DataTable**: Advanced table with sorting, filtering, and pagination
- **Breadcrumbs**: Navigation breadcrumbs
- **SearchInput**: Debounced search component
- **DeleteDialog**: Confirmation dialog for destructive actions
- **FormCardSkeleton**: Loading skeleton for forms
- **ReusableEditor**: Rich text editor powered by TipTap

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors and format code
npm run lint:strict  # Strict linting (no warnings allowed)
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
```

## 🔐 Authentication

The template includes an authentication provider structure in `src/providers/AuthProvider.tsx`. You can integrate your preferred authentication solution (NextAuth, Clerk, Supabase Auth, etc.) by updating this provider.

## 📦 State Management

Redux Toolkit is pre-configured with:

- Store setup in `src/store/index.ts`
- Example slice structure in `src/store/slices/`
- Redux Provider wrapper in `src/providers/ReduxProvider.tsx`

Add your own slices following the example pattern.

## 🎯 Adding New Routes

1. Create a new folder in `src/app/` for your route
2. Add a `page.tsx` file for the page component
3. Optionally add `layout.tsx` for route-specific layouts
4. Use route groups `(folder)` for organization without affecting URLs

Example:
```
src/app/(authenticated)/settings/page.tsx
```

## 🎨 Customization

### Colors

Edit theme colors in `src/app/theme.css` and `tailwind.config.ts`.

### Fonts

Update fonts in `src/lib/font.ts`.

### Layout

Modify the sidebar, header, and navigation in `src/components/layout/`.

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com) for the amazing component library
- [Next.js](https://nextjs.org) team for the incredible framework
- All the open-source libraries that make this template possible

---

**Happy coding! 🚀**
