
import React, { useState } from 'react';
import { searchCodeConcept } from '../services/geminiService';
import { SearchResult, Language } from '../types';
import { translations } from '../translations';
import { Search, Book, Code, AlertCircle, ArrowRight } from 'lucide-react';

interface CodeSearchProps {
    language: Language;
}

const CodeSearch: React.FC<CodeSearchProps> = ({ language }) => {
    const [term, setTerm] = useState('');
    const [result, setResult] = useState<SearchResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const t = translations[language].search;

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!term.trim()) return;
        
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const data = await searchCodeConcept(term, language);
            setResult(data);
        } catch (err) {
            setError(t.error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-3">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white">{t.title}</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">{t.desc}</p>
            </div>

            <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
                <div className="relative">
                    <input 
                        type="text"
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                        placeholder={t.placeholder}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none shadow-sm transition-all"
                        autoFocus
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                </div>
                <button 
                    type="submit"
                    disabled={loading || !term.trim()}
                    className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl font-medium transition-colors disabled:opacity-50"
                >
                    {loading ? t.searching : t.button}
                </button>
            </form>

             {error && (
                <div className="max-w-xl mx-auto p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-center border border-red-100 dark:border-red-900 justify-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    {error}
                </div>
            )}

            {result && (
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden animate-fade-in">
                    <div className="bg-blue-600 p-6 md:p-8 text-white">
                        <div className="flex items-center gap-3 mb-2">
                             <div className="p-2 bg-white/20 rounded-lg">
                                <Code className="w-6 h-6" />
                             </div>
                             <span className="text-blue-100 font-mono text-sm uppercase tracking-widest">Python</span>
                        </div>
                        <h3 className="text-4xl font-bold">{result.term}</h3>
                    </div>

                    <div className="p-6 md:p-8 space-y-8">
                        <div>
                            <p className="text-xl text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                                {result.definition}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-slate-50 dark:bg-slate-700/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-700">
                                <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">{t.syntax}</h4>
                                <code className="font-mono text-blue-600 dark:text-blue-400 text-sm bg-white dark:bg-slate-800 px-3 py-2 rounded-lg block border border-slate-200 dark:border-slate-600">
                                    {result.syntax}
                                </code>
                            </div>

                            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-700 shadow-inner">
                                <h4 className="text-sm font-bold text-slate-500 mb-3 uppercase tracking-wider">{t.example}</h4>
                                <pre className="font-mono text-green-400 text-sm whitespace-pre-wrap">
                                    {result.example}
                                </pre>
                            </div>
                        </div>

                        {result.related && result.related.length > 0 && (
                            <div>
                                <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">{t.related}</h4>
                                <div className="flex flex-wrap gap-2">
                                    {result.related.map(r => (
                                        <button 
                                            key={r}
                                            onClick={() => { setTerm(r); handleSearch({ preventDefault: () => {} } as any); }}
                                            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-600 dark:hover:text-blue-300 transition-colors flex items-center"
                                        >
                                            {r} <ArrowRight className="w-3 h-3 ml-1 opacity-50" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default CodeSearch;
