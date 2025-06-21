import { openRouter } from 'openrouter';

// Initialize OpenRouter with your API Key (replace 'your-openrouter-api-key' with your actual key)
const openRouterClient = openRouter({
  apiKey: 'your-openrouter-api-key',  // Replace with your OpenRouter API Key
});

// Define the model you want to use (only OpenRouter's DeepSeek model)
export const myProvider = {
  languageModels: {
    // Use OpenRouter's DeepSeek model for all language processing tasks
    'deepseek-model': openRouterClient.getModel('deepseek/deepseek-r1-distill-qwen-32b:free'), // OpenRouter's free model
  },
  imageModels: {
    'small-model': openRouterClient.getImageModel('dall-e-2'), // Example image generation model
    'large-model': openRouterClient.getImageModel('dall-e-3'),
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
