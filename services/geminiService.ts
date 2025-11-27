
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Flashcard, AnalysisResult, DailyTip, Language, QuizQuestion, SearchResult, GameMode, GameLevel, LessonContent, ExamPaper } from "../types";

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
                        properties: {
                            // Map string keys to string values
                        } 
                    },
                    output: { type: Type.STRING }
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
                    codeBlock: { type: Type.STRING }
                }
            }
        }
    }
}

// --- API Functions ---

export const generateFlashcards = async (topic: string, level: string, language: Language): Promise<Flashcard[]> => {
  try {
    const prompt = `Generate 5 Python programming flashcards for the topic: "${topic}". 
    The difficulty level is ${level}. 
    Translate definitions and explanations into ${language}.
    Keep examples simple, fun, and easy to understand for a beginner.`;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: FlashcardSchema,
        systemInstruction: `You are an expert Python tutor. You make coding fun. Level: ${level}. Language: ${language}.`
      }
    });

    const data = JSON.parse(response.text || '{"cards": []}');
    return data.cards.map((card: any, index: number) => ({ ...card, id: `card-${Date.now()}-${index}`, level }));
  } catch (error) {
    console.error("Error generating flashcards:", error);
    throw error;
  }
};

export const analyzeCode = async (code: string, language: Language): Promise<AnalysisResult> => {
  try {
    const prompt = `Analyze this Python code: "${code}". 
    Explain what it does simply in ${language}. Break down key parts.`;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: AnalysisSchema,
        systemInstruction: `You are a helpful coding assistant. Explain Python code clearly for beginners in ${language}.`
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Error analyzing code:", error);
    throw error;
  }
};

export const getDailyTip = async (language: Language): Promise<DailyTip> => {
  try {
    const prompt = `Give me a fun, easy Python tip or mini-lesson for a beginner. Include a code snippet. Translate explanations to ${language}.`;
    
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: DailyTipSchema,
      }
    });
    
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Error getting daily tip:", error);
    return {
      topic: "Print Function",
      codeSnippet: "print('Hello World!')",
      explanation: "This displays text on the screen.",
      funFact: "It's usually the first code you write!"
    };
  }
}

export const generateQuiz = async (language: Language, mode: GameMode = 'TRIVIA', level: GameLevel = 'Beginner'): Promise<QuizQuestion[]> => {
    try {
        let prompt = "";
        
        switch (mode) {
            case 'BUG_HUNTER':
                prompt = `Generate 3 "Find the Bug" questions for Python. Level: ${level}. Language: ${language}. 
                Provide a broken code snippet in 'codeBlock' and options describing the error or the fix.`;
                break;
            case 'SYNTAX_SPRINT':
                prompt = `Generate 3 fast, short syntax questions for Python. Level: ${level}. Language: ${language}.
                Focus on operators, keywords, and basic punctuation.`;
                break;
            default:
                prompt = `Generate 3 multiple choice questions about Python concepts. Level: ${level}. Language: ${language}.`;
                break;
        }

        const response = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: QuizSchema,
            }
        });

        const data = JSON.parse(response.text || '{"questions": []}');
        return data.questions;
    } catch (error) {
        console.error("Error generating quiz", error);
        throw error;
    }
}

export const explainTopic = async (topic: string, language: Language, level: string = "Beginner"): Promise<string> => {
    try {
        let systemPrompt = "";
        
        if (level === "Professional") {
            systemPrompt = `You are a Senior Python Architect. Explain "${topic}" deeply in ${language}.
            Include: 1. Technical Definition. 2. Advanced Syntax. 3. Best Practices. 4. Real-world example. Use Markdown.`;
        } else if (level === "Intermediate") {
            systemPrompt = `You are a Python Mentor. Explain "${topic}" in ${language}.
            Include: 1. Concept. 2. Code Examples. 3. Pitfalls. Use Markdown.`;
        } else {
            systemPrompt = `You are a Fun Python Tutor for beginners. Explain "${topic}" in ${language}.
            Include: 1. Simple Analogy. 2. Easy Syntax. 3. Fun Example. Use Markdown.`;
        }

        const response = await ai.models.generateContent({
            model: modelId,
            contents: `Explain the Python topic: ${topic}`,
            config: {
                systemInstruction: systemPrompt
            }
        });
        
        return response.text || "No explanation available.";
    } catch (error) {
        return "Sorry, I couldn't load the book content right now.";
    }
}

export const searchCodeConcept = async (term: string, language: Language): Promise<SearchResult> => {
    try {
        const prompt = `Define the Python term/function: "${term}". 
        Language: ${language}. Provide syntax, a simple example, and related terms.`;

        const response = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: SearchSchema
            }
        });

        return JSON.parse(response.text || '{}');
    } catch (error) {
        throw new Error("Search failed");
    }
}

export const createChatSession = (history: any[] = [], language: Language) => {
    return ai.chats.create({
        model: modelId,
        history: history,
        config: {
            systemInstruction: `You are 'Py-Sensei', a fun, enthusiastic Python tutor for beginners. 
            You explain concepts using simple analogies. 
            You speak in ${language}, but keep Python keywords in English. 
            If the user sends code, help them fix it. 
            Always be encouraging!`,
        }
    });
}

// --- NEW COURSE GENERATOR ---
export const generateLessonContent = async (topic: string, language: Language): Promise<LessonContent> => {
    try {
        const prompt = `Create a step-by-step visual lesson for Python topic: "${topic}".
        Language: ${language}.
        Structure:
        1. Title & simple concept explanation.
        2. A simple code snippet (3-6 lines).
        3. 3-4 steps describing how the code runs line-by-line (for visualization), including variable state changes.
        4. A 2-question mini quiz.`;

        const response = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: LessonContentSchema
            }
        });
        
        const data = JSON.parse(response.text || '{}');
        if (!data.steps || data.steps.length === 0) throw new Error("Invalid Lesson Data");
        return data;
    } catch (e) {
        // Explicitly throw to let component handle fallback
        throw new Error("Lesson Generation Failed");
    }
}

// --- NEW EXAM GENERATOR ---
export const generateExamPaper = async (level: GameLevel, language: Language, isYearly: boolean): Promise<ExamPaper> => {
    try {
        const year = new Date().getFullYear();
        const type = isYearly ? `Mock Exam Paper ${year}` : 'Topic Practice Test';
        
        const prompt = `Generate a ${type} for Python. Level: ${level}. Language: ${language}.
        Include 5 challenging multiple choice questions.
        If it's a mock exam, cover mixed topics (Loops, Functions, Errors).
        If practice, focus on a specific random topic.`;

        const response = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: ExamPaperSchema
            }
        });

        const data = JSON.parse(response.text || '{}');
        if (!data.questions || data.questions.length === 0) throw new Error("Invalid Exam Data");

        // Fallback IDs
        return {
            ...data,
            id: `exam-${Date.now()}`,
            year: data.year || year.toString(),
            durationMinutes: data.durationMinutes || 15
        };
    } catch (e) {
        // Explicitly throw to let component handle fallback
        throw new Error("Exam Generation Failed");
    }
}
