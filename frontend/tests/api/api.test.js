import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';

vi.mock('axios', () => {
  const instance = {
    get: vi.fn(),
    post: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  };
  return { default: { create: vi.fn(() => instance), ...instance } };
});

describe('api axios instance', () => {
  it('creates instance with /api base URL by default', async () => {
    await import('../../src/api/api.js');
    expect(axios.create).toHaveBeenCalledWith(
      expect.objectContaining({ baseURL: expect.stringContaining('/api') })
    );
  });

  it('wires up request and response interceptors', async () => {
    const api = (await import('../../src/api/api.js')).default;
    expect(api.interceptors.request.use).toHaveBeenCalled();
    expect(api.interceptors.response.use).toHaveBeenCalled();
  });
});
