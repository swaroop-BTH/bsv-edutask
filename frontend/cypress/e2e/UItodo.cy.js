describe("Todo Management Feature Tests", () => {

    // We store the created user details here
    let createdUserId
    let createdUserEmail
    let createdUserFullName

    // We use this reusable function to open task details
    const openCreatedTaskDetails = () => {

        cy.contains("Automation Testing Task")
            .click()
    }

    beforeEach(() => {

        // We load mock user data from fixture file
        cy.fixture("user.json").then((mockUserData) => {

            // We create a new user using backend API
            cy.request({
                method: "POST",
                url: "http://localhost:5000/users/create",
                form: true,
                body: mockUserData
            }).then((createUserResponse) => {

                // We save user details for later use
                createdUserId = createUserResponse.body._id.$oid
                createdUserEmail = mockUserData.email
                createdUserFullName =
                    `${mockUserData.firstName} ${mockUserData.lastName}`

                // We open the application
                cy.visit("http://localhost:3000")

                // We perform login using user email
                cy.contains("div", "Email Address")
                    .find("input[type=text]")
                    .type(createdUserEmail)

                cy.get("form").submit()

                // We verify successful login
                cy.get("h1")
                    .should(
                        "contain.text",
                        `Your tasks, ${createdUserFullName}`
                    )

                // We create a new task
                cy.get(".submit-form")
                    .find("#title")
                    .type("Automation Testing Task")

                cy.get(".submit-form")
                    .find("#url")
                    .type("cZypFRdPS9M")

                cy.get('[type="submit"]').click()

                // We open the created task details page
                openCreatedTaskDetails()
            })
        })
    })

    context("R8UC1 - Add Todo Item", () => {

        it("should create a new todo item", () => {

            // We enter a new todo item
            cy.get('.inline-form > [type="text"]')
                .type("Practice Cypress testing")

            // We submit the todo item
            cy.get('.inline-form > [type="submit"]')
                .click()

            // We verify the todo item is added
            cy.get(".todo-item")
                .last()
                .should(
                    "contain.text",
                    "Practice Cypress testing"
                )
        })

        it("should disable add button for empty input", () => {

            // We verify add button is disabled for empty input
            cy.get('.inline-form > [type="submit"]')
                .should("be.disabled")
        })
    })

    context("R8UC2 - Toggle Todo Item", () => {

        it("should mark todo item as completed", () => {

            // We mark the todo item as completed
            cy.contains(".todo-list", "Watch video")
                .find(".checker")
                .click()

            // We verify line-through style is applied
            cy.contains("Watch video")
                .should(
                    "have.css",
                    "text-decoration-line",
                    "line-through"
                )
        })

        it("should revert completed todo item back to active", () => {

            // We mark the todo item as completed
            cy.contains(".todo-list", "Watch video")
                .find(".checker")
                .click()

            // We verify completion style
            cy.contains("Watch video")
                .should(
                    "have.css",
                    "text-decoration-line",
                    "line-through"
                )

            // We click again to make the item active
            cy.contains(".todo-list", "Watch video")
                .find(".checker")
                .click()

            cy.wait(1000)

            // We verify line-through style is removed
            cy.contains("Watch video")
                .should(($element) => {

                    expect(
                        $element.css("text-decoration-line")
                    ).to.not.equal("line-through")
                })
        })
    })

    context("R8UC3 - Delete Todo Item", () => {

        it("should delete selected todo item", () => {

            // We delete the selected todo item
            cy.contains(".todo-list", "Watch video")
                .find(".remover")
                .click()

            // We verify the item is removed
            cy.contains(".todo-list", "Watch video")
                .should("not.exist")
        })
    })

    afterEach(() => {

        // We delete the created user after each test
        cy.request({
            method: "DELETE",
            url: `http://localhost:5000/users/${createdUserId}`
        }).then((deleteUserResponse) => {

            // We print API response in Cypress logs
            cy.log(JSON.stringify(deleteUserResponse.body))
        })
    })
})