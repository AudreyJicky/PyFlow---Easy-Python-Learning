
import React, { useState } from 'react';
import { explainTopic } from '../services/geminiService';
import { ReferenceTopic, Language } from '../types';
import { translations } from '../translations';
import { Book, ChevronRight, Loader2, Star, Shield, Crown, Coffee, GraduationCap, Briefcase, Code, Sparkles } from 'lucide-react';

interface ReferenceBookProps {
    language: Language;
}

interface TopicSection {
    id: string;
    title: string;
    level: 'Beginner' | 'Intermediate' | 'Professional' | 'Practical';
    icon: React.ReactNode;
    color: string;
    topics: ReferenceTopic[];
}

const ReferenceBook: React.FC<ReferenceBookProps> = ({ language }) => {
    const [selectedTopic, setSelectedTopic] = useState<ReferenceTopic | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<string>('Beginner');
    const [content, setContent] = useState<string>('');
    const [loading, setLoading] = useState(false);
    
    const t = translations[language].reference;

    // Expanded Topics List
    const SECTIONS: TopicSection[] = [
        {
            id: 'novice',
            title: 'Novice (Beginner)',
            level: 'Beginner',
            icon: <Star className="w-5 h-5" />,
            color: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20',
            topics: [
                { id: '1', title: t.topics.variables || 'Variables', emoji: '📦', description: t.desc.variables || 'Storing data' },
                { id: '2', title: t.topics.datatypes || 'Data Types', emoji: '🔢', description: t.desc.datatypes || 'Strings, Ints' },
                { id: '3', title: t.topics.lists || 'Lists', emoji: '📜', description: t.desc.lists || 'Collections' },
                { id: '4', title: t.topics.loops || 'Loops', emoji: '🔄', description: t.desc.loops || 'Repetition' },
                { id: '5', title: t.topics.conditionals || 'Conditionals', emoji: '🔀', description: t.desc.conditionals || 'Logic' },
            ]
        },
        {
            id: 'apprentice',
            title: 'Apprentice (Intermediate)',
            level: 'Intermediate',
            icon: <Shield className="w-5 h-5" />,
            color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20',
            topics: [
                { id: '6', title: 'Functions & Scope', emoji: '⚡', description: 'Advanced arguments, Lambda' },
                { id: '7', title: 'Dictionaries & Sets', emoji: '📖', description: 'Hash maps and unique sets' },
                { id: '8', title: 'File Handling', emoji: '📂', description: 'Reading/Writing files' },
                { id: '9', title: 'Error Handling', emoji: '⚠️', description: 'Try, Except, Finally' },
                { id: '10', title: 'Modules & Pip', emoji: '📦', description: 'Importing libraries' },
                { id: '11', title: 'OOP Basics', emoji: '🏗️', description: 'Classes and Objects' },
            ]
        },
        {
            id: 'grandmaster',
            title: 'Grandmaster (Professional)',
            level: 'Professional',
            icon: <Crown className="w-5 h-5" />,
            color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20',
            topics: [
                { id: '12', title: 'Decorators', emoji: '🎀', description: 'Modifying functions' },
                { id: '13', title: 'Generators', emoji: '🏭', description: 'Yield and memory efficiency' },
                { id: '14', title: 'Context Managers', emoji: '🚪', description: 'With statement deep dive' },
                { id: '15', title: 'Concurrency', emoji: '⚡', description: 'Asyncio, Threading' },
                { id: '16', title: 'Metaprogramming', emoji: '🔮', description: 'Code that writes code' },
                { id: '17', title: 'Design Patterns', emoji: '📐', description: 'Singleton, Factory, etc.' },
            ]
        },
        // --- NEW PRACTICAL SECTIONS ---
        {
            id: 'daily',
            title: 'Daily Life',
            level: 'Practical',
            icon: <Coffee className="w-5 h-5" />,
            color: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20',
            topics: [
                { id: 'd1', title: 'Automating Chores', emoji: '🤖', description: 'Scripts for daily tasks' },
                { id: 'd2', title: 'Organizing Files', emoji: '🗂️', description: 'Cleanup your downloads folder' },
                { id: 'd3', title: 'Sending Emails', emoji: '📧', description: 'SMTP automation' },
            ]
        },
        {
            id: 'school',
            title: 'School Helper',
            level: 'Practical',
            icon: <GraduationCap className="w-5 h-5" />,
            color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20',
            topics: [
                { id: 's1', title: 'Math Solver', emoji: '➕', description: 'Calculus & Algebra with SymPy' },
                { id: 's2', title: 'Plotting Graphs', emoji: '📊', description: 'Matplotlib basics' },
                { id: 's3', title: 'Flashcard Maker', emoji: '🃏', description: 'Study tools with Pandas' },
            ]
        },
        {
            id: 'work',
            title: 'Work & Office',
            level: 'Practical',
            icon: <Briefcase className="w-5 h-5" />,
            color: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20',
            topics: [
                { id: 'w1', title: 'Excel Automation', emoji: '📉', description: 'OpenPyXL & Pandas' },
                { id: 'w2', title: 'Web Scraping', emoji: '🕷️', description: 'BeautifulSoup & Selenium' },
                { id: 'w3', title: 'PDF Manipulation', emoji: '📄', description: 'Merging & splitting PDFs' },
            ]
        },
        {
            id: 'code',
            title: 'Code Bank',
            level: 'Practical',
            icon: <Code className="w-5 h-5" />,
            color: 'text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/20',
            topics: [
                { id: 'c1', title: 'One-Liners', emoji: '⚡', description: 'Powerful single lines' },
                { id: 'c2', title: 'Regex Cheat Sheet', emoji: '🔍', description: 'Pattern matching' },
                { id: 'c3', title: 'Algorithm Snippets', emoji: '🧠', description: 'Sort, Search, Graph' },
            ]
        }
    ];

    const handleTopicClick = async (topic: ReferenceTopic, level: string) => {
        setSelectedTopic(topic);
        setSelectedLevel(level);
        setLoading(true);
        setContent('');
        try {
            const explanation = await explainTopic(topic.title, language, level);
            setContent(explanation);
        } catch (e) {
            setContent("Failed to load content.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-[calc(100vh-140px)] gap-6">
            {/* Sidebar Table of Contents */}
            <div className="w-full md:w-1/3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col transition-colors">
                <div className="p-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center">
                        <Book className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0 text-blue-500" /> {t.basics}
                    </h2>
                </div>
                
                <div className="flex-1 overflow-y-auto p-3 space-y-6 bg-white dark:bg-slate-800">
                    {/* Core Curriculum Header */}
                    <div className="px-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                        {t.sections.core || 'Core Curriculum'}
                    </div>

                    {SECTIONS.slice(0, 3).map((section) => (
                         <div key={section.id}>
                            <div className={`flex items-center px-3 py-2 mb-2 rounded-lg font-bold text-sm uppercase tracking-wider ${section.color}`}>
                                <span className="mr-2 rtl:ml-2 rtl:mr-0">{section.icon}</span>
                                {section.title}
                            </div>
                            <div className="space-y-1 pl-2 rtl:pl-0 rtl:pr-2 border-l-2 rtl:border-l-0 rtl:border-r-2 border-slate-100 dark:border-slate-700">
                                {section.topics.map(topic => (
                                    <button
                                        key={topic.id}
                                        onClick={() => handleTopicClick(topic, section.level)}
                                        className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between transition-all group ${
                                            selectedTopic?.id === topic.id
                                                ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white font-bold shadow-sm'
                                                : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                    >
                                        <div className="flex items-center min-w-0">
                                            <span className="text-xl mr-3 rtl:ml-3 rtl:mr-0 opacity-80">{topic.emoji}</span>
                                            <div className="truncate">
                                                <div className="text-sm truncate">{topic.title}</div>
                                            </div>
                                        </div>
                                        {selectedTopic?.id === topic.id && <ChevronRight className="w-4 h-4 text-blue-500 rtl:rotate-180" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Practical Applications Header */}
                    <div className="px-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-6 mb-2 pt-4 border-t border-slate-100 dark:border-slate-700">
                        {t.sections.practical || 'Practical Applications'}
                    </div>

                    {SECTIONS.slice(3).map((section) => (
                         <div key={section.id}>
                            <div className={`flex items-center px-3 py-2 mb-2 rounded-lg font-bold text-sm uppercase tracking-wider ${section.color}`}>
                                <span className="mr-2 rtl:ml-2 rtl:mr-0">{section.icon}</span>
                                {section.title}
                            </div>
                            <div className="space-y-1 pl-2 rtl:pl-0 rtl:pr-2 border-l-2 rtl:border-l-0 rtl:border-r-2 border-slate-100 dark:border-slate-700">
                                {section.topics.map(topic => (
                                    <button
                                        key={topic.id}
                                        onClick={() => handleTopicClick(topic, section.level)}
                                        className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between transition-all group ${
                                            selectedTopic?.id === topic.id
                                                ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white font-bold shadow-sm'
                                                : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                    >
                                        <div className="flex items-center min-w-0">
                                            <span className="text-xl mr-3 rtl:ml-3 rtl:mr-0 opacity-80">{topic.emoji}</span>
                                            <div className="truncate">
                                                <div className="text-sm truncate">{topic.title}</div>
                                            </div>
                                        </div>
                                        {selectedTopic?.id === topic.id && <ChevronRight className="w-4 h-4 text-blue-500 rtl:rotate-180" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col relative overflow-hidden transition-colors">
                {selectedTopic ? (
                    <>
                        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800">
                            <div className="flex items-center">
                                <span className="text-4xl mr-4 rtl:ml-4 rtl:mr-0 shadow-sm rounded-xl p-2 bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-600">{selectedTopic.emoji}</span>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedTopic.title}</h2>
                                        <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${
                                            selectedLevel === 'Professional' ? 'border-purple-200 bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-800' :
                                            selectedLevel === 'Intermediate' ? 'border-blue-200 bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800' :
                                            selectedLevel === 'Practical' ? 'border-green-200 bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800' :
                                            'border-yellow-200 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-800'
                                        }`}>
                                            {selectedLevel}
                                        </span>
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">{selectedTopic.description}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8 bg-white dark:bg-slate-800">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                                    <div className="relative">
                                        <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-xl">🐍</span>
                                        </div>
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">{t.loading}</p>
                                </div>
                            ) : (
                                <div className="prose prose-slate dark:prose-invert max-w-none 
                                    prose-h1:text-3xl prose-h1:font-extrabold prose-h1:text-slate-900 dark:prose-h1:text-white
                                    prose-h2:text-2xl prose-h2:font-bold prose-h2:text-blue-600 dark:prose-h2:text-blue-400 prose-h2:mt-8
                                    prose-h3:text-xl prose-h3:font-semibold prose-h3:text-slate-800 dark:prose-h3:text-white
                                    prose-p:text-slate-700 dark:prose-p:text-white prose-p:leading-relaxed
                                    prose-strong:text-slate-900 dark:prose-strong:text-white
                                    prose-li:text-slate-700 dark:prose-li:text-white
                                    prose-ul:text-slate-700 dark:prose-ul:text-white
                                    prose-ol:text-slate-700 dark:prose-ol:text-white
                                    prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-code:bg-pink-50 dark:prose-code:bg-pink-900/30 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                                    prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700 prose-pre:shadow-lg
                                " dir="auto">
                                    {content.split('\n').map((line, idx) => {
                                        // Custom renderer for better visuals
                                        if (line.startsWith('# ')) return <h1 key={idx}>{line.replace('# ', '')}</h1>;
                                        if (line.startsWith('## ')) return <h2 key={idx}>{line.replace('## ', '')}</h2>;
                                        if (line.startsWith('### ')) return <h3 key={idx}>{line.replace('### ', '')}</h3>;
                                        if (line.trim().startsWith('```')) return null; // Skip code fences
                                        if (line.trim().startsWith('print') || line.includes('def ') || line.includes('class ') || line.includes('import ') || line.includes(' = ')) {
                                             // Heuristic for simple code block rendering if the AI didn't format perfectly or for variety
                                            return <div key={idx} className="bg-slate-900 text-green-400 p-4 rounded-xl font-mono text-sm my-4 border border-slate-700 shadow-sm overflow-x-auto" dir="ltr">{line}</div>;
                                        }
                                        return <p key={idx} className="dark:text-white">{line}</p>;
                                    })}
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 p-8 text-center bg-white dark:bg-slate-800">
                        <div className="bg-slate-100 dark:bg-slate-700/50 p-6 rounded-full mb-6">
                            <Book className="w-16 h-16 text-slate-300 dark:text-slate-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">{t.select}</h3>
                        <p className="max-w-sm mx-auto opacity-70">Choose a topic from Novice to Grandmaster, or explore Practical Applications.</p>
                        
                        <div className="mt-8 flex gap-4 opacity-60">
                            <span className="flex flex-col items-center gap-1">
                                <span className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg text-green-600 dark:text-green-400"><Coffee className="w-4 h-4" /></span>
                                <span className="text-[10px]">Daily</span>
                            </span>
                            <span className="flex flex-col items-center gap-1">
                                <span className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg text-indigo-600 dark:text-indigo-400"><GraduationCap className="w-4 h-4" /></span>
                                <span className="text-[10px]">School</span>
                            </span>
                            <span className="flex flex-col items-center gap-1">
                                <span className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg text-orange-600 dark:text-orange-400"><Briefcase className="w-4 h-4" /></span>
                                <span className="text-[10px]">Work</span>
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReferenceBook;
