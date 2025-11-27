
import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../translations';
import { Play, Trash2, Terminal, Code2, Loader2 } from 'lucide-react';
import { runPythonCode } from '../services/geminiService';

interface PlaygroundProps {
    language: Language;
}

const Playground: React.FC<PlaygroundProps> = ({ language }) => {
    const t = translations[language].playground;
    const [code, setCode] = useState("print('Hello PyFlow!')");
    const [output, setOutput] = useState("");
    const [isRunning, setIsRunning] = useState(false);

    const handleRun = async () => {
        setIsRunning(true);
        setOutput("");

        // --- ZERO LATENCY LOCAL EXECUTION (Simulation) ---
        // Basic regex to handle simple print and math for instant feedback
        const trimmed = code.trim();
        
        // Check for single line print: print('text') or print("text") or print(number)
        const printRegex = /^print\s*\((['"])(.*?)\1\)$|^print\s*\(([\d\.]+)\)$/;
        const match = trimmed.match(printRegex);

        // Check for simple math: 2 + 2, 10 * 5, etc (no variables)
        const mathRegex = /^[\d\s\+\-\*\/\%\(\)\.]+$/;

        if (match) {
            // Simple Print
            const text = match[2] || match[3];
            setOutput(text);
            setIsRunning(false);
            return;
        } else if (mathRegex.test(trimmed)) {
            // Simple Math
            try {
                // eslint-disable-next-line no-eval
                const result = eval(trimmed); // Safe enough for this regex subset
                setOutput(String(result));
                setIsRunning(false);
                return;
            } catch (e) {
                // Fallthrough to AI if eval fails
            }
        }

        // --- AI EXECUTION (Complex Code) ---
        try {
            const result = await runPythonCode(code);
            setOutput(result);
        } catch (e) {
            setOutput("Error: Could not execute code.");
        } finally {
            setIsRunning(false);
        }
    };

    const loadPreset = (presetCode: string) => {
        setCode(presetCode);
        setOutput("");
    };

    const presets = [
        { label: t.presets.hello, code: "print('Hello World!')" },
        { label: t.presets.loop, code: "for i in range(5):\n    print(f'Count: {i}')" },
        { label: t.presets.math, code: "x = 10\ny = 5\nprint(x + y)" },
    ];

    return (
        <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <Terminal className="w-8 h-8 text-blue-600" /> {t.title}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{t.desc}</p>
                </div>
                
                <div className="flex gap-2">
                    {presets.map((p, i) => (
                        <button 
                            key={i}
                            onClick={() => loadPreset(p.code)}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
                {/* Editor */}
                <div className="flex flex-col bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-xl">
                    <div className="bg-slate-800 px-4 py-2 flex justify-between items-center border-b border-slate-700">
                        <span className="text-slate-400 text-xs font-mono flex items-center gap-2">
                            <Code2 className="w-4 h-4" /> {t.editor}
                        </span>
                        <button 
                            onClick={handleRun}
                            disabled={isRunning}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg text-sm font-bold flex items-center transition-all disabled:opacity-50"
                        >
                            {isRunning ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Play className="w-4 h-4 mr-2 fill-current" />}
                            {isRunning ? t.running : t.run}
                        </button>
                    </div>
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="flex-1 bg-slate-900 text-slate-300 font-mono p-4 outline-none resize-none leading-relaxed text-sm"
                        spellCheck={false}
                    />
                </div>

                {/* Console */}
                <div className="flex flex-col bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
                    <div className="bg-slate-900/50 px-4 py-2 flex justify-between items-center border-b border-slate-800">
                        <span className="text-slate-500 text-xs font-mono flex items-center gap-2">
                            <Terminal className="w-4 h-4" /> {t.output}
                        </span>
                        <button 
                            onClick={() => setOutput("")}
                            className="text-slate-500 hover:text-red-400 transition-colors p-1"
                            title={t.clear}
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="flex-1 bg-black p-4 font-mono text-sm overflow-auto">
                        {output ? (
                            <pre className="text-green-400 whitespace-pre-wrap">{output}</pre>
                        ) : (
                            <div className="text-slate-700 italic opacity-50 select-none">
                                {'> Ready to execute...'}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Playground;
