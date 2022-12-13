import { faker } from "@faker-js/faker"

import { IdentityApi } from "./identity"
import { UserApi } from "./user"

describe("User", () => {
    const email = faker.internet.email()
    const password = faker.random.alphaNumeric(16)

    let accessToken: string

    it("Register and Login", async () => {
        await IdentityApi.register(email, password)

        const response = await IdentityApi.login(email, password)

        accessToken = response.refresh_token
    })

    it("Whoami", async () => {
        const userApi = new UserApi(accessToken)

        const response = await userApi.whoami()

        expect(response.email).toBe(email)

        expect(response.id).not.toBeNull()
        expect(response.username).not.toBeNull()
    })

    it("Encryption Key", async () => {
        const userApi = new UserApi(accessToken)

        const encryptionKey = await userApi.encryptionKey(email, password)

        expect(encryptionKey).not.toBeNull()
    })
})
