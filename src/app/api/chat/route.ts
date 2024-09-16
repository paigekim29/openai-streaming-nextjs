import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function iteratorToStream(iterator: AsyncIterableIterator<Uint8Array>) {
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

async function* makeIterator(stream: AsyncIterable<any>) {
  const encoder = new TextEncoder();

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content || '';
    yield encoder.encode(delta);
  }
}

export async function POST(req: Request) {
  const { message } = await req.json();

  try {
    const stream = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: message }],
      stream: true,
    });

    return new Response(iteratorToStream(makeIterator(stream)));
  } catch (error) {
    console.error('Error', error);
    return new Response(`ERROR: ${error}`, {
      status: 500
    })
  }
}
