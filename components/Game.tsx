
import React, { useState } from 'react';
import { generateQuiz } from '../services/geminiService';
import { QuizQuestion, Language, GameMode, GameLevel } from '../types';
import { translations } from '../translations';
import { Gamepad2, Award, CheckCircle, XCircle, ChevronRight, RefreshCw, Loader2, Bug, Zap, BookOpen, Trophy, ArrowLeft } from 'lucide-react';

interface GameProps {
    language: Language;
    onXpGain: (amount: number) => void;
}

const Game: React.FC<GameProps> = ({ language, onXpGain }) => {
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState<'MENU' | 'PLAYING' | 'FINISHED'>('MENU');
    const [loading, setLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [mode, setMode] = useState<GameMode>('TRIVIA');
    const [level, setLevel] = useState<GameLevel>('Beginner');
    
    const t = translations[language].game;

    const startGame = async () => {
        setLoading(true);
        try {
            const quizData = await generateQuiz(language, mode, level);
            if (quizData.length > 0) {
                setQuestions(quizData);
                setCurrentIndex(0);
                setScore(0);
                setGameState('PLAYING');
                setIsAnswered(false);
                setSelectedOption(null);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (option: string) => {
        if (isAnswered) return;
        setSelectedOption(option);
        setIsAnswered(true);

        if (option === questions[currentIndex].correctAnswer) {
            const points = level === 'Professional' ? 20 : level === 'Intermediate' ? 15 : 10;
            setScore(prev => prev + points);
            onXpGain(points);
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
    }

    if (gameState === 'MENU') {
        return (
            <div className="max-w-4xl mx-auto py-8">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">{t.title}</h2>
                    <p className="text-lg text-slate-500 dark:text-slate-400">{t.desc}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <button 
                        onClick={() => setMode('TRIVIA')}
                        className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center text-center ${mode === 'TRIVIA' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-300'}`}
                    >
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                            <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-300" />
                        </div>
                        <h3 className="font-bold text-slate-800 dark:text-white text-lg">{t.modes?.trivia?.title || 'Classic'}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{t.modes?.trivia?.desc}</p>
                    </button>

                    <button 
                        onClick={() => setMode('BUG_HUNTER')}
                        className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center text-center ${mode === 'BUG_HUNTER' ? 'border-red-500 bg-red-50 dark:bg-red-900/30' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-red-300'}`}
                    >
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
                            <Bug className="w-8 h-8 text-red-600 dark:text-red-300" />
                        </div>
                        <h3 className="font-bold text-slate-800 dark:text-white text-lg">{t.modes?.bug?.title || 'Bug Hunter'}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{t.modes?.bug?.desc}</p>
                    </button>

                    <button 
                        onClick={() => setMode('SYNTAX_SPRINT')}
                        className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center text-center ${mode === 'SYNTAX_SPRINT' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-yellow-300'}`}
                    >
                        <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mb-4">
                            <Zap className="w-8 h-8 text-yellow-600 dark:text-yellow-300" />
                        </div>
                        <h3 className="font-bold text-slate-800 dark:text-white text-lg">{t.modes?.sprint?.title || 'Sprint'}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{t.modes?.sprint?.desc}</p>
                    </button>
                </div>

                <div className="flex justify-center mb-10">
                    <div className="bg-white dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 flex">
                        {(['Beginner', 'Intermediate', 'Professional'] as GameLevel[]).map((l) => (
                             <button
                                key={l}
                                onClick={() => setLevel(l)}
                                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                                    level === l 
                                    ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900 shadow-sm' 
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                                }`}
                             >
                                 {t.levels?.[l.toLowerCase() as keyof typeof t.levels] || l}
                             </button>
                        ))}
                    </div>
                </div>

                <div className="text-center">
                    <button 
                        onClick={startGame}
                        disabled={loading}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-12 py-4 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-70 flex items-center justify-center mx-auto"
                    >
                        {loading ? <><Loader2 className="w-6 h-6 animate-spin mr-2" /> {t.loading}</> : t.start}
                    </button>
                </div>
            </div>
        );
    }

    if (gameState === 'FINISHED') {
        return (
            <div className="max-w-2xl mx-auto text-center py-12 bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="mb-6">
                    <Award className="w-24 h-24 text-yellow-500 mx-auto drop-shadow-lg" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">{t.gameOver}</h2>
                <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">{t.score} <span className="font-bold text-purple-600 dark:text-purple-400 text-3xl ml-2">{score} XP</span></p>
                
                <div className="flex justify-center space-x-4 rtl:space-x-reverse">
                    <button 
                        onClick={resetToMenu}
                        className="px-6 py-3 rounded-lg font-bold border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                    >
                        Main Menu
                    </button>
                    <button 
                        onClick={startGame}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-bold shadow-md transition-all flex items-center"
                    >
                        <RefreshCw className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" /> {t.playAgain}
                    </button>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentIndex];

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <button onClick={resetToMenu} className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white flex items-center">
                    <ArrowLeft className="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0" /> Menu
                </button>
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                     <span className="text-sm font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-3 py-1 rounded-full">
                        {t.question} {currentIndex + 1}/{questions.length}
                    </span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-200 flex items-center">
                        <Trophy className="w-4 h-4 mr-1 text-yellow-500" /> {score}
                    </span>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 mb-6 transition-colors">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 leading-relaxed">
                    {currentQuestion.question}
                </h3>

                {currentQuestion.codeBlock && (
                    <div className="mb-6 bg-slate-900 rounded-xl p-4 overflow-x-auto border border-slate-700 shadow-inner">
                        <code className="font-mono text-sm text-green-400 whitespace-pre-wrap block">
                            {currentQuestion.codeBlock}
                        </code>
                    </div>
                )}

                <div className="space-y-3">
                    {currentQuestion.options.map((option, idx) => {
                        let btnClass = "border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-purple-200 dark:hover:border-purple-500 text-slate-700 dark:text-slate-200";
                        if (isAnswered) {
                            if (option === currentQuestion.correctAnswer) {
                                btnClass = "bg-green-100 dark:bg-green-900/30 border-green-500 text-green-800 dark:text-green-300";
                            } else if (option === selectedOption) {
                                btnClass = "bg-red-50 dark:bg-red-900/30 border-red-300 text-red-800 dark:text-red-300";
                            } else {
                                btnClass = "opacity-50 border-slate-200 dark:border-slate-700 dark:text-slate-500";
                            }
                        } else if (selectedOption === option) {
                            btnClass = "bg-purple-50 dark:bg-purple-900/30 border-purple-500";
                        }

                        return (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(option)}
                                disabled={isAnswered}
                                className={`w-full p-4 text-left border-2 rounded-xl font-medium transition-all flex justify-between items-center ${btnClass}`}
                            >
                                <span>{option}</span>
                                {isAnswered && option === currentQuestion.correctAnswer && <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />}
                                {isAnswered && option === selectedOption && option !== currentQuestion.correctAnswer && <XCircle className="w-5 h-5 text-red-500 dark:text-red-400" />}
                            </button>
                        );
                    })}
                </div>

                {isAnswered && (
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-xl text-sm leading-relaxed border border-blue-100 dark:border-blue-900 animate-fade-in">
                        <span className="font-bold block mb-1">{t.explanation}:</span>
                        {currentQuestion.explanation}
                    </div>
                )}
            </div>

            <div className="flex justify-end">
                <button 
                    onClick={nextQuestion}
                    disabled={!isAnswered}
                    className="bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white px-6 py-3 rounded-xl font-bold flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-all rtl:flex-row-reverse"
                >
                    {currentIndex === questions.length - 1 ? t.finish : t.next} <ChevronRight className="w-5 h-5 ml-2 rtl:mr-2 rtl:ml-0 rtl:rotate-180" />
                </button>
            </div>
        </div>
    );
};

export default Game;
