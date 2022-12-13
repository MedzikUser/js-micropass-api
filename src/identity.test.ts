import { faker } from "@faker-js/faker"

import { IdentityApi } from "./identity"

describe("Identity", () => {
    const email = faker.internet.email()
    const password = faker.random.alphaNumeric(16)

    it("Register a new user", async () => {
        await IdentityApi.register(email, password, "very strong password")
    })

    let refreshToken: string

    it("Login with the new user", async () => {
        const response = await IdentityApi.login(email, password)

        expect(response.access_token).not.toBeNull()
        expect(response.refresh_token).not.toBeNull()

        refreshToken = response.refresh_token
    })

    it("Refresh access token", async () => {
        const accessToken = await IdentityApi.refresh(refreshToken)

        expect(accessToken).not.toBeNull()
    })
})
