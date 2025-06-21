import { customProvider } from 'ai'; // Ensure correct import

// Define OpenRouter API URL (replace with actual API endpoint)
const OPENROUTER_API_URL = 'https://api.openrouter.ai/v1/chat/completions';
const OPENROUTER_API_KEY = 'your-openrouter-api-key'; // Replace with your actual OpenRouter API key

// Export the language model provider
export const myProvider = customProvider({
  languageModels: {import { customProvider } from 'ai'; // Ensure correct import

// Define OpenRouter API URL (replace with actual API endpoint)
const OPENROUTER_API_URL = 'https://api.openrouter.ai/v1/chat/completions';
const OPENROUTER_API_KEY = 'your-openrouter-api-key'; // Replace with your actual OpenRouter API key

// Define the default model
export const DEFAULT_CHAT_MODEL: string = 'deepseek/deepseek-r1-distill-qwen-32b:free';  // OpenRouter's free model

// Export the language model provider
export const myProvider = customProvider({
  languageModels: {
    // Define only the models you want to use (OpenRouter model in this case)
    'deepseek/deepseek-r1-distill-qwen-32b:free': async (messages: Array<Message>) => {
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
        return data.reply;
      } else {
        throw new Error('Error: No reply from OpenRouter API');
      }
    },
  },
  imageModels: {
    // Example for image models, modify as needed
    'small-model': async () => {
      // Handle small model
    },
    'large-model': async () => {
      // Handle large model
    },
  },
});

export const chatModels = [
  {
    id: 'deepseek/deepseek-r1-distill-qwen-32b:free',  // OpenRouter model ID
    name: 'DeepSeek Model',
    description: 'Advanced reasoning and text generation model from OpenRouter.',
  },
];

    // Define only the models you want to use (OpenRouter model in this case)
    'deepseek/deepseek-r1-distill-qwen-32b:free': async (messages: Array<Message>) => {
      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`, // Authorization header
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1-distill-qwen-32b:free', // Your OpenRouter model
          messages: messages,
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
    // Example for image models, modify as needed
    'small-model': async () => {
      // Handle small model
    },
    'large-model': async () => {
      // Handle large model
    },
  },
});

export const chatModels = [
  {
    id: 'deepseek/deepseek-r1-distill-qwen-32b:free',  // Your OpenRouter model ID
    name: 'DeepSeek Model',
    description: 'Advanced reasoning and text generation model from OpenRouter.',
  },
];
