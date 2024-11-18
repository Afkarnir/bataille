describe('home spec', () => {
  beforeEach(() => {
    cy.intercept('GET', `${Cypress.env().apiUrl}/games`, { fixture: 'games' }).as('games')
    cy.intercept('GET', `${Cypress.env().apiUrl}/players`, { fixture: 'players' }).as('players')

    cy.visit('/')
  })

  it('should have a loading', () => {
    cy.get('[data-testid="loading"]').should('be.visible')
  })

  describe('game list', () => {
    beforeEach(() => {
      cy.wait('@games')
      cy.wait('@players')
    })

    it('test game list', () => {
      cy.get('[data-testid="game-list"]').should('be.visible')

      cy.get('[data-testid="game-card"]')
        .should('have.length', 3)
    })

    it('test new game button', () => {
      cy.get('[data-testid="new-game-button"]').should('be.visible')
    })
  })

  describe('new game settings', () => {
    beforeEach(() => {
      cy.wait('@games')
      cy.wait('@players')

      cy.get('[data-testid="new-game-button"]').click()
    })

    it('test close button', () => {
      cy.get('[data-testid="close"]')
        .should('be.visible')
        .click()

      cy.get('[data-testid="new-game-settings"]').should('not.exist')
    })

    it('test new game settings with already existing players', () => {
      cy.get('[data-testid="new-game-settings"]')
        .should('be.visible')
      
      cy.get('[data-testid="player-dropdown"]')
        .should('be.visible')
        .should('have.length', 2)
        .first()
        .click()
        .get('p-dropdownitem [aria-label="Test player 1"]')
        .should('be.visible')
        .click()
      
      cy.get('[data-testid="player-dropdown"]')
        .last()
        .click()
        .get('p-dropdownitem [aria-label="Test player 2"]')
        .should('be.visible')
        .click()

      cy.get('[data-testid="play"]')
        .should('be.visible')
        .click()
      
      cy.location('pathname').should('eq', '/game')
    })

    it('test new game settings with new players', () => {
      cy.intercept('POST', `${Cypress.env().apiUrl}/players`, { fixture: 'newPlayer' }).as('newPlayer')
      
      cy.get('[data-testid="player-dropdown"]')
        .should('be.visible')
        .should('have.length', 2)
        .first()
        .click()
        .get('p-dropdownitem [aria-label="Nouveau nom"]')
        .should('be.visible')
        .click()
      
      cy.get('[data-testid="player-new-title"]')
        .should('be.visible')
      
      cy.get('[data-testid="player-new-input"]')
        .should('be.visible')
        .type('Test player 3')
      
      cy.get('[data-testid="player-new-info"]')
        .should('be.visible')
      
      cy.get('[data-testid="player-dropdown"]')
        .last()
        .click()
        .get('p-dropdownitem [aria-label="Test player 2"]')
        .should('be.visible')
        .click()

      cy.get('[data-testid="play"]')
        .should('be.visible')
        .click()
      
      cy.wait('@newPlayer')
      
      cy.location('pathname')
        .should('eq', '/game')
    })

    it('test new game settings with invalid players', () => {
      cy.intercept('POST', `${Cypress.env().apiUrl}/players`, { statusCode: 400, body: { message: 'Invalid player name' } }).as('player')

      cy.get('[data-testid="player-dropdown"]')
        .should('be.visible')
        .should('have.length', 2)
        .first()
        .click()
        .get('p-dropdownitem [aria-label="Nouveau nom"]')
        .should('be.visible')
        .click()
      
      cy.get('[data-testid="player-new-title"]')
        .should('be.visible')
      
      cy.get('[data-testid="player-new-input"]')
        .should('be.visible')
        .type(' ')
      
      cy.get('[data-testid="player-new-info"]')
        .should('be.visible')
      
      cy.get('[data-testid="player-dropdown"]')
        .last()
        .click()
        .get('p-dropdownitem [aria-label="Test player 2"]')
        .should('be.visible')
        .click()
      
      cy.get('[data-testid="play"]')
        .should('be.visible')
        .click()
      
      cy.wait('@player')
      
      cy.get('[data-testid="error"]')
        .should('be.visible')
    })

    it('test new game settings with no inputs', () => {
      cy.get('[data-testid="play"]')
        .should('be.visible')
        .click()

      cy.get('[data-testid="new-game-settings"]')
        .should('be.visible')

      cy.location('pathname').should('eq', '/')
    })
  })
})