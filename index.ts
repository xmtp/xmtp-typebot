import { Wallet } from "ethers";
import { Client } from "@xmtp/xmtp-js";
import { GrpcApiClient } from "@xmtp/grpc-api-client";
import { HandlerContext, Json, newBotConfig, run } from "@xmtp/bot-kit-pro";
import { initializeAppConfig } from './config.js';
import { AppConfig, IBotService, ConversationState } from './types.js';
import { Typebot } from './services/typebot.js';

const appConfig = initializeAppConfig();
const wallet = new Wallet(appConfig.walletKey);
const xmtpKeys = await Client.getKeys(wallet, { env: appConfig.xmtpEnv, apiClientFactory: GrpcApiClient.fromOptions });
const postgresConnectionString = appConfig.postgresConnectionString;

export function createBotService(config: AppConfig): IBotService {
  switch (config.botService.toLowerCase()) {
    case 'typebot':
      return new Typebot(config.typebotPublicId);
    // case 'AnotherBotService':
    //   return new AnotherBotService();
    default:
      throw new Error(`Unknown bot service type: ${config.botService}`);
  }
}

export async function botReply(ctx: HandlerContext<ConversationState, Json>, botService: IBotService): Promise<string[]> {
  const message = ctx.message.content;
  let sessionId = ctx.conversationState.sessionId;

  if (typeof message !== "string") {
    return ["I don't understand that"];
  }

  ctx.conversationState.messages = (ctx.conversationState.messages || []).concat({
    role: "user",
    content: message,
    name: "user"
  });

  const { messages, sessionId: newSessionId } = await botService.fetchAndPrepareResponse(message, sessionId || '');
  if (newSessionId) {
    ctx.conversationState.sessionId = newSessionId;
  }

  messages.forEach(message => ctx.conversationState.messages?.push({
    role: "assistant",
    content: message,
    name: "assistant"
  }));

  return messages;
}

async function start() {
  const botService = createBotService(appConfig);
  const botConfig = newBotConfig(`${appConfig.botService}-${appConfig.botName}`, {
    xmtpKeys,
    xmtpEnv: appConfig.xmtpEnv,
  }, async (ctx) => {
    const replies = await botReply(ctx, botService);
    replies.forEach(reply => ctx.reply(reply));
  });

  await run([botConfig], {
    db: { postgresConnectionString }
  });
}

start();