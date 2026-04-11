# Backend Memory

## Current Architecture
- Stack: Express 5 + TypeScript + Mongoose + Zod.
- Entry point: src/index.ts.
- DB: MongoDB local URI mongodb://localhost:27017/smart_buy_list.
- Main route mount: /api/products.
- Error architecture:
  - AppError class in src/utils/AppError.ts.
  - catchAsync wrapper in src/utils/catchAsync.ts.
  - globalErrorHandler in src/middleware/errorHandler.ts.
  - validate middleware forwards Zod errors as AppError(400).

## API Surface (Current)
- POST /api/products
  - Bulk create only.
  - Request body: { products: ProductInput[] }.
  - Validation: createProductsSchema.
  - Response data: { createdCount, products }.
- GET /api/products
  - Returns all products.
- DELETE /api/products/:id
  - Validates ObjectId.
  - Returns deleted product in data.
- PATCH /api/products/:id
  - Validates ObjectId and request body via updateProductSchema.
  - Supports partial update for: name, description, bought, priority.

## Domain Model
- Product fields:
  - name (required, min 3)
  - description (optional)
  - bought (default false)
  - priority (low|medium|high, default medium)
  - createdAt / updatedAt via timestamps.

## Working Features
- Centralized error middleware is registered after routes.
- Async controller error forwarding works where catchAsync is used.
- Bulk create validation enforces min 1 and max 50 products per request.
- Request validation middleware active on POST and PATCH routes.

## Potential Bugs / Risks
- src/controllers/product.controller.ts: createProducts has `if (!createdProducts)` check, but insertMany returns an array; this condition is effectively unnecessary and message is misleading.
- src/controllers/product.controller.ts: getAllProducts checks `if (!products)` though `find()` returns [] when empty; this check is unnecessary.
- Naming drift: toggleBought now updates multiple fields (not only bought). Consider renaming to updateProductById for clarity.
- globalErrorHandler currently returns only message + optional stack; no structured validation details for field-level UI errors.
- No explicit catch-all 404 route middleware for unknown endpoints.
- Mongo URI is hardcoded in src/index.ts; should move to environment config for deployment safety.
- No graceful shutdown handling for process signals / DB disconnect.

## Suggested Next Improvements
- Remove/clean unreachable checks in createProducts/getAllProducts.
- Standardize all controllers to catchAsync + AppError style (if any remain mixed).
- Add not-found route middleware before globalErrorHandler.
- Add env-based config (PORT, MONGO_URI, NODE_ENV).
- Consider structured error codes/types for frontend handling.

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
