SauceDemo Known Bugs

These defects were identified while designing and executing the positive and negative Cypress cases in `PARKEE-Technical-Test/cypress/e2e/saucedemo.cy.js`.

They are documented here instead of being included as intentionally failing automated tests. This keeps the submitted Cypress functional suite green while still recording the incorrect application behavior, reproduction steps, and expected results.

## BUG-01: Empty cart can continue to checkout

| Field | Details |
| --- | --- |
| Area | Cart / Checkout Step One |
| Severity | Medium |
| Test type | Negative / workflow validation |
| Browser state | Authenticated as `standard_user` |

### Preconditions

- The user is logged in.
- No products have been added to the cart.

### Steps to reproduce

1. Sign in as `standard_user` using password `secret_sauce`.
2. Open the cart without adding a product.
3. Confirm that the cart contains no inventory items.
4. Click **Checkout**.

### Expected result

The user should remain on `/cart.html`. Checkout should be blocked and the page should display a message explaining that at least one product is required.

### Actual result

The application navigates to `/checkout-step-one.html` and allows the user to enter customer information even though the cart is empty.

### Impact

The checkout workflow can begin without an order item. This allows an invalid order state to progress deeper into the purchasing flow.

## BUG-02: Confirmation is accessible without completing an order

| Field | Details |
| --- | --- |
| Area | Checkout Complete |
| Severity | High |
| Test type | Negative / navigation guard |
| Browser state | Authenticated as `standard_user` without an order |

### Preconditions

- The user is logged in.
- The cart is empty.
- The user has not submitted customer information or clicked **Finish**.

### Steps to reproduce

1. Sign in as `standard_user` using password `secret_sauce`.
2. Do not add any products.
3. Navigate directly to `/checkout-complete.html`.

### Expected result

The application should redirect the user to `/inventory.html`, the cart, or the appropriate checkout step. It should not show an order-success message.

### Actual result

The application displays `Thank you for your order!` on `/checkout-complete.html` even though no order was submitted.

### Impact

The site displays a false success state and does not enforce the required checkout sequence. A user or automated process could incorrectly interpret the confirmation as evidence that an order was created.

## Summary

| Bug | Expected | Actual |
| --- | --- | --- |
| BUG-01 | Empty-cart checkout is blocked | Checkout Step One opens |
| BUG-02 | Confirmation requires a completed order | Confirmation opens directly |

These scenarios should be converted into regression tests when the application behavior is fixed. Until then, this document serves as the defect evidence and avoids adding deliberately failing cases to the normal execution report.