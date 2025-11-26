
import React, { useState } from 'react';
import { generateLessonContent } from '../services/geminiService';
import { Language, LessonContent, CourseModule, GameLevel } from '../types';
import { translations } from '../translations';
import { Play, CheckCircle, Lock, BookOpen, ChevronRight, RotateCcw, Award, ArrowLeft, Loader2, Star, Shield, Crown, Zap } from 'lucide-react';

interface CourseProps {
    language: Language;
    onXpGain: (amount: number) => void;
}

const Course: React.FC<CourseProps> = ({ language, onXpGain }) => {
    const t = translations[language].course;
    
    // --- Detailed Syllabus Structure (Dynamically Mapped) ---
    // We map over a static structure but pull TITLES and DESCRIPTIONS from the current language translation object.
    
    const getModules = (): CourseModule[] => [
        // --- LEVEL 1: BEGINNER (NOVICE) ---
        {
            id: 'b1',
            title: t.moduleTitles?.b1 || 'Novice: First Steps',
            description: t.moduleTitles?.b1_desc || 'Your very first code lines.',
            level: 'Beginner',
            isLocked: false,
            lessons: [
                { id: 'b1-1', title: t.lessons?.install || 'Installing Python', isCompleted: true },
                { id: 'b1-2', title: t.lessons?.hello || 'Hello World', isCompleted: true },
                { id: 'b1-3', title: t.lessons?.print || 'The Print Function', isCompleted: false },
                { id: 'b1-4', title: t.lessons?.comments || 'Comments & Notes', isCompleted: false },
                { id: 'b1-5', title: t.lessons?.math || 'Basic Math (+ - * /)', isCompleted: false },
            ]
        },
        {
            id: 'b2',
            title: t.moduleTitles?.b2 || 'Novice: Variables & Data',
            description: t.moduleTitles?.b2_desc || 'How to store information in memory.',
            level: 'Beginner',
            isLocked: true,
            lessons: [
                { id: 'b2-1', title: t.lessons?.var_what || 'What is a Variable?', isCompleted: false },
                { id: 'b2-2', title: t.lessons?.strings || 'Strings (Text)', isCompleted: false },
                { id: 'b2-3', title: t.lessons?.ints || 'Integers (Whole Numbers)', isCompleted: false },
                { id: 'b2-4', title: t.lessons?.floats || 'Floats (Decimals)', isCompleted: false },
                { id: 'b2-5', title: t.lessons?.bools || 'Booleans (True/False)', isCompleted: false },
                { id: 'b2-6', title: t.lessons?.convert || 'Type Conversion', isCompleted: false },
                { id: 'b2-7', title: t.lessons?.input || 'User Input', isCompleted: false },
            ]
        },
        {
            id: 'b3',
            title: t.moduleTitles?.b3 || 'Novice: Making Decisions',
            description: t.moduleTitles?.b3_desc || 'Teaching the computer to think with logic.',
            level: 'Beginner',
            isLocked: true,
            lessons: [
                { id: 'b3-1', title: 'Comparison Operators', isCompleted: false },
                { id: 'b3-2', title: 'The "If" Statement', isCompleted: false },
                { id: 'b3-3', title: 'Else & Elif', isCompleted: false },
                { id: 'b3-4', title: 'Logical AND / OR', isCompleted: false },
                { id: 'b3-5', title: 'Nested Conditions', isCompleted: false },
            ]
        },
        {
            id: 'b4',
            title: t.moduleTitles?.b4 || 'Novice: Looping',
            description: t.moduleTitles?.b4_desc || 'Repeating actions automatically.',
            level: 'Beginner',
            isLocked: true,
            lessons: [
                { id: 'b4-1', title: 'Intro to Loops', isCompleted: false },
                { id: 'b4-2', title: 'While Loops', isCompleted: false },
                { id: 'b4-3', title: 'For Loops', isCompleted: false },
                { id: 'b4-4', title: 'The Range Function', isCompleted: false },
                { id: 'b4-5', title: 'Break & Continue', isCompleted: false },
            ]
        },

        // --- LEVEL 2: INTERMEDIATE (APPRENTICE) ---
        {
            id: 'i1',
            title: t.moduleTitles?.i1 || 'Apprentice: Data Structures',
            description: t.moduleTitles?.i1_desc || 'Organizing complex data.',
            level: 'Intermediate',
            isLocked: true,
            lessons: [
                { id: 'i1-1', title: t.lessons?.lists || 'Intro to Lists', isCompleted: false },
                { id: 'i1-2', title: 'List Methods (Append, Pop)', isCompleted: false },
                { id: 'i1-3', title: 'Slicing Lists', isCompleted: false },
                { id: 'i1-4', title: 'Tuples (Immutable)', isCompleted: false },
                { id: 'i1-5', title: 'Sets (Unique Items)', isCompleted: false },
                { id: 'i1-6', title: 'Dictionaries (Key-Value)', isCompleted: false },
                { id: 'i1-7', title: 'Nested Dictionaries', isCompleted: false },
            ]
        },
        {
            id: 'i2',
            title: t.moduleTitles?.i2 || 'Apprentice: Functions',
            description: t.moduleTitles?.i2_desc || 'Creating reusable blocks of code.',
            level: 'Intermediate',
            isLocked: true,
            lessons: [
                { id: 'i2-1', title: t.lessons?.funcs || 'Defining Functions', isCompleted: false },
                { id: 'i2-2', title: 'Parameters & Arguments', isCompleted: false },
                { id: 'i2-3', title: 'Return Values', isCompleted: false },
                { id: 'i2-4', title: 'Default Arguments', isCompleted: false },
                { id: 'i2-5', title: 'Variable Scope', isCompleted: false },
                { id: 'i2-6', title: 'Lambda Functions', isCompleted: false },
            ]
        },
        {
            id: 'i3',
            title: t.moduleTitles?.i3 || 'Apprentice: File & Error Handling',
            description: t.moduleTitles?.i3_desc || 'Reading files and fixing crashes.',
            level: 'Intermediate',
            isLocked: true,
            lessons: [
                { id: 'i3-1', title: 'Reading Text Files', isCompleted: false },
                { id: 'i3-2', title: 'Writing to Files', isCompleted: false },
                { id: 'i3-3', title: 'Try / Except Blocks', isCompleted: false },
                { id: 'i3-4', title: 'Handling Specific Errors', isCompleted: false },
                { id: 'i3-5', title: 'Finally & Else', isCompleted: false },
            ]
        },

        // --- LEVEL 3: PROFESSIONAL (GRANDMASTER) ---
        {
            id: 'p1',
            title: t.moduleTitles?.p1 || 'Grandmaster: OOP',
            description: t.moduleTitles?.p1_desc || 'Object Oriented Programming mastery.',
            level: 'Professional',
            isLocked: true,
            lessons: [
                { id: 'p1-1', title: t.lessons?.classes || 'Classes & Objects', isCompleted: false },
                { id: 'p1-2', title: 'The __init__ method', isCompleted: false },
                { id: 'p1-3', title: 'Instance vs Class Variables', isCompleted: false },
                { id: 'p1-4', title: 'Inheritance', isCompleted: false },
                { id: 'p1-5', title: 'Polymorphism', isCompleted: false },
                { id: 'p1-6', title: 'Encapsulation', isCompleted: false },
            ]
        },
        {
            id: 'p2',
            title: t.moduleTitles?.p2 || 'Grandmaster: Advanced Features',
            description: t.moduleTitles?.p2_desc || 'Pythonic ways to write code.',
            level: 'Professional',
            isLocked: true,
            lessons: [
                { id: 'p2-1', title: 'List Comprehensions', isCompleted: false },
                { id: 'p2-2', title: 'Generators & Yield', isCompleted: false },
                { id: 'p2-3', title: 'Decorators', isCompleted: false },
                { id: 'p2-4', title: 'Context Managers (with)', isCompleted: false },
                { id: 'p2-5', title: 'Type Hinting', isCompleted: false },
                { id: 'p2-6', title: 'Async / Await', isCompleted: false },
            ]
        }
    ];

    const [modules, setModules] = useState<CourseModule[]>(getModules());
    const [currentLesson, setCurrentLesson] = useState<LessonContent | null>(null);
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState<'MAP' | 'LESSON'>('MAP');
    
    // Visualizer State
    const [visualStep, setVisualStep] = useState(0);
    const [isQuizMode, setIsQuizMode] = useState(false);
    const [lessonScore, setLessonScore] = useState(0);

    // Update modules when language changes
    React.useEffect(() => {
        setModules(getModules());
    }, [language]);

    const handleStartLesson = async (moduleId: string, lessonId: string, title: string) => {
        setLoading(true);
        try {
            // Include level context in prompt
            const content = await generateLessonContent(title, language);
            setCurrentLesson(content);
            setView('LESSON');
            setVisualStep(0);
            setIsQuizMode(false);
            setLessonScore(0);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => {
        if (currentLesson && visualStep < currentLesson.steps.length - 1) {
            setVisualStep(prev => prev + 1);
        } else {
            // Animation done, start quiz
            setIsQuizMode(true);
        }
    };

    const handleQuizAnswer = (isCorrect: boolean) => {
        if (isCorrect) setLessonScore(prev => prev + 1);
    };

    const completeLesson = () => {
        // Mark as complete in state (mock)
        // In real app, find module and update lesson completion
        onXpGain(20 + (lessonScore * 10)); // Base XP + Quiz XP
        setView('MAP');
    };

    const getLevelIcon = (level: GameLevel) => {
        switch(level) {
            case 'Beginner': return <Star className="w-5 h-5" />;
            case 'Intermediate': return <Shield className="w-5 h-5" />;
            case 'Professional': return <Crown className="w-5 h-5" />;
        }
    };

    if (view === 'MAP') {
        return (
            <div className="max-w-4xl mx-auto space-y-8 pb-20">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white">{t.title}</h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">{t.desc}</p>
                </div>

                <div className="space-y-12 relative">
                    {/* Vertical Line Connector */}
                    <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-slate-200 dark:bg-slate-700 hidden md:block"></div>

                    {modules.map((module, mIdx) => (
                        <div key={module.id} className="relative md:pl-24">
                            {/* Module Node Icon */}
                            <div className={`hidden md:flex absolute left-3 top-8 w-11 h-11 rounded-full border-4 items-center justify-center z-10 transition-colors shadow-sm ${
                                module.isLocked 
                                ? 'bg-slate-100 border-slate-300 text-slate-400 dark:bg-slate-800 dark:border-slate-600' 
                                : module.level === 'Beginner' ? 'bg-yellow-100 border-yellow-500 text-yellow-600'
                                : module.level === 'Intermediate' ? 'bg-blue-100 border-blue-500 text-blue-600'
                                : 'bg-purple-100 border-purple-500 text-purple-600'
                            }`}>
                                {module.isLocked ? <Lock className="w-5 h-5" /> : getLevelIcon(module.level)}
                            </div>

                            <div className={`rounded-2xl border transition-all ${
                                module.isLocked 
                                ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-70' 
                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl'
                            }`}>
                                <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center ${
                                                    module.level === 'Beginner' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300' :
                                                    module.level === 'Intermediate' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 
                                                    'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
                                                }`}>
                                                    {module.level}
                                                </span>
                                                <span className="text-xs text-slate-400 font-mono">
                                                    {module.lessons.filter(l => l.isCompleted).length}/{module.lessons.length}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                                {module.title}
                                            </h3>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{module.description}</p>
                                        </div>
                                        {module.isLocked && <Lock className="text-slate-300 dark:text-slate-600 w-6 h-6" />}
                                    </div>
                                    
                                    {/* Progress Bar for Module */}
                                    <div className="mt-4 h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full transition-all duration-500 ${
                                                 module.level === 'Beginner' ? 'bg-yellow-400' :
                                                 module.level === 'Intermediate' ? 'bg-blue-500' : 'bg-purple-500'
                                            }`}
                                            style={{ width: `${(module.lessons.filter(l => l.isCompleted).length / module.lessons.length) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                                
                                <div className="p-2">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {module.lessons.map((lesson, lIdx) => (
                                            <button
                                                key={lesson.id}
                                                disabled={module.isLocked || loading}
                                                onClick={() => handleStartLesson(module.id, lesson.id, lesson.title)}
                                                className={`flex items-center p-3 rounded-xl transition-all text-left border ${
                                                    module.isLocked 
                                                    ? 'cursor-not-allowed text-slate-400 border-transparent' 
                                                    : 'hover:bg-slate-50 dark:hover:bg-slate-700 border-transparent hover:border-slate-200 dark:hover:border-slate-600 text-slate-700 dark:text-slate-200'
                                                }`}
                                            >
                                                <div className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${
                                                    lesson.isCompleted 
                                                    ? 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400' 
                                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                                                }`}>
                                                    {lesson.isCompleted ? <CheckCircle className="w-4 h-4" /> : lIdx + 1}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <span className="font-medium text-sm truncate block">{lesson.title}</span>
                                                </div>
                                                {!module.isLocked && !lesson.isCompleted && (
                                                    <Play className="w-4 h-4 text-slate-300" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // --- LESSON VIEW ---
    if (!currentLesson) return null;

    const currentStepData = currentLesson.steps[visualStep];

    return (
        <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <button onClick={() => setView('MAP')} className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white flex items-center bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" /> {t.title}
                </button>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider hidden sm:block">Lesson Progress</span>
                    <div className="flex gap-1.5">
                        {!isQuizMode && currentLesson.steps.map((_, i) => (
                            <div key={i} className={`w-3 h-1.5 rounded-full transition-colors ${i <= visualStep ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                        ))}
                    </div>
                </div>
            </div>

            {isQuizMode ? (
                // --- QUIZ INTERFACE ---
                <div className="flex-1 flex items-center justify-center animate-fade-in">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-700 text-center">
                        <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Award className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{t.quizTime}</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-8">Test what you just learned.</p>
                        
                        {lessonScore === currentLesson.quiz.length ? (
                            <div className="space-y-6 animate-fade-in">
                                <p className="text-green-500 font-bold text-lg bg-green-50 dark:bg-green-900/20 py-3 rounded-xl border border-green-100 dark:border-green-900">
                                    Perfect Score! All answers correct.
                                </p>
                                <button onClick={completeLesson} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-colors w-full shadow-lg shadow-blue-500/30">
                                    {t.finishModule}
                                </button>
                            </div>
                        ) : (
                            <LessonQuiz 
                                questions={currentLesson.quiz} 
                                onComplete={(score) => {
                                    setLessonScore(score);
                                }} 
                                onFinish={completeLesson}
                            />
                        )}
                    </div>
                </div>
            ) : (
                // --- VISUALIZER INTERFACE ---
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in h-full overflow-hidden">
                    {/* Left: Code & Explanation */}
                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col h-full overflow-hidden">
                        <div className="mb-4">
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{currentLesson.title}</h2>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">{currentLesson.concept}</p>
                        </div>
                        
                        {/* Code Block with Highlight */}
                        <div className="flex-1 bg-slate-900 rounded-2xl p-6 overflow-x-auto relative font-mono text-sm border border-slate-700 shadow-inner custom-scrollbar">
                            {currentLesson.code.split('\n').map((line, idx) => (
                                <div key={idx} className={`relative z-10 px-2 py-1.5 rounded transition-colors ${
                                    (idx + 1) === currentStepData.line 
                                    ? 'bg-blue-500/30 border-l-4 border-blue-400' 
                                    : 'border-l-4 border-transparent opacity-80'
                                }`}>
                                    <span className="text-slate-600 select-none mr-4 w-6 inline-block text-right">{idx + 1}</span>
                                    <span className={`transition-colors ${ (idx + 1) === currentStepData.line ? 'text-white font-bold' : 'text-slate-400'}`}>{line}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Visualization & Output */}
                    <div className="flex flex-col gap-6 h-full overflow-y-auto pb-4">
                        {/* Current Step Description */}
                        <div className="bg-blue-50 dark:bg-blue-900/10 rounded-3xl p-6 border border-blue-100 dark:border-blue-900/50 shadow-sm">
                            <span className="flex items-center text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-3">
                                <Zap className="w-4 h-4 mr-1 fill-blue-500" /> {t.step} {visualStep + 1}
                            </span>
                            <p className="text-xl font-medium text-slate-800 dark:text-white leading-relaxed">
                                {currentStepData.description}
                            </p>
                        </div>

                        {/* Memory / Variables */}
                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 flex-1 flex flex-col shadow-sm">
                            <h4 className="font-bold text-slate-500 dark:text-slate-400 uppercase text-xs mb-4 flex items-center tracking-wider">
                                <span className="w-2 h-2 rounded-full bg-purple-500 mr-2 animate-pulse"></span> {t.variables}
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                {Object.entries(currentStepData.variables || {}).map(([key, val]) => (
                                    <div key={key} className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-600 flex justify-between items-center">
                                        <div className="text-sm text-slate-500 dark:text-slate-400 font-mono">{key}</div>
                                        <div className="font-mono text-slate-800 dark:text-white font-bold bg-white dark:bg-slate-600 px-2 py-1 rounded border border-slate-200 dark:border-slate-500 shadow-sm">{val}</div>
                                    </div>
                                ))}
                                {Object.keys(currentStepData.variables || {}).length === 0 && (
                                    <div className="text-slate-400 text-sm italic col-span-2 flex items-center justify-center h-20 bg-slate-50 dark:bg-slate-700/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                                        Memory empty...
                                    </div>
                                )}
                            </div>

                            {currentStepData.output && (
                                <div className="mt-auto">
                                    <h4 className="font-bold text-slate-500 dark:text-slate-400 uppercase text-xs mb-2 flex items-center tracking-wider">
                                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span> {t.output}
                                    </h4>
                                    <div className="bg-black rounded-2xl p-4 font-mono text-green-400 text-sm shadow-inner border border-slate-800">
                                        > {currentStepData.output}
                                    </div>
                                </div>
                            )}
                        </div>

                        <button 
                            onClick={nextStep}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center text-lg group transform active:scale-95"
                        >
                            {visualStep < currentLesson.steps.length - 1 ? (
                                <>{t.nextLesson} <ChevronRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" /></>
                            ) : (
                                <>{t.quizTime} <Award className="w-6 h-6 ml-2 group-hover:scale-110 transition-transform" /></>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Mini Quiz Component ---
const LessonQuiz = ({ questions, onComplete, onFinish }: { questions: any[], onComplete: (s: number) => void, onFinish: () => void }) => {
    const [qIdx, setQIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [answered, setAnswered] = useState(false);
    const [selected, setSelected] = useState<string | null>(null);

    const handleAns = (opt: string) => {
        if (answered) return;
        setSelected(opt);
        setAnswered(true);
        if (opt === questions[qIdx].correctAnswer) {
            setScore(s => s + 1);
        }
    };

    const next = () => {
        if (qIdx < questions.length - 1) {
            setQIdx(prev => prev + 1);
            setAnswered(false);
            setSelected(null);
        } else {
            onComplete(score + (questions[qIdx].correctAnswer === selected ? 1 : 0)); // Finalize
            onFinish();
        }
    };

    const q = questions[qIdx];

    return (
        <div className="text-left">
            <div className="mb-4 flex justify-between items-center">
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                    Question {qIdx + 1} of {questions.length}
                 </span>
            </div>
            <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-6 leading-relaxed">{q.question}</h4>
            <div className="space-y-3 mb-8">
                {q.options.map((opt: string) => {
                    let style = "border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700";
                    if (answered) {
                        if (opt === q.correctAnswer) style = "bg-green-100 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-300 shadow-sm";
                        else if (opt === selected) style = "bg-red-50 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-300 shadow-sm";
                        else style = "opacity-40";
                    } else if (selected === opt) {
                        style = "border-blue-500 bg-blue-50 dark:bg-blue-900/30";
                    }
                    return (
                        <button key={opt} onClick={() => handleAns(opt)} disabled={answered} className={`w-full p-4 rounded-xl border-2 text-left font-medium transition-all ${style} text-slate-700 dark:text-slate-200`}>
                            {opt}
                        </button>
                    )
                })}
            </div>
            {answered && (
                <button onClick={next} className="w-full py-3 bg-slate-800 dark:bg-slate-600 hover:bg-slate-900 dark:hover:bg-slate-500 text-white rounded-xl font-bold shadow-lg transition-all">
                    {qIdx < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                </button>
            )}
        </div>
    );
};

export default Course;
