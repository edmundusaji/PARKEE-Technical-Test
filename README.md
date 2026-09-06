# Cypress Automation Assessment

This repository contains Cypress automation for two assessment cases:

- **Part A — API validation:** validates character and crew data returned by the One Piece API.
- **Part B — UI/end-to-end testing:** tests the SauceDemo login, inventory, cart, and checkout journey.

The runnable Cypress project is in [`PARKEE-Technical-Test`](PARKEE-Technical-Test/).

## Applications Under Test

- API: `GET https://api.api-onepiece.com/v2/characters/en`
- Website: [https://www.saucedemo.com/](https://www.saucedemo.com/)

## Test Coverage

### Part A: One Piece API

The API suite verifies that:

1. The response status is `200`.
2. Every character ID is unique.
3. `Gum-Gum Fruit` is not assigned to anyone other than `Monkey D. Luffy`.
4. Each crew's `total_prime` equals the sum of its members' bounties.

Spec: [`PARKEE-Technical-Test/cypress/e2e/one-piece-api.cy.js`](PARKEE-Technical-Test/cypress/e2e/one-piece-api.cy.js)

### Part B: SauceDemo UI

Each required page has at least one positive and one negative test.

| Page | Positive test | Negative test |
| --- | --- | --- |
| Login | A valid user reaches Inventory | A locked-out user receives an error |
| Inventory | Products display and sort correctly | Anonymous direct access is rejected |
| Cart | Selected products and quantities are correct | Anonymous direct access is rejected |
| Checkout Step One | Complete customer details advance to Step Two | A missing last name displays an error |
| Checkout Step Two | The selected item and calculated total are correct | Anonymous direct access is rejected |
| Checkout Complete | A completed purchase shows confirmation | Anonymous direct access is rejected |

Spec: [`PARKEE-Technical-Test/cypress/e2e/saucedemo.cy.js`](PARKEE-Technical-Test/cypress/e2e/saucedemo.cy.js)

## Bugs Identified

Two checkout defects are documented in [BUG_REPORT.md](BUG_REPORT.md):

1. **BUG-01:** An empty cart can continue to Checkout Step One.
2. **BUG-02:** An authenticated user can open the success page without completing an order.

The report contains the reproduction steps, expected and actual results, severity, impact, and suggested Cypress assertions. The known defects are documented in Markdown rather than included as deliberately failing automated tests.

## Prerequisites

Install:

- A current Node.js LTS release, including npm
- Git, if cloning the repository
- Chrome, Edge, or another Cypress-supported browser for interactive execution

Confirm that Node.js and npm are available:

```powershell
node --version
npm --version
```

## Setup

Clone the GitHub repository:

```powershell
git clone <repository-url>
cd <repository-directory>\PARKEE-Technical-Test
```

Install dependencies:

```powershell
npm install
```

Verify Cypress:

```powershell
npx cypress verify
```

No private credentials or environment variables are required. The UI tests use SauceDemo's public test account:

```text
Username: standard_user
Password: secret_sauce
```

## Execution

Run the following commands from the `PARKEE-Technical-Test` directory.

### API validation

```powershell
npm run test:api
```

At the last verification, three API checks passed and the crew-total validation failed because several live API values did not satisfy the required calculation. Live API data may change.

### SauceDemo functional UI tests

```powershell
npm run test:functional
```

Expected result:

```text
12 passing
```

These are UI/end-to-end tests even in headless mode. Cypress opens SauceDemo, enters form data, clicks controls, navigates through pages, and validates the rendered interface.

### Interactive Cypress runner

```powershell
npm run cy:open
```

Then:

1. Select **E2E Testing**.
2. Choose an installed browser.
3. Select the spec to run.
4. Review the Cypress command log and assertions.

### Run every spec

```powershell
npm test
```

## Repository Structure

```text
PARKEE-Technical-Test/
├── cypress/
│   └── e2e/
│       ├── one-piece-api.cy.js
│       └── saucedemo.cy.js
├── .gitignore
├── cypress.config.js
├── package-lock.json
├── package.json
├── BUG_REPORT.md
└── README.md

```

## Test Output

- Failed tests generate screenshots under `PARKEE-Technical-Test/cypress/screenshots/`.
- Video recording is disabled in `PARKEE-Technical-Test/cypress.config.js`.
