import dotenv from 'dotenv';
import { AppConfig } from './types.js'

dotenv.config();

export function initializeAppConfig(): AppConfig {
  const appConfig: AppConfig = {
    postgresConnectionString: process.env.NODE_ENV === 'production' ? process.env.POSTGRES_CONNECTION_STRING || '' : '',
    walletKey: process.env.KEY || '',
    xmtpEnv: process.env.XMTP_ENV as "dev" | "production" | "local" | undefined,
    typebotPublicId: process.env.TYPEBOT_PUBLIC_ID || '',
    botService: process.env.BOT_SERVICE || '',
    botName: process.env.BOT_NAME || '',
  };

  if (!appConfig.walletKey || !appConfig.typebotPublicId) {
    throw new Error("Required environment variables are missing");
  }

  return appConfig;
}