# Kitchen Management System — Phase 1: Kitchen Core

**Date:** 2026-05-04
**Status:** Draft
**Scope:** Phase 1 of 3 — Kitchen operations only (no packaging, fleet, or delivery)

---

## Problem

A mid-sized commercial kitchen in Karnataka serves ~6,000 meals/day across 5-15 business clients (IT parks, corporate offices). The owner currently manages everything through Excel sheets and WhatsApp — manually creating daily menus, printing them, and handing them to a head chef who distributes tasks to workers. Workers are largely illiterate and rely on verbal instructions and printouts they can't read.

The owner wants a system that:
- Replaces his Excel-based workflow with structured recipe and menu management
- Gives illiterate workers a visual, easy-to-use task board on an existing kitchen computer
- Lets him monitor kitchen operations remotely from anywhere
- Tracks preparation timelines so he can see if things are on schedule
- Reduces his personal dependency — the kitchen should run without him being physically present

## Target Users

| Role | Literacy | Device | Key Need |
|---|---|---|---|
| Owner | Literate, tech-comfortable | Phone/laptop (remote) | Full control, observability |
| Head Chef | Literate | Kitchen PC + phone | Daily menu execution, task assignment |
| Shift Supervisor | Semi-literate | Kitchen PC | Manage their shift's tasks |
| Worker | Illiterate, smartphone-familiar | Kitchen PC (shared) | See what to cook, update status |

## Architecture

### System Overview

```
┌─────────────────────────────────────────────┐
│           CLOUD (Vercel + Railway)           │
│  Next.js App Router + PostgreSQL + Auth      │
│  SSE for real-time updates                   │
└──────────────┬──────────────────┬────────────┘
               │                  │
    ┌──────────▼──────┐  ┌───────▼──────────┐
    │  OWNER / ADMIN  │  │  KITCHEN STATION  │
    │  (any browser)  │  │  (PWA + offline)  │
    │  Full dashboard │  │  IndexedDB cache  │
    │  Online-only    │  │  Service Workers  │
    └─────────────────┘  └──────────────────┘
```

### Offline-First Kitchen Station

Internet and electricity are unreliable in India. The kitchen station runs as a PWA with aggressive offline support:

- **Service Workers** cache the entire kitchen UI, all recipes, and today's task list
- **IndexedDB (via Dexie.js)** stores working data locally — recipes, today's menu, task statuses, shift assignments
- **Background Sync** — status updates queue locally and sync when connectivity returns
- Every morning (when connectivity is available), the system pulls down the day's plan and caches it. After that, the kitchen runs independently even if internet drops for the entire day.
- After a power cut, data persists in IndexedDB. Workers reopen the browser and pick up where they left off.

**Online-only features:** Owner's remote dashboard, client management, new recipe uploads. These are admin tasks done when connectivity is available.

**Offline menu planning:** The head chef can create/edit today's menu directly on the kitchen station when offline (stored in IndexedDB). When connectivity returns, changes sync to the cloud. This ensures the kitchen operates fully independently when the owner is unavailable.

### Offline Sync & Conflict Resolution

Data flows are intentionally one-directional to avoid conflicts:
- **Owner → Cloud:** Menu planning, recipe edits, client changes (online-only, no offline version)
- **Cloud → Kitchen:** Published menus and recipes sync down at start of day (or when connectivity is available)
- **Kitchen → Cloud:** Only task status updates flow upstream (timestamps, status changes)

Since workers only update task status and the owner only updates menus/recipes, there is no scenario where both sides edit the same data. If the owner re-publishes a menu while the kitchen is offline, the kitchen continues with its cached version. On reconnect, the system flags any discrepancies and the head chef resolves them.

### Real-time Updates

Server-Sent Events (SSE) push kitchen status to the owner's dashboard. Simpler than WebSockets, degrades gracefully when offline (dashboard shows "last synced X min ago").

## User Roles & Permissions

| Role | Can Do | Can't Do |
|---|---|---|
| **Owner** | Everything — recipes, menus, clients, users, reports, settings | Nothing restricted |
| **Head Chef** | View/edit today's menu, assign tasks to shifts, update task status, view recipes | Add/edit clients, manage users, change settings |
| **Shift Supervisor** | View shift tasks, update task status, view recipes, reassign within their shift | Edit menus, manage other shifts, admin functions |
| **Worker** | View assigned tasks, look up recipes, mark tasks as done | Everything else |

### Authentication

- **Owner / Head Chef:** Email + password login
- **Shift Supervisor:** 4-6 digit PIN login
- **Workers:** No individual login. The kitchen station is logged in as the active shift. Workers interact with the shared task board.
- **Owner remote access:** Standard auth + optional OTP

## Module 1: Recipe Management

### Overview

The recipe library is the foundation — all menus and tasks reference recipes. Recipes are flexible: the owner can add as much or as little detail as he wants, gradually formalizing what's currently in the head chef's head.

