const PASSWORD = 'secret_sauce'

const login = (username = 'standard_user') => {
  cy.visit('/')
  cy.get('[data-test="username"]').type(username)
  cy.get('[data-test="password"]').type(PASSWORD, { log: false })
  cy.get('[data-test="login-button"]').click()
}

const addBackpackAndOpenCart = () => {
  login()
  cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click()
  cy.get('[data-test="shopping-cart-link"]').click()
}

const openCheckoutStepOne = () => {
  addBackpackAndOpenCart()
  cy.get('[data-test="checkout"]').click()
  cy.location('pathname').should('eq', '/checkout-step-one.html')
}

const openCheckoutStepTwo = () => {
  openCheckoutStepOne()
  cy.get('[data-test="firstName"]').type('Monkey')
  cy.get('[data-test="lastName"]').type('Luffy')
  cy.get('[data-test="postalCode"]').type('10101')
  cy.get('[data-test="continue"]').click()
  cy.location('pathname').should('eq', '/checkout-step-two.html')
}

const expectProtectedRouteToRejectAnonymousUser = (pathname) => {
  cy.visit(pathname, { failOnStatusCode: false })
  cy.location('pathname').should('eq', '/')
  cy.get('[data-test="error"]')
    .should('be.visible')
    .and('contain', `You can only access '${pathname}' when you are logged in`)
}


describe('SauceDemo functional test cases', () => {
  context('Login Page', () => {
    it('positive: logs in with a valid standard user', () => {
      login()

      cy.location('pathname').should('eq', '/inventory.html')
      cy.get('[data-test="title"]').should('have.text', 'Products')
    })

    it('negative: rejects a locked-out user', () => {
      login('locked_out_user')

      cy.location('pathname').should('eq', '/')
      cy.get('[data-test="error"]')
        .should('be.visible')
        .and('contain', 'Sorry, this user has been locked out')
    })
  })

  context('Inventory Page', () => {
    it('positive: displays all products and sorts them from low to high price', () => {
      login()

      cy.get('[data-test="inventory-item"]').should('have.length', 6)
      cy.get('[data-test="product-sort-container"]').select('lohi')

      cy.get('[data-test="inventory-item-price"]').then(($prices) => {
        const prices = [...$prices].map((element) =>
          Number(element.textContent.replace('$', '')),
        )
        const sortedPrices = [...prices].sort((a, b) => a - b)

        expect(prices, 'displayed prices').to.deep.equal(sortedPrices)
      })
    })

    it('negative: prevents an anonymous user from opening inventory directly', () => {
      expectProtectedRouteToRejectAnonymousUser('/inventory.html')
    })
  })

  context('Cart Page', () => {
    it('positive: adds two selected products with the correct names and quantities', () => {
      login()
      cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click()
      cy.get('[data-test="add-to-cart-sauce-labs-bike-light"]').click()
      cy.get('[data-test="shopping-cart-badge"]').should('have.text', '2')
      cy.get('[data-test="shopping-cart-link"]').click()

      cy.location('pathname').should('eq', '/cart.html')
      cy.get('[data-test="inventory-item"]').should('have.length', 2)
      cy.get('[data-test="inventory-item-name"]')
        .then(($names) => [...$names].map((element) => element.textContent))
        .should('deep.equal', ['Sauce Labs Backpack', 'Sauce Labs Bike Light'])
      cy.get('[data-test="item-quantity"]').each(($quantity) => {
        cy.wrap($quantity).should('have.text', '1')
      })
    })

    it('negative: prevents an anonymous user from opening the cart directly', () => {
      expectProtectedRouteToRejectAnonymousUser('/cart.html')
    })
  })

  context('Checkout Step One Page', () => {
    it('positive: accepts complete customer information', () => {
      openCheckoutStepOne()

      cy.get('[data-test="firstName"]').type('Monkey')
      cy.get('[data-test="lastName"]').type('Luffy')
      cy.get('[data-test="postalCode"]').type('10101')
      cy.get('[data-test="continue"]').click()

      cy.location('pathname').should('eq', '/checkout-step-two.html')
      cy.get('[data-test="title"]').should('have.text', 'Checkout: Overview')
    })

    it('negative: shows an error when the last name is missing', () => {
      openCheckoutStepOne()

      cy.get('[data-test="firstName"]').type('Monkey')
      cy.get('[data-test="postalCode"]').type('10101')
      cy.get('[data-test="continue"]').click()

      cy.location('pathname').should('eq', '/checkout-step-one.html')
      cy.get('[data-test="error"]')
        .should('be.visible')
        .and('have.text', 'Error: Last Name is required')
    })
  })

  context('Checkout Step Two Page', () => {
    it('positive: shows the selected item and a mathematically correct order total', () => {
      openCheckoutStepTwo()

      cy.get('[data-test="inventory-item-name"]').should(
        'have.text',
        'Sauce Labs Backpack',
      )

      cy.get('[data-test="subtotal-label"]').invoke('text').then((subtotalText) => {
        cy.get('[data-test="tax-label"]').invoke('text').then((taxText) => {
          cy.get('[data-test="total-label"]').invoke('text').then((totalText) => {
            const subtotal = Number(subtotalText.match(/[\d.]+/)[0])
            const tax = Number(taxText.match(/[\d.]+/)[0])
            const total = Number(totalText.match(/[\d.]+/)[0])

            expect(total, 'displayed total').to.be.closeTo(subtotal + tax, 0.001)
          })
        })
      })

      cy.get('[data-test="finish"]').should('be.visible').and('be.enabled')
    })

    it('negative: prevents an anonymous user from opening checkout overview directly', () => {
      expectProtectedRouteToRejectAnonymousUser('/checkout-step-two.html')
    })
  })

  context('Checkout Complete Page', () => {
    it('positive: completes an order from inventory to confirmation', () => {
      openCheckoutStepTwo()
      cy.get('[data-test="finish"]').click()

      cy.location('pathname').should('eq', '/checkout-complete.html')
      cy.get('[data-test="complete-header"]').should(
        'have.text',
        'Thank you for your order!',
      )
      cy.get('[data-test="back-to-products"]').should('be.visible')
    })

    it('negative: prevents an anonymous user from opening confirmation directly', () => {
      expectProtectedRouteToRejectAnonymousUser('/checkout-complete.html')
    })
  })

  
})