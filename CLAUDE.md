# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Business Context
...

## System Architecture
...
## Essential Commands
...
### Development Workflow

- **Before coding**: `make generate-schema` - Updates Gateway API types from OpenAPI spec
- **Development**: `cd app && npm run dev` - Starts Next.js dev server with Turbopack
- **End of session**: `cd app && npm run build` - Verifies build passes
- **Database migrations**: `cd app && npm run db:migrate` - Runs Drizzle migrations
- **Linting**: `cd app && npm run lint` - ESLint checks

### Code Organization Principle

- **One function per file** - Maintain clear separation of concerns

## Architecture Overview
...

### Core Technology Stack

- **Next.js 15** with App Router and server components
- **TypeScript** with strict type checking
- **PostgreSQL** with Drizzle ORM
- **Better Auth** for authentication with Google OAuth
- **Zustand** for client state management
- **ShadCN UI** components with custom design system

### Application Structure

#### Route Organization

```
app/
├── (app)/          # Main application routes
│   └── app/
│       ├── projects/        # Project management
│       └── team-settings/   # Team administration
├── (auth)/         # Authentication flows
├── (landing)/      # Public landing pages
```

#### Component Architecture

- **Feature-based organization**: Components co-located with their routes
- **Private UI component**: Shared components in `_components/`
- **At least one store per page**: Zustand stores per feature area in `store.tsx`
- **Shared UI components**: Radix-based design system in `/components/ui/`
- **Performance optimization**: Extensive use of `React.memo`, `useMemo`, and memoized table rows
- **Compound patterns**: Complex interactions broken into focused sub-components

### Authentication Flow

**Multi-layer Authentication:**

1. **Better Auth** handles OAuth with Google
2. **Gateway integration** via custom session plugin that enriches sessions with Gateway tokens

Key files:


### Gateway Client Integration

**Three Client Types:**

1. **User Client** (`createUserClient`): User-scoped operations with access tokens
2. **Service Client** (`createGatewayClient`): Server-only operations with service tokens
3. **Token Client** (`createUserClientByToken`): Flexible client with provided tokens

**Environment Handling:**

- Different URLs for client vs server environments
- Automatic schema generation from Gateway OpenAPI spec
- Type-safe API calls with full autocomplete

### Server App Routing Pattern

**Page Components are Always SSR:**

- **`page.tsx` files are Server Components by default** - Always rendered on the server
- **Server components are preferred** - Use Server Components whenever possible for better performance
- **API fetches happen inside SSR components** - Direct server-side data fetching with `await`
- **Authentication checks** - Handle auth redirects server-side before rendering
- **Initial data loading** - Fetch data server-side for optimal performance
- **SEO optimization** - Server-rendered content is crawlable
- **SSR components must have skeleton** - Provide loading states for better UX
- **SSR must be wrapped with Suspense** - Use Suspense boundaries for streaming and error handling

**Key Patterns:**

```typescript
// page.tsx - Always Server Component
export default async function Page() {
  // Server-side auth check
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/auth/login");

  return (
    <div>
      <h1>Page Title</h1>
      {/* Wrap SSR components with Suspense */}
      <Suspense fallback={<ServerDataComponent.Skeleton />}>
        <ServerDataComponent />
      </Suspense>
      <ClientComponent /> {/* Use "use client" for interactivity */}
    </div>
  );
}

// Server Component with data fetching
async function ServerDataComponent() {
  // API fetches happen inside SSR components
  const data = await getServerData();

  return <DataDisplay data={data} />;
}

// Skeleton component for loading state
function DataSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );
}
```

**Cache Management:**

- Use `{ next: { tags: [...] } }` in GET server actions for caching
- Use `revalidateTag()` in mutating server actions to invalidate cache
- Server-side data fetching benefits from Next.js caching automatically

**Client-Side Rendering (CSR) Pattern:**

- **Never make `page.tsx` a Client Component** - Always keep it as Server Component
- **Use `_components/` for client interactivity** - Create client components in the `_components` folder
- **Import client components into page.tsx** - Let the server component orchestrate client components
- **"use client" directive** - Add to components that need browser APIs, state, or event handlers

```typescript
// page.tsx - Server Component (SSR)
export default async function Page() {
  const serverData = await fetchServerData();

  return (
    <div>
      <h1>Server-rendered title</h1>
      {/* Client component for interactivity */}
      <InteractiveForm initialData={serverData} />
    </div>
  );
}

// _components/interactive-form.tsx - Client Component (CSR)
("use client");

import { useState } from "react";

export function InteractiveForm({ initialData }) {
  const [state, setState] = useState(initialData);
  // ... client-side logic, event handlers, browser APIs
}
```

