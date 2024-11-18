describe('header spec', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should have a header', () => {
    cy.get('[data-testid="header"]').should('be.visible')
    cy.get('[data-testid="header-title"]').should('have.text', 'Jeu de bataille')
  })

  it('should have a button that open settings dialog', () => {
    cy.get('[data-testid="settings-button"]')
      .should('be.visible')
      .click()

    cy.get('[data-testid="language-title"]').should('be.visible')
  })

  describe('settings dialog', () => {
    beforeEach(() => {
      cy.get('[data-testid="settings-button"]')
        .click()
    })

    it('test language selector', () => {
      cy.get('[data-testid="language-title"]').should('be.visible')
      cy.get('[data-testid="language-dropdown"]')
        .should('be.visible')
        .click()
      cy.get('p-dropdownitem [aria-label="en"]')
        .should('be.visible')
        .click()

      cy.get('[data-testid="language-title"]').should('have.text', 'Language')
    })

    it('test font size slider', () => {
      cy.get('[data-testid="font-size"]').should('be.visible')
      cy.get('[data-testid="font-size-slider"]')
        .should('be.visible')
        .get('.p-slider-handle')
        .click()
        .type('{rightarrow}')

      cy.get('body')
        .should('have.css', 'font-size')
        .and('eq', '20px')
    })

    it('test close button', () => {
      cy.get('[data-testid="close"]')
        .should('be.visible')
        .click()

      cy.get('[data-testid="language-title"]').should('not.exist')
    })
  })
})