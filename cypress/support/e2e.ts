// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

import '@testing-library/cypress/add-commands';

// Add any custom commands here
Cypress.Commands.add('createMatch', (team1: string, team2: string, overs: number) => {
  cy.visit('/');
  cy.get('[data-testid=team1-input]').type(team1);
  cy.get('[data-testid=team2-input]').type(team2);
  cy.get('[data-testid=overs-input]').type(overs.toString());
  cy.get('[data-testid=create-match-btn]').click();
});

// Add command to simulate a tie scenario
Cypress.Commands.add('simulateTieMatch', (team1Score: number, team2Score: number) => {
  // Assuming we have a way to set scores directly
  cy.get('[data-testid=team1-score]').clear().type(team1Score.toString());
  cy.get('[data-testid=team2-score]').clear().type(team2Score.toString());
});