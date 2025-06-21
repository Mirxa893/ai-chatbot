'use server';

import { Message } from 'ai';
import { cookies } from 'next/headers';

import {
  deleteMessagesByChatIdAfterTimestamp,
  getMessageById,
  updateChatVisiblityById,
} from '@/lib/db/queries';
import { VisibilityType } from '@/components/visibility-selector';

// Define the OpenRouter API URL (for DeepSeek model)
const OPENROUTER_API_URL = 'https://api.openrouter.ai/v1/chat/completions';
const OPENROUTER_API_KEY = 'your-openrouter-api-key';  // Replace with your OpenRouter API key

// Save the selected chat model as a cookie
export async function saveChatModelAsCookie(model: string) {
  const cookieStore = await cookies();
  cookieStore.set('chat-model', model);
}

// Function to generate title from user message using OpenRouter's DeepSeek model
export async function generateTitleFromUserMessage({
  message,
}: {
  message: Message;
}) {
  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek/deepseek-r1-distill-qwen-32b:free', // OpenRouter model for text generation
      messages: [
        {
          role: 'user',
          content: message.content, // Sending user message content for title generation
        },
      ],
    }),
  });

  const data = await response.json();

  if (data && data.reply) {
    return data.reply; // Returning the model's generated title
  } else {
    throw new Error('Error: No reply from OpenRouter API');
  }
}

// Function to delete trailing messages by chatId
export async function deleteTrailingMessages({ id }: { id: string }) {
  const [message] = await getMessageById({ id });

  await deleteMessagesByChatIdAfterTimestamp({
    chatId: message.chatId,
    timestamp: message.createdAt,
  });
}

// Function to update chat visibility
export async function updateChatVisibility({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: VisibilityType;
}) {
  await updateChatVisiblityById({ chatId, visibility });
}
