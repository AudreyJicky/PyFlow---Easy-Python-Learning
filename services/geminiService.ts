
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Flashcard, AnalysisResult, DailyTip, Language, QuizQuestion, SearchResult, GameMode, GameLevel, LessonContent, ExamPaper, PlaygroundFeedback } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const modelId = "gemini-2.5-flash";

// --- Schema Definitions ---

const FlashcardSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    cards: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          concept: { type: Type.STRING },
          category: { type: Type.STRING },
          definition: { type: Type.STRING },
          syntax: { type: Type.STRING },
          exampleCode: { type: Type.STRING },
        },
        required: ["concept", "category", "definition", "syntax", "exampleCode"]
      }
    }
  }
};

const AnalysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    originalCode: { type: Type.STRING },
    summary: { type: Type.STRING },
    concepts: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          segment: { type: Type.STRING },
          type: { type: Type.STRING },
          explanation: { type: Type.STRING },
        }
      }
    },
    bestPracticeTip: { type: Type.STRING }
  }
};

const DailyTipSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    topic: { type: Type.STRING },
    codeSnippet: { type: Type.STRING },
    explanation: { type: Type.STRING },
    funFact: { type: Type.STRING }
  }
};

const QuizSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
            question: { type: Type.STRING },
            options: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
            },
            correctAnswer: { type: Type.STRING },
            explanation: { type: Type.STRING },
            codeBlock: { type: Type.STRING, description: "Optional code snippet relevant to the question" }
        }
      }
    }
  }
};

const SearchSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        term: { type: Type.STRING },
        definition: { type: Type.STRING },
        syntax: { type: Type.STRING },
        example: { type: Type.STRING },
        related: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
        }
    }
}

const LessonContentSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        concept: { type: Type.STRING },
        code: { type: Type.STRING },
        steps: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    line: { type: Type.INTEGER },
                    description: { type: Type.STRING },
                    variables: { 
                        type: Type.OBJECT,
                        description: "Map of variable names to values",
                        nullable: true
                    },
                    output: { type: Type.STRING, nullable: true }
                }
            }
        },
        quiz: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    correctAnswer: { type: Type.STRING },
                    explanation: { type: Type.STRING }
                }
            }
        }
    }
}

const ExamPaperSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING },
        title: { type: Type.STRING },
        year: { type: Type.STRING },
        level: { type: Type.STRING },
        durationMinutes: { type: Type.INTEGER },
        questions: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    correctAnswer: { type: Type.STRING },
                    explanation: { type: Type.STRING },
                    codeBlock: { type: Type.STRING, nullable: true }
                }
            }
        }
    }
}

const FeedbackSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        explanation: { type: Type.STRING, description: "A detailed explanation of the code logic." },
        tip: { type: Type.STRING, description: "A best practice or performance tip." },
        hint: { type: Type.STRING, description: "A debugging hint if error, or a cool fact if success." },
        fixedCode: { type: Type.STRING, nullable: true, description: "Corrected code if there was an error." },
        isError: { type: Type.BOOLEAN },
        example: { type: Type.STRING, description: "A relevant code example or variation." }
    }
};

// --- Helper Utilities ---

// Cleans JSON strings that might be wrapped in Markdown code blocks
const cleanJSON = (text: string) => {
    if (!text) return "{}";
    return text.replace(/```json\n?|```/g, '').trim();
}

// --- API Calls ---

export const generateFlashcards = async (topic: string, level: string, language: Language): Promise<Flashcard[]> => {
  try {
    const prompt = `Generate 5 Python programming flashcards about "${topic}" for a ${level} level learner. 
    Content must be in ${language}.
    Return valid JSON matching the schema.`;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: FlashcardSchema,
      },
    });

    const json = JSON.parse(cleanJSON(response.text || "{}"));
    if (!json.cards) throw new Error("Invalid API response format");
    return json.cards;
  } catch (error) {
    console.error("Error generating flashcards:", error);
    throw error;
  }
};

export const analyzeCode = async (code: string, language: Language): Promise<AnalysisResult> => {
  try {
    const prompt = `Analyze this Python code for a beginner:
    "${code}"
    Provide a summary, breakdown of concepts, and a best practice tip.
    Content must be in ${language}.
    Return valid JSON matching the schema.`;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: AnalysisSchema,
      },
    });

    const json = JSON.parse(cleanJSON(response.text || "{}"));
    if (!json.summary) throw new Error("Invalid API response format");
    return json;
  } catch (error) {
    console.error("Error analyzing code:", error);
    throw error;
  }
};

export const createChatSession = (history: any[], language: Language) => {
    return ai.chats.create({
        model: modelId,
        history: history,
        config: {
            systemInstruction: `You are Py-Sensei, a friendly and encouraging Python tutor. 
            Your goal is to explain concepts simply to beginners. 
            Always answer in ${language}. 
            If the user sends code, explain it. 
            If they ask for a challenge, give them a small coding task.
            Keep answers concise and helpful.`
        }
    });
};

export const getDailyTip = async (language: Language): Promise<DailyTip> => {
    try {
        const prompt = `Generate a fun and useful "Daily Python Tip" for a beginner/intermediate learner.
        Include a code snippet, explanation, and a fun fact.
        Content must be in ${language}.
        Return valid JSON matching the schema.`;

        const response = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: DailyTipSchema,
            },
        });

        const json = JSON.parse(cleanJSON(response.text || "{}"));
        if (!json.topic) throw new Error("Invalid API response format");
        return json;
    } catch (error) {
        // Suppress console spam for 429 and specific errors
        const errString = String(error);
        if (errString.includes("429") || errString.includes("quota")) {
             // Silent fail allows UI to use fallback
             throw new Error("Quota Exceeded");
        }
        throw error;
    }
};

