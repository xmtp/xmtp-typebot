import { describe, it, expect, vi } from 'vitest';
import { createBotService, botReply } from './index.js';
import { HandlerContext, Json } from '@xmtp/bot-kit-pro';
import { IBotService, ConversationState } from './types.js';
import { Typebot } from './services/typebot.js'

describe('index.ts', () => {
  it('createBotService should create a Typebot service', () => {
    const appConfig = {
        postgresConnectionString: '',
        walletKey: '',
        xmtpEnv: 'dev' as "dev" | "production" | "local" | undefined,
        typebotPublicId: 'test-public-id',
        botService: 'typebot',
        botName: 'testBot'
      };
    const botService = createBotService(appConfig);
    expect(botService).toBeInstanceOf(Typebot);
  });

  it('botReply should handle messages correctly', async () => {
    const mockBotService: IBotService = {
      fetchAndPrepareResponse: vi.fn(() => Promise.resolve({
        messages: ['Hello, world!'],
        sessionId: 'new-session-id'
      }))
    };
    const ctx: HandlerContext<ConversationState, Json> = {
        message: {
          content: 'Hello',
          id: 'unique-message-id',
          messageVersion: 'v2',
          senderAddress: 'sender',
          sent: new Date(),
          recipientAddress: 'recipient',
        } as any,
        conversationState: { messages: [], sessionId: 'session-id' },
        reply: vi.fn()
      } as any ;
    const messages = await botReply(ctx, mockBotService);
    expect(messages).toEqual(['Hello, world!']);
    expect(ctx.conversationState.sessionId).toBe('new-session-id');
    expect(ctx.conversationState.messages).toHaveLength(2);
  });
});