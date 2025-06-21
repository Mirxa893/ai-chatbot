// Define the OpenRouter API URL
const OPENROUTER_API_URL = 'https://api.openrouter.ai/v1/chat/completions';

// Set up your OpenRouter API Key here (replace with your actual API key)
const OPENROUTER_API_KEY = 'your-openrouter-api-key';  // Replace with your OpenRouter API Key

export const myProvider = {
  languageModels: {
    // Using OpenRouter's DeepSeek model for AI language processing
    'deepseek-model': async (messages: Array<Message>) => {
      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1-distill-qwen-32b:free',  // The specific OpenRouter model
          messages: messages.map(message => ({
            role: message.role,
            content: message.content,
          })),
        }),
      });

      const data = await response.json();

      if (data && data.reply) {
        return data.reply; // Returning the model's reply
      } else {
        throw new Error('Error: No reply from OpenRouter API');
      }
    },
  },
  imageModels: {
    'small-model': async () => {
      // Image model handling code here
    },
    'large-model': async () => {
      // Image model handling code here
    },
  },
};

// Define available chat models with only the DeepSeek model
interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'deepseek-model',
    name: 'DeepSeek Model',
    description: 'Advanced reasoning and AI-powered solutions using the DeepSeek model.',
  },
];
