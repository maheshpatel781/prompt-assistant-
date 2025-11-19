import { GoogleGenAI, Type } from "@google/genai";
import { PromptAnalysisResponse } from "../types";

const SYSTEM_INSTRUCTION = `
You are an Expert Prompt Engineer. Your goal is to take basic, vague user ideas and rewrite them into highly optimized, professional prompts that can be pasted into ChatGPT, Gemini, or Claude.

Your Workflow:
1. Analyze: Read the basic request and identify the core goal, the persona needed, and the missing details.
2. Clarify (Simulated): Identify if the request is too vague. If so, generate 3 quick questions that would help narrow it down, but ALWAYS generate a "best guess" prompt anyway.
3. Generate: Output a "Ready-to-Use Prompt" structured specifically with Persona, Task, Constraints, and Format.

The "Perfect Prompt" Structure you must use in the JSON output:
- Persona: (e.g., "Act as a Senior Marketing Manager...")
- Task: (Clear, step-by-step instructions)
- Constraints: (Word count, formatting, things to avoid)
- Format: (Table, Bullet points, Code block)

Output MUST be strict JSON.
`;

export const generateExpertPrompt = async (userInput: string): Promise<PromptAnalysisResponse> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please set the API_KEY environment variable.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: userInput,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          analysis: {
            type: Type.STRING,
            description: "A brief analysis of the user's intent and what was missing.",
          },
          is_vague: {
            type: Type.BOOLEAN,
            description: "True if the user's input was very vague and required heavy assumptions.",
          },
          clarification_questions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "3 questions to ask the user if they want to refine the prompt further.",
          },
          generated_prompt: {
            type: Type.OBJECT,
            properties: {
              persona: { type: Type.STRING },
              task: { type: Type.STRING },
              constraints: { type: Type.STRING },
              format: { type: Type.STRING },
              full_text: { 
                type: Type.STRING,
                description: "The full, copy-pasteable prompt including all sections."
              }
            },
            required: ["persona", "task", "constraints", "format", "full_text"],
          },
        },
        required: ["analysis", "is_vague", "clarification_questions", "generated_prompt"],
      },
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("No response from Gemini.");
  }

  try {
    return JSON.parse(text) as PromptAnalysisResponse;
  } catch (e) {
    console.error("Failed to parse JSON", text);
    throw new Error("Invalid JSON response from model.");
  }
};