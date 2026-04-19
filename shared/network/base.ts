
type Headers = Record<string, string>;

type RequestMethods = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

type RequestConfig<TRequest> = Omit<RequestInit, "body"> & {
    body?: TRequest;
};
type RequestPromise = <TRequest, TResponse>(url: string, config?: RequestConfig<TRequest>) => Promise<TResponse>;

type NoBodyRequestPromise = <TResponse>(
    url: string,
    config?: RequestConfig<never>
) => Promise<TResponse>;

type StreamingPromise = <TRequest>(url: string, config?: RequestConfig<TRequest>) => Promise<ReadableStream<Uint8Array>>;

type BaseReturn = {
    get: NoBodyRequestPromise;
    post: RequestPromise;
    put: RequestPromise;
    delete: NoBodyRequestPromise;
    patch: RequestPromise;
    stream: StreamingPromise
}


export function baseApi(base: string, baseHeader: Headers): BaseReturn {
    async function request<TRequest, TResponse>(url: string, method: RequestMethods, config?: RequestConfig<TRequest>): Promise<TResponse> {
        try {
            const { headers, body } = config || {};
            const finalUrl = base + url;
            const res = await fetch(finalUrl, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...baseHeader,
                    ...headers,
                },
                body: method === "GET" || method === "DELETE"
                    ? undefined
                    : JSON.stringify(body),
            });
            if (!res.ok) {
                throw new Error(`HTTP Error: ${res.status}`);
            }

            return res.json() as Promise<TResponse>;
        } catch (error) {
            throw error;
        }
    }

    async function requestStream<TRequest>(url: string, method: RequestMethods, config?: RequestConfig<TRequest>): Promise<ReadableStream<Uint8Array> | null> {
        try {
            const { headers, body } = config || {};
            const finalUrl = base + url;

            console.log("requestStream", finalUrl, headers);

            const res = await fetch(finalUrl, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...baseHeader,
                    ...headers,
                },
                body: method === "GET" || method === "DELETE"
                    ? undefined
                    : JSON.stringify(body),
            });
            if (!res.ok) {
                const errorText = await res.text();
                console.error("Streaming request error:", errorText);
                throw new Error(`HTTP Error: ${res.status}`);
            }

            return res.body
        } catch (error) {
            throw error;
        }
    }

    return {
        get: <TResponse>(url: string, config?: RequestConfig<never>) => request<never, TResponse>(url, "GET", config),
        post: <TRequest, TResponse>(url: string, config?: RequestConfig<TRequest>) => request<TRequest, TResponse>(url, "POST", config),
        put: <TRequest, TResponse>(url: string, config?: RequestConfig<TRequest>) => request<TRequest, TResponse>(url, "PUT", config),
        delete: <TResponse>(url: string, config?: RequestConfig<never>) => request<never, TResponse>(url, "DELETE", config),
        patch: <TRequest, TResponse>(url: string, config?: RequestConfig<TRequest>) => request<TRequest, TResponse>(url, "PATCH", config),
        stream: <TRequest>(url: string, config?: RequestConfig<TRequest>) => requestStream<TRequest>(url, "POST", config),
    }
}

export default baseApi