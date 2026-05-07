# Plan: Discount spamming / “Stack the Savings” flag

**Owner:** Soham  
**Challenge flag:** `CTF{discount_stacking_exploit}`  
**Category:** `logic-flaw` (easy)  
**Intent:** 10% off promo (banner or popup); at checkout, players can **stack** the same discount (e.g. 10×) so the order total goes to **$0**; backend must **not** fully re-validate totals (intentional CTF behaviour).

Use this doc as a checklist while implementing. Update the “Status” section as you go.

---

## Status


| Step                                          | Done |
| --------------------------------------------- | ---- |
| UI: promo surface (banner / modal)            | ☐    |
| Checkout: apply discount + stacked total      | ☐    |
| API: body fields + CTF comment on server      | ☐    |
| Seed: challenge copy aligned                  | ☐    |
| Flag reveal path (modal / API / confirmation) | ☐    |
| Manual test + lint/build                      | ☐    |


---

## Context (read first)

- **Checkout today:** `frontend/src/pages/CheckoutPage.jsx` — `total = cartTotal + shipping`; `createOrder` does not send `discountApplied`.
- **Backend today:** `POST /api/orders` in `backend/src/controllers/order.controller.js` accepts `total` and `discountApplied` from the body and **does not recompute** totals from line items — this is the hook for the logic flaw.
- **Model:** `discountApplied` on `Order` (`backend/src/models/order.model.js`); `OrderDetailPage` can show it when `> 0`.
- **Challenge record:** `backend/src/config/seed.global.js` — challenge **“Stack the Savings”** (upserted by `title`). Flag string must stay `**CTF{discount_stacking_exploit}`** unless the team re-seeds with a new flag everywhere.

---

## Player journey / flag reveal

### How scoring works in this app

1. `**/challenges` never sends the flag** — the API omits `challenge.flag` so players cannot read it from the challenge list alone.
2. **Submitting** — players paste `CTF{...}` into **Submit flag** for the matching challenge; the server compares it to the value in MongoDB (seeded as `CTF{discount_stacking_exploit}`).

So **stacking the discount proves the vulnerability**, but it does **not** automatically give someone the exact string unless **you** expose it somewhere legitimate for this lab.

### Why “click 10×” alone does not show the flag

Nothing in the backend guarantees a popup with the flag after a free checkout unless you implement it. Plan explicitly **how** players obtain the literal string after they succeed.

### Recommended ways to surface the flag (pick one primary path)


| Approach                                  | Notes                                                                                                                                                                                                                                                      |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Success modal after exploitable order** | After placing an order with `**total === 0`** (or after first qualifying exploit), show `frontend/src/components/common/FlagFoundModal.jsx` with `CTF{discount_stacking_exploit}` and short copy (“Nice — submit this on Challenges”). Best for beginners. |
| **Flag in API response**                  | Include a field only when discount exploit succeeded (e.g. `congratulationsFlag`) so DevTools/network tab hunters find it. Pair with UI modal if you want parity for non–network players.                                                                  |
| **Order confirmation screen**             | Same string on the post-checkout view only when conditions match (avoid leaking on normal orders).                                                                                                                                                         |


### Avoid

- Putting the flag in **every** order response or banner without conditions (cheapens the challenge).
- Expecting players to **guess** the slug with no in-app leak — poor UX for an **easy** challenge.

### End-to-end journey (target experience)

1. User sees **10% off** promo → goes to checkout.
2. User **stacks** the discount until merchandise is free (per your math).
3. User places order successfully (**server accepts** client `total` — intentional flaw).
4. User sees **flag reveal** (modal / confirmation / structured API field).
5. User opens `**/challenges`** → **Stack the Savings** → pastes `**CTF{discount_stacking_exploit}`** → earns points.

---

## Design decisions (fill in before coding)

1. **Promo placement:** ☐ site-wide banner ☐ homepage ☐ checkout-only popup (pick one primary).
2. **Stacking math:** Recommend **additive on subtotal** for clarity: each “Apply 10% off” adds 10% off the **original** subtotal → 10 applications = 100% off merchandise (then add shipping rules below).
3. **Shipping:** Keep existing rule (`cartTotal >= 500` → free shipping) **based on pre-discount cart** or **post-discount** — choose one and document in UI so totals are not confusing.
4. **Minimum total:** Allow `$0.00` order for CTF demo, or require `total >= 0` only — avoid negative totals.

