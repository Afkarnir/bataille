describe('game spec', () => {
  beforeEach(() => {
    cy.createNewGame()
  })

  it('test header leave button', () => {
    cy.get('[data-testid="settings-button"]')
      .should('be.visible')
      .click()

    cy.get('[data-testid="leave"]')
      .should('be.visible')
      .click()

    cy.location('pathname')
      .should('eq', '/')
  })

  it('test game rules', () => {
    cy.get('[data-testid="player"]')
      .should('be.visible')
      .should('have.length', 2)

    for (let i = 0; i < 26; i++) {
      cy.get('[data-testid="play-button"]')
        .first()
        .click()

      cy.get('[data-testid="play-button"]')
        .last()
        .click()

      cy.wait(Cypress.env().waitBetweenTurns)
    }

    cy.get('[data-testid="leave"]')
      .should('be.visible')
      .click()

    cy.location('pathname')
      .should('eq', '/')
  })
})