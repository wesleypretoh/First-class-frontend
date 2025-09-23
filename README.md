# First-class-frontend

_aka **Nextjs15-Auth-Prisma-Shadcn Starter Kit**_

A multilingual, credential-based application starter for Next.js 15. The kit ships with:

- First-class NextAuth + Prisma credentials flow backed by PostgreSQL (Neon-friendly).
- shadcn/ui + Tailwind dashboard shell with theme and color pickers.
- English/Thai localization, including locale-aware routing, middleware, and auth screens.
- Opinionated project structure designed for rapid SaaS or admin dashboards.

## About

First-Class pairs authenticated SaaS scaffolding with multilingual routing so you can launch dashboards quickly. The layout stays approachable for newcomers while leaving room for production hardening.

### Page Title & SEO

- **Global template** – `app/layout.tsx` defines the default title (`First-Class`) and template (`%s | First-Class`). Update this file to change the app name or description shown across tabs and search results.
- **Default-locale pages** – English routes (for example `app/page.tsx`, `app/login/page.tsx`, `app/dashboard/page.tsx`) export a `metadata` object. Edit the `title` field there to adjust the tab title.
- **Localized pages** – `app/[lang]/…/page.tsx` files implement `generateMetadata` to pull titles from the locale dictionary. Modify the `pageTitles` entries inside `locales/en.ts` and `locales/th.ts` to keep translations in sync.

## Tech Stack

- **Framework:** Next.js 15 (App Router, Server Components, Turbopack)
- **Language:** TypeScript
- **Auth:** NextAuth (credentials provider) with Prisma adapter
- **Database:** PostgreSQL (Neon by default) via Prisma ORM
- **Styling/UI:** Tailwind CSS, shadcn/ui primitives, Radix UI icons/interactions
- **Forms & Validation:** react-hook-form + Zod
- **Internationalization:** Custom locale router (`/` for English, `/th` for Thai) with dictionary loader
- **Tooling:** ESLint 9 (Next.js config), TypeScript, Turbopack dev/build

## Database Structure

```json
{
  "Role": {
    "type": "enum",
    "values": ["ADMIN", "STAFF", "USER"]
  },
  "User": {
    "id": "String @id @default(cuid())",
    "name": "String?",
    "email": "String @unique",
    "emailVerified": "DateTime?",
    "image": "String?",
    "password": "String?",
    "role": "Role @default(USER)",
    "accounts": "Account[]",
    "createdAt": "DateTime @default(now())",
    "updatedAt": "DateTime @updatedAt",
    "lastLoginAt": "DateTime?",
    "lastLoginDevice": {
      "type": "Json?",
      "example": {
        "ua": "Mozilla/5.0 ...",
        "os": "iOS",
        "browser": "Safari",
        "device_type": "mobile",
        "ip": "203.0.113.4",
        "geo": {
          "country": "TH",
          "region": "10",
          "city": "Bangkok"
        }
      }
    },
    "themePreference": "String @default(\"system\")",
    "colorThemePreference": "String @default(\"neutral\")"
  },
"Account": {
    "userId": "String",
    "type": "String",
    "provider": "String",
    "providerAccountId": "String",
    "refresh_token": "String?",
    "access_token": "String?",
    "expires_at": "Int?",
    "token_type": "String?",
    "scope": "String?",
    "id_token": "String?",
    "session_state": "String?",
    "createdAt": "DateTime @default(now())",
    "updatedAt": "DateTime @updatedAt",
    "@id": "[provider, providerAccountId]",
    "@relation": "user User @relation(fields: [userId], references: [id], onDelete: Cascade)"
  }
}
```

> ℹ️ **Note:** `Account` is created by the NextAuth Prisma adapter. When you only use credential-based login it stays empty, but it becomes important if you add OAuth/social providers later, so keep the name as-is.

## Device Tracking

- Every credentials login updates `User.lastLoginAt` with the current timestamp.
- The accompanying `User.lastLoginDevice` JSON stores a compact fingerprint:

  ```json
  {
    "ua": "Mozilla/5.0 ...",
    "os": "iOS",
    "browser": "Safari",
    "device_type": "mobile",
    "ip": "203.0.113.4",
    "geo": {
      "country": "TH",
      "region": "10",
      "city": "Bangkok"
    }
  }
  ```

- Device signals come from standard proxy headers (`x-forwarded-for`, `x-real-ip`, `x-vercel-ip-*`, `cf-ipcountry`). When they’re unavailable, the fields are `null` and `device_type` falls back to `"unknown"`.
- The admin users API (`GET /api/users`) exposes both fields for audit dashboards or account monitoring.
- Device payloads are validated with a dedicated Zod schema (`DeviceInfoSchema`), ensuring malformed metadata is discarded before it reaches the database or response bodies.

