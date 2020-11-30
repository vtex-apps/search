// / <reference types='cypress' />

import * as CONSTANTS from '../constants'

context('Autocomplete', () => {
  before(() => {
    cy.setVtexIdCookie()
    cy.visit('/')
  })

  it('should open the autocomplete', () => {
    cy.get(CONSTANTS.hiddenAutocomplete).should('exist')
    cy.get(CONSTANTS.autocomplete).should('exist')
    cy.get(CONSTANTS.searchBarContainer).click()
    cy.get(CONSTANTS.hiddenAutocomplete).should('not.exist')
    cy.get(CONSTANTS.autocomplete).should('exist')
  })
})
