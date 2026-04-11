# Frontend Memory

## Architecture Overview
- Stack: React + TypeScript + Vite with BrowserRouter.
- Entry flow:
  - `src/main.tsx` mounts app inside `BrowserRouter` and `StrictMode`.
  - `src/App.tsx` defines route `/` -> `ShoppingListPage`.
- Main page orchestration in `src/pages/ShoppingListPage.tsx`:
  - Owns full shopping state (`items`) and derived views (`remainingItems`, `boughtItems`).
  - Handles data fetching on mount (`getShoppingList`).
  - Implements optimistic updates for bought toggle, delete, and priority changes.
  - Controls edit modal and bulk-add modal open/saving state.
- API layer in `src/services/shoppingService.tsx`:
  - Centralized `API_URL = http://localhost:3000/api/products`.
  - Shared API envelope parser `parseApiResponse<T>` expecting `{ success, data, message }`.
  - Contracts:
    - `getShoppingList(): ShoppingItem[]`
    - `addProducts(products): { createdCount, products }`
    - `updateProduct(id, updates): ShoppingItem`
    - `deleteProduct(id): ShoppingItem`
- Component structure:
  - `ShoppingList` renders list/empty state and delegates item actions.
  - `ShoppingItem` renders card UI and action icons (edit/move/delete).
  - `ProductEditModal` handles name/description edit with inline validation.
  - `ProductsAddingModal` parses multiline text into product array for bulk create.
- Domain type in `src/types/shopping.types.ts`:
  - `ShoppingItem` with `_id`, `name`, optional `description`, `bought`, `priority`, `createdAt`, `updatedAt`.

## Implemented Features
- Hebrew/RTL-oriented shopping list UX.
- Two-list layout:
  - Remaining products.
  - Bought products.
- Summary stats cards:
  - Total items.
  - Bought count.
  - Pending count.
- Product actions:
  - Toggle bought status (optimistic).
  - Delete product (optimistic with rollback).
  - Edit product via modal (name + description).
- Bulk add products:
  - Modal accepts multiline input.
  - Each non-empty line maps to a product `{ name }`.
  - Sends bulk payload `{ products: [...] }`.
- Priority capability is preserved in types/components but can be hidden by context via `showPriority={false}`.

## Behavioral Notes
- Delete rollback is index-precise:
  - If delete fails, item is reinserted at original index.
- Delete response mismatch handling:
  - If server returns a deleted `_id` not matching request, page triggers full refetch to resync.
- Edit flow:
  - Local modal validation enforces minimum product name length.
  - On success, updated product replaces matching item by `_id`.
- Bulk add flow:
  - Empty submission blocked with user-facing error.
  - On success, created products are prepended to current list.

## Known Risks / Gaps
- No user-facing global error surface (toasts/banner). Most failures only log to console.
- `API_URL` is hardcoded; no environment-based config (`import.meta.env`).
- `handleSaveProducts` closes modal in page logic; modal also closes itself after `onSave`. This is redundant (works, but duplicated responsibility).
- In simple grocery mode, priority is hidden but still updated by available handler path; ensure product requirements stay aligned.
- No request cancellation for in-flight fetches on unmount.
- No automated frontend tests (unit/component/e2e) to guard optimistic behavior and modal flows.

## Conventions
- API responses are expected in a consistent envelope:
  - success boolean
  - data payload
  - optional message
- Optimistic UI updates should include rollback behavior for failure cases.
- Keep server-generated fields (`_id`, timestamps, `bought`) out of create DTOs.

## Suggested Next Improvements
1. Add env-based API base URL using `VITE_API_URL` with fallback.
2. Add a shared error notification system (toast or inline alert region).
3. Add tests for:
   - optimistic toggle/delete rollback
   - bulk add parsing
   - edit modal validation and save
4. Consolidate modal close responsibility (page vs modal) to one owner.
5. Consider moving data fetching/mutations into a hook (`useShoppingList`) or React Query for caching/retries.
6. Improve accessibility:
   - focus trap in modals
   - keyboard shortcuts and stronger aria messaging for action feedback.

## Sync Contract Checklist (Frontend <-> Backend)
- Base URL and route:
  - Frontend uses `/api/products` (via API_URL or env).
  - Backend mounts products router at `/api/products`.
- Response envelope consistency for all endpoints:
  - Shape must remain `{ success, data, message? }`.
  - `success` is boolean.
  - `data` exists on successful responses.
- GET `/api/products`:
  - Response `data` is `ShoppingItem[]`.
  - Empty list returns `[]`, not null.
- POST `/api/products` (bulk only):
  - Request body shape is `{ products: ProductInput[] }`.
  - Product input includes `name` and optional `description`.
  - Response `data` shape is `{ createdCount: number, products: ShoppingItem[] }`.
  - `createdCount === products.length`.
- PATCH `/api/products/:id`:
  - Accepts partial updates for `name | description | bought | priority`.
  - Response `data` is the fully updated product object.
  - Invalid ObjectId returns 400.
  - Unknown id returns 404.
- DELETE `/api/products/:id`:
  - Response `data` is the deleted product object.
  - Invalid ObjectId returns 400.
  - Unknown id returns 404.
- Domain field alignment:
  - Product object includes `_id, name, description?, bought, priority, createdAt, updatedAt`.
  - `priority` enum stays `low | medium | high`.
- Validation alignment:
  - Name min length in backend schema and frontend form validation remain aligned.
  - Bulk limits (min/max products per request) are documented and reflected in UI behavior.
- Error contract alignment:
  - Validation/business errors return clear `message`.
  - If backend adds field-level error metadata, frontend parser/types are updated in the same change.
- Change management rule:
  - Any API shape change requires same-PR updates to:
    - backend Zod schema/controller response
    - frontend DTO/types/service parser
    - both memory files checklist/notes
