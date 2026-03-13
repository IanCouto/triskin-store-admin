import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { api } from './api';

describe('api', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('get returns json when response ok', async () => {
    const data = { id: '1' };
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(data),
    });
    const result = await api.get<{ id: string }>('/test');
    expect(result).toEqual(data);
  });

  it('get throws when response not ok', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });
    await expect(api.get('/test')).rejects.toThrow('API error: 404 Not Found');
  });

  it('patch sends body and returns json when ok', async () => {
    const body = { name: 'x' };
    const data = { id: '1', name: 'x' };
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(data),
    });
    const result = await api.patch<typeof data>('/test', body);
    expect(result).toEqual(data);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/test'),
      expect.objectContaining({
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
    );
  });

  it('patch throws when response not ok', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });
    await expect(api.patch('/test', {})).rejects.toThrow('API error: 500');
  });
});
