# Mobile-Ready Design — MathTutor CRM

**Date:** 2026-06-27
**Scope:** Responsive layout, bottom navigation, calendar day view on mobile, student contact validation fix.

---

## 1. Navigation

### Mobile (< 768px / `md` breakpoint)

- **Sidebar hidden** — `hidden md:flex` on the `<aside>`.
- **Top header** — new `MobileHeader` component rendered in `AppLayout` only on mobile (`flex md:hidden`). Shows the ∑ logo and current page title (derived from pathname). Fixed at top, `h-14`, white background, `border-b border-indigo-100`.
- **Bottom tab bar** — new `BottomNav` client component, `fixed bottom-0 inset-x-0`, white background, `border-t border-indigo-100`, `pb-4` bottom padding. Four tabs: Dashboard (🏠), Students (👥), Calendar (📅), Payments (💶). Each tab: icon + label, active tab text and icon in indigo. Admin link is omitted from the bottom bar (low-traffic); it remains accessible via `/admin` URL on mobile. Sign out stays on the Admin page.
- **Content area** gets `pb-20` on mobile to clear the bottom bar.

### Desktop (≥ 768px)

Sidebar unchanged.

---

## 2. AppLayout

```
AppLayout
├── MobileHeader (flex md:hidden) — top bar with logo + page title
├── Sidebar     (hidden md:flex)  — existing sidebar, no changes
├── main content (flex-1)
│   └── children (pb-20 md:pb-0 to clear bottom nav on mobile)
└── BottomNav   (flex md:hidden)  — fixed bottom tab bar
```

---

## 3. Page Layout Fixes

All changes are Tailwind responsive classes. No new components unless noted.

### Dashboard (`page.tsx`)

| Element | Current | Mobile fix |
|---------|---------|------------|
| Page header | `px-7 py-4` | `px-4 py-3 md:px-7 md:py-4` |
| KPI grid | `grid-cols-4` | `grid-cols-2 md:grid-cols-4` |
| Main content | `grid-cols-[1fr_320px]` | `grid-cols-1 md:grid-cols-[1fr_320px]` |
| Upcoming lesson row | `grid-cols-[36px_1fr_72px_80px_52px]` | On mobile: two-row card — avatar + name/time stacked, grade + status + cost in a flex row below |
| Content padding | `p-7` | `p-4 md:p-7` |
| Date locale | `en-GB` | `pt-PT` (fix existing inconsistency) |

### Students list (`students/page.tsx`)

| Element | Current | Mobile fix |
|---------|---------|------------|
| Grid | unspecified (likely 1–3 col) | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` |
| Page header | `px-7 py-4` | `px-4 py-3 md:px-7 md:py-4` |

Student cards are already compact enough to work at full width.

### Student profile (`students/[id]/page.tsx` and sub-components)

| Element | Current | Mobile fix |
|---------|---------|------------|
| Page header | `px-7 py-4` | `px-4 py-3 md:px-7 md:py-4` |
| Stat bar | `grid-cols-3` or flex row | `grid-cols-2 md:grid-cols-3` |
| Tab nav | horizontal links | `overflow-x-auto` scroll if needed |
| Lesson row | `grid-cols-[90px_1fr_auto_auto]` | On mobile: stacked — date/badge on top, notes below, cost + actions in a bottom row |
| Content padding | `p-7` | `p-4 md:p-7` |

### Payments (`payments/page.tsx`)

- Header padding: `px-4 md:px-7`.
- Row padding: `px-4 md:px-5`, reduce column count if needed.

### Calendar (`calendar/page.tsx`)

- Header padding only — layout is controlled by FullCalendar.

---

## 4. Calendar — Day View on Mobile

In `LessonCalendar`:

- On mount, read `window.innerWidth`. If `< 768`, set `initialView = 'timeGridDay'`; otherwise `'timeGridWeek'`. Store in state; no SSR concern since the component is already `'use client'`.
- `headerToolbar` switches on mobile:
  - **Mobile:** `{ left: 'prev,next', center: 'title', right: 'today' }` — removes month/week/day switcher.
  - **Desktop:** current toolbar unchanged.
- No change to the slot-click → schedule dialog flow.

---

## 5. Dialogs — Bottom Sheet on Mobile

All scheduling/payment/notes dialogs use `@base-ui/react` Select via `DialogContent`. On mobile they should feel like bottom sheets.

- In `src/components/ui/dialog.tsx`, update `DialogContent`'s className to include: `sm:max-w-sm max-w-full w-full sm:rounded-xl rounded-t-xl sm:top-[50%] top-auto bottom-0 sm:bottom-auto translate-y-0 sm:-translate-y-1/2`.
- This positions the dialog flush to the bottom on mobile (rounded top corners) and centered on desktop — no JS needed, pure CSS via Tailwind breakpoints.

---

## 6. Student Contact Validation Fix

In `AddStudentDialog` (and `EditStudentDialog` if it exists):

- `parent_email` field: remove `required`.
- `parent_phone` field: remove `required`.
- Add client-side validation on submit: if both `parent_email` and `parent_phone` are empty, show an inline error "Please provide at least a phone number or email."
- DB schema likely has both as nullable — no migration needed (verify before implementing).
- Display label changes: "Contact" section header with "(phone or email required)" note.

---

## 7. What Is Not Changing

- Sidebar markup and styles on desktop — zero changes.
- FullCalendar week view on desktop — unchanged.
- All server actions and data fetching — purely a presentation layer change.
- Auth and middleware — untouched.

---

## 8. Files Touched

| File | Change |
|------|--------|
| `src/app/(app)/layout.tsx` | Add MobileHeader + BottomNav, `pb-20 md:pb-0` on content |
| `src/components/layout/sidebar.tsx` | Add `hidden md:flex` |
| `src/components/layout/mobile-header.tsx` | **New** — top bar for mobile |
| `src/components/layout/bottom-nav.tsx` | **New** — fixed bottom tab bar |
| `src/app/(app)/page.tsx` | Responsive grid classes, fix date locale |
| `src/app/(app)/students/page.tsx` | Responsive grid |
| `src/app/(app)/students/[id]/page.tsx` | Responsive header |
| `src/app/(app)/students/[id]/stat-bar.tsx` | `grid-cols-2 md:grid-cols-3` |
| `src/app/(app)/students/[id]/tab-nav.tsx` | Overflow scroll |
| `src/app/(app)/students/[id]/tabs/lessons-tab.tsx` | Mobile-stacked lesson row |
| `src/app/(app)/payments/page.tsx` | Responsive padding |
| `src/components/calendar/lesson-calendar.tsx` | Dynamic initialView + headerToolbar |
| `src/components/ui/dialog.tsx` | Bottom sheet positioning on mobile |
| `src/components/students/add-student-dialog.tsx` | Contact validation fix |
