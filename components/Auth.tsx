
import React, { useState, useEffect } from 'react';
import { UserProfile, Language, SavedAccount } from '../types';
import { translations } from '../translations';
import { Terminal, Mail, Phone, ArrowRight, Globe, X, User, ChevronDown, Plus, Trash2, CheckSquare, Square } from 'lucide-react';

interface AuthProps {
    onLogin: (user: UserProfile, method: 'email' | 'phone' | 'google') => void;
    language?: Language;
    onLanguageChange?: (lang: Language) => void;
    detectedLocation?: string;
}

const COUNTRY_CODES = [
    { code: '+1', flag: '🇺🇸', name: 'USA' },
    { code: '+86', flag: '🇨🇳', name: 'China' },
    { code: '+60', flag: '🇲🇾', name: 'Malaysia' },
    { code: '+81', flag: '🇯🇵', name: 'Japan' },
    { code: '+82', flag: '🇰🇷', name: 'Korea' },
    { code: '+62', flag: '🇮🇩', name: 'Indonesia' },
    { code: '+66', flag: '🇹🇭', name: 'Thailand' },
    { code: '+84', flag: '🇻🇳', name: 'Vietnam' },
    { code: '+95', flag: '🇲🇲', name: 'Myanmar' },
    { code: '+20', flag: '🇪🇬', name: 'Egypt' }, // Proxy for Arabic
    { code: '+44', flag: '🇬🇧', name: 'UK' },
];

