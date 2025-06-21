import { openai } from '@ai-sdk/openai';
import { fireworks } from '@ai-sdk/fireworks';
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';

// Define default chat model
export const DEFAULT_CHAT_MODEL: string = 'chat-model-small';

// Define the Hugging Face Space API endpoint (chat endpoint)
const HUGGINGFACE_API_URL = 'https://mirxakamran893-LOGIQCURVECHATIQBOT.hf.space/chat';

export const myProvider = customProvider({
  languageModels: {
    'chat-model-small': openai('gpt-4o-mini'),
    'chat-model-large': openai('gpt-4o'),
    'chat-model-reasoning': wrapLanguageModel({
      model: fireworks('accounts/fireworks/models/deepseek-r1'),
      middleware: extractReasoningMiddleware({ tagName: 'think' }),
    }),
    'title-model': openai('gpt-4-turbo'),
    'artifact-model': openai('gpt-4o-mini'),
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
  imageModels: {
    'small-model': openai.image('dall-e-2'),
    'large-model': openai.image('dall-e-3'),
  },
});

interface ChatModel {
  id: string;
  name: string;
  description: string;
}

// Chat models array with updated Hugging Face chat model
export const chatModels: Array<ChatModel> = [
  {
    id: 'chat-model-small',
    name: 'Small model',
    description: 'Small model for fast, lightweight tasks',
  },
  {
    id: 'chat-model-large',
    name: 'Large model',
    description: 'Large model for complex, multi-step tasks',
  },
  {
    id: 'chat-model-reasoning',
    name: 'Reasoning model',
    description: 'Uses advanced reasoning',
  },
  {
    id: 'huggingface-chat-model',
    name: 'Hugging Face Chat Model',
    description: 'Chat model powered by Hugging Face Space',
  },
];
