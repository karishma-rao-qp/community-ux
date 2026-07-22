<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Scope

We are building only the frontend/UX prototype for a product in the QuestionPro suite.

- Product: QuestionPro-Communities
- Purpose: An online panel where communities can conduct surveys, polls, and discussions with members
- Primary users: Community admins and community members
- Key entities: Survey, response, discussion, topic, and poll
- Primary actions: Send surveys, send polls, and engage through discussions and topics

Do not build backend APIs, database schemas, authentication, sync engines, or production integrations.


# Product Source of Truth

- Read `PRD.md` before starting any product task. It is the source of truth for screens, flows, behaviors, and terminology.
- Use terminology exactly as written in `PRD.md`; do not paraphrase interface labels or headings.
- Do not invent concepts, fields, screens, or workflows that the PRD does not define.
- If a requirement is missing or ambiguous, call it out and ask instead of assuming.


# Codex Workflow

When implementing a task:

1. Read `PRD.md` and identify the screens and flows in scope.
2. Build in this order: main list/index view, detail view, then modals and side panels.
3. Use typed mock data from the start; never wait for or build a real API.
4. Make every button and link functional, even if the action only navigates to a placeholder or displays a toast.


# File and Folder Conventions

```text
src/
├── app/
│   └── (dashboard)/
│       └── [feature]/
│           ├── page.tsx              # list or index view
│           └── [id]/
│               └── page.tsx          # detail view
├── components/
│   └── [feature]/
│       └── [ComponentName].tsx        # feature-specific components
└── data/
    └── mock-[feature].ts              # typed mock data
```

- Add navigation items in `src/components/SideNav.tsx` by following the existing pattern.
- Use one route per major feature under `src/app/(dashboard)/`.
- Keep mock data in `src/data/`; never define it inline in components.


# Mock Data

- Export explicit, typed arrays or objects from `src/data/mock-[feature].ts`.
- Use realistic names, dates, and meaningful numbers; never use placeholder values such as “foo,” “bar,” or “test.”
- Include 8–15 records so lists, pagination, and filters are demonstrable.
- Include edge cases such as one very long name and one record with missing optional fields.
- Use the installed `date-fns` package for date formatting.


# UX Rules

- Every button and link must navigate, open an interface, or show a WuToast.
- Lists need an empty state with a message or illustration and a call to action.
- Use WuToast for success and error feedback.
- Use modals for confirmations and inline forms.
- Keep flows self-contained so prototype users never reach a dead end.
- Prioritize UX completeness over production technical behavior when the two differ.


# Existing Reusable Patterns

Use these existing components and utilities instead of rebuilding them:

| Pattern | File | Use |
|---|---|---|
| Page header | `src/components/ui/PageHeader.tsx` | Page title, description, and primary action |
| Empty state | `src/components/ui/EmptyState.tsx` | Empty lists, no results, and not-found states |
| Confirm modal | `src/components/ui/ConfirmModal.tsx` | Destructive actions such as delete, archive, and revoke |
| Date utilities | `src/data/mock-utils.ts` | `formatDate()`, `formatRelativeDate()`, and `truncate()` |

Follow `src/app/(dashboard)/projects/` as the example feature. Its list view demonstrates search, filters, WuTable, row actions, a create modal, and toasts; its detail view demonstrates tabs, stat cards, and a settings form.


# UI Library and WickUI Import Pattern

- Use QuestionPro WickUI exclusively for UI components.
- Do not use shadcn/ui or another component library.
- Use Tailwind only for layout, spacing, and minor styling—not to recreate components WickUI already provides.
- Verify exact WickUI prop names in the documentation before using a component: https://wick-ui-lib.pages.dev/?path=/docs/docs-getting-started--docs

WickUI **components** must always be dynamically imported with `ssr: false`. Never use static imports for components — they will break server rendering.

**Exception — hooks and types:** Hooks (`useWuShowToast`, `useWuSidebar`, etc.) and TypeScript types (`IWuTableColumnDef`, `IWuTabItem`, etc.) must be imported statically. Hooks cannot be dynamically imported. Use `import type` for type-only imports.

```typescript
// ✅ Correct — component
const WuButton = dynamic(
  () => import('@npm-questionpro/wick-ui-lib').then((m) => ({ default: m.WuButton })),
  { ssr: false }
);

// ✅ Correct — hook (static import is required)
import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';

// ✅ Correct — type (static import, erased at compile time)
import type { IWuTableColumnDef } from '@npm-questionpro/wick-ui-lib';

// ❌ Never — component as static import
import { WuButton } from '@npm-questionpro/wick-ui-lib';
```

```typescript
// ✅ Always do this
const WuButton = dynamic(
  () => import('@npm-questionpro/wick-ui-lib').then((m) => ({ default: m.WuButton })),
  { ssr: false }
);

// ❌ Never do this — breaks SSR
import { WuButton } from '@npm-questionpro/wick-ui-lib';
```

**WuTable generic cast:** Dynamic import loses WuTable's generic type parameter. Always cast `data` and `columns` when passing them to the dynamically imported WuTable:

```typescript
<WuTable
  data={items as unknown[]}
  columns={columns as unknown as IWuTableColumnDef<unknown>[]}
  ...
/>
```

Define your `columns` array as `IWuTableColumnDef<YourType>[]` for proper cell renderer typing — the cast only happens at the JSX boundary.


# Client vs. Server Components

- Any file that uses WickUI or browser APIs must have `'use client'` at the top
- Dashboard pages and feature components are almost always client components
- When in doubt, use `'use client'`


# Routing

- All prototype screens live under `src/app/(dashboard)/`
- Route structure: `src/app/(dashboard)/[feature]/page.tsx`
- To add a nav item, edit `src/components/SideNav.tsx` and follow the existing pattern
- The root `/` page returns `null` — do not add content there


# State

- Use `useState` and `useReducer` for all local state — no Redux, Zustand, or Context
- Lift state to the nearest parent page when siblings need to share it
- No data-fetching libraries (React Query, SWR) — mock data is static imports


# TypeScript

- Define explicit types for all mock data shapes — no `any`
- Strict mode is on; the compiler will catch errors