## User Preferences

- Theme mode (`system`, `light`, `dark`) and accent palette (`neutral`, `apricot`, …) persist per user in `User.themePreference` and `User.colorThemePreference`.
- Updates flow through `PATCH /api/settings`, which validates payloads with `UpdateUserPreferencesSchema` and returns the normalized settings.
- Language selection stores in `User.languagePreference`, ensuring subsequent redirects and dictionaries default to the user’s preferred locale inside the authenticated app.
- Authenticated layouts hydrate user preferences on load, while unauthenticated surfaces (`/`, `/login`, `/signup`) reset to the default system theme and neutral palette via the client preferences applier and `DEFAULT_THEME_PREFERENCE`/`DEFAULT_COLOR_THEME`.

## Validation

- Credential and registration forms rely on Zod schemas (`LoginSchema`, `RegisterSchema`) for server-side validation.
- Admin role updates use `UpdateUserRoleSchema` to whitelist valid role transitions before PATCH requests are sent.
- Device fingerprint JSON is enforced by `DeviceInfoSchema`, which normalizes user-agent, OS, browser, IP, and geo fields when users sign in.

## Build Guidelines (AI Prompt Cheatsheet)

**UI**
- Use existing shadcn/ui primitives and Tailwind utility classes already present in the project.
- Prefer native shadcn components before introducing bespoke UI or third-party widgets.
- Trigger user feedback via Sonner toasts (`toast.success`, `toast.error`) rather than inline banners.
- Keep action buttons consistent: default size, `variant="outline"` when matching current admin table actions.
- Follow the established dialog and alert patterns when adding modals (import from `@/components/ui/dialog` or `@/components/ui/alert-dialog`).
- Persist settings through `PATCH /api/settings` when adding new toggles that affect per-user preferences.
- When adding new theme-like controls, integrate with `DEFAULT_THEME_PREFERENCE`, `DEFAULT_COLOR_THEME`, and `resetClientPreferences()` so unauthenticated pages stay clean after logout.

**Routing & Access**
- Place new API/routes under `app/…/route.ts` using Next.js App Router conventions.
- Gate protected endpoints with `getServerSession({ …authConfig, …authOptions })` and `hasAccessToPath` to align with current RBAC checks.
- Update `ROUTE_ACCESS_RULES` in `lib/auth/permissions.ts` when new pages require specific roles, and keep role constants in `lib/auth/roles.ts` as the single source of truth.
- Use `buildLocalizedPath` and locale-aware components when linking within dashboard views.

**Navigation**
- Extend navigation via `components/app-sidebar.tsx` and keep menu copy in locale dictionaries for consistency.
- Ensure sidebar entries respect `hasAccessToPath` so STAFF/USER roles only see routes they can open.
- Mirror breadcrumb patterns in the dashboard admin pages when adding new sections.

**Validation & Data**
- Back new forms/endpoints with Zod schemas in `schemas/index.ts` and parse inputs before hitting Prisma.
- Serialize Prisma results with `toISOString()` for dates and Zod guards (e.g., `DeviceInfoSchema`) before returning to clients.
- Update `types/next-auth.d.ts` when augumenting session or user payloads so hooks/components receive strong typing.
- Keep user preference enums (`lib/user-preferences.ts`, `lib/color-theme.ts`) in sync when expanding theme or accent options.
- Extend `SUPPORTED_LOCALES` if you introduce languages, and mirror the change in preference schemas so stored language preferences remain valid.

**Styling & Localization**
- Mirror CSS class structures from existing pages; prefer server components for layout, client components for interactivity.
- Add copy to `locales/en.ts` and `locales/th.ts`, and adjust `lib/i18n/get-dictionary.ts` typings if you introduce new strings.
- Ensure new UI follows responsive patterns present in `app/dashboard/**` (flex layouts, `sm:` breakpoints, etc.).

## Project Structure

