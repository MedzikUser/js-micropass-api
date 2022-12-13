import { aes, pbkdf2 } from "@medzik/libcrypto"

import { IdentityApi } from "./identity"
import * as client from "./client"

/**
 * UserApi is a class that contains all the user related API calls.
 */
export class UserApi {
    /**
     * The user token that is used to authenticate the user.
     */
    private accessToken: string

    /**
     * Create a new UserApi instance.
     * @param accessToken The user token
     */
    constructor(accessToken: string) {
        this.accessToken = accessToken
    }

    /**
     * Get the user's profile
     * @param token The user token
     * @returns The user profile
     */
    async whoami(): Promise<{
        id: string;
        email: string;
        username: string;
    }> {
        const response = await client.get("/user/whoami", this.accessToken)
        return await response.json()
    }

    /**
     * Get encryption key of the user.
     * @param token The user token
     * @param email The user email
     * @param password The user password
     */
    async encryptionKey(email: string, password: string): Promise<string> {
        // send request to the API
        const response = await client.get("/user/encryption_key", this.accessToken)
        // parse the response
        const responseJson = await response.json()

        // create the secret key
        const secretKey = pbkdf2.hash256(password, email, IdentityApi.ITERATIONS)

        // decrypt the encryption key
        const cipherText = responseJson.encryption_key
        const encryptionKey = aes.decryptAesCbc(secretKey, cipherText)

        // return the encryption key
        return encryptionKey
    }
}
