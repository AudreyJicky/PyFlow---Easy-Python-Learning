
import React, { useState, useEffect, useRef } from 'react';
import { generateQuiz } from '../services/geminiService';
import { QuizQuestion, Language, GameMode, GameLevel } from '../types';
import { translations } from '../translations';
import { Gamepad2, Award, CheckCircle, XCircle, ChevronRight, RefreshCw, Loader2, Bug, Zap, BookOpen, Trophy, ArrowLeft, Play, Timer } from 'lucide-react';

interface GameProps {
    language: Language;
    onXpGain: (amount: number) => void;
}

// --- INSTANT FALLBACK QUESTIONS (Zero Latency) ---
// Used if AI takes longer than the 3-second countdown
const LOCAL_FALLBACK_QUESTIONS: Record<string, QuizQuestion[]> = {
    TRIVIA: [
        { question: "What is the output of print(2 ** 3)?", options: ["6", "8", "9", "5"], correctAnswer: "8", explanation: "** is the exponent operator (2 to the power of 3)." },
        { question: "Which keyword defines a function?", options: ["func", "def", "function", "define"], correctAnswer: "def", explanation: "Python uses 'def' to define functions." },
        { question: "How do you start a comment?", options: ["//", "/*", "#", "<!--"], correctAnswer: "#", explanation: "Python uses # for single-line comments." },
        { question: "Which is NOT a valid variable name?", options: ["my_var", "var2", "2var", "_var"], correctAnswer: "2var", explanation: "Variable names cannot start with a number." },
        { question: "What does len('Hello') return?", options: ["4", "5", "6", "1"], correctAnswer: "5", explanation: "The string 'Hello' has 5 characters." }
    ],
    BUG_HUNTER: [
        { question: "Find the bug:", codeBlock: "if x = 5:\n  print('Five')", options: ["Missing indentation", "Use == for comparison", "print needs braces", "x is undefined"], correctAnswer: "Use == for comparison", explanation: "= is assignment, == is comparison." },
        { question: "Fix the syntax:", codeBlock: "print 'Hello World'", options: ["Add parentheses ()", "Add colon :", "Remove quotes", "Capitalize Print"], correctAnswer: "Add parentheses ()", explanation: "Python 3 requires parentheses for print()." },
        { question: "What is wrong?", codeBlock: "def my_func()\n  print('Hi')", options: ["Missing colon :", "Wrong indent", "Typo in def", "No arguments"], correctAnswer: "Missing colon :", explanation: "Function definitions must end with a colon." }
    ],
    SYNTAX_SPRINT: [
        { question: "Boolean True in Python?", options: ["true", "True", "TRUE", "1"], correctAnswer: "True", explanation: "Capital T for True." },
        { question: "List brackets?", options: "() [] {} <>".split(" "), correctAnswer: "[]", explanation: "Lists use square brackets." },
        { question: "String quoter?", options: ["Only '", 'Only "', "Both ' and \"", "None"], correctAnswer: "Both ' and \"", explanation: "Python accepts single and double quotes." }
    ]
};