```
./
├─ actions/                         # Server actions (login, register, etc.)
├─ app/
│  ├─ api/auth/[...nextauth]/route.ts  # NextAuth handler
│  ├─ layout.tsx                       # Root layout + metadata template
│  ├─ dashboard/
│  │  ├─ render-dashboard-page.tsx     # Locale-aware renderer for /dashboard
│  │  ├─ admin/
│  │  │  ├─ page.tsx                   # Default-locale admin console entry
│  │  │  └─ render-admin-page.tsx      # Shared admin renderer
│  │  ├─ settings/
│  │  │  ├─ page.tsx                   # Default-locale settings entry
│  │  │  └─ render-settings-page.tsx   # Shared settings renderer
│  │  └─ page.tsx                      # Default-locale dashboard entry
│  ├─ login/page.tsx                   # Default-locale login
│  ├─ signup/page.tsx                  # Default-locale signup
│  ├─ [lang]/                          # Locale-prefixed routes
│  │  ├─ page.tsx                      # Landing page fallback /[lang]
│  │  ├─ dashboard/
│  │  │  ├─ page.tsx                   # /[lang]/dashboard
│  │  │  ├─ admin/page.tsx             # /[lang]/dashboard/admin
│  │  │  └─ settings/page.tsx          # /[lang]/dashboard/settings
│  │  ├─ login/page.tsx                # /[lang]/login
│  │  └─ signup/page.tsx               # /[lang]/signup
│  └─ page.tsx                         # Landing page (login form)
├─ auth.config.ts                     # NextAuth credential provider config
├─ components/                        # UI components & shadcn wrappers (language-aware variants)
├─ hooks/
│  └─ use-current-locale.ts           # Client hook to read active locale from pathname
├─ lib/
│  ├─ auth-options.ts                 # Shared NextAuth adapter/session options
│  ├─ prisma.ts                       # Prisma client singleton
│  └─ i18n/
│     ├─ config.ts                    # Locale registry & helpers
│     ├─ get-dictionary.ts            # Translation loader & typings
│     └─ routing.ts                   # Locale-aware path utilities
├─ app/api/                           # Route handlers (REST-ish API)
│  └─ users/
│     └─ [id]/                        # Dynamic segments for user operations
│        ├─ route.ts                  # DELETE handler (admin-only delete user)
│        └─ role/route.ts             # PATCH handler to change a user's role
├─ locales/                           # Dictionary sources (en, th, ...)
├─ middleware.ts                      # Auth guard + locale-aware redirects
├─ prisma/schema.prisma               # Database schema definitions
├─ schemas/                           # Zod schemas (login/register)
├─ public/                            # Static assets
├─ package.json                       # Scripts & dependencies
└─ tsconfig.json                      # TypeScript config
```

## Prerequisites

- Node.js 18.18+ or 20+
- Yarn (preferred) or npm
- PostgreSQL instance (Neon connection string used in examples)

## Environment Variables

Create a `.env` file in the project root with the following keys:

```bash
DATABASE_URL="postgresql://<user>:<password>@<host>/<db>?sslmode=require"
AUTH_SECRET="<generated_nextauth_secret>"
NEXTAUTH_URL="http://localhost:3000"
```

- Generate a secret with `npx auth secret`.
- Neon’s connection string requires `sslmode=require`.
- Update `NEXTAUTH_URL` to your production domain when deploying so NextAuth can build absolute URLs.

### Quick Start

1. Clone the repo and move into the folder.
2. Run `yarn install` to grab dependencies.
3. Create `.env` with database credentials, an `AUTH_SECRET`, and `NEXTAUTH_URL` (see above).
4. Execute `yarn prisma migrate dev` to create/update the database schema.
5. Start the dev server with `yarn dev` and open `http://localhost:3000`.
6. Register your first account (it will be a `USER`), adjust the role in the database if you need an admin, and begin customizing the dashboard.

## Setup & Local Development

```bash
# 1. Install dependencies
yarn install

# 2. Generate the Prisma client
yarn prisma generate

# 3. Apply database migrations
yarn prisma migrate dev

# 4. Start the dev server (Turbopack)
yarn dev
```

Visit `http://localhost:3000` for the English login form. Thai lives at `/th/login`. Registration is available at `/signup` and `/th/signup`. The dashboard requires an authenticated session at `/dashboard` (or `/th/dashboard`).

### Available Scripts

- `yarn dev` – Run Next.js with Turbopack
- `yarn build` – Production build with Turbopack
- `yarn start` – Start the compiled app
- `yarn lint` – ESLint (Next.js config)
- `yarn prisma generate` – Generate Prisma client
- `yarn prisma migrate dev` – Create & apply migrations in dev
- `yarn prisma migrate deploy` – Apply migrations in production

## Theming

