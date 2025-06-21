import { customProvider } from 'ai';

// Define default chat model
export const DEFAULT_CHAT_MODEL: string = 'huggingface-chat-model';

// Define the Hugging Face Space API endpoint (chat endpoint)
const HUGGINGFACE_API_URL = 'https://mirxakamran893-LOGIQCURVECHATIQBOT.hf.space/chat';

export const myProvider = customProvider({
  languageModels: {
    'huggingface-chat-model': async ({ messages }) => {
      // This is where we integrate the Hugging Face API call for chat replies
      const userMessage = messages[messages.length - 1].content;

      // Call Hugging Face API with the user message
      const response = await fetch(HUGGINGFACE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add Authorization header if needed
          // 'Authorization': `Bearer YOUR_HUGGINGFACE_API_KEY`
        },
        body: JSON.stringify({
          inputs: {
            message: userMessage,
          },
        }),
      });

      const data = await response.json();

      // Ensure the response contains the expected data
      if (data && data.reply) {
        return data.reply; // The assistant's reply
      } else {
        throw new Error('Error: No reply from Hugging Face API');
      }
    },
  },
  imageModels: {}, // No image models are needed now
});

interface ChatModel {
  id: string;
  name: string;
  description: string;
}

// Chat models array with only Hugging Face chat model, renamed
export const chatModels: Array<ChatModel> = [
  {
    id: 'huggingface-chat-model',
    name: "LogIQ Curve's AI Model",
    description: 'Chat model powered by LogIQ Curve AI (Hugging Face Space)',
  },
];
