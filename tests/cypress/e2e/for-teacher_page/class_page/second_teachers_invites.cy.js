import {loginForTeacher, logout} from "../../tools/login/login.js"
import { goToProfilePage } from "../../tools/navigation/nav";
import { createClass } from "../../tools/classes/class";

const secondTeachers = ["teacher2", "teacher3"]
const invitesTable = body => body.find("#invites-block table")

describe("Second teachers: invitations", () => {
  before(() => {
    loginForTeacher();
    createClass()
  });

  it(`Invites ${secondTeachers.length} second teachers: by username`, () => {
    loginForTeacher();
    cy.get(".view_class").first().click();

    for (const teacher of secondTeachers) {
      
      cy.get("#add-second-teacher").click();
      cy.get("#modal-prompt-input").type(teacher);
      cy.get("#modal-ok-button").click();
      
      cy.get("body").then(invitesTable).then(table => {
        if (table.length) {
          table = cy.get("#invites-block table")
          cy.get("#invites-block .username_cell")
          .should('be.visible')
          .and("include.text", teacher)
        } else {
          cy.log("Second teacher not invited.")
        }
      })
    }
  })

  it(`Tries duplicating ${secondTeachers[0]}'s invitation`, () => {
    loginForTeacher();
    cy.get(".view_class").first().click();

    cy.get("#add-second-teacher").click();
    cy.get("#modal-prompt-input").type(secondTeachers[0]);
    cy.get("#modal-ok-button").click();

    cy.get("#modal_alert_container")
    .should('be.visible')
    .and("contain", "pending invitation")
  })

  it(`Accepts invitation sent to ${secondTeachers[0]}`, () => {
    loginForTeacher(secondTeachers[0])
    goToProfilePage()
    cy.get("#messages").should("exist")
    cy.get("#messages #join").click()
  })

  it("Reads all second teachers", () => {
    loginForTeacher()
    cy.get(".view_class").first().click();        
    cy.get("#second_teachers_container .username_cell").should("include.text", secondTeachers[0])
  })

  it(`Deletes ${secondTeachers[1]}'s invitation`, () => {

    loginForTeacher();
    cy.get(".view_class").first().click();
    cy.get("body").then(invitesTable).then(table => {
      // if not, then no invitation.
      if (table.length) {
        table = cy.get("#invites-block table")
        console.log(table)
        table.should("exist")
        table.get(".remove_user_invitation").first().click()
        cy.get("#modal-yes-button").click();
      } else {
        cy.log("Second teacher not deleted.")
      }
    })
    cy.get('body').then(invitesTable).then(table => 
      table.length && cy.get("#invites-block table").should("not.contain", secondTeachers[0]))
  })

})