- **Default palette:** Neutral tone declared at the top of `app/globals.css`; the settings page exposes an “Apricot” accent option out of the box.
- **Persistence:** `lib/color-theme.ts` stores the active accent in both `localStorage` and cookies so SSR pages render with the correct colors.
- **Mechanics:** The selected theme toggles a `data-color-theme` attribute on `<html>` which drives CSS variable blocks (e.g. `[data-color-theme="apricot"]`).
- **Custom palettes:** Add entries to `COLOR_THEME_OPTIONS`, define matching CSS variables in `app/globals.css`, and the picker will render them automatically.
- **Tools:** [Zippy Starter’s shadcn theme generator](https://zippystarter.com/tools/shadcn-ui-theme-generator) and [shadcnstudio’s generator](https://shadcnstudio.com/theme-generator) provide compatible token sets.

## Internationalization

- **Routing model:** English occupies the root (`/login`, `/dashboard`, …). Additional locales mount at `/[lang]/…` (Thai currently at `/th/...`). Server pages use locale-aware render helpers (`app/dashboard/**/render-*.tsx`) to avoid duplication.
- **Dictionaries:** Translation dictionaries live in `locales/<code>.ts` and are loaded through `lib/i18n/get-dictionary.ts`. They cover navigation, theme settings, auth forms, team switcher, and quick links.
- **Language pickers:** `components/language-select.tsx` recalculates the current URL in the chosen locale while preserving query parameters. The picker appears in the dashboard settings card and in the auth card footers (compact `text-xs` trigger).
- **Middleware + hooks:** `middleware.ts` maintains locale-aware redirects, and `useCurrentLocale()` exposes the active locale to client components (e.g. sign-out button) to keep callbacks in-language.
- **Add a language:** 1) Extend `SUPPORTED_LOCALES` in `lib/i18n/config.ts`. 2) Create `locales/<code>.ts` mirroring the dictionary shape. 3) Translate any remaining hard-coded copy. 4) Ensure links/middleware use `buildLocalizedPath` when routing.
- **Future ideas:** Persist locale preference via cookie, integrate automated translation imports, or add Accept-Language detection in middleware.

## Authentication Flow

- **Register:** `actions/register.ts` validates with `RegisterSchema`, hashes with `bcryptjs`, and creates users via Prisma.
- **Login:** `actions/login.ts` verifies credentials before delegating to `signIn`. Client-side logic handles surfacing errors and redirecting to the locale-specific dashboard.
- **Session Guard:** `middleware.ts` checks the NextAuth JWT, redirecting unauthenticated users to the locale-appropriate `/login` route and keeping authenticated users away from auth pages.
- **Dashboard:** Uses `getServerSession` to protect content and includes a locale-aware `SignOutButton` that returns users to the correct `/[lang]/login` page.
- **Role propagation:** NextAuth sessions carry a `user.role` value (`ADMIN`, `STAFF`, or `USER`) pulled from Prisma and exposed to client components via `lib/auth-options.ts` callbacks.

## Role-Based Access Control

- **Roles & defaults:** The Prisma schema defines a `Role` enum (`prisma/schema.prisma`). New registrations receive `USER` by default.
- **Access rules:** `lib/auth/permissions.ts` declares `ROUTE_ACCESS_RULES`, mapping normalized pathname prefixes (for example `/dashboard/admin`) to the roles allowed to open them. `getAllowedRolesForPath()` picks the most specific match and returns the permitted roles, while `hasAccessToPath()` checks the current user role against that list.
- **Guard usage:** Server components call `hasAccessToPath()` before rendering protected pages (see `app/dashboard/**/render-*.tsx`), and the middleware invokes the same helper so browsers are redirected away from paths they cannot open.
- **Settings access:** `/dashboard/settings` is now visible to every role so all members can configure their own preferences.
- **Navigation filtering:** `components/app-sidebar.tsx` filters each section with `hasAccessToPath()` so the sidebar only shows routes returned from the access map. The active role label is also pulled from the per-locale `userRoles` dictionary for quick debugging.
- **Localized labels:** Role display strings live in each locale dictionary (`locales/<code>.ts`) under `userRoles`, so the sidebar shows `Admin`, `Operation`, or `Member` in the selected language.
- **Updating roles:** An admin-only API route at `PATCH /api/users/[id]/role` accepts `{ "role": "ADMIN" | "STAFF" | "USER" }` validated by `UpdateUserRoleSchema`.
- **Existing data:** After pulling the latest schema, run `yarn prisma migrate dev` and backfill roles for existing users (e.g. `UPDATE "User" SET role='USER' WHERE role IS NULL;`). Production deployments should apply the migration with `yarn prisma migrate deploy` before rolling out new code.
- **Promoting an admin:** The first account you register will be a `USER`. If you need admin access, update the role directly in the database once the record exists:

  ```sql
  UPDATE "User"
  SET role = 'ADMIN'
  WHERE id = '<user_id>';
  ```

  Replace `<user_id>` with the cuid generated for the target user. Afterwards, the session will reflect the new role on the next login (or after the JWT refresh cycle).