const Auth: React.FC<AuthProps> = ({ onLogin, language = 'English', onLanguageChange, detectedLocation }) => {
    const [method, setMethod] = useState<'options' | 'email' | 'phone' | 'google' | 'saved_accounts'>('options');
    const [isSignUp, setIsSignUp] = useState(false);
    const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>([]);
    
    // Form Inputs
    const [inputValue, setInputValue] = useState('');
    const [name, setName] = useState('');
    const [countryCode, setCountryCode] = useState(COUNTRY_CODES[0]);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    
    const [loading, setLoading] = useState(false);
    const [showOneTap, setShowOneTap] = useState(false);
    
    // Internal state for language if not controlled by parent (fallback)
    const [localLang, setLocalLang] = useState<Language>(language);
    
    const currentLang = onLanguageChange ? language : localLang;
    const t = translations[currentLang].auth;
    const isRTL = currentLang === 'Arabic';

    // Check for saved accounts on mount
    useEffect(() => {
        const saved = localStorage.getItem('pyflow-saved-accounts');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setSavedAccounts(parsed);
                    setMethod('saved_accounts');
                }
            } catch (e) {
                console.error("Failed to parse saved accounts");
            }
        }
    }, []);

    // Simulate "Auto Detect" Google Login
    useEffect(() => {
        const timer = setTimeout(() => {
            const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
            if ((isChrome || true) && method === 'options') { // Force true for demo
                setShowOneTap(true);
            }
        }, 1500);
        return () => clearTimeout(timer);
    }, [method]);

    const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLang = e.target.value as Language;
        if (onLanguageChange) {
            onLanguageChange(newLang);
        } else {
            setLocalLang(newLang);
        }
        document.documentElement.dir = newLang === 'Arabic' ? 'rtl' : 'ltr';
    };

    const handleMethodSelect = (m: 'email' | 'phone' | 'google') => {
        if (m === 'google') {
            // Google simulation goes straight to login
            setMethod('google');
            // Trigger login immediately for Google
            completeLogin('google', 'user@gmail.com', 'Google User');
        } else {
            setMethod(m);
            setInputValue('');
        }
    };

    const handleSavedAccountClick = (account: SavedAccount) => {
        // Immediate login with saved account
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        const mockUser: UserProfile = {
            name: account.name,
            email: account.email,
            avatar: account.avatar,
            theme: systemDark ? 'dark' : 'light',
            xp: parseInt(localStorage.getItem('pyflow-xp') || '0'),
            country: detectedLocation || 'Unknown',
            joinedDate: new Date().getFullYear().toString()
        };
        onLogin(mockUser, account.method);
    };

    const removeSavedAccount = (e: React.MouseEvent, email: string) => {
        e.stopPropagation();
        const updated = savedAccounts.filter(acc => acc.email !== email);
        setSavedAccounts(updated);
        localStorage.setItem('pyflow-saved-accounts', JSON.stringify(updated));
        if (updated.length === 0) {
            setMethod('options');
        }
    };

    const handleAuthSubmit = () => {
        // Ensure method is a valid login method to satisfy TypeScript narrowing
        if (method === 'options' || method === 'saved_accounts') return;

        if (!inputValue && method !== 'google') return;
        if (isSignUp && !agreedToTerms) return; // Prevent if terms not agreed

        setLoading(true);
        // Simulate network request delay
        setTimeout(() => {
            const emailOrPhone = method === 'phone' 
                ? (inputValue.includes('+') ? inputValue : `${countryCode.code} ${inputValue}`)
                : inputValue;
            
            const finalName = name || (emailOrPhone.split('@')[0] || 'Coder');
            
            completeLogin(method, emailOrPhone, finalName);
        }, 1000);
    };

    const completeLogin = (loginMethod: 'email' | 'phone' | 'google', identifier: string, userName: string) => {
         // Auto-detect current system theme for new profile default
         const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
         
         const mockUser: UserProfile = {
            name: userName,
            email: identifier,
            avatar: loginMethod === 'google' 
                ? 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' 
                : `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`,
            theme: systemDark ? 'dark' : 'light',
            xp: parseInt(localStorage.getItem('pyflow-xp') || '0'),
            country: detectedLocation || 'Unknown',
            joinedDate: new Date().getFullYear().toString()
        };
        
        setLoading(false);
        onLogin(mockUser, loginMethod);
    };

    const languages: Language[] = [
        'English', 'Chinese (Simplified)', 'Malay', 'Japanese', 'Korean', 
        'Indonesian', 'Thai', 'Vietnamese', 'Myanmar', 'Arabic'
    ];

    return (
        <div className={`min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center items-center p-4 transition-colors duration-300 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
            
            {/* Google One Tap Simulation Popup */}
            {showOneTap && method === 'options' && (
                <div className="fixed top-4 right-4 md:top-6 md:right-6 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-0 w-80 animate-fade-in-down z-50 overflow-hidden font-sans transition-colors">
                    <div className="bg-blue-600 h-1.5 w-full"></div>
                    <div className="p-4 relative">
                        <button onClick={() => setShowOneTap(false)} className="absolute top-2 right-2 text-slate-300 hover:text-slate-500 dark:hover:text-slate-400">
                            <X className="w-4 h-4" />
                        </button>
                        <div className="flex items-center space-x-3 rtl:space-x-reverse mb-3">
                            <div className="w-10 h-10 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-600">
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Sign in with Google</p>
                                <p className="text-sm font-bold text-slate-800 dark:text-white">PyFlow</p>
                            </div>
                        </div>
                        <div className="border-t border-slate-100 dark:border-slate-700 pt-3">
                            <button onClick={() => handleMethodSelect('google')} className="w-full flex items-center p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors text-left group">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="w-8 h-8 rounded-full bg-slate-200 mr-3 rtl:ml-3 rtl:mr-0" alt="Avatar" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-700 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">Google User</p>
                                    <p className="text-xs text-slate-400 truncate">user@gmail.com</p>
                                </div>
                                <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    Continue
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Language Picker */}
            <div className="absolute top-4 right-4 flex items-center bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
                <Globe className="w-4 h-4 text-slate-400 mr-2 rtl:ml-2 rtl:mr-0" />
                <select 
                    value={currentLang}
                    onChange={handleLangChange}
                    className="bg-transparent text-sm text-slate-600 dark:text-slate-300 outline-none cursor-pointer dark:bg-slate-800"
                >
                    {languages.map(lang => (
                        <option key={lang} value={lang} className="dark:bg-slate-800 dark:text-white">{lang}</option>
                    ))}
                </select>
            </div>

            <div className="mb-8 text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/30 transform rotate-3">
                    <Terminal className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-2 transition-colors">{t.title}</h1>
                <p className="text-slate-500 dark:text-slate-400 transition-colors">{t.subtitle}</p>
            </div>

            <div className="bg-white dark:bg-slate-800 w-full max-w-md p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 transition-all duration-300">
                
                {/* View 0: Saved Accounts */}
                {method === 'saved_accounts' && (
                    <div className="animate-fade-in">
                         <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 text-center">
                            {t.welcomeBack}
                        </h2>
                        <p className="text-center text-slate-500 dark:text-slate-400 mb-6 text-sm">{t.chooseAccount}</p>
                        
                        <div className="space-y-3 mb-6">
                            {savedAccounts.map((account) => (
                                <div 
                                    key={account.email}
                                    onClick={() => handleSavedAccountClick(account)}
                                    className="flex items-center p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-all group relative"
                                >
                                    <img src={account.avatar} alt="Avatar" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 mr-3 rtl:ml-3 rtl:mr-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-slate-800 dark:text-white text-sm truncate">{account.name}</p>
                                        <p className="text-xs text-slate-400 truncate">{account.email}</p>
                                    </div>
                                    <div className="mr-2 rtl:ml-2 rtl:mr-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ArrowRight className="w-5 h-5 text-blue-500 rtl:rotate-180" />
                                    </div>
                                    <button 
                                        onClick={(e) => removeSavedAccount(e, account.email)}
                                        className="absolute top-[-5px] right-[-5px] bg-white dark:bg-slate-700 rounded-full p-1 shadow border border-slate-100 dark:border-slate-600 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                        title="Remove account"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button 
                            onClick={() => setMethod('options')}
                            className="w-full py-3 px-4 border border-dashed border-slate-300 dark:border-slate-600 rounded-xl flex items-center justify-center space-x-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all font-medium rtl:space-x-reverse"
                        >
                            <Plus className="w-4 h-4" />
                            <span>{t.useAnother}</span>
                        </button>
                    </div>
                )}

                {/* View 1: Options */}
                {method === 'options' && (
                    <div className="animate-fade-in">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 text-center">
                            {isSignUp ? t.signUp : t.getStarted}
                        </h2>
                        
                        <div className="space-y-4">
                            <button 
                                onClick={() => handleMethodSelect('google')}
                                className="w-full py-3 px-4 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl flex items-center justify-center space-x-3 hover:bg-slate-50 dark:hover:bg-slate-600 transition-all font-medium text-slate-700 dark:text-slate-200 rtl:space-x-reverse relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/30 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                                <div className="relative flex items-center space-x-3 rtl:space-x-reverse">
                                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                                    <span>{t.google}</span>
                                </div>
                            </button>
                            
                            <button 
                                onClick={() => handleMethodSelect('email')}
                                className="w-full py-3 px-4 bg-slate-800 dark:bg-black text-white rounded-xl flex items-center justify-center space-x-3 hover:bg-slate-900 dark:hover:bg-slate-900 transition-all font-medium shadow-lg shadow-slate-200 dark:shadow-none rtl:space-x-reverse border dark:border-slate-700"
                            >
                                <Mail className="w-5 h-5" />
                                <span>{t.email}</span>
                            </button>

                            <button 
                                onClick={() => handleMethodSelect('phone')}
                                className="w-full py-3 px-4 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl flex items-center justify-center space-x-3 hover:bg-slate-50 dark:hover:bg-slate-600 transition-all font-medium text-slate-700 dark:text-slate-200 rtl:space-x-reverse"
                            >
                                <Phone className="w-5 h-5" />
                                <span>{t.phone}</span>
                            </button>
                        </div>
                        
                        <div className="mt-6 text-center">
                            <button onClick={() => setIsSignUp(!isSignUp)} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                {isSignUp ? t.hasAccount : t.noAccount}
                            </button>
                        </div>

                         {/* Back to Saved Accounts link if they exist */}
                         {savedAccounts.length > 0 && (
                             <div className="mt-4 text-center pt-4 border-t border-slate-100 dark:border-slate-700">
                                 <button onClick={() => setMethod('saved_accounts')} className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                     ← {t.chooseAccount}
                                 </button>
                             </div>
                         )}
                    </div>
                )}

                {/* View 2: Input Credentials */}
                {method !== 'options' && method !== 'saved_accounts' && (
                    <div className="animate-fade-in space-y-6">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white text-center">
                            {isSignUp ? t.signUp : (method === 'email' ? t.emailLogin : t.phoneLogin)}
                        </h2>

                        {/* Sign Up Name Field */}
                        {isSignUp && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    {t.nameLabel}
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 rtl:right-3 rtl:left-auto" />
                                    <input 
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder={translations['English'].auth.placeholderName} // Fallback placeholder
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all rtl:pr-10 rtl:pl-4"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Email or Phone Input */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                {method === 'email' ? t.emailLabel : t.phoneLabel}
                            </label>
                            
                            {method === 'email' ? (
                                <input 
                                    type="email"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder={t.placeholderEmail}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    autoFocus
                                />
                            ) : (
                                <div className="flex gap-2">
                                    <div className="relative w-28 flex-shrink-0">
                                        <select 
                                            value={countryCode.code}
                                            onChange={(e) => setCountryCode(COUNTRY_CODES.find(c => c.code === e.target.value) || COUNTRY_CODES[0])}
                                            className="w-full h-full px-2 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white appearance-none focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                        >
                                            {COUNTRY_CODES.map(c => (
                                                <option key={c.code} value={c.code} className="dark:bg-slate-800">{c.flag} {c.code}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                    </div>
                                    <input 
                                        type="tel"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder={t.placeholderPhone}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        autoFocus
                                    />
                                </div>
                            )}
                        </div>

                        {/* Agreement Checkbox for Sign Up */}
                        {isSignUp && (
                            <button 
                                onClick={() => setAgreedToTerms(!agreedToTerms)}
                                className="flex items-start text-left w-full p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group"
                            >
                                {agreedToTerms ? (
                                    <CheckSquare className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-0.5 rtl:ml-3 rtl:mr-0" />
                                ) : (
                                    <Square className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0 mt-0.5 group-hover:text-blue-500 dark:group-hover:text-blue-400 rtl:ml-3 rtl:mr-0" />
                                )}
                                <span className={`text-xs ${agreedToTerms ? 'text-slate-700 dark:text-slate-200 font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
                                    {t.agreeLabel || "I agree to the Terms of Service and allow data usage to improve the app."}
                                </span>
                            </button>
                        )}
                        
                        <button 
                            onClick={handleAuthSubmit}
                            disabled={!inputValue || loading || (isSignUp && !agreedToTerms)}
                            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 disabled:opacity-50 disabled:bg-slate-400 dark:disabled:bg-slate-700 transition-all flex justify-center items-center rtl:flex-row-reverse"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>{isSignUp ? t.signUp : t.signIn} <ArrowRight className="w-5 h-5 ml-2 rtl:ml-0 rtl:mr-2 rtl:rotate-180" /></>
                            )}
                        </button>

                        <button 
                            onClick={() => setMethod('options')}
                            className="w-full text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                        >
                            {t.back}
                        </button>
                    </div>
                )}
                
                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 text-center text-xs text-slate-400 dark:text-slate-500">
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