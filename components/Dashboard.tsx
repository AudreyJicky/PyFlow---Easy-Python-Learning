
import React, { useEffect, useState } from 'react';
import { getDailyTip } from '../services/geminiService';
import { DailyTip, Language, AppView, UserProfile } from '../types';
import { translations } from '../translations';
import { Sparkles, Code, ArrowRight, Layers, Terminal, BookOpen, Gamepad2, PenTool } from 'lucide-react';

interface DashboardProps {
    onNavigate: (view: AppView) => void;
    language: Language;
    user: UserProfile;
    onShowMissions?: () => void;
}

// --- ZERO LATENCY FALLBACK TIPS ---
// Instant content if AI is slow or offline
const FALLBACK_TIPS: DailyTip[] = [
    {
        topic: "F-Strings",
        codeSnippet: "name = 'PyFlow'\nprint(f'I love {name}!')",
        explanation: "F-strings (Formatted String Literals) are the fastest and most readable way to embed expressions inside strings.",
        funFact: "Introduced in Python 3.6, they are faster than %-formatting and str.format()."
    },
    {
        topic: "List Comprehension",
        codeSnippet: "squares = [x**2 for x in range(5)]\n# Result: [0, 1, 4, 9, 16]",
        explanation: "A concise way to create lists. It replaces multiline for-loops with a single line of readable code.",
        funFact: "It's often faster than using a for-loop to append items."
    },
    {
        topic: "Enumerate",
        codeSnippet: "colors = ['red', 'blue']\nfor i, color in enumerate(colors):\n    print(i, color)",
        explanation: "Use enumerate() to loop over a list and get both the index and the value at the same time.",
        funFact: "Pythonic code rarely uses 'range(len(list))'."
    },
    {
        topic: "Unpacking",
        codeSnippet: "a, b = 5, 10\na, b = b, a  # Swap values!",
        explanation: "You can assign multiple variables at once. This makes swapping values incredibly easy without a temp variable.",
        funFact: "This works with lists and tuples too!"
    },
    {
        topic: "Zip Function",
        codeSnippet: "names = ['Anna', 'Bob']\nages = [25, 30]\ncombined = list(zip(names, ages))",
        explanation: "zip() takes multiple lists and combines them element-by-element into tuples.",
        funFact: "Like a physical zipper, it joins two sides together."
    }
];

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, language, user, onShowMissions }) => {
    const [tip, setTip] = useState<DailyTip | null>(null);
    const [loading, setLoading] = useState(true);
    const t = translations[language].dashboard;

    useEffect(() => {
        const fetchTip = async () => {
            setLoading(true);
            
            // 1. Prepare Fallback
            const randomFallback = FALLBACK_TIPS[Math.floor(Math.random() * FALLBACK_TIPS.length)];

            try {
                // 2. Race: AI vs 1.0s Timeout for instant feel
                const aiPromise = getDailyTip(language);
                const timeoutPromise = new Promise<DailyTip>((_, reject) => 
                    setTimeout(() => reject('timeout'), 1000)
                );

                const data = await Promise.race([aiPromise, timeoutPromise]);
                setTip(data);
            } catch (e) {
                // 3. Use Fallback immediately if slow or error
                console.log("Using Zero-Latency Fallback Tip");
                setTip(randomFallback);
            } finally {
                setLoading(false);
            }
        };
        fetchTip();
    }, [language]);

    const AwardIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
    )

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
                        {t.hello}, {user.name}! 👋
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400">{t.subtitle}</p>
                </div>
                <div 
                    onClick={onShowMissions}
                    className="bg-white dark:bg-slate-800 px-6 py-3 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center space-x-4 rtl:space-x-reverse cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group"
                >
                    <div className="text-right">
                        <div className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase">{t.dailyXp}</div>
                        <div className="text-xl font-bold text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform origin-right">{user.xp}</div>
                    </div>
                    <div className="h-10 w-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center text-yellow-600 dark:text-yellow-400 group-hover:rotate-12 transition-transform">
                        <AwardIcon />
                    </div>
                </div>
            </header>

            <div className="space-y-6">
                {/* Daily Tip Card */}
                <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 transition-colors group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                        <Code className="w-48 h-48 text-blue-500" />
                    </div>
                    <div className="p-6 md:p-8 relative z-10">
                        <div className="flex items-center space-x-2 text-blue-500 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider mb-4 rtl:space-x-reverse">
                            <Sparkles className="w-4 h-4" />
                            <span>{t.dailyTip}</span>
                        </div>
                        
                        {loading ? (
                            <div className="animate-pulse space-y-4">
                                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                                <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                            </div>
                        ) : tip ? (
                            <div className="space-y-4 animate-fade-in">
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                                        {tip.topic}
                                    </h3>
                                    <div className="bg-slate-900 rounded-xl p-4 font-mono text-green-400 text-sm overflow-x-auto border border-slate-700 shadow-inner" dir="ltr">
                                        <pre>{tip.codeSnippet}</pre>
                                    </div>
                                </div>
                                <div className="text-slate-600 dark:text-slate-300">
                                    <p className="font-medium text-sm leading-relaxed">{tip.explanation}</p>
                                    {tip.funFact && (
                                        <p className="text-xs text-blue-500 dark:text-blue-400 mt-2 italic flex items-center">
                                            <Sparkles className="w-3 h-3 mr-1" /> {tip.funFact}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <p className="text-red-500">{t.failedTip}</p>
                        )}
                    </div>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <ActionCard 
                        title={t.features.reference.title}
                        desc={t.features.reference.desc}
                        icon={BookOpen}
                        color="amber"
                        onClick={() => onNavigate(AppView.REFERENCE)}
                        openText={t.open}
                    />
                    <ActionCard 
                        title={t.features.game.title}
                        desc={t.features.game.desc}
                        icon={Gamepad2}
                        color="purple"
                        onClick={() => onNavigate(AppView.GAME)}
                        openText={t.open}
                    />
                    <ActionCard 
                        title={t.features.notebook.title}
                        desc={t.features.notebook.desc}
                        icon={PenTool}
                        color="pink"
                        onClick={() => onNavigate(AppView.NOTEBOOK)}
                        openText={t.open}
                    />
                    <ActionCard 
                        title={t.features.flashcards.title}
                        desc={t.features.flashcards.desc}
                        icon={Layers}
                        color="indigo"
                        onClick={() => onNavigate(AppView.FLASHCARDS)}
                        openText={t.open}
                    />
                    <ActionCard 
                        title={t.features.chat.title}
                        desc={t.features.chat.desc}
                        icon={Terminal}
                        color="emerald"
                        onClick={() => onNavigate(AppView.CHAT)}
                        openText={t.open}
                    />
                    <ActionCard 
                        title={t.features.analyzer.title}
                        desc={t.features.analyzer.desc}
                        icon={Code}
                        color="cyan"
                        onClick={() => onNavigate(AppView.ANALYZER)}
                        openText={t.open}
                    />
                </div>
            </div>
        </div>
    );
};

const ActionCard = ({ title, desc, icon: Icon, color, onClick, openText }: any) => {
    const colorClasses: any = {
        amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800 hover:border-amber-300',
        purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-800 hover:border-purple-300',
        pink: 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 border-pink-100 dark:border-pink-800 hover:border-pink-300',
        indigo: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800 hover:border-indigo-300',
        emerald: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800 hover:border-emerald-300',
        cyan: 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 border-cyan-100 dark:border-cyan-800 hover:border-cyan-300',
    };

    return (
        <button 
            onClick={onClick}
            className={`group flex flex-col items-start p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all text-left`}
        >
            <div className={`p-3 rounded-xl mb-4 transition-colors ${colorClasses[color]}`}>
                <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{desc}</p>
            <div className={`mt-auto flex items-center text-sm font-semibold opacity-70 group-hover:opacity-100 transition-opacity dark:text-slate-200 rtl:flex-row-reverse`}>
                {openText} <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform rtl:ml-0 rtl:mr-1 rtl:group-hover:-translate-x-1" />
            </div>
        </button>
    )
}

export default Dashboard;
