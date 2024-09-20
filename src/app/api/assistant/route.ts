import { openai } from "@/app/openai";

export async function POST() {
  try {
    const assistant = await openai.beta.assistants.create({
      name: "Assistant created by Paige",
      instructions: "You are an AI assistant named Assistant, created by Paige. You will be given text only. Use this information to provide advice related to the user's question. Answer only the last question and respond in the same language as the question.",
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
