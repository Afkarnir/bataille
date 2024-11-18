/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//

Cypress.Commands.add('createNewGame', () => {
    cy.intercept('GET', `${Cypress.env().apiUrl}/games`, { fixture: 'games' }).as('games')
    cy.intercept('GET', `${Cypress.env().apiUrl}/players`, { fixture: 'players' }).as('players')
    
    cy.visit('/')

    cy.wait('@games')
    cy.wait('@players')

    cy.get('[data-testid="new-game-button"]').click()
      
    cy.get('[data-testid="player-dropdown"]')
        .first()
        .click()
        .get('p-dropdownitem [aria-label="Test player 1"]')
        .click()
    
    cy.get('[data-testid="player-dropdown"]')
        .last()
        .click()
        .get('p-dropdownitem [aria-label="Test player 2"]')
        .click()

    cy.get('[data-testid="play"]')
        .click()
})

declare namespace Cypress {
    interface Chainable {
        createNewGame(): Chainable<void>
    //   login(email: string, password: string): Chainable<void>
    //   drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
    //   dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
    //   visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
    }
}