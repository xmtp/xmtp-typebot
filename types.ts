// Define a type for the app configuration
export interface AppConfig {
  postgresConnectionString: string;
  walletKey: string;
  xmtpEnv: "dev" | "production" | "local" | undefined;
  typebotPublicId: string;
  botService: string;
  botName: string;
}

// Define an interface for bot services
export interface IBotService {
  fetchAndPrepareResponse(message: string, sessionId: string): Promise<{ messages: string[], sessionId: string }>;
}

// Define a type for the roles in a chat message
export type ChatRole = "user" | "assistant" | "system" | "function";

// Define the structure of a chat message
export interface ChatMessage {
  role: ChatRole;
  content: string;
  name: string;
}

// Define the structure of the conversation state
export interface ConversationState {
  messages?: ChatMessage[];
  sessionId?: string;
}