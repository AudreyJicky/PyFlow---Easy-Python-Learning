
import React, { useState } from 'react';
import { UserProfile, Gender, ThemeMode, Language } from '../types';
import { translations } from '../translations';
import { Save, User, Mail, Calendar, Heart, Camera, Check, MapPin, Globe, Bell, MessageSquare, Link as LinkIcon, Copy, Moon, Sun, Monitor, Languages, MessageSquarePlus, LogOut, Gift, Share2 } from 'lucide-react';

interface ProfileSettingsProps {
    user: UserProfile;
    onUpdateUser: (updatedUser: UserProfile) => void;
    language: Language;
    onLanguageChange: (lang: Language) => void;
    onThemeChange: (mode: ThemeMode) => void;
    // New props for moved actions
    onFeedback: () => void;
    onLogout: () => void;
    onReferral: () => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, onUpdateUser, language, onLanguageChange, onThemeChange, onFeedback, onLogout, onReferral }) => {
    const t = translations[language]?.profile || translations['English'].profile;
    const navT = translations[language]?.nav || translations['English'].nav;

    const [name, setName] = useState(user.name);
    const [bio, setBio] = useState(user.bio || '');
    const [birthday, setBirthday] = useState(user.birthday || '');
    const [gender, setGender] = useState<Gender>(user.gender || 'Prefer not to say');
    const [autoTranslate, setAutoTranslate] = useState(user.autoTranslate || false);
    const [studyReminder, setStudyReminder] = useState(user.studyReminder || '');
    
    // Local theme state for deferred saving
    const [selectedTheme, setSelectedTheme] = useState<ThemeMode>(user.theme);
    
    const [saved, setSaved] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);
    const [refLinkCopied, setRefLinkCopied] = useState(false);

    const languages: Language[] = [
        'English', 'Chinese (Simplified)', 'Malay', 'Japanese', 'Korean', 
        'Indonesian', 'Thai', 'Vietnamese', 'Myanmar', 'Arabic'
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Update user object with all fields including the selected theme
        onUpdateUser({
            ...user,
            name,
            bio,
            birthday,
            gender,
            autoTranslate,
            studyReminder,
            theme: selectedTheme // Apply theme only on save
        });
        
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    // Instant Save Handler for Toggles/Selects
    const handleInstantSave = (key: keyof UserProfile, value: any) => {
        const updatedUser = { ...user, [key]: value };
        // Update local state to reflect change immediately in UI
        if (key === 'autoTranslate') setAutoTranslate(value);
        if (key === 'studyReminder') setStudyReminder(value);
        
        // Persist
        onUpdateUser(updatedUser);
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
    };

    const handleCopyReferral = () => {
        const refLink = `${window.location.href}?ref=${user.name.replace(/\s+/g, '').toLowerCase()}`;
        navigator.clipboard.writeText(refLink);
        setRefLinkCopied(true);
        onReferral(); // Trigger XP gain logic
        setTimeout(() => setRefLinkCopied(false), 2000);
    }

    return (
        <div className="max-w-2xl mx-auto pb-10">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">{t.title}</h2>
            
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                {/* Header / Banner */}
                <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 relative"></div>
                
                <div className="px-8 pb-8">
                    {/* Avatar Section */}
                    <div className="relative -mt-12 mb-6 flex justify-between items-end">
                        <div className="relative">
                            <img src={user.avatar} alt="Profile" className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 bg-slate-100" />
                            <div className="absolute bottom-0 right-0 rtl:left-0 rtl:right-auto bg-blue-500 p-1.5 rounded-full border-2 border-white dark:border-slate-800 text-white cursor-pointer hover:bg-blue-600 transition-colors">
                                <Camera className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-right rtl:text-left">
                            {user.country && (
                                <div className="text-xs text-blue-200 bg-blue-600/90 px-2 py-1 rounded inline-flex items-center mb-1 shadow-sm">
                                    <MapPin className="w-3 h-3 mr-1" /> {user.country}
                                </div>
                            )}
                            <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">{t.memberSince}</div>
                            <div className="text-sm font-medium text-slate-800 dark:text-white">{user.joinedDate || new Date().getFullYear()}</div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* App Preferences Section */}
                        <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-5 border border-slate-100 dark:border-slate-700 space-y-5">
                            <h3 className="font-bold text-slate-800 dark:text-white text-sm uppercase tracking-wider flex items-center">
                                <Monitor className="w-4 h-4 mr-2" /> {t.appPrefs || 'App Preferences'}
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Language Selector */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center">
                                        <Languages className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" /> {navT.nativeLang}
                                    </label>
                                    <select 
                                        value={language}
                                        onChange={(e) => onLanguageChange(e.target.value as Language)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                                    >
                                        {languages.map(lang => (
                                            <option key={lang} value={lang}>{lang}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Theme Selector (Local State) */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center">
                                        {selectedTheme === 'light' ? <Sun className="w-4 h-4 mr-2" /> : selectedTheme === 'dark' ? <Moon className="w-4 h-4 mr-2" /> : <Monitor className="w-4 h-4 mr-2" />} 
                                        {navT.theme}
                                    </label>
                                    <div className="flex bg-white dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-600 p-1">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedTheme('light')}
                                            className={`flex-1 flex items-center justify-center py-1.5 rounded-lg text-xs font-medium transition-all ${
                                                selectedTheme === 'light' 
                                                ? 'bg-blue-100 text-blue-700 shadow-sm' 
                                                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'
                                            }`}
                                        >
                                            <Sun className="w-3 h-3 mr-1" /> Light
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedTheme('dark')}
                                            className={`flex-1 flex items-center justify-center py-1.5 rounded-lg text-xs font-medium transition-all ${
                                                selectedTheme === 'dark' 
                                                ? 'bg-slate-700 text-white shadow-sm' 
                                                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'
                                            }`}
                                        >
                                            <Moon className="w-3 h-3 mr-1" /> Dark
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedTheme('auto')}
                                            className={`flex-1 flex items-center justify-center py-1.5 rounded-lg text-xs font-medium transition-all ${
                                                selectedTheme === 'auto' 
                                                ? 'bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm' 
                                                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'
                                            }`}
                                        >
                                            <Monitor className="w-3 h-3 mr-1" /> {t.system || 'Auto'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-slate-100 dark:border-slate-700 pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center">
                                    <User className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" /> {t.fullName}
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center">
                                    <Mail className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" /> {t.email}
                                </label>
                                <input
                                    type="email"
                                    value={user.email}
                                    disabled
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-500 cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center">
                                    <Calendar className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" /> {t.birthday}
                                </label>
                                <input
                                    type="date"
                                    value={birthday}
                                    onChange={(e) => setBirthday(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    {t.gender}
                                </label>
                                <select
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value as Gender)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="Male">{t.genderOpts?.male || 'Male'}</option>
                                    <option value="Female">{t.genderOpts?.female || 'Female'}</option>
                                    <option value="Other">{t.genderOpts?.other || 'Other'}</option>
                                    <option value="Prefer not to say">{t.genderOpts?.prefer || 'Prefer not to say'}</option>
                                </select>
                            </div>

                             {/* Location Field */}
                             <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center">
                                    <Globe className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" /> {t.locationDetect || 'Location (Detected via Network IP)'}
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={user.country || 'Detecting...'}
                                        disabled
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 cursor-not-allowed"
                                    />
                                    {user.country && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 rtl:right-auto rtl:left-3">
                                            <Check className="w-4 h-4" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Referral Link Generator */}
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-5 text-white shadow-lg">
                             <h3 className="font-bold text-lg mb-1 flex items-center">
                                <Gift className="w-5 h-5 mr-2" /> {t.referral}
                             </h3>
                             <p className="text-purple-100 text-sm mb-4">{t.referralDesc}</p>
                             
                             <div className="flex gap-2">
                                 <div className="flex-1 bg-white/20 backdrop-blur px-4 py-3 rounded-xl border border-white/30 text-sm font-mono text-white truncate">
                                     {`${window.location.origin}?ref=${user.name.replace(/\s+/g, '').toLowerCase()}`}
                                 </div>
                                 <button 
                                    type="button"
                                    onClick={handleCopyReferral}
                                    className="bg-white text-purple-600 px-4 py-2 rounded-xl font-bold transition-all hover:bg-purple-50 flex items-center whitespace-nowrap"
                                 >
                                     {refLinkCopied ? <Check className="w-4 h-4 mr-1" /> : <Share2 className="w-4 h-4 mr-1" />}
                                     {refLinkCopied ? t.linkCopied : t.copyReferral}
                                 </button>
                             </div>
                        </div>

                        {/* Web Access Link */}
                         <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-5 text-white shadow-lg">
                             <h3 className="font-bold text-lg mb-1 flex items-center">
                                <Monitor className="w-5 h-5 mr-2" /> {t.webLink}
                             </h3>
                             <p className="text-blue-100 text-sm mb-4">Use this link to access your account on a computer.</p>
                             
                             <div className="flex gap-2">
                                 <div className="flex-1 bg-white/20 backdrop-blur px-4 py-3 rounded-xl border border-white/30 text-sm font-mono text-white truncate">
                                     {window.location.href}
                                 </div>
                                 <button 
                                    type="button"
                                    onClick={handleCopyLink}
                                    className="bg-white text-blue-600 px-4 py-2 rounded-xl font-bold transition-all hover:bg-blue-50 flex items-center whitespace-nowrap"
                                 >
                                     {linkCopied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                                     {linkCopied ? t.linkCopied : t.generateLink}
                                 </button>
                             </div>
                        </div>

                        {/* Learning Preferences - Instant Save */}
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center">
                                        <Bell className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" /> {t.studyReminder}
                                    </label>
                                    <input 
                                        type="time" 
                                        value={studyReminder}
                                        onChange={(e) => handleInstantSave('studyReminder', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div className="flex items-center h-full pt-6">
                                    <div className="flex items-center w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                                         <input 
                                            type="checkbox"
                                            checked={autoTranslate}
                                            onChange={(e) => handleInstantSave('autoTranslate', e.target.checked)}
                                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                                            id="autoTranslate"
                                         />
                                         <label htmlFor="autoTranslate" className="ml-3 text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center cursor-pointer">
                                            <MessageSquare className="w-4 h-4 mr-2" /> {t.autoTranslate}
                                         </label>
                                    </div>
                                </div>
                             </div>
                        </div>

                        <div>
                             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center">
                                <Heart className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" /> {t.bio}
                            </label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder={t.bioPlaceholder}
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            />
                        </div>

                        {/* Account Actions (Feedback & Logout) */}
                        <div className="pt-6 border-t border-slate-100 dark:border-slate-700 space-y-3">
                            <h3 className="font-bold text-slate-800 dark:text-white text-sm uppercase tracking-wider flex items-center mb-4">
                                {t.actions}
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <button 
                                    type="button"
                                    onClick={onFeedback}
                                    className="flex items-center justify-center p-3 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-medium"
                                >
                                    <MessageSquarePlus className="w-4 h-4 mr-2" /> {navT.feedback}
                                </button>
                                <button 
                                    type="button"
                                    onClick={onLogout}
                                    className="flex items-center justify-center p-3 text-red-600 bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors font-medium"
                                >
                                    <LogOut className="w-4 h-4 mr-2" /> {navT.logout}
                                </button>
                            </div>
                        </div>

                        <div className="pt-4 flex items-center justify-end">
                            {saved && (
                                <span className="text-green-600 dark:text-green-400 text-sm font-medium mr-4 rtl:ml-4 rtl:mr-0 flex items-center animate-fade-in">
                                    <Check className="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0" /> {t.saved}
                                </span>
                            )}
                            <button
                                type="submit"
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center"
                            >
                                <Save className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" /> {t.save}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;
