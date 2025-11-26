
import React, { useState, useEffect } from 'react';
import { StudyGroup, GroupMember, Language, ClassroomMode } from '../types';
import { translations } from '../translations';
import { MessageCircle, Mic, Timer, ArrowLeft, Send, Users, MoreHorizontal, UserPlus, Bell, X, Trophy, MapPin, Star, Languages } from 'lucide-react';

interface ClassroomProps {
    group: StudyGroup;
    language: Language;
    onExit: () => void;
}

const Classroom: React.FC<ClassroomProps> = ({ group, language, onExit }) => {
    // See comment in ProfileSettings re: language access
    const userSettings = JSON.parse(localStorage.getItem('pyflow-user') || '{}');
    const autoTranslate = userSettings.autoTranslate || false;

    const t = translations[language].community.classroom;
    const [mode, setMode] = useState<ClassroomMode>('CONVERSATION');
    const [messageInput, setMessageInput] = useState('');
    
    // Message structure updated for translation simulation
    const [messages, setMessages] = useState<{user: string, text: string, originalText?: string, isTranslated?: boolean}[]>([
        { user: 'System', text: `Welcome to ${group.name}!` },
        { user: 'Chen', text: '你好！很高兴见到大家。', originalText: '你好！很高兴见到大家。', isTranslated: false },
        { user: 'Ravi', text: 'Hello everyone! Ready to code?', isTranslated: false }
    ]);
    
    const [focusTime, setFocusTime] = useState(25 * 60);
    const [isFocusing, setIsFocusing] = useState(false);
    const [selectedMember, setSelectedMember] = useState<GroupMember | null>(null);
    const [notification, setNotification] = useState<string | null>(null);

    // Mock Active Members
    const members: GroupMember[] = group.activeMembers || [
        { id: '1', name: 'You', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', country: 'Japan', xp: 2400, level: 'Apprentice', isOnline: true, status: isFocusing ? 'FOCUSING' : 'IDLE', isFriend: false },
        { id: '2', name: 'Anna', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna', country: 'USA', xp: 1200, level: 'Novice', isOnline: true, status: 'IDLE', isFriend: false },
        { id: '3', name: 'Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chen', country: 'China', xp: 5400, level: 'Grandmaster', isOnline: true, status: 'TYPING', isFriend: true },
        { id: '4', name: 'Ravi', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ravi', country: 'India', xp: 3100, level: 'Apprentice', isOnline: true, status: 'SPEAKING', isFriend: false },
        { id: '5', name: 'Sarah', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', country: 'UK', xp: 800, level: 'Novice', isOnline: false, status: 'IDLE', isFriend: false },
    ];

    // Apply auto-translate on mount or new messages if enabled
    useEffect(() => {
        if (autoTranslate) {
            setMessages(prev => prev.map(msg => {
                if (msg.user !== 'You' && msg.user !== 'System' && !msg.isTranslated && msg.originalText) {
                    return {
                        ...msg,
                        text: mockTranslate(msg.originalText),
                        isTranslated: true
                    }
                }
                return msg;
            }));
        }
    }, [autoTranslate]);

    // Timer Logic
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isFocusing && focusTime > 0) {
            interval = setInterval(() => setFocusTime(prev => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [isFocusing, focusTime]);

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec < 10 ? '0' : ''}${sec}`;
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageInput.trim()) return;
        setMessages([...messages, { user: 'You', text: messageInput }]);
        setMessageInput('');
    };

    const handleAction = (action: 'FRIEND' | 'REMINDER') => {
        if (action === 'FRIEND') setNotification(t.friendAdded);
        if (action === 'REMINDER') setNotification(t.reminderSet);
        setSelectedMember(null);
        setTimeout(() => setNotification(null), 3000);
    };

    // Mock translation function since we don't have real-time API here
    const mockTranslate = (text: string) => {
        if (text.includes('你好')) return "Hello! Nice to meet everyone. (Translated)";
        return text + " (Translated)";
    };

    const toggleTranslate = (index: number) => {
        setMessages(prev => prev.map((msg, i) => {
            if (i === index) {
                if (msg.isTranslated) {
                    // Revert
                    return { ...msg, text: msg.originalText || msg.text, isTranslated: false };
                } else {
                    // Translate
                    return { 
                        ...msg, 
                        originalText: msg.text, 
                        text: mockTranslate(msg.text), 
                        isTranslated: true 
                    };
                }
            }
            return msg;
        }));
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] bg-slate-100 dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 relative">
            
            {/* Notification Toast */}
            {notification && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-2 rounded-full shadow-lg z-50 animate-fade-in-down font-bold">
                    {notification}
                </div>
            )}

            {/* Header */}
            <div className="bg-white dark:bg-slate-800 p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <button onClick={onExit} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                    </button>
                    <div>
                        <h2 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            {group.name}
                            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded-full">{group.activeMembers?.length || members.length} Online</span>
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {group.country || 'Global'}
                        </p>
                    </div>
                </div>
                
                {/* Mode Switcher */}
                <div className="flex bg-slate-100 dark:bg-slate-700 rounded-xl p-1">
                    <button onClick={() => setMode('CONVERSATION')} className={`p-2 rounded-lg transition-all ${mode === 'CONVERSATION' ? 'bg-white dark:bg-slate-600 text-blue-500 shadow-sm' : 'text-slate-400'}`} title={t.conversation}>
                        <MessageCircle className="w-5 h-5" />
                    </button>
                    <button onClick={() => setMode('VOICE')} className={`p-2 rounded-lg transition-all ${mode === 'VOICE' ? 'bg-white dark:bg-slate-600 text-green-500 shadow-sm' : 'text-slate-400'}`} title={t.voice}>
                        <Mic className="w-5 h-5" />
                    </button>
                    <button onClick={() => setMode('FOCUS')} className={`p-2 rounded-lg transition-all ${mode === 'FOCUS' ? 'bg-white dark:bg-slate-600 text-purple-500 shadow-sm' : 'text-slate-400'}`} title={t.focus}>
                        <Timer className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden relative">
                
                {/* Classroom Visual Area (Desks) */}
                <div className="flex-1 bg-slate-200 dark:bg-slate-900/50 p-6 overflow-y-auto relative">
                     {/* Background Pattern */}
                     <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 relative z-10">
                        {members.map(member => (
                            <div key={member.id} className="flex flex-col items-center group relative">
                                {/* Avatar Container */}
                                <button 
                                    onClick={() => setSelectedMember(member)}
                                    className={`relative w-20 h-20 rounded-full border-4 transition-transform transform hover:scale-105 ${
                                        member.status === 'SPEAKING' ? 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]' :
                                        member.status === 'FOCUSING' ? 'border-purple-500 opacity-80' :
                                        'border-white dark:border-slate-700 shadow-md'
                                    }`}
                                >
                                    <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full bg-slate-100" />
                                    {/* Status Badge */}
                                    <div className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-800 p-1 rounded-full shadow-sm">
                                        {member.status === 'SPEAKING' && <Mic className="w-3 h-3 text-green-500" />}
                                        {member.status === 'FOCUSING' && <Timer className="w-3 h-3 text-purple-500" />}
                                        {member.status === 'TYPING' && <MessageCircle className="w-3 h-3 text-blue-500 animate-pulse" />}
                                    </div>
                                </button>
                                
                                {/* Name Plate */}
                                <div className="mt-3 bg-white dark:bg-slate-800 px-3 py-1 rounded-lg shadow-sm text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1 border border-slate-200 dark:border-slate-700">
                                    {member.name}
                                    {member.id === '1' && <span className="text-[10px] text-blue-500">(You)</span>}
                                </div>
                            </div>
                        ))}
                     </div>
                </div>

                {/* Right Panel (Contextual based on Mode) */}
                <div className="w-80 bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 flex flex-col">
                    
                    {/* Mode: Conversation */}
                    {mode === 'CONVERSATION' && (
                        <>
                            <div className="p-4 border-b border-slate-100 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300">
                                {t.conversation}
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`flex flex-col ${msg.user === 'You' ? 'items-end' : 'items-start'}`}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs text-slate-400">{msg.user}</span>
                                            {msg.user !== 'You' && msg.user !== 'System' && (
                                                <button onClick={() => toggleTranslate(idx)} className="text-[10px] text-blue-500 hover:underline flex items-center">
                                                    <Languages className="w-3 h-3 mr-1" />
                                                    {msg.isTranslated ? t.original : t.translate}
                                                </button>
                                            )}
                                        </div>
                                        <div className={`px-3 py-2 rounded-xl text-sm max-w-[80%] ${
                                            msg.user === 'You' 
                                            ? 'bg-blue-600 text-white rounded-tr-none' 
                                            : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-tl-none'
                                        }`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 dark:border-slate-700 flex gap-2">
                                <input 
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    placeholder={t.typing}
                                    className="flex-1 bg-slate-50 dark:bg-slate-900 border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 dark:text-white"
                                />
                                <button type="submit" className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </>
                    )}

                    {/* Mode: Focus */}
                    {mode === 'FOCUS' && (
                        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                            <div className="w-32 h-32 rounded-full border-4 border-purple-500 flex items-center justify-center mb-6 relative">
                                <span className="text-3xl font-mono font-bold text-slate-800 dark:text-white">{formatTime(focusTime)}</span>
                                {isFocusing && <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-ping"></span>}
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{t.focus}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Notifications muted. Status set to "Focusing".</p>
                            
                            <button 
                                onClick={() => setIsFocusing(!isFocusing)}
                                className={`w-full py-3 rounded-xl font-bold transition-all ${
                                    isFocusing 
                                    ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' 
                                    : 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-500/30'
                                }`}
                            >
                                {isFocusing ? t.stopFocus : t.startFocus}
                            </button>
                        </div>
                    )}

                    {/* Mode: Voice */}
                    {mode === 'VOICE' && (
                        <div className="flex-1 flex flex-col p-6">
                            <div className="flex items-center justify-center mb-8">
                                <div className="flex gap-1 items-end h-12">
                                    <div className="w-2 bg-green-500 rounded-full animate-[bounce_1s_infinite] h-8"></div>
                                    <div className="w-2 bg-green-500 rounded-full animate-[bounce_1.2s_infinite] h-12"></div>
                                    <div className="w-2 bg-green-500 rounded-full animate-[bounce_0.8s_infinite] h-6"></div>
                                    <div className="w-2 bg-green-500 rounded-full animate-[bounce_1.1s_infinite] h-10"></div>
                                </div>
                            </div>
                            <h3 className="text-center font-bold text-slate-800 dark:text-white mb-6">Voice Channel Active</h3>
                            <div className="space-y-3">
                                {members.filter(m => m.status === 'SPEAKING' || m.isOnline).map(m => (
                                    <div key={m.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <img src={m.avatar} className="w-8 h-8 rounded-full" />
                                            <span className="text-sm font-medium dark:text-white">{m.name}</span>
                                        </div>
                                        {m.status === 'SPEAKING' && <Mic className="w-4 h-4 text-green-500" />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Member Card Modal */}
            {selectedMember && (
                <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedMember(null)}>
                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-6 w-full max-w-sm relative animate-scale-in" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setSelectedMember(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                            <X className="w-5 h-5" />
                        </button>
                        
                        <div className="text-center mb-6">
                            <img src={selectedMember.avatar} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-slate-100 dark:border-slate-700 bg-slate-50" />
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center justify-center gap-2">
                                {selectedMember.name}
                                <span className="text-lg">{selectedMember.country === 'Japan' ? '🇯🇵' : selectedMember.country === 'USA' ? '🇺🇸' : selectedMember.country === 'China' ? '🇨🇳' : '🏳️'}</span>
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">{selectedMember.level}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl text-center">
                                <div className="text-xs text-slate-400 uppercase font-bold">{t.rank}</div>
                                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">#12</div>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl text-center">
                                <div className="text-xs text-slate-400 uppercase font-bold">{t.xp}</div>
                                <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{selectedMember.xp}</div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {selectedMember.id !== '1' && (
                                <>
                                    <button 
                                        onClick={() => handleAction('FRIEND')}
                                        disabled={selectedMember.isFriend}
                                        className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                                            selectedMember.isFriend 
                                            ? 'bg-green-100 text-green-700 cursor-default' 
                                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                                        }`}
                                    >
                                        <UserPlus className="w-5 h-5" /> {selectedMember.isFriend ? 'Friend' : t.addFriend}
                                    </button>
                                    <button 
                                        onClick={() => handleAction('REMINDER')}
                                        className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                                    >
                                        <Bell className="w-5 h-5" /> {t.reminder}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Classroom;
