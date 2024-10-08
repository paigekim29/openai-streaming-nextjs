import { openai } from "@/app/openai";

export async function POST(request: Request, { params: { id } }: { params: { id: string } }) {
  const { content, assistantId } = await request.json();

  const response = await openai.beta.threads.messages.create(id, {
    role: "user",
    content,
  });

  const stream = openai.beta.threads.runs.stream(id, {
    assistant_id: assistantId,
  });

  return new Response(stream.toReadableStream(), {
    headers: {
      'Content-Type': 'application/json',
      'X-Message-ID': response.id,
    }
  });
}