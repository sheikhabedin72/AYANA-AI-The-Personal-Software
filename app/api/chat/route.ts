
import { GoogleGenAI } from "@google/genai";

// This allows the response to take longer if needed (up to 30 seconds)
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, prompt } = await req.json();
    
    // Resolve the incoming prompt from either 'messages' (AI SDK style) or direct 'prompt'
    const activePrompt = prompt || (messages && messages[messages.length - 1]?.content);

    if (!activePrompt) {
      return new Response(JSON.stringify({ error: "No prompt provided" }), { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Using Gemini 3 Flash for the rapid 'Factory' experience
    const result = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: activePrompt,
      config: {
        systemInstruction: `You are AYANA AI, a sophisticated software engineering intelligence.
        
        TASK:
        Generate a single-file, high-quality React component based on the user's request.
        
        CONSTRAINTS:
        - Use Tailwind CSS for all styling.
        - Use 'lucide-react' for icons.
        - Output ONLY the raw code for the 'App.tsx' file.
        - Do NOT include markdown code blocks (like \`\`\`tsx). Just the text.
        - Ensure the component is exported as 'default'.
        - If the user asks for a persona (like Sam Altman), style the app to match their aesthetic.
        - Always start your response with '/* AYANA AI GENERATED */'.`,
      },
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result) {
            const text = chunk.text;
            if (text) {
              // Stream raw text chunks to the client
              controller.enqueue(encoder.encode(text));
            }
          }
        } catch (e) {
          console.error("AYANA Factory Streaming Error:", e);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("AYANA Factory Route Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
