function setVtexIdCookie() {
  const cookieOptions = {
    domain: `.${new URL(Cypress.config().baseUrl as string).hostname}`,
  };
  return cy.setCookie(
    "VtexIdclientAutCookie",
    Cypress.env("authToken"),
    cookieOptions,
  );
}

Cypress.Commands.add("setVtexIdCookie", setVtexIdCookie);

declare namespace Cypress {
  interface Chainable<Subject> {
    setVtexIdCookie: typeof setVtexIdCookie;
  }
}
