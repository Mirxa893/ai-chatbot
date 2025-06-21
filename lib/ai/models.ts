import { openai } from '@ai-sdk/openai';
import { fireworks } from '@ai-sdk/fireworks';
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';

// Default model
export const DEFAULT_CHAT_MODEL: string = 'chat-model-small';

// Define the Hugging Face API URL for o4-mini (if needed)
const HUGGINGFACE_API_URL = 'https://mirxakamran893-LOGIQCURVECHATIQBOT.hf.space/chat';

export const myProvider = customProvider({
  languageModels: {
    'gpt-4.1': openai('gpt-4'),  // Use GPT-4.1 model
    'o4-mini': openai('o4-mini'),  // Use o4-mini for fast tasks
    'o3': fireworks('accounts/fireworks/models/o3'), // Reasoning model (o3)
    'chat-model-small': openai('gpt-4o-mini'),
    'chat-model-large': openai('gpt-4o'),
    'chat-model-reasoning': wrapLanguageModel({
      model: fireworks('accounts/fireworks/models/deepseek-r1'),
      middleware: extractReasoningMiddleware({ tagName: 'think' }),
    }),
    'title-model': openai('gpt-4-turbo'),
    'artifact-model': openai('gpt-4o-mini'),
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
  {
    id: 'chat-model-small',
    name: 'Small model',
    description: 'Small model for fast, lightweight tasks.',
  },
  {
    id: 'chat-model-large',
    name: 'Large model',
    description: 'Large model for complex, multi-step tasks.',
  },
  {
    id: 'chat-model-reasoning',
    name: 'Reasoning model',
    description: 'Uses advanced reasoning techniques for more complex answers.',
  },
  {
    id: 'title-model',
    name: 'Title model',
    description: 'Model used for generating titles for content.',
  },
  {
    id: 'artifact-model',
    name: 'Artifact model',
    description: 'Specialized model for artifact generation and analysis.',
  },
];
