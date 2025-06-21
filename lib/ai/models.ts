import { customProvider, LanguageModelV1 } from 'ai'; // Import necessary types

// Define OpenRouter API URL (replace with actual API endpoint)
const OPENROUTER_API_URL = 'https://api.openrouter.ai/v1/chat/completions';
const OPENROUTER_API_KEY = 'your-openrouter-api-key'; // Replace with your actual OpenRouter API key

// Define the default model
export const DEFAULT_CHAT_MODEL: string = 'deepseek/deepseek-r1-distill-qwen-32b:free';  // OpenRouter's free model

// Export the language model provider
export const myProvider = customProvider({
  languageModels: {
    // Define the OpenRouter model properly using LanguageModelV1
    'deepseek/deepseek-r1-distill-qwen-32b:free': {
      generate: async (messages: Array<Message>): Promise<LanguageModelV1> => {
        const response = await fetch(OPENROUTER_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`, // Authorization header
          },
          body: JSON.stringify({
            model: 'deepseek/deepseek-r1-distill-qwen-32b:free', // OpenRouter model
            messages: messages,
          }),
        });

        const data = await response.json();

        if (data.reply) {
          return { text: data.reply }; // Ensure the response matches LanguageModelV1's structure
        } else {
          throw new Error('Error: No reply from OpenRouter API');
        }
      }
    },
  },
  imageModels: {
    'small-model': async () => {},
    'large-model': async () => {},
  },
});

export const chatModels = [
  {
    id: 'deepseek/deepseek-r1-distill-qwen-32b:free',
    name: 'DeepSeek Model',
    description: 'Advanced reasoning and text generation model from OpenRouter.',
  },
];
