
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function buildMetaPrompt(initialPrompt: string, desiredOutcome: string): string {
    return `You are an world-class AI prompt engineer. Your sole purpose is to transform a user's rough prompt idea into a precise, detailed, and highly effective prompt for a generative AI like Gemini.

Analyze the user's initial prompt and their desired outcome. Then, construct a new prompt that:
- Is exceptionally clear and unambiguous.
- Provides all necessary context for the AI to excel.
- Specifies the desired format, tone, voice, and style of the output.
- Includes constraints or negative constraints to guide the AI.
- Uses strong action verbs and a clear structure (e.g., using roles, steps, or markdown for clarity).
- Is optimized for the AI to deliver the best possible result based on the user's goals.

Here is the user's input:
---
INITIAL PROMPT:
"${initialPrompt}"
---
DESIRED OUTCOME:
"${desiredOutcome || 'No specific outcome provided. Infer the best possible outcome from the initial prompt and create a versatile, high-quality prompt.'}"
---

Now, provide the rewritten, perfected prompt. Your entire response MUST BE ONLY the new prompt text, without any explanation, preamble, or markdown formatting like \`\`\`.`;
}


function buildAnalysisPrompt(initialPrompt: string, desiredOutcome: string): string {
    return `You are an expert AI prompt engineering diagnostician. Your goal is to analyze a user's prompt and provide constructive, actionable feedback to help them improve it for any generative AI model. Do not rewrite the prompt for them; instead, teach them how to improve it.

Analyze the user's initial prompt and their desired outcome. Identify potential issues such as vagueness, ambiguity, lack of context, missing constraints, or unclear formatting. Provide a concise list of 3-5 specific suggestions for improvement. Frame your suggestions as helpful tips.

Here is the user's input:
---
INITIAL PROMPT:
"${initialPrompt}"
---
DESIRED OUTCOME:
"${desiredOutcome || 'No specific outcome provided. Infer the best possible outcome from the initial prompt.'}"
---

Your analysis and suggestions:
Format your response as a markdown bulleted list. Each bullet point should be a clear, actionable suggestion. Your entire response must ONLY be the markdown list. For example:
* Suggestion 1...
* Suggestion 2...`;
}

export const analyzePrompt = async (initialPrompt: string, desiredOutcome: string): Promise<string> => {
    try {
        if (!initialPrompt) {
            return "Please provide an initial prompt to analyze.";
        }
        
        const metaPrompt = buildAnalysisPrompt(initialPrompt, desiredOutcome);

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: metaPrompt,
            config: {
                temperature: 0.5,
            }
        });

        const text = response.text;

        if (!text) {
            throw new Error('Received an empty analysis from the AI.');
        }

        return text.trim();

    } catch (error) {
        console.error('Error calling Gemini API for analysis:', error);
        throw new Error('Failed to communicate with the AI service for analysis.');
    }
}


export const generatePerfectPrompt = async (initialPrompt: string, desiredOutcome: string): Promise<string> => {
    try {
        const metaPrompt = buildMetaPrompt(initialPrompt, desiredOutcome);

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: metaPrompt,
            config: {
                temperature: 0.7,
                topP: 0.95,
            }
        });

        const text = response.text;
        
        if (!text) {
            throw new Error('Received an empty response from the AI.');
        }

        return text.trim();

    } catch (error) {
        console.error('Error calling Gemini API:', error);
        throw new Error('Failed to communicate with the AI service.');
    }
};
