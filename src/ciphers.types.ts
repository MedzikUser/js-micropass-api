/**
 * Type definitions for ciphers.
 */
export class CipherType {
    /**
     * Login cipher type.
     */
    static Login: 1 = 1
    /**
     * Secure note cipher type.
     * @notice This is currently not supported by MicroPass.
     */
    static SecureNote: 2 = 2
    /**
     * Card cipher type.
     * @notice This is currently not supported by MicroPass.
     */
    static Card: 3 = 3
    /**
     * Identity cipher type.
     * @notice This is currently not supported by MicroPass.
     */
    static Identity: 4 = 4
}

export type CipherTypeT = typeof CipherType.Login |
                          typeof CipherType.SecureNote |
                          typeof CipherType.Card |
                          typeof CipherType.Identity

/**
 * Type definitions for cipher fields.
 */
export class CipherFieldType {
    /**
     * Default field type. (built-in MicroPass fields)
     */
    static Default: -1 = -1
    /**
     * Text field type. (custom fields)
     */
    static Text: 0 = 0
    /**
     * Hidden field type. (custom fields)
     */
    static Hidden: 1 = 1
}

export type CipherFieldTypeT = typeof CipherFieldType.Default |
                               typeof CipherFieldType.Text |
                               typeof CipherFieldType.Hidden

export type CipherTypedFields = {
    username?: string;
    password?: string;
    totp?: string;
    url?: string;
    note?: string;
}
