# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a React TypeScript frontend application for Global Photo Rental (GPR), a photo equipment rental service. The application provides a modern, responsive interface for browsing and booking photography equipment with features like product catalogs, bundling options, search functionality, and booking management.

## Development Commands

### Core Commands
```bash
# Start development server (uses Vite)
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

### Package Management
```bash
# Install dependencies
npm install

# Add new dependencies
npm install <package-name>
npm install -D <package-name>  # For dev dependencies
```

### Testing Individual Components
The app uses lazy loading, so test specific pages by navigating to their routes:
- Home: `http://localhost:5173/`
- Browse Products: `http://localhost:5173/browse-product`
- Product Details: `http://localhost:5173/product/{slug}`
- Category Details: `http://localhost:5173/category/{slug}`
- Brand Details: `http://localhost:5173/brand/{slug}`
- Booking Flow: `http://localhost:5173/product/{slug}/book`

## Architecture Overview

### Tech Stack
- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite with SWC for fast compilation
- **Routing**: React Router DOM v7 with lazy-loaded components
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Query (TanStack Query) for server state
- **Forms**: Zod for validation
- **HTTP Client**: Axios with custom configuration
- **Animations**: Custom animation system with scroll-based triggers

### Project Structure
```
src/
├── components/          # Reusable UI components
├── pages/              # Route components (lazy-loaded)
├── types/              # TypeScript interfaces and schemas
├── assets/             # Static assets and animations
└── wrappers/           # Layout wrappers
```

### Key Architectural Patterns

#### API Integration
- Base URL: `http://gpr.id/api`
- API Key: `gbTnWu4oBizYlgeZ0OPJlbpnG11ARjsf` (hardcoded in components)
- Uses React Query for data fetching with proper caching strategies
- Axios with cancel tokens for request management
- Consistent error handling across components

#### Component Architecture
- **Lazy Loading**: All page components are lazy-loaded via `React.lazy()`
- **Compound Components**: Complex pages like `BrowseProduct` use sub-components for organization
- **Custom Hooks**: React Query hooks for API calls with proper cache keys
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints

#### State Management
- **Server State**: React Query for API data with stale-time and gc-time configuration
- **Client State**: React useState for local component state
- **URL State**: Search params for filter persistence and deep linking
- **Theme State**: System preference detection with manual override

#### Animation System
- **Scroll Animations**: Custom animation utilities in `animationUtils.js`
- **CSS Classes**: `.scroll-fade-in`, `.stagger-fade-in`, `.stagger-item` for declarative animations
- **Intersection Observer**: For performance-optimized scroll triggers
- **Fallback System**: Ensures content visibility if animations fail

## Data Flow and API Patterns

### API Response Structure
All API endpoints follow consistent patterns:
```typescript
{
  data: T[],           // Array of items
  meta?: {             // Pagination metadata
    last_page: number,
    min_price?: number,
    max_price?: number
  }
}
```

### Key Data Types
- **Product**: Core entity with photos, specifications, and rental includes
- **Bundling**: Package of multiple products with combined pricing
- **Category/SubCategory/Brand**: Hierarchical organization
- **BookingDetails**: Booking transaction with user and product info

### Query Key Patterns
- Single items: `["product", slug]`, `["bundling", slug]`
- Lists: `["products", filters]`, `["categories"]`
- Static data cached with longer stale times

## Styling System

### Design System
Based on "persian-blue" color palette with comprehensive design tokens:
- **Primary**: `#1e5df2` (persian-blue-600)
- **Secondary**: `#1648df` (persian-blue-700)
- **Light Theme**: `#eef6ff` backgrounds
- **Dark Theme**: `#152356` backgrounds

### Theme System
- **Auto-detection**: Respects `prefers-color-scheme`
- **Manual Override**: Toggle button in navigation
- **Class-based**: Uses Tailwind's `dark:` variant system
- **Transition Support**: Smooth theme transitions with custom utilities

### Animation Classes
- **Scroll Animations**: `.scroll-fade-in`, `.scroll-slide-left/right`
- **Staggered Effects**: `.stagger-fade-in` containers with `.stagger-item` children
- **Hover Effects**: `.hover-lift`, `.hover-scale`
- **Loading States**: `.animate-pulse`, `.animate-shimmer`

## Development Patterns

### Component Patterns
1. **Error Boundaries**: Comprehensive error handling with user-friendly messages
2. **Loading States**: Skeleton components and full-screen loaders
3. **Responsive Images**: Lazy loading with error fallbacks
4. **Form Handling**: Zod validation with proper error states
5. **Accessibility**: ARIA labels, semantic HTML, keyboard navigation

### Performance Optimizations
1. **Code Splitting**: Route-based with React.lazy()
2. **Image Optimization**: Lazy loading and placeholder systems
3. **Request Deduplication**: React Query prevents duplicate requests
4. **Cancel Tokens**: Axios requests cancelled on component unmount
5. **Memoization**: useMemo and useCallback for expensive operations

### Error Handling
1. **API Errors**: Consistent error messages with retry options
2. **Network Errors**: Cancel token handling for aborted requests
3. **Validation Errors**: Zod schema validation with field-level feedback
4. **Fallback Content**: Graceful degradation when data unavailable

## Common Development Tasks

### Adding New Product Features
1. Update `types/type.ts` interfaces
2. Add API calls in page components using React Query
3. Create reusable components in `/components`
4. Add routes in `App.tsx` with lazy loading
5. Update navigation in `navCard.tsx` if needed

### Implementing New Animations
1. Add CSS keyframes in `assets/animations.css`
2. Create utility classes following existing patterns
3. Update `animationUtils.js` for JavaScript-driven animations
4. Use data attributes for animation configuration
5. Test with fallback visibility system

### API Integration Guidelines
1. Use React Query for all server state
2. Implement proper cache keys and stale times
3. Add loading and error states
4. Use cancel tokens for cleanup
5. Handle pagination consistently

### Styling New Components
1. Use existing design tokens from Tailwind config
2. Follow mobile-first responsive patterns
3. Include dark mode variants
4. Add hover and focus states
5. Ensure accessibility compliance
