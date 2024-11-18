describe('template spec', () => {
  beforeEach(() => {
    cy.intercept('GET', `${Cypress.env().apiUrl}/games`, { statusCode: 500, body: { message: 'Internal server error' } }).as('games')
    cy.intercept('GET', `${Cypress.env().apiUrl}/players`, { statusCode: 500, body: { message: 'Internal server error' } }).as('players')

    cy.visit('/')

    cy.wait('@games')
    cy.wait('@players')
  })

  it('test error', () => {
    cy.get('[data-testid="error-title"]')
      .should('be.visible')
    
    cy.get('[data-testid="error-message"]')
      .should('be.visible')
      .should('have.text', 'Internal server error')
  })

  it('test retry button', () => {
    cy.intercept('GET', `${Cypress.env().apiUrl}/games`, { fixture: 'games' }).as('games')
    cy.intercept('GET', `${Cypress.env().apiUrl}/players`, { fixture: 'players' }).as('players')

    cy.get('[data-testid="retry"]')
      .should('be.visible')
      .click()

    cy.get('[data-testid="error-title"]')
      .should('not.exist')
  })
})