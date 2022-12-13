/**
 * MicroPass API server address.
 */
const DOMAIN = "https://micropass-api.medzik.xyz"

/**
 * Send a GET request to the server
 * @param path The path to send the request to (e.g. /identity/token)
 * @param params The parameters to send with the request
 */
export async function get(path: string, token?: string): Promise<Response> {
    const res = await fetch(`${DOMAIN}${path}`, {
        method: "GET",
        headers: {
            "Authorization": token ? `Bearer ${token}` : undefined
        }
    })

    await checkError(res)

    return res
}

/**
 * Send a POST request to the server
 * @param path The path to send the request to (e.g. /identity/token)\
 * @param body The body to send with the request
 * @param token The access token to send with the request
 */
export async function post(path: string, body?: any, token?: string): Promise<Response> {
    const res = await fetch(`${DOMAIN}${path}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : undefined
        },
        body: JSON.stringify(body)
    })

    await checkError(res)

    return res
}

/**
 * Send a PATCH request to the server
 * @param path The path to send the request to (e.g. /identity/token)\
 * @param body The body to send with the request
 * @param token The access token to send with the request
 */
export async function patch(path: string, body?: any, token?: string): Promise<Response> {
    const res = await fetch(`${DOMAIN}${path}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : undefined
        },
        body: JSON.stringify(body)
    })

    await checkError(res)

    return res
}

/**
 * Send a PUT request to the server
 * @param path The path to send the request to (e.g. /identity/token)
 * @param body The body to send with the request
 * @param token The access token to send with the request
 */
export async function put(path: string, body?: any, token?: string): Promise<Response> {
    const res = await fetch(`${DOMAIN}${path}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : undefined
        },
        body: JSON.stringify(body)
    })

    await checkError(res)

    return res
}

/**
 * Send a DELETE request to the server
 * @param path The path to send the request to (e.g. /identity/token)
 * @param token The access token to send with the request
 */
export async function del(path: string, token?: string): Promise<Response> {
    const res = await fetch(`${DOMAIN}${path}`, {
        method: "DELETE",
        headers: {
            "Authorization": token ? `Bearer ${token}` : undefined
        }
    })

    await checkError(res)

    return res
}

async function checkError(res: Response) {
    // if the response is ok, return
    if (res.status >= 200 && res.status < 300) {
        return
    }

    // get the error response from the response body
    const resErr: ErrorResponse = await res.json()

    // throw the error
    throw resErr
}

type ErrorResponse = {
    error: string;
    error_description: string;
}
