// Import the required method from the 'ai' SDK (or the relevant package you're using)
import { customProvider } from 'ai'; // Ensure this is the correct package you're using

// Define the default model
export const DEFAULT_CHAT_MODEL: string = 'deepseek/deepseek-r1-distill-qwen-32b:free'; // OpenRouter's free model

// Define the OpenRouter API URL (used in our model)
const OPENROUTER_API_URL = 'https://api.openrouter.ai/v1/chat/completions';

export const myProvider = customProvider({
  languageModels: {
    'deepseek/deepseek-r1-distill-qwen-32b:free': async (messages: Array<Message>) => {
      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1-distill-qwen-32b:free',
          messages,
        }),
      });

      const data = await response.json();

      if (data.reply) {
        return data.reply;
      } else {
        throw new Error('Error: No reply from OpenRouter API');
      }
    },
  },
  imageModels: {
    'small-model': async () => {
      // Example for image model handling
    },
    'large-model': async () => {
      // Example for image model handling
    },
  },
});

export const chatModels: Array<ChatModel> = [
  {
    id: 'deepseek/deepseek-r1-distill-qwen-32b:free',
    name: 'DeepSeek Model',
    description: 'Advanced reasoning and text generation model from OpenRouter.',
  },
];