### Recipe Fields

| Field | Required | Description |
|---|---|---|
| name_en | Yes | Dish name in English |
| name_hi | No | Dish name in Hindi |
| photo | No | Dish photo (for worker recognition) |
| categories | No | Tags: meal type (breakfast/lunch/dinner), diet (veg/non-veg), food type (rice/bread/curry) |
| baseServings | No (default: 1) | The serving count the recipe is written for |
| prepTime | No | Preparation time in minutes |
| cookTime | No | Cooking time in minutes |
| ingredients | No | List of {name_en, name_hi, quantity, unit} |
| steps | No | Ordered list of {description_en, description_hi} |

### UI: Card Grid View

Recipes displayed as visual cards with dish photo/emoji, bilingual name, and key stats (prep time, servings). Click a card to open the full recipe editor.

### Auto-Scaling

Ingredients scale automatically based on actual servings needed. If the recipe's `baseServings` is 100 and today's order requires 1,200 servings, the system multiplies all ingredient quantities by 12x. Workers see the scaled amounts — no mental math.

### Internationalization

All user-facing text fields (dish names, ingredient names, step descriptions) have `_en` and `_hi` variants. The i18n system supports adding more languages (Kannada is the first planned addition). UI labels and navigation are translated via next-intl resource bundles.

## Module 2: Menu Planning

### Overview

The owner's daily workflow: decide what each client gets for each meal, then publish to the kitchen.

### UI: Client Tabs + Meal Cards

