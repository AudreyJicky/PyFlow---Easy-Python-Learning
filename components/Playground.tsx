
import React, { useState } from 'react';
import { Language, PlaygroundFeedback } from '../types';
import { translations } from '../translations';
import { Play, Trash2, Terminal, Code2, Loader2, MessageSquare, Lightbulb, AlertTriangle, Zap, CheckCircle, Wrench, FileCode, BookOpen } from 'lucide-react';
import { runPythonCode, getCodeFeedback } from '../services/geminiService';

interface PlaygroundProps {
    language: Language;
}

const Playground: React.FC<PlaygroundProps> = ({ language }) => {
    const t = translations[language].playground;
    const [code, setCode] = useState("name = 'World'\nprint(f'Hello, {name}!')");
    const [output, setOutput] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    
    // Input State (Hidden/Unused for now as UI column is removed)
    const [userInput, setUserInput] = useState("");
    
    // AI Assistant State
    const [activeTab, setActiveTab] = useState<'OUTPUT' | 'EXPLAIN' | 'TIP' | 'HINT' | 'FIX' | 'EXAMPLE'>('OUTPUT');
    const [feedback, setFeedback] = useState<PlaygroundFeedback | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleRun = async (codeOverride?: string | React.MouseEvent) => {
        // If called from button click (event object) or undefined, use state 'code'. 
        // If called with string, use that (for Auto Fix).
        const sourceCode = typeof codeOverride === 'string' ? codeOverride : code;

        setIsRunning(true);
        setOutput("");
        setFeedback(null); // Reset previous feedback
        setActiveTab('OUTPUT'); // Switch to output view while running

        let execResult = "";

        // --- ZERO LATENCY LOCAL EXECUTION (Simulation) ---
        // Basic regex to handle simple print and math for instant feedback
        const trimmed = sourceCode.trim();
        const printRegex = /^print\s*\((['"])(.*?)\1\)$/;
        const printMathRegex = /^print\s*\(([^)]+)\)$/; // Catches print(1+1)
        const match = trimmed.match(printRegex);
        const mathMatch = trimmed.match(printMathRegex);
        
        // Skip local execution if 'input(' is present or userInput is provided, to ensure AI handles it
        const hasInputCall = trimmed.includes("input(");

        if (match && !userInput && !hasInputCall) {
            // Case 1: Simple string print -> print("Hello")
            execResult = match[2];
            setOutput(execResult);
            setIsRunning(false);
            handleAnalyze(execResult, sourceCode); 
            return;
        } else if (mathMatch && !userInput && !hasInputCall) {
            // Case 2: Math inside print -> print(10 + 5)
            const content = mathMatch[1].trim();
            // Check if it's a valid math expression (numbers, operators, parens)
            if (/^[\d\s\+\-\*\/\%\(\)\.]+$/.test(content)) {
                 try {
                     // eslint-disable-next-line no-eval
                     execResult = String(eval(content));
                     setOutput(execResult);
                     setIsRunning(false);
                     handleAnalyze(execResult, sourceCode);
                     return;
                 } catch (e) {
                     // Fallthrough to AI if eval fails
                 }
            }
        }

        // --- AI EXECUTION (Complex Code & Input Handling) ---
        try {
            execResult = await runPythonCode(sourceCode, userInput);
            setOutput(execResult);
            handleAnalyze(execResult, sourceCode); // Always trigger analysis automatically

        } catch (e) {
            const errStr = "Error: Could not execute code.";
            setOutput(errStr);
            handleAnalyze(errStr, sourceCode);
        } finally {
            setIsRunning(false);
        }
    };

    const handleAnalyze = async (currentOutput: string, codeToAnalyze?: string) => {
        const sourceCode = codeToAnalyze || code;
        setIsAnalyzing(true);
        try {
            const result = await getCodeFeedback(sourceCode, currentOutput, language);
            setFeedback(result);
            if (result.isError) {
                setActiveTab('FIX'); // Auto-switch to fix tab if error
            } else {
                setActiveTab('EXPLAIN'); // Auto-switch to explain if success
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const loadPreset = (presetCode: string) => {
        setCode(presetCode);
        setOutput("");
        setFeedback(null);
        setActiveTab('OUTPUT');
        setUserInput("");
    };

    const presets = [
        { label: t.presets.hello, code: "print('Hello World!')" },
        { label: t.presets.loop, code: "for i in range(5):\n    print(f'Count: {i}')" },
        { label: t.presets.math, code: "print(10 + 5 * 2)\nprint(100 / 4)" },
    ];

    return (
        <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex flex-col gap-4">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <Terminal className="w-8 h-8 text-blue-600" /> {t.title}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{t.desc}</p>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
                {/* Editor Column (Left) */}
                <div className="flex flex-col bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-xl h-full">
                    <div className="bg-slate-800 px-4 py-2 flex justify-between items-center border-b border-slate-700 shrink-0">
                        <span className="text-slate-400 text-xs font-mono flex items-center gap-2">
                            <Code2 className="w-4 h-4" /> {t.editor}
                        </span>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setCode("")}
                                className="text-slate-500 hover:text-red-400 transition-colors p-1"
                                title={t.clear}
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={() => handleRun()}
                                disabled={isRunning}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg text-sm font-bold flex items-center transition-all disabled:opacity-50"
                            >
                                {isRunning ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Play className="w-4 h-4 mr-2 fill-current" />}
                                {isRunning ? t.running : t.run}
                            </button>
                        </div>
                    </div>
                    
                    {/* Presets Bar */}
                    <div className="bg-slate-900 border-b border-slate-800 px-3 py-2 flex gap-2 overflow-x-auto custom-scrollbar items-center">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0 flex items-center">
                            <FileCode className="w-3 h-3 mr-1" /> Samples:
                        </span>
                        {presets.map((p, i) => (
                            <button 
                                key={i}
                                onClick={() => loadPreset(p.code)}
                                className="px-3 py-1 rounded-md bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 hover:text-blue-400 hover:border-blue-500/50 text-xs font-medium whitespace-nowrap transition-colors"
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                    
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="flex-1 bg-slate-900 text-slate-300 font-mono p-4 outline-none resize-none leading-relaxed text-sm custom-scrollbar"
                        spellCheck={false}
                        placeholder="# Write your python code here"
                    />
                </div>

                {/* Right Column: Output, AI */}
                <div className="flex flex-col gap-4 h-full">
                    
                    {/* Console Output */}
                    <div className="flex-1 flex flex-col bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-xl min-h-[120px]">
                        <div className="bg-slate-900/50 px-4 py-2 flex justify-between items-center border-b border-slate-800 shrink-0">
                            <span className="text-slate-500 text-xs font-mono flex items-center gap-2">
                                <Terminal className="w-4 h-4" /> {t.output}
                            </span>
                        </div>
                        <div className="flex-1 bg-black p-4 font-mono text-sm overflow-auto custom-scrollbar">
                            {output ? (
                                <pre className={`${output.toLowerCase().includes("error") ? "text-red-400" : "text-green-400"} whitespace-pre-wrap`}>{output}</pre>
                            ) : (
                                <div className="text-slate-700 italic opacity-50 select-none">
                                    {'> Ready to execute...'}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* AI Assistant Panel */}
                    <div className="flex-1 flex flex-col bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden min-h-0">
                        {/* AI Tabs */}
                        <div className="flex border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-1 gap-1 shrink-0 overflow-x-auto">
                            <button 
                                onClick={() => setActiveTab('EXPLAIN')}
                                className={`flex-1 min-w-[70px] py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-colors ${activeTab === 'EXPLAIN' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800'}`}
                            >
                                <MessageSquare className="w-3 h-3" /> {t.ai?.explain || 'Explain'}
                            </button>
                            <button 
                                onClick={() => setActiveTab('EXAMPLE')}
                                className={`flex-1 min-w-[70px] py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-colors ${activeTab === 'EXAMPLE' ? 'bg-white dark:bg-slate-700 text-green-600 dark:text-green-400 shadow-sm' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800'}`}
                            >
                                <BookOpen className="w-3 h-3" /> {t.ai?.example || 'Example'}
                            </button>
                            <button 
                                onClick={() => setActiveTab('TIP')}
                                className={`flex-1 min-w-[70px] py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-colors ${activeTab === 'TIP' ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-sm' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800'}`}
                            >
                                <Zap className="w-3 h-3" /> {t.ai?.tip || 'Tip'}
                            </button>
                            <button 
                                onClick={() => setActiveTab('HINT')}
                                className={`flex-1 min-w-[70px] py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-colors ${activeTab === 'HINT' ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-sm' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800'}`}
                            >
                                <Lightbulb className="w-3 h-3" /> {t.ai?.hint || 'Hint'}
                            </button>
                            {/* Show Fix tab only if there is an error detected or we are manually analyzing */}
                            {(feedback?.isError || output.toLowerCase().includes("error")) && (
                                <button 
                                    onClick={() => setActiveTab('FIX')}
                                    className={`flex-1 min-w-[70px] py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-colors ${activeTab === 'FIX' ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 shadow-sm' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800'}`}
                                >
                                    <Wrench className="w-3 h-3" /> {t.ai?.fix || 'Fix'}
                                </button>
                            )}
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 p-6 overflow-y-auto bg-white dark:bg-slate-800 relative">
                            {!output && !feedback ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 opacity-60">
                                    <Code2 className="w-12 h-12 mb-2" />
                                    <p>{t.ai?.waiting || 'Run code to see analysis.'}</p>
                                </div>
                            ) : !feedback && !isAnalyzing ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm z-10">
                                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Waiting for results...</p>
                                </div>
                            ) : isAnalyzing ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm z-10">
                                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
                                    <p className="text-sm font-bold text-slate-600 dark:text-slate-300">{t.ai?.analyzing}</p>
                                </div>
                            ) : feedback && (
                                <div className="animate-fade-in space-y-4">
                                    
                                    {/* EXPLAIN TAB */}
                                    {activeTab === 'EXPLAIN' && (
                                        <div>
                                            <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-2 flex items-center">
                                                <MessageSquare className="w-5 h-5 mr-2 text-blue-500" /> Code Explanation
                                            </h4>
                                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">
                                                {feedback.explanation}
                                            </p>
                                        </div>
                                    )}

                                    {/* EXAMPLE TAB */}
                                    {activeTab === 'EXAMPLE' && (
                                        <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-xl border border-green-100 dark:border-green-900/50">
                                            <h4 className="font-bold text-green-800 dark:text-green-300 mb-2 flex items-center">
                                                <BookOpen className="w-4 h-4 mr-2" /> Example Variation
                                            </h4>
                                            <pre className="bg-slate-900 text-green-400 p-3 rounded-lg font-mono text-xs overflow-x-auto">
                                                {feedback.example || "# No example available"}
                                            </pre>
                                            <button 
                                                onClick={() => { setCode(feedback.example || ""); setActiveTab('EXPLAIN'); }}
                                                className="mt-3 w-full bg-green-100 dark:bg-green-800/50 hover:bg-green-200 dark:hover:bg-green-800 text-green-700 dark:text-green-200 py-2 rounded-lg text-xs font-bold transition-colors"
                                            >
                                                Load This Example
                                            </button>
                                        </div>
                                    )}

                                    {/* TIP TAB */}
                                    {activeTab === 'TIP' && (
                                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-900/50">
                                            <h4 className="font-bold text-purple-800 dark:text-purple-300 mb-2 flex items-center">
                                                <Zap className="w-4 h-4 mr-2" /> Pro Tip
                                            </h4>
                                            <p className="text-purple-700 dark:text-purple-200 text-sm">
                                                {feedback.tip}
                                            </p>
                                        </div>
                                    )}

                                    {/* HINT TAB */}
                                    {activeTab === 'HINT' && (
                                        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-900/50">
                                            <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2 flex items-center">
                                                <Lightbulb className="w-4 h-4 mr-2" /> {feedback.isError ? 'Debugging Hint' : 'Did you know?'}
                                            </h4>
                                            <p className="text-amber-700 dark:text-amber-200 text-sm">
                                                {feedback.hint}
                                            </p>
                                        </div>
                                    )}

                                    {/* FIX TAB */}
                                    {activeTab === 'FIX' && feedback.isError && feedback.fixedCode && (
                                        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-900/50">
                                            <h4 className="font-bold text-red-800 dark:text-red-300 mb-2 flex items-center">
                                                <AlertTriangle className="w-4 h-4 mr-2" /> Suggested Fix
                                            </h4>
                                            <div className="relative">
                                                <pre className="bg-slate-900 text-green-400 p-3 rounded-lg font-mono text-xs overflow-x-auto">
                                                    {feedback.fixedCode}
                                                </pre>
                                                <button 
                                                    onClick={() => { 
                                                        const fixed = feedback.fixedCode || "";
                                                        setCode(fixed); 
                                                        handleRun(fixed); // Auto-Run Fixed Code
                                                    }}
                                                    className="mt-3 w-full bg-red-100 dark:bg-red-800 hover:bg-red-200 dark:hover:bg-red-700 text-red-700 dark:text-red-200 py-2 rounded-lg text-xs font-bold transition-colors"
                                                >
                                                    Apply Fix
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Success State if in Fix tab but no error */}
                                    {activeTab === 'FIX' && !feedback.isError && (
                                        <div className="flex flex-col items-center justify-center text-center py-8">
                                            <CheckCircle className="w-12 h-12 text-green-500 mb-2" />
                                            <p className="text-green-600 dark:text-green-400 font-bold">{t.ai?.success}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Playground;