const Game: React.FC<GameProps> = ({ language, onXpGain }) => {
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState<'MENU' | 'COUNTDOWN' | 'PLAYING' | 'FINISHED'>('MENU');
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [mode, setMode] = useState<GameMode>('TRIVIA');
    const [level, setLevel] = useState<GameLevel>('Beginner');
    const [countdown, setCountdown] = useState(3);
    
    // Streak & Combo visuals
    const [streak, setStreak] = useState(0);
    const [showCombo, setShowCombo] = useState(false);

    const t = translations[language].game;
    const isRTL = language === 'Arabic';

    // Countdown Logic
    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;
        if (gameState === 'COUNTDOWN') {
            if (countdown > 0) {
                timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
            } else {
                setGameState('PLAYING');
            }
        }
        return () => clearInterval(timer);
    }, [gameState, countdown]);

    const startGameSequence = () => {
        setGameState('COUNTDOWN');
        setCountdown(3);
        setScore(0);
        setCurrentIndex(0);
        setStreak(0);
        setIsAnswered(false);
        setSelectedOption(null);
        setQuestions([]); // Clear old questions

        // Logic: Try to fetch AI questions within 2.9s. 
        // If AI fails or is slow, use fallback so the game starts EXACTLY when countdown hits 0.
        const fetchGameData = async () => {
            const fallback = LOCAL_FALLBACK_QUESTIONS[mode] || LOCAL_FALLBACK_QUESTIONS['TRIVIA'];
            
            try {
                // Race: AI Generation vs 2.9 seconds timeout
                const aiPromise = generateQuiz(language, mode, level);
                const timeoutPromise = new Promise<QuizQuestion[]>((_, reject) => 
                    setTimeout(() => reject('timeout'), 2900)
                );

                const result = await Promise.race([aiPromise, timeoutPromise]);
                
                if (result && result.length > 0) {
                    setQuestions(result);
                } else {
                    setQuestions(fallback);
                }
            } catch (e) {
                console.log("Using Fast Fallback Questions (AI Slow/Error)");
                setQuestions(fallback);
            }
        };

        fetchGameData();
    };

    const handleAnswer = (option: string) => {
        if (isAnswered) return;
        setSelectedOption(option);
        setIsAnswered(true);

        // Ensure questions exist (safeguard against rare race condition)
        const currentQ = questions[currentIndex] || (LOCAL_FALLBACK_QUESTIONS[mode] || LOCAL_FALLBACK_QUESTIONS['TRIVIA'])[0];

        if (option === currentQ.correctAnswer) {
            const basePoints = level === 'Professional' ? 20 : level === 'Intermediate' ? 15 : 10;
            const streakBonus = Math.min(streak * 2, 10);
            const totalPoints = basePoints + streakBonus;
            
            setScore(prev => prev + totalPoints);
            setStreak(prev => prev + 1);
            onXpGain(totalPoints);
            
            if (streak > 1) {
                setShowCombo(true);
                setTimeout(() => setShowCombo(false), 1000);
            }
        } else {
            setStreak(0);
        }
    };

    const nextQuestion = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setIsAnswered(false);
            setSelectedOption(null);
        } else {
            setGameState('FINISHED');
        }
    };

    const resetToMenu = () => {
        setGameState('MENU');
        setScore(0);
        setStreak(0);
    }

    // --- MENU VIEW (Arcade Style) ---
    if (gameState === 'MENU') {
        return (
            <div className="max-w-5xl mx-auto py-4 animate-fade-in">
                <div className="text-center mb-10 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
                    <h2 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-4 tracking-tight drop-shadow-sm">
                        {t.title}
                    </h2>
                    <p className="text-xl text-slate-600 dark:text-slate-300 font-medium max-w-2xl mx-auto">{t.desc}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 px-4">
                    <ModeCard 
                        active={mode === 'TRIVIA'} 
                        onClick={() => setMode('TRIVIA')}
                        icon={BookOpen}
                        title={t.modes?.trivia?.title || 'Classic'}
                        desc={t.modes?.trivia?.desc}
                        color="cyan"
                    />
                    <ModeCard 
                        active={mode === 'BUG_HUNTER'} 
                        onClick={() => setMode('BUG_HUNTER')}
                        icon={Bug}
                        title={t.modes?.bug?.title || 'Bug Hunter'}
                        desc={t.modes?.bug?.desc}
                        color="pink"
                    />
                    <ModeCard 
                        active={mode === 'SYNTAX_SPRINT'} 
                        onClick={() => setMode('SYNTAX_SPRINT')}
                        icon={Zap}
                        title={t.modes?.sprint?.title || 'Sprint'}
                        desc={t.modes?.sprint?.desc}
                        color="yellow"
                    />
                </div>

                {/* Level Select */}
                <div className="flex justify-center mb-12">
                    <div className="bg-slate-100 dark:bg-slate-800/80 p-2 rounded-2xl flex shadow-inner backdrop-blur border border-slate-200 dark:border-slate-700">
                        {(['Beginner', 'Intermediate', 'Professional'] as GameLevel[]).map((l) => (
                             <button
                                key={l}
                                onClick={() => setLevel(l)}
                                className={`px-8 py-3 rounded-xl text-sm font-bold transition-all transform duration-200 ${
                                    level === l 
                                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-lg scale-105 ring-1 ring-black/5 dark:ring-white/10' 
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                                }`}
                             >
                                 {t.levels?.[l.toLowerCase() as keyof typeof t.levels] || l}
                             </button>
                        ))}
                    </div>
                </div>

                <div className="text-center pb-8">
                    <button 
                        onClick={startGameSequence}
                        className="group relative inline-flex items-center justify-center px-20 py-6 font-black text-white transition-all duration-200 bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl hover:scale-105 focus:outline-none focus:ring-4 ring-blue-500/50 shadow-[0_0_30px_rgba(37,99,235,0.5)] hover:shadow-[0_0_50px_rgba(37,99,235,0.7)]"
                    >
                        <Play className="w-8 h-8 mr-3 fill-current" />
                        <span className="text-2xl tracking-widest uppercase">{t.start}</span>
                        <div className="absolute inset-0 rounded-3xl ring-2 ring-white/20 group-hover:ring-white/40"></div>
                    </button>
                </div>
            </div>
        );
    }

    // --- COUNTDOWN VIEW (Action!) ---
    if (gameState === 'COUNTDOWN') {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/95 backdrop-blur-md">
                <div className="text-center animate-bounce-short">
                    <div className="text-[15rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-cyan-400 to-blue-600 drop-shadow-[0_0_25px_rgba(6,182,212,0.5)] font-mono leading-none">
                        {countdown > 0 ? countdown : 'GO!'}
                    </div>
                    <div className="mt-8 text-slate-400 text-xl font-bold tracking-[0.5em] uppercase animate-pulse">
                        {mode === 'BUG_HUNTER' ? 'LOCATING BUGS...' : 'READY PLAYER ONE...'}
                    </div>
                </div>
            </div>
        );
    }

    // --- GAME OVER VIEW ---
    if (gameState === 'FINISHED') {
        return (
            <div className="max-w-2xl mx-auto text-center py-12 bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-700 mt-10 animate-scale-in relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                <div className="mb-6 relative inline-block">
                    <div className="absolute inset-0 bg-yellow-500/30 rounded-full blur-2xl animate-pulse"></div>
                    <Award className="w-32 h-32 text-yellow-500 relative z-10" />
                </div>
                <h2 className="text-4xl font-bold text-slate-800 dark:text-white mb-2">{t.gameOver}</h2>
                
                <div className="my-8 py-6 px-8 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700 inline-block min-w-[300px]">
                    <div className="text-sm text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-1">{t.score}</div>
                    <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">{score} XP</div>
                </div>
                
                <div className="flex justify-center space-x-4 rtl:space-x-reverse">
                    <button 
                        onClick={resetToMenu}
                        className="px-8 py-4 rounded-xl font-bold border-2 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                    >
                        Menu
                    </button>
                    <button 
                        onClick={startGameSequence}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-blue-500/30 transition-all flex items-center hover:scale-105"
                    >
                        <RefreshCw className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" /> {t.playAgain}
                    </button>
                </div>
            </div>
        );
    }

    // --- PLAYING VIEW ---
    // Use fallback if questions array is somehow empty (extra safety)
    const currentQuestion = questions[currentIndex] || (LOCAL_FALLBACK_QUESTIONS[mode] || LOCAL_FALLBACK_QUESTIONS['TRIVIA'])[0];

    return (
        <div className="max-w-3xl mx-auto py-6">
            <div className="flex justify-between items-center mb-6 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <button onClick={resetToMenu} className="text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 font-bold flex items-center transition-colors text-sm">
                    <XCircle className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" /> Quit
                </button>
                
                {/* Progress Bar */}
                <div className="flex-1 mx-6 h-4 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden p-1">
                     <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                        style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                     ></div>
                </div>

                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                     {streak > 1 && (
                         <div className={`text-orange-500 font-black italic transform transition-all ${showCombo ? 'scale-125' : 'scale-100'}`}>
                             {streak}x COMBO!
                         </div>
                     )}
                    <span className="font-mono font-bold text-slate-700 dark:text-white flex items-center bg-slate-50 dark:bg-slate-900 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                        <Trophy className="w-4 h-4 mr-2 text-yellow-500" /> {score}
                    </span>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-xl border border-slate-200 dark:border-slate-700 p-8 mb-6 transition-all relative overflow-hidden">
                {/* Question Header */}
                <h3 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-8 leading-tight">
                    {currentQuestion.question}
                </h3>

                {currentQuestion.codeBlock && (
                    <div className="mb-8 bg-slate-900 rounded-2xl p-6 overflow-x-auto border-l-4 border-blue-500 shadow-lg relative group">
                        <div className="absolute top-2 right-2 flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                        </div>
                        <code className="font-mono text-base text-green-400 whitespace-pre-wrap block pt-2">
                            {currentQuestion.codeBlock}
                        </code>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-4">
                    {currentQuestion.options.map((option, idx) => {
                        let btnClass = "border-2 border-slate-100 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 bg-slate-50 dark:bg-slate-700/30";
                        let textClass = "text-slate-700 dark:text-slate-200";
                        let shadowClass = "";
                        
                        if (isAnswered) {
                            if (option === currentQuestion.correctAnswer) {
                                btnClass = "bg-green-100 dark:bg-green-900/40 border-green-500";
                                textClass = "text-green-800 dark:text-green-300 font-bold";
                                shadowClass = "shadow-[0_0_15px_rgba(34,197,94,0.3)]";
                            } else if (option === selectedOption) {
                                btnClass = "bg-red-50 dark:bg-red-900/40 border-red-500 opacity-80";
                                textClass = "text-red-800 dark:text-red-300";
                            } else {
                                btnClass = "opacity-40 border-transparent";
                            }
                        } else if (selectedOption === option) {
                            btnClass = "bg-blue-50 dark:bg-blue-900/40 border-blue-500";
                        }

                        return (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(option)}
                                disabled={isAnswered}
                                className={`w-full p-5 text-left rounded-2xl font-medium transition-all transform active:scale-[0.98] flex justify-between items-center group ${btnClass} ${textClass} ${shadowClass}`}
                            >
                                <span className="text-lg">{option}</span>
                                {isAnswered && option === currentQuestion.correctAnswer && <CheckCircle className="w-6 h-6 text-green-500 animate-bounce-short" />}
                                {isAnswered && option === selectedOption && option !== currentQuestion.correctAnswer && <XCircle className="w-6 h-6 text-red-500" />}
                                {!isAnswered && <div className="w-4 h-4 rounded-full border-2 border-slate-300 group-hover:border-blue-400 transition-colors"></div>}
                            </button>
                        );
                    })}
                </div>

                {isAnswered && (
                    <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-2xl text-base leading-relaxed border border-blue-100 dark:border-blue-900/50 animate-fade-in flex gap-4 items-start">
                        <div className="bg-blue-200 dark:bg-blue-800 p-2 rounded-lg shrink-0">
                            <BookOpen className="w-5 h-5 text-blue-700 dark:text-blue-300" />
                        </div>
                        <div>
                            <span className="font-bold block mb-1 text-sm uppercase tracking-wide opacity-70">{t.explanation}</span>
                            {currentQuestion.explanation}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-end h-16">
                {isAnswered && (
                    <button 
                        onClick={nextQuestion}
                        className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 py-4 rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center rtl:flex-row-reverse animate-fade-in"
                    >
                        {currentIndex === questions.length - 1 ? t.finish : t.next} <ChevronRight className="w-6 h-6 ml-2 rtl:mr-2 rtl:ml-0 rtl:rotate-180" />
                    </button>
                )}
            </div>
        </div>
    );
};

const ModeCard = ({ active, onClick, icon: Icon, title, desc, color }: any) => {
    const colorStyles: any = {
        cyan: active ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 shadow-[0_0_20px_rgba(6,182,212,0.2)]' : 'hover:border-cyan-300 dark:hover:border-cyan-700',
        pink: active ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20 shadow-[0_0_20px_rgba(236,72,153,0.2)]' : 'hover:border-pink-300 dark:hover:border-pink-700',
        yellow: active ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 shadow-[0_0_20px_rgba(234,179,8,0.2)]' : 'hover:border-yellow-300 dark:hover:border-yellow-700',
    };

    const iconColors: any = {
        cyan: 'text-cyan-500',
        pink: 'text-pink-500',
        yellow: 'text-yellow-500',
    };

    return (
        <button 
            onClick={onClick}
            className={`group relative p-6 rounded-3xl border-2 text-left transition-all duration-300 bg-white dark:bg-slate-800 ${colorStyles[color]} ${active ? 'scale-105' : 'scale-100 opacity-80 hover:opacity-100'}`}
        >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-slate-100 dark:bg-slate-700 ${iconColors[color]}`}>
                <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-1">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{desc}</p>
            
            {active && <div className="absolute top-4 right-4 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>}
        </button>
    )
}

export default Game;
