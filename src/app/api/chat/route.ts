import { openai } from '@/app/openai';

import OpenAI from 'openai';
import { Stream } from 'openai/streaming';

function iteratorToStream(iterator: AsyncGenerator<Uint8Array>) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();

      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });
}

async function* makeIterator(stream: Stream<OpenAI.Chat.Completions.ChatCompletionChunk>) {
  const encoder = new TextEncoder();

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content || '';
    yield encoder.encode(delta);
  }
}

export async function POST(req: Request) {
  const { message } = await req.json();

  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: message }],
      stream: true,
      stream_options: { include_usage: true }
    });

    return new Response(iteratorToStream(makeIterator(stream)));
  } catch (error) {
    console.error('Error', error);
    return new Response(`ERROR: ${error}`, {
      status: 500
    })
  }
}
