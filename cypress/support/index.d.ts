/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Creates a new match with the specified teams and overs
     * @param team1 Name of team 1
     * @param team2 Name of team 2
     * @param overs Number of overs
     */
    createMatch(team1: string, team2: string, overs: number): Chainable<void>

    /**
     * Simulates a tie match by setting equal scores for both teams
     * @param team1Score Score for team 1
     * @param team2Score Score for team 2
     */
    simulateTieMatch(team1Score: number, team2Score: number): Chainable<void>
  }
} 