import { Cipher } from "./ciphers"
import * as client from "./client"

/**
 * CiphersApi is a class that provides methods for interacting with the ciphers API.
 */
export class CiphersApi {
    /**
     * The access token to use for authentication.
     */
    private accessToken: string
    /**
     * The key is used for encryption/decryption ciphers.
     */
    private encryptionKey?: string

    /**
     * Create a new CiphersApi instance.
     * @param accessToken The access token to use for authentication.
     */
    constructor(accessToken: string, encryptionKey?: string) {
        this.accessToken = accessToken
        this.encryptionKey = encryptionKey
    }

    /**
     * Insert a new cipher into the database.
     * @param cipher The cipher to insert.
     * @returns Id of the inserted cipher.
     */
    async insert(cipher: Cipher): Promise<string> {
        if (!this.encryptionKey) {
            throw new Error("No encryption key provided.")
        }

        // serialize the cipher data and encrypt it
        const cipherData = cipher.data.toJson(this.encryptionKey)

        // send the cipher to the server
        const body = { data: cipherData }
        const response = await client.post("/ciphers/insert", body, this.accessToken)

        // return the id of the inserted cipher
        return (await response.json()).id
    }

    /**
     * List all ciphers in the database.
     * @param lastSync The last sync unix time (optional).
     * @returns Cipher IDs.
     */
    async list(lastSync?: number): Promise<{
        updated: string[],
        deleted: string[]
    }> {
        let url = "/ciphers/list"
        if (lastSync) {
            url += `?lastSync=${lastSync}`
        }

        // get the ciphers from the server
        const response = await client.get(url, this.accessToken)

        // parse the response
        const responseJson = await response.json()

        return responseJson
    }

    /**
     * Get a cipher from the database.
     * @param id The id of the cipher to get.
     * @returns The cipher.
     */
    async get(id: string): Promise<Cipher> {
        if (!this.encryptionKey) {
            throw new Error("No encryption key provided.")
        }

        // get the cipher from the server
        const response = await client.get(`/ciphers/get/${id}`, this.accessToken)

        // parse the response
        const responseJson = await response.json()

        // decrypt the cipher and deserialize it into a Cipher object
        return new Cipher(JSON.stringify(responseJson), this.encryptionKey)
    }

    /**
     * Update a cipher in the database.
     * @param id The id of the cipher to update.
     * @param cipher The cipher to update.
     */
    async update(id: string, cipher: Cipher): Promise<void> {
        if (!this.encryptionKey) {
            throw new Error("No encryption key provided.")
        }

        // serialize the cipher data and encrypt it
        const cipherData = cipher.data.toJson(this.encryptionKey)

        // send the cipher to the server
        const body = { id, data: cipherData }
        await client.patch(`/ciphers/update`, body, this.accessToken)
    }

    /**
     * Delete a cipher from the database.
     * @param id The id of the cipher to delete.
     */
    async delete(id: string): Promise<void> {
        await client.del(`/ciphers/delete/${id}`, this.accessToken)
    }
}