**Best Practices:**

- **Prefer Server Components** - Default to Server Components for all new components
- **API fetches in SSR** - Perform all data fetching server-side when possible
- **Always provide skeletons** - Create loading skeleton for every SSR component with data
- **Wrap with Suspense** - Use Suspense boundaries around SSR components for streaming
- Keep server components for data fetching and initial rendering
- Use client components only for user interactions, forms, and browser APIs
- Pass server-fetched data as props to client components
- Minimize client-side JavaScript bundle by strategic component boundaries

### Server Actions Pattern

**Standardized Structure:**

```typescript
export async function actionName(
  data: InputType
): Promise<SAResponse<OutputType>> {
  try {
    const client = await createUserClient();
    const { error } = await client.POST("/api/endpoint", { body: data });

    if (error) {
      return {
        data: null,
        error: extractErrorMessage(error, "Operation failed"),
      };
    }

    return { data: true, error: null };
  } catch (error) {
    console.error("Error:", error);
    return { data: null, error: "An unexpected error occurred" };
  }
}
```

**Available Server Actions:**

- **Auth**: `/lib/server-actions/auth/` - login, logout, refresh
- **Users**: `/lib/server-actions/users/` - profile management
- **Teams**: `/lib/server-actions/teams/` - team CRUD, invitations, members
- **Projects**: `/lib/server-actions/projects/` - project CRUD
- **URL Sources**: `/lib/server-actions/url-sources/` - URL management, batch operations

### State Management with Zustand

**Domain-Specific Stores:**

- Stores co-located with their feature areas
- **Optimistic updates** for better UX (e.g., URL sources auto-sort by like count)
- **Loading states** managed at store level
- **CRUD operations** built into store actions

Example patterns:

- Project list management with real-time sync
- URL source management with optimistic sorting
- Team switching with immediate UI updates

### Real-time Data with Electric SQL

**Integration Pattern:**

- **Electric handlers** wrap components for real-time data sync
- **Token-based authorization** using Gateway tokens
- **Zustand integration** for seamless state management
- **Table-specific queries** with project-level filtering

Key components:

- `electric-project-handler` - Real-time project data
- `electric-url-sources-handler` - Real-time URL source updates

### Database (Drizzle ORM)

**IMPORTANT NOTICE: Drizzle is ONLY used for Better Auth - DO NOT create new models/schemas**

**Drizzle Usage Restrictions:**
- **Authentication only** - Drizzle is exclusively for Better Auth session management
- **No business logic** - All business data is handled by the external core-gateway server
- **No new schemas** - Never create new Drizzle models or database schemas
- **No direct queries** - Don't write direct database queries for business data
- **Auth-specific only** - Only modify auth-related schemas if absolutely necessary

**Architecture Context:**
- **bon5-v2 database** - Only stores Better Auth data (users, sessions, accounts)
- **core-gateway database** - Stores all business data (teams, projects, URL sources)
- **Data separation** - Authentication and business data are completely separate
- **API-first approach** - All business data access goes through gateway API endpoints

**Current Drizzle Setup:**
- PostgreSQL with connection pooling (auth data only)
- Schema organized in `auth-schema.ts` (Better Auth tables only)
- Migrations via drizzle-kit (auth schema changes only)
- Type-safe queries with relations (Better Auth operations only)

**What to Use Instead:**
- **Server Actions** - Use server actions for all business data operations
- **Gateway Client** - Use `createUserClient()` for API calls to core-gateway
- **Type Safety** - Generated types from OpenAPI schema, not Drizzle schema

### Error Handling Patterns

**Server Actions:**

- Use `extractErrorMessage()` helper for consistent error extraction
- Always return `SAResponse<T>` format: `{data: T, error: null} | {data: null, error: string}`
- Log errors server-side for debugging

**Client Components:**

- Use toast notifications (Sonner) for user feedback
- Handle loading states with skeleton UI
- Graceful fallbacks for missing data

### Performance Considerations

**Optimization Strategies:**

- Memoize expensive table rows and complex calculations
- Use optimistic updates for immediate feedback
- Implement loading skeletons for perceived performance
- Co-locate state with components to minimize re-renders

### Development Guidelines

**Type Safety:**

- Always regenerate schema before coding: `make generate-schema`
- Use strict TypeScript configuration
- Leverage generated types from Gateway API

**Component Patterns:**

- Prefer server components when possible
- Use client components only for interactivity
- Implement proper loading and error states
- Follow compound component patterns for complex UI

**Testing:**

- Build verification required: `npm run build`
- No existing test setup - consider adding Jest + React Testing Library
- Server actions can be tested with mock clients
