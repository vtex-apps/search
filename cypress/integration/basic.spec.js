/// <reference types="cypress" />

context("Basic Test", () => {
  before(() => {
    cy.setVtexIdCookie()
  })

  it("get the search-result", () => {
    cy.visit('/top?map=ft')
    cy.get('.vtex-search-result-3-x-searchResultContainer').should('exist')
  })
})