- **Tab bar** at top shows all clients with headcount. Select one client at a time.
- **Meal cards** below show breakfast/lunch/dinner (based on client's contract). Each card has a subtle color gradient (warm for breakfast, blue for lunch, dark for dinner).
- **Dish chips** inside each card: emoji + bilingual name + remove button. Click "+ Add dish" to pick from the recipe library.
- **Status badges** on client tabs: green (menu set), yellow (partial), red (not set).

### Key Features

- **Copy from Previous Day:** Most menus are similar day-to-day. One click copies yesterday's menu, then the owner tweaks.
- **Weekly Templates:** Save a full week's menu as a reusable template.
- **Publish to Kitchen:** Converts the day's menus into ShiftTasks on the worker task board. This is the bridge between planning and execution.

### Menu-to-Task Generation

When the owner clicks "Publish to Kitchen":
1. System aggregates all dishes across clients for the same meal type
2. Combines quantities — if TCS and Wipro both need Poori for breakfast, it becomes one task with combined servings
3. Assigns tasks to the appropriate shift based on meal type (breakfast → 4am shift, lunch → 6am shift, dinner → 6pm shift)
4. Calculates `expectedStartBy` and `expectedDoneBy` based on recipe prep/cook times and delivery deadlines
5. Tasks appear on the Kitchen Task Board

## Module 3: Kitchen Task Board (Worker-Facing)

### Overview

The most critical screen. Workers interact with this on the kitchen computer. Designed for illiterate users — big visuals, color-coded status, minimal text, one action button per task.

### Design Principles

1. **Color = Status.** Green = done, Orange = cooking, Blue = prepping, Grey = not started. No reading needed.
2. **One Big Button.** Each task has exactly one action button — the next logical step. No confusion.
3. **Dish Photos + Emoji.** Workers recognize dishes by sight, not by reading. Large icons and uploaded photos front and center.
4. **Bilingual Always.** Every label in English + Hindi.
5. **Large Font, High Contrast.** Designed for glancing from across the kitchen.

### UI Layout

- **Shift tabs** at top — big, obvious, one tap to switch between 4am / 6am / 6pm
- **Progress bar** below tabs — visual indicator of shift completion
- **Task cards** — one per dish, ordered by priority (behind schedule first, then in-progress, then not started, then done)

### Task Card Structure

Each card shows:
- Dish emoji/photo (large, left side)
- Dish name (bilingual, large font)
- Client name(s) + total servings
- Current status with color-coded border
- Time info (started at, estimated time remaining)
- One action button: "Start Prep" → "Start Cook" → "Mark Done"

### Task Status Flow

```
Not Started → Prepping → Cooking → Done
   (grey)     (blue)    (orange)  (green)
```

Each transition records a timestamp for timeline tracking.

### Recipe Quick Lookup

A search bar at the top. Worker types the first few letters of a dish name → autocomplete shows matches with photos. Selecting a dish shows:
- Ingredients list (auto-scaled to today's serving count) with bilingual names
- Step-by-step instructions (bilingual) with numbered circles

## Module 4: Owner Dashboard

### Overview

The owner's remote monitoring view. Shows real-time kitchen status, timeline progress, per-client delivery status, and alerts.

### UI Layout

**Top stats bar** (4 cards):
- Today's total servings + client count
- Active shift name
- Overall progress percentage with bar
- Alert count with most urgent alert preview

**Main area** (two columns):
- **Left: Shift Timeline** — Gantt-style horizontal bar chart. Each dish is a row. Bars show prep (blue) and cooking (orange) phases against a time axis. A red "NOW" marker shows current time. Dashed outlines show expected timing. Easy to spot anything behind schedule.
- **Right: Client Status** — Per-client cards showing progress bar, on-track/delayed badge, and summary of completed vs. pending dishes.

### Alert System

Three severity levels:
- **Critical (red):** Task should have started but hasn't. Delivery deadline at risk.
- **Warning (yellow):** Task is running but behind expected timeline.
- **Info (blue):** Routine updates — shift completed, menu not yet set for tomorrow.

Alerts show in the dashboard and as browser notifications. Future: SMS/WhatsApp alerts.

## Module 5: Client Management

### Overview

Simple CRUD for managing business clients.

### Client Fields

| Field | Required | Description |
|---|---|---|
| name | Yes | Business name |
| contactPerson | No | Primary contact name |
| contactPhone | No | Phone number |
| headcount | Yes | Number of people served |
| meals | Yes | Which meals: breakfast, lunch, dinner (multi-select) |
| deliveryAddress | No | Where food is delivered |
| deliveryTimes | No | Expected delivery time per meal |
| preferences | No | Dietary preferences, budget tier, special notes |

## Data Model

### Core Entities

**Client**
- id, name, contactPerson, contactPhone, headcount, meals[], deliveryAddress, deliveryTimes{}, preferences, createdAt, updatedAt

**Recipe**
- id, name_en, name_hi, photoUrl, categories[], baseServings, prepTimeMinutes, cookTimeMinutes, ingredients[{name_en, name_hi, quantity, unit}], steps[{order, description_en, description_hi}], createdBy, createdAt, updatedAt

**DailyMenu**
- id, date, clientId→Client, mealType(breakfast/lunch/dinner), dishes[{recipeId→Recipe, servings}], status(draft/published), publishedAt, createdBy, createdAt

**ShiftTask**
- id, date, dailyMenuIds[]→DailyMenu, recipeId→Recipe, shiftType(shift_4am/shift_6am/shift_6pm), totalServings, status(not_started/prepping/cooking/done), prepStartedAt, cookStartedAt, completedAt, expectedStartBy, expectedDoneBy, createdAt

**User**
- id, name, email, passwordHash, pin, role(owner/head_chef/supervisor/worker), assignedShift, isActive, createdAt

### Key Relationships

- Client 1:N DailyMenu (one per date per meal)
- DailyMenu N:N Recipe (multiple dishes per menu)
- DailyMenu 1:N ShiftTask (publishing generates tasks)
- Recipe referenced by ShiftTask (for ingredient lookup)
- ShiftTask aggregates servings across multiple clients for the same dish

## Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Next.js 15 (App Router) | SSR for dashboard, PWA for kitchen, API routes for backend — single codebase |
| Database | SQLite (via Turso/libsql) | Embedded DB, zero cost, zero maintenance. Sufficient for ~10 concurrent users. Migrate to PostgreSQL if multi-kitchen scaling needed |
| ORM | Drizzle ORM | Type-safe queries, SQLite-native, lightweight migration system, better SQLite support than Prisma |
| Auth | NextAuth.js | Email/password for owner, PIN-based custom provider for workers, role middleware |
| Real-time | Server-Sent Events (SSE) | One-way kitchen→dashboard updates, simpler than WebSockets, graceful offline fallback |
| Offline/PWA | next-pwa + Dexie.js (IndexedDB) | Service worker caching + local DB for kitchen station |
| i18n | next-intl | App Router compatible, supports Hindi/English/Kannada, message bundles |
| Styling | Tailwind CSS | Rapid development, responsive utilities, easy to build large-button worker UI |
| Deployment | Single VPS (Hetzner/DigitalOcean, ~$5/mo) | One server, one deploy via Docker Compose, SQLite on local disk. Minimal infra management |

## Future Phases (Out of Scope)

- **Phase 2: Packaging & Dispatch** — Package tracking per client order, dispatch management, handoff to transport
- **Phase 3: Fleet & Delivery** — Live GPS fleet tracking, delivery status, client-facing ETA
- **Future Kitchen Enhancements** — Touch kiosk mode, voice commands in Hindi, inventory/procurement management, cost tracking, WhatsApp/SMS alerts

## Success Criteria

1. Owner can create a full day's menu for all clients in under 10 minutes (vs. 30+ min with Excel)
2. Workers can look up any recipe and see today's tasks without needing to read — visual recognition only
3. Kitchen station works through a full-day internet outage without losing data
4. Owner can see real-time shift progress from his phone and gets alerts when something falls behind
5. System supports English + Hindi from day one, with Kannada addable via config
