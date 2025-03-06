import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Add additional instruction to the last message to request engaging questions
    const enhancedMessages = [...messages];
    const lastMessage = enhancedMessages[enhancedMessages.length - 1];
    
    // Append instructions to generate engaging questions
    lastMessage.content += "\n\nBased on our conversation so far, generate exactly 3 engaging questions that would be interesting to ask. Make the questions thoughtful and likely to spark meaningful conversation. Format them as a numbered list.";
    
    const result = streamText({
      model: google('gemini-1.5-pro-latest'),
      messages: enhancedMessages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    if (error instanceof Error) {
      const { name, message } = error;
      const status = 'status' in error ? (error as any).status : 500;
      const headers = 'headers' in error ? (error as any).headers : undefined;
      
      return NextResponse.json(
        { name, status, headers, message },
        { status: status || 500 }
      );
    } else {
      console.error('An unexpected error occurred', error);
      return NextResponse.json(
        { message: 'An unexpected error occurred' },
        { status: 500 }
      );
    }
  }
}