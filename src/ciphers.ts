import { aes } from "@medzik/libcrypto"

import { CipherFieldTypeT, CipherTypedFields, CipherTypeT } from "./ciphers.types"

export * from "./ciphers.types"

/**
 * Cipher is a class that represents a cipher.
 */
export class Cipher {
    /**
     * The id of the cipher.
     */
    id: string
    /**
     * The directory of the cipher.
     */
    dir: string
    /**
     * The data of the cipher.
     * @see CipherData
     */
    data: CipherData
    /**
     * The creation date of the cipher.
     */
    created: number
    /**
     * The last update date of the cipher.
     */
    updated: number

    constructor(json: string, encryptionKey?: string) {
        // parse the JSON string to a JavaScript Object
        var jsonObject = JSON.parse(json)

        // iterate over the keys of the object
        for (let key in jsonObject) {
            // if the key is "data", create a new CipherData object
            if (key === "data") {
                // if the encryption key is defined, decrypt the data
                if (encryptionKey) {
                    this.data = new CipherData(JSON.parse(aes.decryptAesCbc(encryptionKey, jsonObject[key])))
                } else {
                    this.data = new CipherData(jsonObject[key])
                }

                continue
            }

            // set the value of the key to the value of the object
            this[key] = jsonObject[key]
        }
    }

    /**
     * Converts the cipher to a JavaScript Object.
     * @param encryptedKey The encryption key to encrypt the data. (optional)
     * @returns The cipher as a JavaScipt Object.
     */
    toJSObject(encryptedKey?: string): Object {
        return {
            id: this.id,
            dir: this.dir,
            data: encryptedKey ? aes.encryptAesCbc(encryptedKey, this.data.toJson()) : this.data.toJSObject(),
            created: this.created,
            updated: this.updated
        }
    }

    /**
     * Converts the cipher to a JSON string.
     * @returns The cipher as a JSON string.
     */
    toJson(encryptedKey?: string): string {
        return JSON.stringify(this.toJSObject(encryptedKey))
    }

    /**
     * Converts the cipher to a JSON string.
     * @returns The cipher as a JSON string.
     */
    toString(encryptedKey?: string): string {
        return this.toJson(encryptedKey)
    }
}

/**
 * CipherData is a class that represents the data of a cipher.
 */
export class CipherData  {
    /**
     * The type of the cipher.
     * - 1 - Login
     * - 2 - Secure Note
     * - 3 - Card
     * - 4 - Identity
     */
    type: CipherTypeT
    /**
     * The name of the cipher.
     */
    name: string
    /**
     * Whether the cipher is a favorite.
     */
    favorite: boolean
    /**
     * The note of the cipher. (maybe null)
     */
    note?: string
    /**
     * The fields of the cipher.
     * @see CipherField
     */
    fields: Map<string, CipherField>

    constructor(object: Object) {
        // iterate over the keys of the object
        for (let key in object) {
            // if the key is "fields", create a new Map of CipherFields
            if (key === "fields") {
                this.fields = new Map<string, CipherField>()

                // iterate over the keys of the fields object
                for (let [name, field] of Object.entries(object[key])) {
                    // create a new CipherField object and add it to the Map
                    this.fields.set(name, new CipherField(field))
                }

                continue
            }

            // set the value of the key to the value of the object
            this[key] = object[key]
        }
    }

    /**
     * Converts the cipher data to a JavaScript Object.
     * @returns The cipher data as a JavaScript Object.
     */
    toJSObject(): Object {
        let fields: Object = {}

        // if the fields Map is not null, iterate over it and add the fields to the fields object
        if (this.fields) {
            for (let [name, field] of this.fields.entries()) {
                fields[name] = field.toJSObject()
            }
        }

        return {
            type: this.type,
            favorite: this.favorite,
            name: this.name,
            note: this.note,
            fields: fields
        }
    }

    /**
     * Converts the cipher data to a JSON string.
     * @param encryptionKey The encryption key to encrypt the data. (optional)
     * @returns The cipher data as a JSON string.
     */
    toJson(encryptionKey?: string): string {
        // convert the cipher data to a JavaScript Object and stringify it to a JSON string
        const jsonString = JSON.stringify(this.toJSObject())

        // if the encryption key is defined, encrypt the data
        return encryptionKey ? aes.encryptAesCbc(encryptionKey, jsonString) : jsonString
    }

    /**
     * Returns the typed fields of the cipher.
     * @returns The typed fields of the cipher.
     */
    getTypedFields(): CipherTypedFields {
        return {
            username: this.fields.get("user")?.value,
            password: this.fields.get("totp")?.value,
            url:      this.fields.get("url")?.value,
            note:     this.fields.get("note")?.value,
        }
    }

    /**
     * Sets the typed fields of the cipher.
     */
    fromTypedFields(fields: CipherTypedFields) {
        if (fields.username) this.fields.set("user", new CipherField({ typ: -1, val: fields.username }))
        if (fields.password) this.fields.set("pass", new CipherField({ typ: -1, val: fields.password }))
        if (fields.totp)     this.fields.set("totp", new CipherField({ typ: -1, val: fields.totp }))
        if (fields.url)      this.fields.set("url",  new CipherField({ typ: -1, val: fields.url }))
        if (fields.note)     this.fields.set("note", new CipherField({ typ: -1, val: fields.note }))
    }
}

export class CipherField {
    /**
     * The type of the cipher field.
     * - -1 - Default
     * - 0 - Text
     * - 1 - Hidden
     */
    type: CipherFieldTypeT
    /**
     * The value of the cipher field.
     */
    value: string

    constructor(object: Object) {
        for (let key in object) {
            if (key === "typ") this.type = object[key]
            else if (key === "val") this.value = object[key]
        }
    }

    /**
     * Converts the cipher field to a JavaScript Object.
     * @returns The cipher field as a JavaScript Object.
     */
    toJSObject(): Object {
        return {
            typ: this.type,
            val: this.value
        }
    }
}
