# AIOM Dashboard — AI Agent Guide

Admin web dashboard for the AIOM system. Also read the root `AGENTS.md` for repo-wide rules.

## Stack

- React 19 + TypeScript, built with CRA (`react-scripts`) — package manager: **yarn**
- State: Redux Toolkit (slice + thunk per domain)
- Styling: TailwindCSS + SCSS, light/dark theme via CSS variables
- Forms: Formik + Yup · i18n: i18next · Tables: @tanstack/react-table · Charts: ApexCharts
- HTTP: axios (used only inside `src/apis/`)

## Directory Structure

```
src/
├── apis/<domain>/        # axios API functions (customer, order, product, receipt, …)
├── slices/<domain>/      # Redux Toolkit slice + thunks per domain; registered in slices/index.ts
├── pages/Dashboards/<Domain>/   # feature screens (Customer, Order, Product, Receipt, …)
├── pages/Authentication/ # login/logout flows
├── Common/               # shared UI: TableContainer, Pagination, DeleteModal, BreadCrumb, …
│   ├── Components/       # smaller shared widgets
│   ├── constants/ enums/ # shared values
├── Layout/               # app shell (sidebar, header, footer)
├── Routes/               # allRoutes.ts + AuthProtected wrapper
├── helpers/              # pure utilities, formatters
├── locales/              # i18next translation files
├── slices/               # redux store
└── types/                # shared TypeScript types
```

## Engineering Rules (MUST FOLLOW)

### Data flow — strict layering

```
Component → dispatch(thunk) → slice → src/apis/<domain>/ → backend
```

- Components **never** call axios/fetch directly; they dispatch thunks and read state via selectors.
- New domain = new folder in `src/apis/<domain>/` + new slice in `src/slices/<domain>/` registered in `src/slices/index.ts`.
- API functions stay thin: request + typed response, no business logic.

### Structure & file splitting

- Feature screens live in `src/pages/Dashboards/<Domain>/`. Keep the main screen file to layout + orchestration; extract tables, modals, and form sections into per-section components in the same folder when the file approaches ~300 lines (hard ceiling 500).
- Reuse `Common/` components (`TableContainer`, `TableCustom`, `Pagination`, `DeleteModal`, `BreadCrumb`, dropdowns) before building new ones. New shared UI goes in `Common/`, not copied between pages.
- Types in `src/types/`; shared enums/constants in `src/Common/enums` and `src/Common/constants`; pure functions in `src/helpers/`.

### UI/UX

- Every async view handles loading, error (with retry), and empty states — not just success.
- All user-facing strings go through i18next (`src/locales/`); no hardcoded copy.
- Forms: Formik + Yup with field-level error messages; disable submit while pending.
- Tables use server-side pagination via the shared `Pagination` component.
- Destructive actions require confirmation (`DeleteModal`); show success/failure via react-toastify.
- Charts via ApexCharts wrappers; respect light/dark theme variables — no hardcoded colors.
- Money formats as VND using shared formatters; dates via `dayjs`.

### Routing & auth

- Register routes in `src/Routes/allRoutes.ts`; authenticated pages go through `AuthProtected`.

### Documentation & verification

- Complex features (reporting logic, receipt/payment flows, cross-domain screens) require a doc in `fe-dashboard/docs/` covering purpose, data flow, and edge cases.
- Before finishing: `yarn build` must pass (it type-checks the project).

## Receipt Return Reference

| Feature | Component | Documentation |
| --- | --- | --- |
| Debt return/exchange v3 review | ReceiptReturn/components/DebtReturnReview | docs/receipt-debt-return-exchange.md |

## Observability Reference

| Feature | Implementation | Documentation |
| --- | --- | --- |
| Safe client exceptions and API correlation | src/helpers/api-telemetry.ts, source-maps.ts | docs/observability.md |
