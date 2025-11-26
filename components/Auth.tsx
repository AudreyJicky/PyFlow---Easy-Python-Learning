
import React, { useState, useEffect } from 'react';
import { UserProfile, Language } from '../types';
import { translations } from '../translations';
import { Terminal, Mail, Phone, ArrowRight, Globe } from 'lucide-react';

interface AuthProps {
    onLogin: (user: UserProfile) => void;
    language?: Language;
    onLanguageChange?: (lang: Language) => void;
    detectedLocation?: string;
}

const Auth: React.FC<AuthProps> = ({ onLogin, language = 'English', onLanguageChange, detectedLocation }) => {
    const [method, setMethod] = useState<'options' | 'email' | 'phone'>('options');
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Internal state for language if not controlled by parent (fallback)
    const [localLang, setLocalLang] = useState<Language>(language);
    
    const currentLang = onLanguageChange ? language : localLang;
    const t = translations[currentLang].auth;
    const isRTL = currentLang === 'Arabic';

    const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLang = e.target.value as Language;
        if (onLanguageChange) {
            onLanguageChange(newLang);
        } else {
            setLocalLang(newLang);
        }
        document.documentElement.dir = newLang === 'Arabic' ? 'rtl' : 'ltr';
    };

    const handleLogin = (type: string) => {
        setLoading(true);
        
        // Auto-detect current system theme for new profile default
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Simulate API delay
        setTimeout(() => {
            const mockUser: UserProfile = {
                name: type === 'google' ? 'Google User' : inputValue.split('@')[0] || 'New Coder',
                email: type === 'email' ? inputValue : 'user@example.com',
                avatar: type === 'google' 
                    ? 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' // Simulate Google Avatar
                    : 'https://api.dicebear.com/7.x/avataaars/svg?seed=NewUser',
                theme: systemDark ? 'dark' : 'light',
                xp: parseInt(localStorage.getItem('pyflow-xp') || '0'),
                country: detectedLocation || 'Unknown',
                joinedDate: new Date().getFullYear().toString()
            };
            onLogin(mockUser);
            setLoading(false);
        }, 1500);
    };

    const languages: Language[] = [
        'English', 'Chinese (Simplified)', 'Malay', 'Japanese', 'Korean', 
        'Indonesian', 'Thai', 'Vietnamese', 'Myanmar', 'Arabic'
    ];

    return (
        <div className={`min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
            
            {/* Language Picker */}
            <div className="absolute top-4 right-4 flex items-center bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-200">
                <Globe className="w-4 h-4 text-slate-400 mr-2 rtl:ml-2 rtl:mr-0" />
                <select 
                    value={currentLang}
                    onChange={handleLangChange}
                    className="bg-transparent text-sm text-slate-600 outline-none cursor-pointer"
                >
                    {languages.map(lang => (
                        <option key={lang} value={lang}>{lang}</option>
                    ))}
                </select>
            </div>

            <div className="mb-8 text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/30 transform rotate-3">
                    <Terminal className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-slate-800 mb-2">{t.title}</h1>
                <p className="text-slate-500">{t.subtitle}</p>
            </div>

            <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-xl border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
                    {method === 'options' ? t.getStarted : method === 'email' ? t.emailLogin : t.phoneLogin}
                </h2>

                {method === 'options' ? (
                    <div className="space-y-4">
                        <button 
                            onClick={() => handleLogin('google')}
                            className="w-full py-3 px-4 border border-slate-200 rounded-xl flex items-center justify-center space-x-3 hover:bg-slate-50 transition-all font-medium text-slate-700 rtl:space-x-reverse relative overflow-hidden group"
                        >
                             <div className="absolute inset-0 bg-blue-50 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                             <div className="relative flex items-center space-x-3 rtl:space-x-reverse">
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                                <span>{t.google}</span>
                             </div>
                        </button>
                        
                        <button 
                            onClick={() => setMethod('email')}
                            className="w-full py-3 px-4 bg-slate-800 text-white rounded-xl flex items-center justify-center space-x-3 hover:bg-slate-900 transition-all font-medium shadow-lg shadow-slate-200 rtl:space-x-reverse"
                        >
                            <Mail className="w-5 h-5" />
                            <span>{t.email}</span>
                        </button>

                        <button 
                            onClick={() => setMethod('phone')}
                            className="w-full py-3 px-4 border border-slate-200 rounded-xl flex items-center justify-center space-x-3 hover:bg-slate-50 transition-all font-medium text-slate-700 rtl:space-x-reverse"
                        >
                            <Phone className="w-5 h-5" />
                            <span>{t.phone}</span>
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                {method === 'email' ? t.emailLabel : t.phoneLabel}
                            </label>
                            <input 
                                type={method === 'email' ? 'email' : 'tel'}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder={method === 'email' ? t.placeholderEmail : t.placeholderPhone}
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                autoFocus
                            />
                        </div>
                        
                        <button 
                            onClick={() => handleLogin('email')}
                            disabled={!inputValue || loading}
                            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 disabled:opacity-50 transition-all flex justify-center items-center rtl:flex-row-reverse"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>{t.signIn} <ArrowRight className="w-5 h-5 ml-2 rtl:ml-0 rtl:mr-2 rtl:rotate-180" /></>
                            )}
                        </button>

                        <button 
                            onClick={() => setMethod('options')}
                            className="w-full text-sm text-slate-500 hover:text-slate-800"
                        >
                            {t.back}
                        </button>
                    </div>
                )}
                
                <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
                    {detectedLocation ? (
                         <span className="flex items-center justify-center gap-1">
                            <Globe className="w-3 h-3" /> Detected Location: {detectedLocation}
                         </span>
                    ) : t.terms}
                </div>
            </div>
        </div>
    );
};

export default Auth;