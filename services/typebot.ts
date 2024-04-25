import { IBotService } from '../types.js'

type TypebotMessage = {
  id: string;
  type: string;
  content: {
    richText: Array<{
      type: string;
      children: Array<{
        text: string;
      }>;
    }>;
  };
};

export class Typebot implements IBotService {
  private typebotPublicId: string;

  constructor(typebotPublicId: string) {
    this.typebotPublicId = typebotPublicId;
  }

  async fetchAndPrepareResponse(message: string, sessionId?: string): Promise<{ messages: string[], sessionId: string }> {
    const url = sessionId ? `https://typebot.io/api/v1/sessions/${sessionId}/continueChat` : `https://typebot.io/api/v1/typebots/${this.typebotPublicId}/startChat`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const jsonResponse = await response.json();
    const { messages, sessionId: newSessionId } = jsonResponse;
    const extractedMessages = messages.map((msg: TypebotMessage) =>
      msg.content.richText.map(block =>
        block.children.map(child => child.text).join('')
      ).join(' ')
    );
    return { messages: extractedMessages, sessionId: newSessionId || sessionId };
  }
}