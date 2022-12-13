import { aes, pbkdf2, salt } from "@medzik/libcrypto"

import * as client from './client'

/**
 * IdentityApi is a class that connects to the identity API.
 */
export class IdentityApi {
    /**
     * The number of password iterations.
     */
    static ITERATIONS = 100000

    /**
     * Create a new account.
     * @param email - The email of the account.
     * @param password - The password of the account.
     * @param passwordHint - The hint of the password.
     */
    static async register(email: string, password: string, passwordHint?: string): Promise<void> {
        // compute a base password hash
        const passwordHashBase = pbkdf2.hash256(password, email, this.ITERATIONS)
        // compute a final password hash
        const passwordHashFinal = pbkdf2.hash512(passwordHashBase, email, 1)

        // create account encryption key with a random salt
        const encryptionKeySalt = salt.generate(32)
        const encryptionKey = pbkdf2.hash256(passwordHashBase, encryptionKeySalt, 1)
        // encrypt the encryption key
        const encryptedEncryptionKey = aes.encryptAesCbc(passwordHashBase, encryptionKey)

        await client.post('/identity/register', {
            email,
            password: passwordHashFinal,
            password_hint: passwordHint,
            encryption_key: encryptedEncryptionKey
        })
    }

    /**
     * Login to an account.
     * @param email - The email of the account.
     * @param password - The password of the account.
     * @returns The access token and refresh token.
     */
    static async login(email: string, password: string): Promise<{ access_token: string, refresh_token: string }> {
        // compute a base password hash
        const passwordHashBase = pbkdf2.hash256(password, email, this.ITERATIONS)
        // compute a final password hash
        const passwordHashFinal = pbkdf2.hash512(passwordHashBase, email, 1)

        const response = await client.post('/identity/token', {
            grant_type: 'password',
            email,
            password: passwordHashFinal
        })

        const responseJson = await response.json()

        return {
            access_token: responseJson.access_token,
            refresh_token: responseJson.refresh_token
        }
    }

    /**
     * Refresh an access token.
     * @param refreshToken - The refresh token.
     * @returns The new access token.
     */
    static async refresh(refreshToken: string): Promise<string> {
        const response = await client.post('/identity/token', {
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        })

        return (await response.json()).access_token
    }

}
