
import React, { useState, useEffect } from 'react';
import { generateExamPaper } from '../services/geminiService';
import { ExamPaper, Language, GameLevel } from '../types';
import { translations } from '../translations';
import { FileText, Clock, AlertCircle, CheckCircle, XCircle, ArrowLeft, Loader2, BookOpen } from 'lucide-react';

interface ExamProps {
    language: Language;
}

// --- INSTANT FALLBACK EXAMS (Zero Latency) ---
const FALLBACK_EXAMS: Record<string, ExamPaper> = {
    'Beginner': {
        id: 'fallback-beg',
        title: 'Beginner Assessment',
        year: '2024',
        level: 'Beginner',
        durationMinutes: 10,
        questions: [
            { question: "What is the output of print(10 + 5)?", options: ["105", "15", "Error", "10 + 5"], correctAnswer: "15", explanation: "Python performs arithmetic addition on integers.", codeBlock: "print(10 + 5)" },
            { question: "Which symbol starts a comment?", options: ["//", "/*", "#", "<!--"], correctAnswer: "#", explanation: "Hash (#) is used for single line comments." },
            { question: "How do you create a variable?", options: ["var x = 5", "int x = 5", "x = 5", "declare x = 5"], correctAnswer: "x = 5", explanation: "Python variables are dynamically typed and assigned using =." },
            { question: "Output of type(3.14)?", options: ["int", "float", "double", "str"], correctAnswer: "float", explanation: "Numbers with decimals are floats." },
            { question: "Which is a valid boolean?", options: ["true", "True", "TRUE", "yes"], correctAnswer: "True", explanation: "Booleans must be capitalized: True or False." }
        ]
    },
    'Intermediate': {
        id: 'fallback-int',
        title: 'Intermediate Certification',
        year: '2024',
        level: 'Intermediate',
        durationMinutes: 15,
        questions: [
            { question: "How to add an item to a list?", options: ["list.push(x)", "list.add(x)", "list.append(x)", "list[len] = x"], correctAnswer: "list.append(x)", explanation: "The append() method adds an element to the end." },
            { question: "What creates a dictionary?", options: "[] {} () <>".split(" "), correctAnswer: "{}", explanation: "Curly braces {} are used for dictionaries (and sets)." },
            { question: "Correct function syntax?", options: ["func myFunc():", "def myFunc():", "function myFunc():", "def myFunc:"], correctAnswer: "def myFunc():", explanation: "Use 'def', the name, parentheses, and a colon." },
            { question: "How to catch errors?", options: ["try / catch", "do / catch", "try / except", "attempt / fail"], correctAnswer: "try / except", explanation: "Python uses try/except blocks." },
            { question: "Output of len([1, 2, 3])?", options: ["2", "3", "4", "0"], correctAnswer: "3", explanation: "The list has 3 elements." }
        ]
    },
    'Professional': {
        id: 'fallback-pro',
        title: 'Professional Mock Exam',
        year: '2024',
        level: 'Professional',
        durationMinutes: 20,
        questions: [
            { question: "What is a decorator?", options: ["A wrapper function", "A class style", "A variable type", "A module"], correctAnswer: "A wrapper function", explanation: "Decorators modify the behavior of functions or classes." },
            { question: "What does __init__ do?", options: ["Ends a class", "Initializes an object", "Imports a module", "Deletes data"], correctAnswer: "Initializes an object", explanation: "It is the constructor method in classes." },
            { question: "Keyword for generator?", options: ["return", "yield", "gen", "make"], correctAnswer: "yield", explanation: "Generators use 'yield' to produce a sequence of values." },
            { question: "What is the GIL?", options: ["Global Interpreter Lock", "General Input Log", "Graphic Interface Lib", "Global Index List"], correctAnswer: "Global Interpreter Lock", explanation: "A mutex that allows only one thread to control the interpreter." },
            { question: "Library for dataframes?", options: ["NumPy", "Pandas", "Matplotlib", "Requests"], correctAnswer: "Pandas", explanation: "Pandas is the standard for tabular data manipulation." }
        ]
    }
};

