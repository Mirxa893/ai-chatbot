import { type Message } from 'ai';
import { auth } from '@/app/(auth)/auth';
import {
  deleteChatById,
  getChatById,
  saveChat,
  saveMessages,
} from '@/lib/db/queries';
import { generateUUID, getMostRecentUserMessage } from '@/lib/utils';
import { generateTitleFromUserMessage } from '../../actions';

// Define the Hugging Face API URL
const HUGGINGFACE_API_URL = "https://mirxakamran893-LOGIQCURVECHATIQBOT.hf.space/chat";

// Define pre-messages (system messages to guide the AI)
const preMessages = [
  {
    role: 'system',
    content: 'You are LogIQ Curve AI, an intelligent assistant powered by Hugging Face.',
  },
  {
    role: 'system',
    content: 'Please assist the user with any queries related to LogIQ Curve services and AI-powered solutions.',
  },
];

export const maxDuration = 60;

export async function POST(request: Request) {
  const { id, messages }: { id: string; messages: Array<Message> } = await request.json();

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
    messages: [{ ...userMessage, createdAt: new Date(), chatId: id, id: generateUUID() }], // Add the `id` field here
  });

  try {
    // Combine pre-messages with user messages to send them as context to Hugging Face API
    const combinedMessages = [...preMessages, ...messages];

    // Send the user message to Hugging Face API for chat replies
    const response = await fetch(HUGGINGFACE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add Authorization header if needed
        // 'Authorization': `Bearer YOUR_HUGGINGFACE_API_KEY`
      },
      body: JSON.stringify({
        inputs: {
          message: userMessage.content, // Send the user's message content
        },
      }),
    });

    const data = await response.json();

    // Ensure that the response contains the expected data
    if (data && data.reply) {
      const chatReply = data.reply; // This is the reply from Hugging Face API

      // Save the response from Hugging Face into your messages collection
      await saveMessages({
        messages: [
          {
            role: 'assistant',
            content: chatReply,
            createdAt: new Date(),
            chatId: id,
            id: generateUUID(), // Generate a unique `id` for the response message
          },
        ],
      });

      // Return the response data
      return new Response(JSON.stringify({ reply: chatReply }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else {
      return new Response('Error: No reply from Hugging Face API', { status: 500 });
    }
  } catch (error) {
    console.error('Error while contacting Hugging Face API:', error);
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

export async function PUT(request: Request) {
  // This PUT method might be used for updating the chat, e.g., marking a chat as read
  const { id, status }: { id: string; status: string } = await request.json();
  const session = await auth();

  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (!chat) {
      return new Response('Chat not found', { status: 404 });
    }

    if (chat.userId !== session.user.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Update the status of the chat or any other necessary fields
    chat.status = status; // For example, marking it as read
    await saveChat({ id, userId: session.user.id, status });

    return new Response('Chat updated', { status: 200 });
  } catch (error) {
    console.error('Error while updating chat:', error);
    return new Response('Error while processing request', { status: 500 });
  }
}