## Admin API Endpoints

- `PATCH /api/users/:id/role` – Admin-only. Validates `{ "role": "ADMIN" | "STAFF" | "USER" }`, updates the record via Prisma, and returns the updated user. Responds with `401/403` on unauthorized access.
- `DELETE /api/users/:id` – Admin-only. Removes the user account and returns `{ success: true }` when successful. Emits `401/403` if the caller lacks permission.

These handlers live in `app/api/.../route.ts` files where the exported function names match HTTP verbs (`export async function PATCH`, `DELETE`, `GET`, etc.). Inside each handler:

- We await `context.params` before reading route segments (`const { id } = await context.params`) to satisfy Next.js’ streaming route rules.
- Authorization runs up front via `getServerSession`, and we short-circuit with `401/403` responses when the caller’s role is insufficient.
- Database operations stay thin—each handler calls Prisma directly for now. If logic grows, extract helpers (e.g. `await deleteUser(id)`) into `lib/services/...` to keep route files small.
- Non-2xx responses return `{ error: string }` bodies to simplify client-side error handling.

### Adding Another Endpoint

1. Create a folder matching the resource path (for example, `app/api/food/[id]/route.ts`).
2. Export functions that match the verbs you need (`GET`, `POST`, `PATCH`, `DELETE`). Each file can expose multiple verbs, but keep one resource per file.
3. Reuse the session + role check pattern and await `context.params` before destructuring.
4. Return JSON with explicit status codes, mirroring the error shape used elsewhere so clients can surface consistent alerts.

Because each route file is isolated, naming the handler `DELETE` in multiple files does not collide. When logic repeats (logging, validation, etc.), build small utilities and import them into the relevant handlers.

## Database & Prisma

- `prisma/schema.prisma` defines `User` and `Account` models compatible with NextAuth’s Prisma adapter.
- Modify the schema and run `yarn prisma migrate dev` locally; use `yarn prisma migrate deploy` when promoting to production.
- Ensure the `DATABASE_URL` points to the correct environment (Neon, Supabase, RDS, etc.).

## Deployment

### Vercel

1. Push the repository to GitHub.
2. Create a Vercel project pointing at the repo root.
3. Set environment variables: `DATABASE_URL`, `AUTH_SECRET`, and `NEXTAUTH_URL` (to the production domain).
4. Use the default build command (`yarn install && yarn build`).
5. After deployment, run migrations against production:
   ```bash
   DATABASE_URL=... yarn prisma migrate deploy
   ```

### Other Platforms

Any Node-capable host (Render, Railway, Fly.io, Docker, etc.) works. Typical steps:

1. Install dependencies (`yarn install`).
2. Apply migrations (`yarn prisma migrate deploy`).
3. Start the app (`yarn start`).

Use a process manager (PM2, Docker) if you need zero-downtime restarts.

## Development Tips

- Turbopack is enabled; switch to Webpack by adjusting the `dev`/`build` scripts if needed.
- Forms rely on `react-hook-form` + Zod—update schemas and server actions together when adding fields.
- UI primitives in `components/ui` come from shadcn. Add more with `npx shadcn@latest add <component>`.
- No automated tests are bundled. Introduce Vitest or Playwright as your project grows.
- **Add a page:** drop a `page.tsx` under `app/<route>/`. To localize it, mirror the file under `app/[lang]/<route>/` or use the shared render helpers pattern.
- **Protect a page:** run logic server-side and check `getServerSession`, or rely on middleware for broad guards.
- **Expose publicly:** list the route in `authRoutes` within `middleware.ts`; otherwise visitors are redirected to login.
- **Navigation:** Update `components/app-sidebar.tsx` and locale dictionaries to surface new sections in every language.

## Troubleshooting

- **Auth warnings:** Ensure `NEXTAUTH_URL` and `AUTH_SECRET` are present locally and in production; restart the dev server after changes.
- **Prisma client issues:** Delete `node_modules/.prisma` and rerun `yarn prisma generate` if the generated client becomes stale.
- **Database connectivity:** Neon requires TLS (`sslmode=require`). Review IP allow lists or pooling settings if connections fail.

## License

No explicit license is provided. Add one before distributing or open-sourcing the project.
