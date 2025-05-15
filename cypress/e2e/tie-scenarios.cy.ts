describe('Cricket Match Tie Scenarios', () => {
  beforeEach(() => {
    cy.createMatch('India', 'Australia', 20);
  });

  it('should handle basic tie scenario - same scores', () => {
    cy.simulateTieMatch(150, 150);
    cy.get('[data-testid=match-result]').should('contain', 'Match Tied');
  });

  it('should handle tie with super over option', () => {
    cy.simulateTieMatch(200, 200);
    cy.get('[data-testid=super-over-btn]').should('be.visible').click();
    cy.get('[data-testid=super-over-section]').should('be.visible');
  });

  it('should handle tie in super over', () => {
    // First tie in main match
    cy.simulateTieMatch(180, 180);
    cy.get('[data-testid=super-over-btn]').click();
    
    // Simulate tie in super over
    cy.get('[data-testid=team1-super-over-score]').type('12');
    cy.get('[data-testid=team1-super-over-wickets]').type('2');
    cy.get('[data-testid=team2-super-over-score]').type('12');
    cy.get('[data-testid=team2-super-over-wickets]').type('2');
    
    cy.get('[data-testid=super-over-result]').should('contain', 'Super Over Tied');
    cy.get('[data-testid=boundary-count-section]').should('be.visible');
  });

  it('should handle tie resolution by boundary count', () => {
    // Set up tie scenario
    cy.simulateTieMatch(200, 200);
    
    // Set boundary counts
    cy.get('[data-testid=team1-boundaries]').type('15'); // 10 fours + 5 sixes
    cy.get('[data-testid=team2-boundaries]').type('12'); // 8 fours + 4 sixes
    
    cy.get('[data-testid=final-result]')
      .should('contain', 'India')
      .and('contain', 'wins by boundary count');
  });

  it('should handle multiple super overs until winner is decided', () => {
    // Initial match tie
    cy.simulateTieMatch(150, 150);
    cy.get('[data-testid=super-over-btn]').click();
    
    // First super over tie
    cy.get('[data-testid=team1-super-over-score]').type('12');
    cy.get('[data-testid=team2-super-over-score]').type('12');
    cy.get('[data-testid=next-super-over-btn]').should('be.visible').click();
    
    // Second super over (decisive)
    cy.get('[data-testid=team1-super-over-2-score]').type('15');
    cy.get('[data-testid=team2-super-over-2-score]').type('10');
    
    cy.get('[data-testid=final-result]')
      .should('contain', 'India')
      .and('contain', 'wins in second super over');
  });
}); 