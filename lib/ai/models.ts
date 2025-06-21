// Define the default model
export const DEFAULT_CHAT_MODEL: string = 'deepseek/deepseek-r1-distill-qwen-32b:free'; // Use OpenRouter's model

// Define available models
export const myProvider = customProvider({
  languageModels: {
    'deepseek/deepseek-r1-distill-qwen-32b:free': async (messages: Array<Message>) => {
      const response = await fetch('https://api.openrouter.ai/v1/chat/completions', {
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
      // Image model logic
    },
    'large-model': async () => {
      // Image model logic
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
