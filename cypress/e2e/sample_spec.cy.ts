describe('Sample Test', () => {
    it('should visit the homepage', () => {
        cy.visit('http://localhost:4128');
        cy.contains('Vite + React');
    });
});