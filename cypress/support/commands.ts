// ***********************************************
// This example commands.js shows you how to
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
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })


// Cypress.Commands.add('setupEnvironment', () => {
//   Cypress.env('CURRENT_WORKSPACE', 'test')
//   Cypress.env('CURRENT_ACCOUNT', 'biggy')

//   const localWorkspace = Cypress.env('CURRENT_WORKSPACE')
//   const account = Cypress.env('CURRENT_ACCOUNT')
//   if (localWorkspace && account) {
//     Cypress.env(
//       'authenticateUrl',
//       `https://${localWorkspace}--${account}.myvtex.com/api/vtexid/pub/authentication`
//     )
//     Cypress.config(
//       'baseUrl',
//       `https://${localWorkspace}--${account}.myvtex.com/`
//     )
//   }

//   const authenticateUrl = Cypress.env('authenticateUrl')
//   const userEmail = Cypress.env('userEmail')
//   const userPassword = Cypress.env('userPassword')
//   let authenticationToken = null
//   cy.request(`${authenticateUrl}/start`).then(response => {
//     expect(response.body).to.have.property('authenticationToken')
//     authenticationToken = response.body.authenticationToken

//     cy.request({
//       method: 'POST',
//       url: `${authenticateUrl}/classic/validate?login=${userEmail}&authenticationToken=${authenticationToken}&password=${encodeURIComponent(
//         userPassword
//       )}`,
//       headers: {
//         'content-type': 'application/x-www-form-urlencoded',
//       },
//     }).then(response => {
//       expect(response.body).to.have.property('authCookie')
//       cy.clearCookie('VtexIdclientAutCookie')
//       cy.setCookie(
//         response.body.authCookie.Name,
//         response.body.authCookie.Value
//       )
//     })
//   })
// })
