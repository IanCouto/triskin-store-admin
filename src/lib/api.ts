/**
 * API client: uses backend when VITE_API_URL is set, otherwise mock data.
 */
const BASE_URL = import.meta.env.VITE_API_URL ?? '';

export const api = {
  async get<T>(path: string): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`);
    if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
    return res.json();
  },

  async patch<T>(path: string, body: object): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
    return res.json();
  },
};
