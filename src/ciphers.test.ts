import { pbkdf2 } from "@medzik/libcrypto"
import { Cipher  } from "./ciphers"

export const cipherJson = `
{
    "id": "aa770bed-e199-41f1-90b1-c4578104e22b",
    "dir": "622e5baf-f4b4-427b-b1dd-d54cded668e3",
    "data": {
        "type": 1,
        "name": "Example",
        "favorite": true,
        "fields": {
            "user": {
                "typ": -1,
                "val": "medzik@example.com"
            },
            "pass": {
                "typ": -1,
                "val": "SecretPassword"
            },
            "totp": {
                "typ": -1,
                "val": "otpauth://totp/medzik@example.com?secret=JBSWY3DPEHPK3PXP&issuer=example.com"
            },
            "url": {
                "typ": -1,
                "val": "https://example.com"
            },
            "note": {
                "typ": -1,
                "val": "my note about this cipher"
            },
            "Custom Field": {
                "typ": 0,
                "val": "This is a text in your custom field"
            },
            "Custom Secret Field": {
                "typ": 1,
                "val": "This is a secret text in your secret custom field"
            }
        }
    }
}`

describe("Ciphers", () => {
    let cipher: Cipher

    it("Ciphers", () => {
        // parse the cipher
        cipher = new Cipher(cipherJson)

        // check if the cipher is parsed correctly
        expect(cipher.id).toBe("aa770bed-e199-41f1-90b1-c4578104e22b")
        expect(cipher.dir).toBe("622e5baf-f4b4-427b-b1dd-d54cded668e3")
        expect(cipher.data.type).toBe(1)
        expect(cipher.data.name).toBe("Example")
        expect(cipher.data.favorite).toBe(true)
        expect(cipher.data.fields).toBeDefined()
        expect(cipher.data.fields.get("user")!.type).toBe(-1)
        expect(cipher.data.fields.get("user")!.value).toBe("medzik@example.com")
        expect(cipher.data.fields.get("pass")!.type).toBe(-1)
        expect(cipher.data.fields.get("pass")!.value).toBe("SecretPassword")
        expect(cipher.data.fields.get("totp")!.type).toBe(-1)
        expect(cipher.data.fields.get("totp")!.value).toBe("otpauth://totp/medzik@example.com?secret=JBSWY3DPEHPK3PXP&issuer=example.com")
        expect(cipher.data.fields.get("url")!.type).toBe(-1)
        expect(cipher.data.fields.get("url")!.value).toBe("https://example.com")
        expect(cipher.data.fields.get("note")!.type).toBe(-1)
        expect(cipher.data.fields.get("note")!.value).toBe("my note about this cipher")
        expect(cipher.data.fields.get("Custom Field")!.type).toBe(0)
        expect(cipher.data.fields.get("Custom Field")!.value).toBe("This is a text in your custom field")
        expect(cipher.data.fields.get("Custom Secret Field")!.type).toBe(1)
        expect(cipher.data.fields.get("Custom Secret Field")!.value).toBe("This is a secret text in your secret custom field")
    })

    it("serialize and deserialize", () => {
        const cipher2 = new Cipher(cipher.toString())
        expect(cipher2).toStrictEqual(cipher)
    })

    const encKey = pbkdf2.hash256("hello world", "salt", 1000)

    it("serialize and deserialize encrypted", () => {
        // serialize and encrypt the cipher
        const encryptedCipher = cipher.toString(encKey)

        // deserialize and decrypt the cipher
        const cipher2 = new Cipher(encryptedCipher, encKey)

        // check if the cipher is the same
        expect(cipher2).toStrictEqual(cipher)
    })

    it("deserialize encrypted cipher", () => {
        // example of a cipher encrypted with the key "hello world" and salt "salt" and 1000 iterations
        const cipherJsonEncrypted = `{"id":"aa770bed-e199-41f1-90b1-c4578104e22b","dir":"622e5baf-f4b4-427b-b1dd-d54cded668e3","data":"91cdbd58a5f63615757fbc4ccf9a2735aedbc9dbffa204d9d46138cbf99389122fb19d97c41d5978dc0c9ec68a3b877190a3177ba0fee03dbced9db060f267ea9e1610045c611bc26b3aacd66c0c4153f9f21c6d4da7a458b5aad41e59f317a65df4abbfa1a0801852d5bfb007f37f76494555d6440ee0ee4f62d71af6fe4ecdd9aea56aa90b6eeea1feac88f014e99b8f84a8fb8405e99623914e977cc575ee640095c97524eddd30c124800aa1913d45e57896598c097695fbed05516f815589a6548cd90d7df2bf3ee0549efc9c1d11f3d97d84856236fb34f9e760ffd2af61a1ea46f32bf927461822e810c43a9e8e5a9ed7e49f39c16290e6ef5f6d1c67395b391fcc699aef376bf0e73adcd0f05a072c496e2bc0c1c7e15518bf61e8c2d499ea21909850926cacbe8ec2fb36f433dce84feb272bf0bac8784e3c1febc1fa374d782b3e9b3d70c9efaf19c35471228c645c2f762ea3783cc8467088b1aa4db90994a31ff5a9ce7e15de797bf0dffdd6f63003234f1dfd75dda8cec0dbc45bf935d545668275832a17a381eab0ed5a18662e8b321fba8e27a11c75eee6b49464b420cd07538a05ec0479532d31e39b4f4b82b4fe5e90ad4108c30718374d4403a8743b8d6ecb90791f5937db453477c45571a8151b82912cefcb83ec37339c9cc77e7b741f93d3eb78bf896390dc846f944f5b4d9bfc1633812ba61c51fb56fa46d52db7c613f5019d0ddc40facd"}`

        // deserialize and decrypt the cipher
        const cipher2 = new Cipher(cipherJsonEncrypted, encKey)

        // check if the cipher is the same
        expect(cipher2).toStrictEqual(cipher)
    })
})
