
import React, { useState, useEffect } from 'react';
import { StudyGroup, GroupMember, Language } from '../types';
import { translations } from '../translations';
import { Users, Search, MessageCircle, Hash, Plus, X, Globe } from 'lucide-react';
import Classroom from './Classroom';

const MOCK_GROUPS: StudyGroup[] = [
    { id: '1', name: 'Python Beginners 2024', members: 1240, description: 'A safe place for absolute beginners to ask questions.', tags: ['Beginner', 'General'], isJoined: true, country: 'Global' },
    { id: '2', name: 'Data Science Squad', members: 850, description: 'Focusing on Pandas, NumPy and Matplotlib.', tags: ['Data Science', 'Intermediate'], country: 'USA' },
    { id: '3', name: 'Web Dev with Django', members: 420, description: 'Building web apps together.', tags: ['Web', 'Django'], country: 'Europe' },
    { id: '4', name: 'Daily Coding Challenge', members: 3200, description: 'One problem a day keeps the bugs away.', tags: ['Practice', 'Algorithms'], country: 'Asia' },
    { id: '5', name: 'Asian Timezone Study', members: 150, description: 'Evening study sessions for GMT+8.', tags: ['Social', 'Voice Chat'], country: 'Asia' },
];

const Community: React.FC = () => {
    // See comment in ProfileSettings re: language access
    const currentLang = (localStorage.getItem('pyflow-lang') as Language) || 'English';
    const t = translations[currentLang]?.community || translations['English'].community;

    const [activeGroup, setActiveGroup] = useState<StudyGroup | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    
    // Load groups from local storage or fall back to mock data
    const [groups, setGroups] = useState<StudyGroup[]>(() => {
        const saved = localStorage.getItem('pyflow-groups');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Failed to parse groups", e);
                return MOCK_GROUPS;
            }
        }
        return MOCK_GROUPS;
    });

    // Helper to update state and persist to localStorage
    const updateGroups = (newGroups: StudyGroup[]) => {
        setGroups(newGroups);
        localStorage.setItem('pyflow-groups', JSON.stringify(newGroups));
    };

    // Form State
    const [newName, setNewName] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [newTags, setNewTags] = useState('');
    const [newCountry, setNewCountry] = useState('Global');

    const handleCreateGroup = (e: React.FormEvent) => {
        e.preventDefault();
        const newGroup: StudyGroup = {
            id: Date.now().toString(),
            name: newName,
            description: newDesc,
            tags: newTags.split(',').map(t => t.trim()),
            country: newCountry,
            members: 1,
            isJoined: true
        };
        
        const updatedList = [newGroup, ...groups];
        updateGroups(updatedList);
        
        setShowCreateModal(false);
        setActiveGroup(newGroup); // Auto enter
        // Reset
        setNewName(''); setNewDesc(''); setNewTags('');
    };

    const handleJoinGroup = (groupId: string) => {
        const updatedGroups = groups.map(g => g.id === groupId ? { ...g, isJoined: true } : g);
        updateGroups(updatedGroups);
    };

    if (activeGroup) {
        return <Classroom group={activeGroup} language={currentLang} onExit={() => setActiveGroup(null)} />;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white">{t.title}</h2>
                    <p className="text-slate-500 dark:text-slate-400">{t.desc}</p>
                </div>
                <button 
                    onClick={() => setShowCreateModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium shadow-md flex items-center"
                >
                    <Plus className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" /> {t.create}
                </button>
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowCreateModal(false)}>
                    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setShowCreateModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">{t.createModal.title}</h3>
                        
                        <form onSubmit={handleCreateGroup} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.createModal.name}</label>
                                <input required value={newName} onChange={e => setNewName(e.target.value)} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Python Wizards" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.createModal.desc}</label>
                                <textarea required value={newDesc} onChange={e => setNewDesc(e.target.value)} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" placeholder="What's this group about?" rows={3} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.createModal.country}</label>
                                    <select value={newCountry} onChange={e => setNewCountry(e.target.value)} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white outline-none">
                                        <option value="Global">Global 🌍</option>
                                        <option value="Asia">Asia 🌏</option>
                                        <option value="Europe">Europe 🌍</option>
                                        <option value="Americas">Americas 🌎</option>
                                        <option value="Japan">Japan 🇯🇵</option>
                                        <option value="USA">USA 🇺🇸</option>
                                        <option value="China">China 🇨🇳</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t.createModal.tags}</label>
                                    <input value={newTags} onChange={e => setNewTags(e.target.value)} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" placeholder="beginner, web" />
                                </div>
                            </div>
                            <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors mt-2">
                                {t.createModal.submit}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 rtl:right-4 rtl:left-auto" />
                <input 
                    type="text" 
                    placeholder={t.search}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none shadow-sm rtl:pr-12 rtl:pl-4"
                />
            </div>

            {/* My Groups Section */}
            <div className="mb-8">
                 <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center">
                    <Users className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0 text-blue-500" /> {t.yourGroups}
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {groups.filter(g => g.isJoined).map(group => (
                        <div key={group.id} className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-5 flex justify-between items-center transition-transform hover:scale-[1.02]">
                            <div>
                                <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    {group.name}
                                    {group.country !== 'Global' && <span className="text-[10px] bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600">{group.country}</span>}
                                </h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{group.members} {t.members} • <span className="text-green-600 dark:text-green-400">12 {t.online}</span></p>
                            </div>
                            <button 
                                onClick={() => setActiveGroup(group)}
                                className="bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                            >
                                {t.openChat}
                            </button>
                        </div>
                    ))}
                 </div>
            </div>

            {/* Explore Section */}
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">{t.explore}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.filter(g => !g.isJoined).map(group => (
                    <div key={group.id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all flex flex-col h-full">
                        <div className="flex items-start justify-between mb-3">
                             <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-xl">
                                <Hash className="w-6 h-6 text-slate-500 dark:text-slate-400" />
                             </div>
                             <div className="flex flex-col items-end gap-1">
                                <span className="text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-full">
                                    {group.members} {t.members}
                                </span>
                                {group.country && <span className="text-[10px] text-slate-400 flex items-center gap-1"><Globe className="w-3 h-3"/> {group.country}</span>}
                             </div>
                        </div>
                        
                        <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{group.name}</h4>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 flex-1">
                            {group.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {group.tags.map(tag => (
                                <span key={tag} className="text-xs bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 px-2 py-1 rounded border border-slate-200 dark:border-slate-600">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <button 
                            onClick={() => handleJoinGroup(group.id)}
                            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                        >
                            {t.join}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Community;
