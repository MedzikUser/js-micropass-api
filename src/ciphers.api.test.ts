import { faker } from "@faker-js/faker"

import { IdentityApi } from "./identity"
import { UserApi } from "./user"
import { CiphersApi } from "./ciphers.api"
import { Cipher } from "./ciphers"

import { cipherJson } from "./ciphers.test"

describe("Ciphers API", () => {
    const email = faker.internet.email()
    const password = faker.random.alphaNumeric(16)

    let accessToken: string
    let encryptionKey: string

    it("Register and Login", async () => {
        await IdentityApi.register(email, password)

        const response = await IdentityApi.login(email, password)

        accessToken = response.refresh_token
        encryptionKey = await (new UserApi(accessToken)).encryptionKey(email, password)
    })

    it("insert cipher", async () => {
        const client = new CiphersApi(accessToken, encryptionKey)

        const cipher = new Cipher(cipherJson)

        await client.insert(cipher)
    })

    it("list ciphers", async () => {
        const client = new CiphersApi(accessToken, encryptionKey)

        const listResponse = await client.list()

        let ciphers: Cipher[] = []

        for (let i in listResponse.updated) {
            const cipher = await client.get(listResponse.updated[i])
            ciphers.push(cipher)
        }

        expect(ciphers[0].data.type).toBe(1)
        expect(ciphers[0].data.name).toBe("Example")
        expect(ciphers[0].data.favorite).toBe(true)
        expect(ciphers[0].data.fields).toBeDefined()
        expect(ciphers[0].data.fields.get("user")!.type).toBe(-1)
        expect(ciphers[0].data.fields.get("user")!.value).toBe("medzik@example.com")
        expect(ciphers[0].data.fields.get("pass")!.type).toBe(-1)
        expect(ciphers[0].data.fields.get("pass")!.value).toBe("SecretPassword")
        expect(ciphers[0].data.fields.get("totp")!.type).toBe(-1)
        expect(ciphers[0].data.fields.get("totp")!.value).toBe("otpauth://totp/medzik@example.com?secret=JBSWY3DPEHPK3PXP&issuer=example.com")
        expect(ciphers[0].data.fields.get("url")!.type).toBe(-1)
        expect(ciphers[0].data.fields.get("url")!.value).toBe("https://example.com")
        expect(ciphers[0].data.fields.get("note")!.type).toBe(-1)
        expect(ciphers[0].data.fields.get("note")!.value).toBe("my note about this cipher")
        expect(ciphers[0].data.fields.get("Custom Field")!.type).toBe(0)
        expect(ciphers[0].data.fields.get("Custom Field")!.value).toBe("This is a text in your custom field")
        expect(ciphers[0].data.fields.get("Custom Secret Field")!.type).toBe(1)
        expect(ciphers[0].data.fields.get("Custom Secret Field")!.value).toBe("This is a secret text in your secret custom field")

        expect(ciphers.length).toBe(1)
    })

    it("update cipher", async () => {
        const client = new CiphersApi(accessToken, encryptionKey)

        const listResponse = await client.list()

        const cipher = await client.get(listResponse.updated[0])

        cipher.data.name = "Updated"

        await client.update(cipher.id, cipher)

        const cipher2 = await client.get(listResponse.updated[0])

        expect(cipher2.data.name).toBe("Updated")
    })

    it("delete ciphers", async () => {
        const client = new CiphersApi(accessToken, encryptionKey)

        const listResponse = await client.list()

        for (let i in listResponse.updated) {
            await client.delete(listResponse.updated[i])
        }
    })
})
