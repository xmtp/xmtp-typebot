import { describe, it, expect, vi } from 'vitest';
import { Typebot } from './typebot';

describe('Typebot', () => {
  it('should create a Typebot instance with a public ID', () => {
    const publicId = 'test-public-id';
    const bot = new Typebot(publicId);
    expect(bot).toBeInstanceOf(Typebot);
    expect(bot['typebotPublicId']).toBe(publicId);
  });

  it('should handle fetchAndPrepareResponse correctly', async () => {
    const bot = new Typebot('test-public-id');
    const mockFetch = vi.fn(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        messages: [{ content: { richText: [{ children: [{ text: 'Hello' }] }] } }],
        sessionId: 'new-session-id'
      })
    }));
    vi.stubGlobal('fetch', mockFetch);
    const response = await bot.fetchAndPrepareResponse('Hello', 'session-id');
    expect(response).toEqual({
      messages: ['Hello'],
      sessionId: 'new-session-id'
    });
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});