const Exam: React.FC<ExamProps> = ({ language }) => {
    const t = translations[language].exam;
    
    const [mode, setMode] = useState<'MENU' | 'PREPARING' | 'PAPER' | 'RESULT'>('MENU');
    const [paper, setPaper] = useState<ExamPaper | null>(null);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    // Timer Effect
    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;
        if (mode === 'PAPER' && timeLeft > 0 && !isSubmitted) {
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        handleSubmit(); // Auto submit
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [mode, timeLeft, isSubmitted]);

    const startExam = async (type: 'MOCK' | 'PRACTICE', level: GameLevel) => {
        setMode('PREPARING');
        
        // --- ZERO LATENCY LOGIC ---
        // 1. Prepare Fallback
        const fallbackPaper = FALLBACK_EXAMS[level] || FALLBACK_EXAMS['Beginner'];
        
        try {
            // 2. Race Condition: AI vs 2.5s Timeout
            const aiPromise = generateExamPaper(level, language, type === 'MOCK');
            const timeoutPromise = new Promise<ExamPaper>((_, reject) => 
                setTimeout(() => reject('timeout'), 2500)
            );

            const newPaper = await Promise.race([aiPromise, timeoutPromise]);
            
            if (newPaper && newPaper.questions && newPaper.questions.length > 0) {
                setPaper(newPaper);
                setTimeLeft(newPaper.durationMinutes * 60);
            } else {
                throw new Error("Empty paper");
            }
        } catch (e) {
            console.log("Using Fallback Exam (AI Slow/Error)");
            // 3. Instant Fallback
            setPaper(fallbackPaper);
            setTimeLeft(fallbackPaper.durationMinutes * 60);
        } finally {
            setAnswers({});
            setIsSubmitted(false);
            setMode('PAPER');
        }
    };

    const handleOptionSelect = (qIdx: number, option: string) => {
        if (isSubmitted) return;
        setAnswers(prev => ({ ...prev, [qIdx]: option }));
    };

    const handleSubmit = () => {
        setIsSubmitted(true);
        setMode('RESULT');
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const calculateScore = () => {
        if (!paper) return 0;
        let correct = 0;
        paper.questions.forEach((q, idx) => {
            if (answers[idx] === q.correctAnswer) correct++;
        });
        return Math.round((correct / paper.questions.length) * 100);
    };

    if (mode === 'MENU') {
        return (
            <div className="max-w-4xl mx-auto py-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">{t.title}</h2>
                    <p className="text-lg text-slate-500 dark:text-slate-400">{t.desc}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Mock Exam Card */}
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
                            <FileText className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{t.mock}</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-8">Full syllabus yearly style exam papers. Timed conditions.</p>
                        
                        <div className="space-y-3">
                            {(['Beginner', 'Intermediate', 'Professional'] as GameLevel[]).map(level => (
                                <button 
                                    key={level}
                                    onClick={() => startExam('MOCK', level)}
                                    className="w-full py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-500 text-slate-700 dark:text-slate-200 font-medium transition-all flex justify-between items-center group"
                                >
                                    <span>{level}</span>
                                    <ArrowLeft className="w-4 h-4 rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Topic Practice Card */}
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all">
                        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/50 rounded-2xl flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400">
                            <BookOpen className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{t.practice}</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-8">Focused questions on specific topics to build strength.</p>
                        
                        <div className="space-y-3">
                             {(['Beginner', 'Intermediate', 'Professional'] as GameLevel[]).map(level => (
                                <button 
                                    key={level}
                                    onClick={() => startExam('PRACTICE', level)}
                                    className="w-full py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-300 dark:hover:border-purple-500 text-slate-700 dark:text-slate-200 font-medium transition-all flex justify-between items-center group"
                                >
                                    <span>{level}</span>
                                    <ArrowLeft className="w-4 h-4 rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (mode === 'PREPARING') {
        return (
            <div className="max-w-4xl mx-auto h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-6" />
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Preparing Exam Paper...</h3>
                <p className="text-slate-500 dark:text-slate-400">Reviewing syllabus and shuffling questions.</p>
            </div>
        );
    }

    if (!paper) return null;

    const score = calculateScore();
    const isPass = score >= 70;

    return (
        <div className="max-w-4xl mx-auto pb-20 animate-fade-in">
            {/* Exam Header */}
            <div className="sticky top-0 z-20 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">{paper.title}</h2>
                    <p className="text-xs text-slate-500">{paper.questions.length} {t.questions} • {paper.level}</p>
                </div>
                
                {mode === 'PAPER' ? (
                    <div className={`flex items-center space-x-2 px-4 py-2 rounded-full font-mono font-bold ${timeLeft < 60 ? 'bg-red-100 text-red-600' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'}`}>
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(timeLeft)}</span>
                    </div>
                ) : (
                    <button onClick={() => setMode('MENU')} className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white">
                        {t.quit}
                    </button>
                )}
            </div>

            {mode === 'RESULT' && (
                <div className="mb-10 bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 text-center animate-scale-in">
                    <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${isPass ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {isPass ? <CheckCircle className="w-10 h-10" /> : <AlertCircle className="w-10 h-10" />}
                    </div>
                    <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">{score}%</h3>
                    <p className={`text-lg font-medium mb-6 ${isPass ? 'text-green-600' : 'text-red-500'}`}>
                        {isPass ? t.passed : t.failed}
                    </p>
                    <div className="flex justify-center gap-4">
                        <button onClick={() => setMode('MENU')} className="px-6 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                            Return to Hall
                        </button>
                    </div>
                </div>
            )}

            {/* Questions List */}
            <div className="space-y-6">
                {paper.questions.map((q, idx) => {
                    const isCorrect = answers[idx] === q.correctAnswer;
                    const showFeedback = mode === 'RESULT';

                    return (
                        <div key={idx} className={`bg-white dark:bg-slate-800 rounded-2xl p-6 border transition-colors ${
                            showFeedback 
                                ? (isCorrect ? 'border-green-200 dark:border-green-900' : 'border-red-200 dark:border-red-900')
                                : 'border-slate-200 dark:border-slate-700'
                        }`}>
                            <div className="flex gap-4">
                                <span className="flex-shrink-0 w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center font-bold text-slate-500 text-sm">
                                    {idx + 1}
                                </span>
                                <div className="flex-1">
                                    <h4 className="text-lg font-medium text-slate-800 dark:text-white mb-4">{q.question}</h4>
                                    
                                    {q.codeBlock && (
                                        <pre className="bg-slate-900 text-green-400 p-4 rounded-xl font-mono text-sm mb-6 overflow-x-auto border border-slate-700">
                                            {q.codeBlock}
                                        </pre>
                                    )}

                                    <div className="space-y-2">
                                        {q.options.map((opt) => {
                                            let btnClass = "border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700";
                                            const isSelected = answers[idx] === opt;
                                            
                                            if (showFeedback) {
                                                if (opt === q.correctAnswer) btnClass = "bg-green-100 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-300";
                                                else if (isSelected && opt !== q.correctAnswer) btnClass = "bg-red-50 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-300";
                                                else btnClass = "opacity-50 border-slate-200 dark:border-slate-700";
                                            } else if (isSelected) {
                                                btnClass = "bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-300";
                                            }

                                            return (
                                                <button
                                                    key={opt}
                                                    onClick={() => handleOptionSelect(idx, opt)}
                                                    disabled={mode === 'RESULT'}
                                                    className={`w-full text-left p-3 rounded-xl border-2 transition-all flex justify-between items-center ${btnClass} dark:text-slate-200`}
                                                >
                                                    <span>{opt}</span>
                                                    {showFeedback && opt === q.correctAnswer && <CheckCircle className="w-5 h-5 text-green-500" />}
                                                    {showFeedback && isSelected && opt !== q.correctAnswer && <XCircle className="w-5 h-5 text-red-500" />}
                                                </button>
                                            )
                                        })}
                                    </div>

                                    {showFeedback && (
                                        <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl text-sm text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-600">
                                            <span className="font-bold">Explanation:</span> {q.explanation}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {mode === 'PAPER' && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-t border-slate-200 dark:border-slate-800 flex justify-center z-30">
                    <button 
                        onClick={handleSubmit}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-3 rounded-xl font-bold text-lg shadow-lg transition-all"
                    >
                        Submit Exam
                    </button>
                </div>
            )}
        </div>
    );
};

export default Exam;
