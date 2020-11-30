/// <reference types='cypress' />

import * as CONSTANTS from '../constants'

context('Search Result', () => {
  before(() => {
    cy.setVtexIdCookie()
    cy.visit('/top?map=ft')
  })

  it('should render the search-result', () => {
    cy.get(CONSTANTS.searchResultContainer).should('exist')
    cy.get(CONSTANTS.searchResultLoading).should('not.exist')
  })

  it('should have a breadcrumb', () => {
    cy.get(CONSTANTS.breadcrumb).should('exist')
  })

  it('should show filters', () => {
    cy.get(CONSTANTS.filtersWrapper).should('exist')
  })
})