---

## Implementation plan (ordered)

### 1. Frontend — promo surface

- Add a dismissible **banner** or **modal** advertising **10% off** with copy that nudges users toward checkout (no flag string in UI).
- Prefer a reusable piece under `frontend/src/components/common/` if other pages might reuse it.
- **Styling:** Tailwind only; match existing APapparel tokens (`primary`, surfaces).

### 2. Frontend — checkout stacking UX

- In `CheckoutPage.jsx`:
  - Track **how many times** the promo was applied (or a **discount percent** capped at 100% for display).
  - Show **Subtotal**, **Discount** line(s), **Shipping**, **Total**.
  - **Apply** button (or equivalent): each click applies another 10% slice toward the cap (see math above).
  - On submit, pass to `createOrder`:
    - `total` — final number the user pays (can be `0`).
    - `discountApplied` — dollar amount discounted (for order history / realism).
  - Ensure `handlePlaceOrder` uses the **discounted** total, not raw `cartTotal + shipping` only.
  - Implement **flag reveal** per [Player journey / flag reveal](#player-journey--flag-reveal) (e.g. `FlagFoundModal` when qualifying order succeeds, or controlled API field).

### 3. Backend — intentional weakness (document, don’t “fix”)

- In `createOrder`:
  - Optionally clamp absurd negatives if you want to avoid broken DB state; **do not** fully recompute `total` from `items` + shipping − discount (that would kill the challenge).
  - Add: `// CTF: intentional vulnerability — logic-flaw (discount stacking)` near the trust boundary.

### 4. Seed / challenge copy

- In `backend/src/config/seed.global.js`, align **title/description/hints** with “Discount spamming” / banner + multi-apply if you rename (remember **upsert by `title`** — avoid orphan duplicate titles).
- Sync `backend/seed.js` only if your team still runs that script.

### 5. Verification

- Place order with stacked discount → **$0** total succeeds.
- Order detail shows sensible `total` / `discountApplied`.
- `/challenges`: submit `CTF{discount_stacking_exploit}` succeeds after exploit (players must have obtained the string via your reveal path).
- `npm run lint` + `npm run build` in `frontend/`.

---

## Suggested commit plan

Use **small, reviewable commits**. Messages below are templates—adjust if you bundle steps.


| #   | Commit subject (example)                                                   | Contents                                                                                                                             |
| --- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | `feat(checkout): add discount state and order payload`                     | Checkout only: state, UI lines, `createOrder` includes `discountApplied` + corrected `total`; no banner yet if you prefer splitting. |
| 2   | `feat(store): add 10% off promo banner/modal`                              | New component + wire into `HomePage` or `App` / layout as chosen.                                                                    |
| 3   | `chore(backend): document CTF discount-trust boundary in order controller` | Comment + any minimal validation (e.g. reject `total < 0` only).                                                                     |
| 4   | `chore(seed): align Stack the Savings challenge copy`                      | `seed.global.js` (+ `seed.js` if needed).                                                                                            |


**Optional squash:** If your team prefers one PR = one commit, squash to a single message like  
`feat: discount stacking logic-flaw at checkout (CTF Stack the Savings)`.

---

## Testing checklist

- Logged-in user with items in cart sees promo (if on eligible routes).
- Checkout: multiple applies reduce total; **10 stacks → free** (per your math).
- Order appears in history with expected amounts.
- Flag reveal appears only after qualifying exploit (if implemented).
- Flag submits successfully on Challenges page.
- No new ESLint warnings (`frontend`: max-warnings 0).

---

## References

- `frontend/src/pages/CheckoutPage.jsx`
- `frontend/src/api/order.api.js`
- `backend/src/controllers/order.controller.js`
- `backend/src/models/order.model.js`
- `backend/src/config/seed.global.js`
- `CLAUDE.md` — flag format, `CTF:` comments, design consistency

