# Church Membership & Secretariat Management System

Digital system for church clerks, secretaries, pastors and officers to manage membership records, families, departments, leadership appointments, meetings, minutes, resolutions, action items, correspondence and official documents.

## Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Neon PostgreSQL + Drizzle ORM
- **Auth**: NextAuth.js (Auth.js) v5
- **File Storage**: Vercel Blob (configurable)
- **Deployment**: Vercel

## Getting Started

### 1. Prerequisites

- Node.js 20+
- A Neon PostgreSQL database (free tier works)
- (Optional) Vercel Blob token for file uploads

### 2. Install dependencies

```bash
cd church-membership-system
npm install
```

### 3. Environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and set:

```
DATABASE_URL=postgresql://...          # from Neon console
AUTH_SECRET=your-long-random-secret    # openssl rand -base64 32
AUTH_URL=http://localhost:3000
```

### 4. Database setup

```bash
# Push schema to Neon (or generate + migrate)
npm run db:push

# Seed roles, statuses, sample church + admin user
npm run db:seed
```

Default login after seed:

- **Email**: `admin@samplechurch.org`
- **Password**: `admin123`

### 5. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── (auth)/login/          # Login page
│   ├── (dashboard)/           # Protected area (sidebar layout)
│   └── api/auth/              # NextAuth handlers
├── components/
│   ├── layout/                # Sidebar, Header
│   ├── ui/                    # Primitives (future)
│   └── shared/                # Shared domain components
├── lib/
│   ├── db/                    # Drizzle schema + client + seed
│   ├── auth/                  # NextAuth config + helpers
│   ├── permissions/           # Role → resource → action matrix
│   ├── storage/               # File storage abstraction (future)
│   └── validations/           # Zod schemas (future)
└── actions/                   # Server Actions (future)
```

## Available Scripts

| Script            | Description                          |
|-------------------|--------------------------------------|
| `npm run dev`     | Start development server             |
| `npm run build`   | Production build                     |
| `npm run db:push` | Push schema changes to Neon          |
| `npm run db:generate` | Generate migrations             |
| `npm run db:migrate`  | Run migrations                  |
| `npm run db:studio`   | Open Drizzle Studio             |
| `npm run db:seed`     | Seed initial data               |

## Roles (seeded)

- Administrator
- Church Clerk
- Assistant Clerk
- Pastor
- Elder
- Department Leader
- Read Only

See `src/lib/permissions/index.ts` for the full permission matrix.

## Next Development Stages

1. Membership CRUD + profiles + families
2. Baptism & Transfer records
3. Departments & Leadership history
4. Meetings, Minutes, Resolutions, Action Items
5. Document archive + storage integration
6. Reports & exports
7. Full audit logging

## Important Design Principles

- Official church records are historical – never overwrite history.
- Minutes are linked to Meetings which own Agenda, Attendees, Resolutions and Action Items.
- All privileged actions are audited.
- Server-side permission checks on every mutation.

## License

Private – for church use.
