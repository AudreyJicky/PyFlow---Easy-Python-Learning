
import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../translations';
import { X, Send, Bug, Lightbulb, Palette, FileText } from 'lucide-react';

interface FeedbackModalProps {
    language: Language;
    onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ language, onClose }) => {
    const t = translations[language].feedback;
    const [category, setCategory] = useState<'DESIGN' | 'CONTENT' | 'BUG' | 'SUGGESTION'>('SUGGESTION');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => onClose(), 2000);
    };

    const categories = [
        { id: 'DESIGN', label: t.design, icon: <Palette className="w-4 h-4" /> },
        { id: 'CONTENT', label: t.content, icon: <FileText className="w-4 h-4" /> },
        { id: 'BUG', label: t.bug, icon: <Bug className="w-4 h-4" /> },
        { id: 'SUGGESTION', label: t.suggestion, icon: <Lightbulb className="w-4 h-4" /> },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">{t.title}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <div className="p-6">
                    {submitted ? (
                        <div className="py-12 text-center text-green-600 dark:text-green-400">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Send className="w-8 h-8" />
                            </div>
                            <h4 className="text-xl font-bold">{t.thanks}</h4>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <p className="text-slate-500 dark:text-slate-400 text-sm">{t.desc}</p>
                            
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">{t.category}</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {categories.map(cat => (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => setCategory(cat.id as any)}
                                            className={`flex items-center justify-center p-3 rounded-xl border transition-all text-sm font-medium ${
                                                category === cat.id 
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                                                : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600'
                                            }`}
                                        >
                                            <span className="mr-2">{cat.icon}</span> {cat.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t.message}</label>
                                <textarea
                                    required
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    placeholder="Tell us more..."
                                />
                            </div>

                            <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg transition-colors">
                                {t.submit}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FeedbackModal;
