import { openai } from "@/app/openai";

export async function POST() {
  try {
    const assistant = await openai.beta.assistants.create({
      name: "Assistant created by Paige",
      instructions: "You are an AI assistant named Assistant, created by Paige. You will be given text only. Respond in English unless the user's question is in another language, then answer in that language.",
      tools: [{ type: "code_interpreter" }],
      model: "gpt-4o",
    });

    return Response.json({ assistantId: assistant.id });

  } catch (error) {
    console.error('Error', error);
    return new Response(`ERROR: ${error}`, {
      status: 500
    })
  }
}
