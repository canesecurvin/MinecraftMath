import { GoogleGenAI, Type } from "@google/genai";
import type { CharacterOptions, QuizQuestion, UserProfile, QuizResult } from './types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a fallback for development; in a real environment, the key would be set.
  console.warn("API_KEY environment variable not set. Using a placeholder.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const quizQuestionSchema = {
  type: Type.OBJECT,
  properties: {
    question: { type: Type.STRING },
    options: {
      type: Type.OBJECT,
      properties: {
        A: { type: Type.STRING },
        B: { type: Type.STRING },
        C: { type: Type.STRING },
        D: { type: Type.STRING },
      },
      required: ['A', 'B', 'C', 'D'],
    },
    correctAnswer: { type: Type.STRING },
    visual: { type: Type.STRING, description: "An optional SVG string for questions needing a visual representation (e.g., fractions, geometry). The SVG should be self-contained." },
  },
  required: ['question', 'options', 'correctAnswer'],
};

export const generateQuizQuestions = async (grade: string, subject: string): Promise<QuizQuestion[]> => {
  try {
    const prompt = `Generate 10 unique, multiple-choice math questions for a ${grade} student studying ${subject}. The questions should be common core aligned. For any questions that involve geometry, fractions, or visual elements, please provide a simple SVG string in the 'visual' property. For example, for 'What fraction of the shape is shaded?', provide an SVG of a shape with parts shaded. Crucially, please double-check that the provided 'correctAnswer' is accurate for the question.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: quizQuestionSchema,
        },
      },
    });

    const jsonText = response.text;
    const questions = JSON.parse(jsonText) as QuizQuestion[];
    return questions;
  } catch (error) {
    console.error("Error generating quiz questions:", error);
    // Fallback with a sample question in case of API error
    return [{
      question: "What is 2 + 2?",
      options: { A: "3", B: "4", C: "5", D: "6" },
      correctAnswer: "B"
    }];
  }
};

export const getHintForQuestion = async (question: string): Promise<string> => {
  try {
    const prompt = `Provide a simple, one-sentence hint for this math problem without giving away the answer: "${question}"`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error getting hint:", error);
    return "Think about the main operation (addition, subtraction, etc.) you need to use.";
  }
};

export const generateCharacterAscii = async (character: CharacterOptions): Promise<string> => {
  try {
    const prompt = `
      Create a simple, blocky, text-based ASCII art representation of a character.
      - Hair Style: ${character.hairStyle}
      Use '#' for hair.
      Use 'T' for the shirt.
      Use 'P' for the pants.
      Use 'S' for the shoes.
      Use standard characters for the face like 'o' for eyes and '_' for mouth.
      The output should be just the ASCII art inside a markdown code block, and nothing else. Be creative with the hair style.
    `;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    const text = response.text;
    const match = text.match(/```([\s\S]*?)```/);
    return match ? match[1].trim() : '[Character Art]';
  } catch (error) {
    console.error("Error generating character ASCII:", error);
    return "[Character Art]";
  }
};


export const summarizeResultsForParent = async (profile: UserProfile, results: QuizResult[], score: number, characterAscii: string): Promise<string> => {
  try {
    const topicsToPractice = results
      .filter(r => !r.isCorrect || r.neededHelp)
      .map(r => `- ${r.question.substring(0, 60)}${r.question.length > 60 ? '...' : ''} ${r.neededHelp ? "(Needed a hint)" : ""}`)
      .join('\n');

    const prompt = `
      Create a concise, postcard-style summary of a math quiz for a parent. Be friendly and encouraging. The output should be plain text, suitable for copying into an email. Do not add a subject line.

      Here's the information:
      - Child's Name: ${profile.name}
      - Final Score: ${score}/100 Minecoins
      - Character Art:\n${characterAscii}
      - Topics to practice:\n${topicsToPractice || "None! A perfect score!"}

      Your task is to assemble this information into a friendly message. Start with a positive greeting, include the character art, state the name and score, provide a bulleted list of topics under the heading "Areas to practice:", and end with a short, encouraging closing sentence.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return encodeURIComponent(response.text);
  } catch (error) {
    console.error("Error summarizing results:", error);
    return "There was an error generating the summary. Please check the results manually.";
  }
};
