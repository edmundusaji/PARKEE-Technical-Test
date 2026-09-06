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