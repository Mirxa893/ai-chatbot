import { openai } from '@ai-sdk/openai';
import { fireworks } from '@ai-sdk/fireworks';
import {
  customProvider,
} from 'ai';

// Default model
export const DEFAULT_CHAT_MODEL: string = 'gpt-4.1';  // Set default model to gpt-4.1

// Define available models
export const myProvider = customProvider({
  languageModels: {
    'gpt-4.1': openai('gpt-4'),  // Use GPT-4.1 model
    'o4-mini': openai('o4-mini'),  // Use o4-mini for fast tasks
    'o3': fireworks('accounts/fireworks/models/o3'), // Reasoning model (o3)
  },
  imageModels: {
    'small-model': openai.image('dall-e-2'),
    'large-model': openai.image('dall-e-3'),
  },
});

// Define your available chat models
interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'gpt-4.1',
    name: 'GPT-4.1',
    description: 'Advanced model with high performance for general tasks.',
  },
  {
    id: 'o4-mini',
    name: 'o4-mini',
    description: 'Fast, lightweight model for fast tasks and efficient performance.',
  },
  {
    id: 'o3',
    name: 'o3',
    description: 'Model for advanced reasoning and complex analysis tasks.',
  },
];
