import Debug from "debug"

const debug = Debug("micropass:HttpClient")

export class HttpClient {
    /**
     * MicroPass API server address.
     */
    static DOMAIN = "https://micropass-api.medzik.xyz"

    /**
     * Send a GET request to the server
     * @param path The path to send the request to (e.g. /identity/token)
     * @param params The parameters to send with the request
     */
    static async get(path: string, token?: string): Promise<Response> {
        return this.send("GET", path, null, token)
    }

    /**
     * Send a POST request to the server
     * @param path The path to send the request to (e.g. /identity/token)\
     * @param body The body to send with the request
     * @param token The access token to send with the request
     */
    static async post(path: string, body?: any, token?: string): Promise<Response> {
        return this.send("POST", path, body, token)
    }

    /**
     * Send a PATCH request to the server
     * @param path The path to send the request to (e.g. /identity/token)\
     * @param body The body to send with the request
     * @param token The access token to send with the request
     */
    static async patch(path: string, body?: any, token?: string): Promise<Response> {
        return this.send("PATCH", path, body, token)
    }

    /**
     * Send a PUT request to the server
     * @param path The path to send the request to (e.g. /identity/token)
     * @param body The body to send with the request
     * @param token The access token to send with the request
     */
    static async put(path: string, body?: any, token?: string): Promise<Response> {
        return this.send("PUT", path, body, token)
    }

    /**
     * Send a DELETE request to the server
     * @param path The path to send the request to (e.g. /identity/token)
     * @param token The access token to send with the request
     */
    static async del(path: string, token?: string): Promise<Response> {
        return this.send("DELETE", path, null, token)
    }

    private static async send(method: string, path: string, body?: any, token?: string): Promise<Response> {
        debug(`Sending '${method}' request to '${path}' with body '${body ? JSON.stringify(body) : null}'`)

        const res = await fetch(`${this.DOMAIN}${path}`, {
            method: method,
            headers: {
                "Content-Type": body ? "application/json" : undefined,
                "Authorization": token ? `Bearer ${token}` : undefined
            },
            body: body ? JSON.stringify(body) : undefined
        })

        await checkError(res)

        return res
    }
}

async function checkError(res: Response) {
    // if the response is ok, return
    if (res.status >= 200 && res.status < 300) {
        return
    }

    // get the error response from the response body
    const resErr: ErrorResponse = await res.json()

    // log the error
    debug(`Error status: ${res.status}`)
    debug(`Error code: ${resErr.error}`)
    debug(`Error message: ${resErr.error_description}`)

    // throw the error
    throw resErr
}

type ErrorResponse = {
    error: string;
    error_description: string;
}
