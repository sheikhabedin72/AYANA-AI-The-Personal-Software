import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { FileStructure } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const AYANA_SYSTEM_INSTRUCTION = `You are AYANA AI: The Personal Software Factory. 
Your goal is to build high-performance, aesthetically pleasing React applications.

DESIGN GUIDELINES:
- Aesthetic: Minimalist, high-end, inspired by Apple and Bolt.new.
- Color Palette: Use white backgrounds (#FFFFFF) and light gray accents (#F9FAFB).
- Primary Color: Use Indigo-600 (#4f46e5) as the primary brand color for buttons, highlights, and active states.
- Typography: Large, clean typography with plenty of whitespace and perfect alignment.
- Icons: Use 'lucide-react' for all icons.
- Branding: Always include a small "Built with AYANA AI" attribution if appropriate for the app's footer.

ENGINEERING CONSTRAINTS:
- Libraries: ONLY use lucide-react, framer-motion, clsx, tailwind-merge, and standard React hooks. 
- Styling: Use Tailwind CSS exclusively.
- Language: TypeScript with functional components and clean prop interfaces.
- Response: Output ONLY raw code. No explanations. No markdown formatting. No conversational filler.

If you must use a library outside the approved list, add a comment at the top of the file: "// Dependency required: [name]".`;

export async function runArchitectAgent(prompt: string): Promise<FileStructure[]> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Blueprint Request: "${prompt}".
    Map out the required React files. One file must be "App.tsx" (the entry point).`,
    config: {
      systemInstruction: AYANA_SYSTEM_INSTRUCTION + "\nPhase 1: Architecting. Provide a JSON array of files.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            path: { type: Type.STRING },
            description: { type: Type.STRING }
          },
          required: ["path", "description"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || '[]');
  } catch (e) {
    return [{ path: 'App.tsx', description: 'Main production module' }];
  }
}

export async function runDeveloperAgentStream(
  originalPrompt: string, 
  file: FileStructure, 
  context: string = "",
  onChunk: (chunk: string) => void
): Promise<string> {
  const streamResponse = await ai.models.generateContentStream({
    model: 'gemini-3-flash-preview',
    contents: `Build Module: "${file.path}" (${file.description}).
    Global Blueprint: "${originalPrompt}".
    Context of other files: ${context}`,
    config: {
      systemInstruction: AYANA_SYSTEM_INSTRUCTION + "\n/* AYANA AI GENERATED */",
      temperature: 0.1,
    }
  });

  let fullCode = "";
  for await (const chunk of streamResponse) {
    const chunkText = (chunk as GenerateContentResponse).text;
    if (chunkText) {
      const cleaned = chunkText.replace(/```tsx|```jsx|```javascript|```/g, "");
      fullCode += cleaned;
      onChunk(fullCode);
    }
  }

  return fullCode;
}