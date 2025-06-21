import {
  type Message,
  createDataStreamResponse,
  smoothStream,
  streamText,
} from 'ai';

import { auth } from '@/app/(auth)/auth';
import { myProvider } from '@/lib/ai/models';
import { systemPrompt } from '@/lib/ai/prompts';
import {
  deleteChatById,
  getChatById,
  saveChat,
  saveMessages,
} from '@/lib/db/queries';
import {
  generateUUID,
  getMostRecentUserMessage,
  sanitizeResponseMessages,
} from '@/lib/utils';

import { generateTitleFromUserMessage } from '../../actions';
import { createDocument } from '@/lib/ai/tools/create-document';
import { updateDocument } from '@/lib/ai/tools/update-document';
import { requestSuggestions } from '@/lib/ai/tools/request-suggestions';
import { getWeather } from '@/lib/ai/tools/get-weather';

// Define OpenRouter API URL
const OPENROUTER_API_URL = 'https://api.openrouter.ai/v1/chat/completions'; // Define the correct OpenRouter API endpoint

const OPENROUTER_API_KEY = 'your-openrouter-api-key'; // Replace with your actual OpenRouter API Key

export const maxDuration = 60;

export async function POST(request: Request) {
  const {
    id,
    messages,
    selectedChatModel,
  }: { id: string; messages: Array<Message>; selectedChatModel: string } = await request.json();

  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const userMessage = getMostRecentUserMessage(messages);

  if (!userMessage) {
    return new Response('No user message found', { status: 400 });
  }

  const chat = await getChatById({ id });

  if (!chat) {
    const title = await generateTitleFromUserMessage({ message: userMessage });
    await saveChat({ id, userId: session.user.id, title });
  }

  await saveMessages({
    messages: [{
      ...userMessage,
      createdAt: new Date(),
      chatId: id,
      id: generateUUID(),
    }],
  });

  try {
    // Directly use 'deepseek-model' as the selected model
    const selectedModel = myProvider.languageModels['deepseek-model']; // No fallback needed, only DeepSeek model

    // Fetch the response from OpenRouter using the selected model
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`, // Include the OpenRouter API key for authentication
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1-distill-qwen-32b:free', // OpenRouter's free model
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      }),
    });

    const data = await response.json();

    if (data && data.reply) {
      // After getting the response from OpenRouter, process it further
      const chatReply = data.reply;  // The assistant's reply from OpenRouter

      // Save the assistant's response in the database
      await saveMessages({
        messages: [{
          role: 'assistant',
          content: chatReply,
          createdAt: new Date(),
          chatId: id,
          id: generateUUID(),  // Ensure that each message has a unique ID
        }],
      });

      return new Response(JSON.stringify({ reply: chatReply }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response('Error: No reply from OpenRouter API', { status: 500 });
    }
  } catch (error) {
    console.error('Error while processing request:', error);
    return new Response('Error while processing request', { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Not Found', { status: 404 });
  }

  const session = await auth();

  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (chat.userId !== session.user.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    await deleteChatById({ id });

    return new Response('Chat deleted', { status: 200 });
  } catch (error) {
    return new Response('An error occurred while processing your request', {
      status: 500,
    });
  }
}
