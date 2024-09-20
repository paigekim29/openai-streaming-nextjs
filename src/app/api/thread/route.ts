import { openai } from "@/app/openai";

export async function POST() {
  try {
    const thread = await openai.beta.threads.create();

    return Response.json({ threadId: thread.id });

  } catch (error) {
    console.error('Error', error);
    return new Response(`ERROR: ${error}`, {
      status: 500
    })
  }
}
