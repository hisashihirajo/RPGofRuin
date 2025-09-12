# Overview

This project is a Japanese RPG (Role-Playing Game) web application based on the story "終焉化している世界に終止符を" (Putting an End to the Apocalyptic World). The game is set in a post-apocalyptic world where humanity was transformed into "Mutators" after a devastating war, following the journey of Chris, a human boy, and his relationships with Mutators in a war-torn society seeking redemption and coexistence.

The application is built as a full-stack web RPG featuring character selection, turn-based combat, inventory management, relationship systems, and world exploration through an interactive map interface. The game emphasizes narrative storytelling with Japanese dialogue and incorporates modern RPG mechanics inspired by games like Final Fantasy XIV and Genshin Impact.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Component System**: Shadcn/ui with Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with custom design system featuring post-apocalyptic color palette (dark slate, rust brown, mutation purple)
- **State Management**: TanStack React Query for server state management, React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **Typography**: Custom font stack using Cinzel (headers), Inter (body), and JetBrains Mono (UI elements)

## Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **Language**: TypeScript with ES modules
- **Database Integration**: Drizzle ORM configured for PostgreSQL
- **Development**: Hot module replacement via Vite integration
- **Storage Interface**: Abstracted storage layer with in-memory implementation for development

## Component Architecture
The game is structured around specialized RPG components:
- **Character System**: Character selection, stats management, and progression tracking
- **Combat Interface**: Turn-based combat with abilities, health/mana management, and target selection
- **Inventory System**: Grid-based item management with tooltips, rarity system, and item categories
- **Relationship System**: Character affection tracking, memory system, and dialogue interactions
- **Map Interface**: World exploration with location-based navigation and danger level indicators
- **Game Interface**: Central hub connecting all game systems with story progression

## Data Architecture
- **Schema Design**: User authentication system with Drizzle schema definitions
- **Type Safety**: Shared TypeScript types between frontend and backend via shared schema
- **Asset Management**: Static asset serving for character portraits and generated artwork

## Design System
- **Theme Support**: Light/dark mode toggle with CSS custom properties
- **Component Variants**: Consistent design tokens using class-variance-authority
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Accessibility**: Radix UI primitives ensure WCAG compliance

# External Dependencies

## Core Framework Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection for production deployment
- **drizzle-orm**: Type-safe database ORM with PostgreSQL dialect
- **@tanstack/react-query**: Server state management and data fetching
- **wouter**: Lightweight routing library for React applications

## UI and Design Dependencies
- **@radix-ui/react-***: Comprehensive set of accessible UI primitives (accordion, dialog, dropdown-menu, etc.)
- **tailwindcss**: Utility-first CSS framework for styling
- **class-variance-authority**: Type-safe component variant management
- **lucide-react**: Icon library for consistent iconography

## Development Dependencies
- **vite**: Fast build tool and development server
- **typescript**: Static type checking
- **@vitejs/plugin-react**: React support for Vite
- **@replit/vite-plugin-runtime-error-modal**: Development error handling

## Database and Session Management
- **connect-pg-simple**: PostgreSQL session store for Express sessions
- **drizzle-zod**: Schema validation integration between Drizzle and Zod

## Form and Validation
- **@hookform/resolvers**: React Hook Form resolvers for form validation
- **react-hook-form**: Performant form library with minimal re-renders
- **zod**: TypeScript-first schema validation

## Additional Utilities
- **date-fns**: Date utility library for time-based game mechanics
- **embla-carousel-react**: Carousel component for UI interactions
- **nanoid**: Unique ID generation for game entities