export const generateQuiz = async (language: Language, mode: GameMode, level: GameLevel): Promise<QuizQuestion[]> => {
    try {
        const prompt = `Generate 5 Python quiz questions for a ${level} learner. 
        Mode: ${mode} (Trivia = General knowledge, Bug Hunter = Find errors in code, Syntax Sprint = Fast basic syntax).
        Content must be in ${language}.
        Return valid JSON matching the schema.`;

        const response = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: QuizSchema,
            },
        });

        const json = JSON.parse(cleanJSON(response.text || "{}"));
        if (!json.questions) throw new Error("Invalid API response format");
        return json.questions;
    } catch (error) {
        const errString = String(error);
        if (errString.includes("429") || errString.includes("quota")) {
             throw new Error("Quota Exceeded");
        }
        throw error;
    }
};

export const explainTopic = async (topic: string, language: Language, level: string): Promise<string> => {
    try {
        const prompt = `Write a textbook entry about Python "${topic}".
        Target Audience: ${level} (Beginner = Simple metaphors, Intermediate = Technical details, Professional = Deep dive, best practices, performance).
        Language: ${language}.
        Format: Markdown.
        Include:
        - Introduction
        - Syntax Example
        - Real-world Use Case
        - Common Pitfalls`;

        const response = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
        });

        if (!response.text) throw new Error("Empty response");
        return response.text;
    } catch (error) {
        const errString = String(error);
        if (errString.includes("429") || errString.includes("quota")) {
             throw new Error("Quota Exceeded");
        }
        throw error;
    }
}

export const searchCodeConcept = async (term: string, language: Language): Promise<SearchResult> => {
    try {
        const prompt = `Define the Python term "${term}".
        Language: ${language}.
        Return valid JSON matching the schema.
        If the term is not related to Python or programming, define it generally but mention it's not a keyword.`;

        const response = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: SearchSchema,
            },
        });

        const json = JSON.parse(cleanJSON(response.text || "{}"));
        if (!json.term) throw new Error("Invalid API response format");
        return json;
    } catch (error) {
        const errString = String(error);
        if (errString.includes("429") || errString.includes("quota")) {
             throw new Error("Quota Exceeded");
        }
        throw error;
    }
}

export const generateLessonContent = async (title: string, language: Language): Promise<LessonContent> => {
    try {
        const prompt = `Create a Python lesson titled "${title}".
        Language: ${language}.
        The "code" field should be a small, executable snippet (3-6 lines) demonstrating the concept.
        The "steps" array should explain execution line-by-line for a visualizer.
        Return valid JSON matching the schema.`;

        const response = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: LessonContentSchema,
            },
        });

        const json = JSON.parse(cleanJSON(response.text || "{}"));
        if (!json.title) throw new Error("Invalid API response format");
        return json;
    } catch (error) {
        const errString = String(error);
        if (errString.includes("429") || errString.includes("quota")) {
             throw new Error("Quota Exceeded");
        }
        throw error;
    }
}

export const generateExamPaper = async (level: string, language: Language, isMock: boolean): Promise<ExamPaper> => {
    try {
        const prompt = `Create a Python ${isMock ? 'Full Mock Exam' : 'Topic Practice Paper'} for ${level} level.
        Language: ${language}.
        Duration: ${isMock ? '20' : '10'} minutes.
        Questions: 5 multiple choice questions.
        Return valid JSON matching the schema.`;

        const response = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: ExamPaperSchema,
            },
        });

        const json = JSON.parse(cleanJSON(response.text || "{}"));
        if (!json.questions) throw new Error("Invalid API response format");
        return json.questions;
    } catch (error) {
        const errString = String(error);
        if (errString.includes("429") || errString.includes("quota")) {
             throw new Error("Quota Exceeded");
        }
        throw error;
    }
}

export const runPythonCode = async (code: string, inputs?: string): Promise<string> => {
    try {
        // Use the model to act as a Python interpreter
        const prompt = `Act strictly as a Python interpreter. Execute the following code and return ONLY the output.
        Do not provide explanations or markdown formatting unless it's part of the print output.
        If there is an error, return the Python error message.
        
        ${inputs ? `The user has provided the following inputs for any input() calls (use them sequentially):
${inputs}
` : ''}

        Code:
        ${code}`;

        const response = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
        });

        return response.text || "";
    } catch (error) {
        return `Error: ${error}`;
    }
}

export const getCodeFeedback = async (code: string, output: string, language: Language): Promise<PlaygroundFeedback> => {
    try {
        const prompt = `Analyze this python code execution.
        Code: "${code}"
        Output/Error: "${output}"
        Language: ${language}
        
        Provide:
        1. Explanation: Detailed breakdown of how the code works.
        2. Tip: A best practice, performance tip, or "Did you know?".
        3. Hint: If there is an error, give a specific debugging hint. If successful, give a suggestion to improve it.
        4. FixedCode: If there is an error, provide the corrected version. Else null.
        5. Example: A relevant short code example showing a variation or advanced usage of this concept.
        6. IsError: Boolean.
        
        Return valid JSON matching the schema.`;

        const response = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: FeedbackSchema,
            },
        });

        const json = JSON.parse(cleanJSON(response.text || "{}"));
        if (!json.explanation) throw new Error("Invalid structure");
        return json;
    } catch (error) {
        return {
            explanation: "Could not analyze code at the moment. Please check your internet connection.",
            tip: "Double check indentation and syntax.",
            hint: "Python is case-sensitive.",
            isError: true,
            example: "print('Hello')"
        };
    }
}
