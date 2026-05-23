const BASE_URL = import.meta.env.VITE_SERVER_URL;

/**
 * wrapper for fetch API with base url and default headers
 */
export function fetchApi(url: string, options?: RequestInit) {
  
  const config: RequestInit = {
    ...options,
    method: options?.method || 'GET' // default method is GET
  }

  return fetch(`${BASE_URL}${url}`, { ...config });
}