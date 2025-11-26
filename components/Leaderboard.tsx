
import React, { useState } from 'react';
import { LeaderboardEntry, UserProfile, Language } from '../types';
import { translations } from '../translations';
import { Trophy, Medal, Crown, Globe, MapPin } from 'lucide-react';

interface LeaderboardProps {
    currentUser: UserProfile;
}

type Region = 'Global' | 'Asia' | 'Europe' | 'Americas' | 'Local';

interface ExtendedLeaderboardEntry extends LeaderboardEntry {
    region: Region;
    country: string;
    flag: string;
}

const MOCK_LEADERBOARD: ExtendedLeaderboardEntry[] = [
    { id: '1', name: 'PythonMaster99', xp: 2450, rank: 1, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', region: 'Asia', country: 'Japan', flag: '🇯🇵' },
    { id: '2', name: 'CodeNinja', xp: 2100, rank: 2, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka', region: 'Americas', country: 'USA', flag: '🇺🇸' },
    { id: '3', name: 'DevSarah', xp: 1950, rank: 3, avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Coder', region: 'Europe', country: 'UK', flag: '🇬🇧' },
    { id: '4', name: 'AlgoRhythm', xp: 1600, rank: 4, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Robot', region: 'Asia', country: 'India', flag: '🇮🇳' },
    { id: '5', name: 'PySnake', xp: 1200, rank: 5, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob', region: 'Europe', country: 'Germany', flag: '🇩🇪' },
    { id: '6', name: 'ByteMe', xp: 950, rank: 6, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Calvin', region: 'Asia', country: 'Singapore', flag: '🇸🇬' },
    { id: '7', name: 'RaraTech', xp: 850, rank: 7, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rara', region: 'Asia', country: 'Malaysia', flag: '🇲🇾' },
    { id: '8', name: 'VinaCode', xp: 800, rank: 8, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vina', region: 'Asia', country: 'Vietnam', flag: '🇻🇳' },
];

const Leaderboard: React.FC<LeaderboardProps> = ({ currentUser }) => {
    const currentLang = (localStorage.getItem('pyflow-lang') as Language) || 'English';
    const t = translations[currentLang]?.leaderboard || translations['English'].leaderboard;
    const [filter, setFilter] = useState<Region>('Global');

    // Inject current user into ranking
    const userEntry: ExtendedLeaderboardEntry = {
        id: 'user-current',
        name: currentUser.name,
        xp: currentUser.xp,
        rank: 99, 
        avatar: currentUser.avatar,
        region: 'Asia', // Default fallback if detection fails
        country: currentUser.country || 'Unknown',
        flag: '🏳️'
    };

    // Filter Logic
    let displayList = MOCK_LEADERBOARD;
    
    if (filter === 'Local') {
        // Filter by user's specific country
        displayList = MOCK_LEADERBOARD.filter(e => e.country === userEntry.country);
    } else if (filter !== 'Global') {
        // Filter by broad region
        displayList = MOCK_LEADERBOARD.filter(e => e.region === filter);
    }

    // Sort by XP
    displayList = [...displayList].sort((a, b) => b.xp - a.xp);
    
    // Re-calculate ranks for display
    displayList = displayList.map((item, index) => ({...item, rank: index + 1}));

    const getRankIcon = (rank: number) => {
        switch(rank) {
            case 1: return <Crown className="w-6 h-6 text-yellow-500 fill-yellow-500" />;
            case 2: return <Medal className="w-6 h-6 text-slate-400 fill-slate-400" />;
            case 3: return <Medal className="w-6 h-6 text-amber-700 fill-amber-700" />;
            default: return <span className="font-bold text-slate-500 dark:text-slate-400 w-6 text-center">{rank}</span>;
        }
    };

    const tabs: Region[] = ['Global', 'Asia', 'Europe', 'Americas', 'Local'];

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white">{t.title}</h2>
                <p className="text-slate-500 dark:text-slate-400">{t.desc}</p>
            </div>

            {/* Region Filter Tabs */}
            <div className="flex justify-center flex-wrap gap-2">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center ${
                            filter === tab 
                            ? 'bg-blue-600 text-white shadow-md transform scale-105' 
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                    >
                        {tab === 'Global' ? <Globe className="w-4 h-4 mr-2" /> : <MapPin className="w-3 h-3 mr-2" />}
                        {tab === 'Local' ? (userEntry.country || 'Local') : tab}
                    </button>
                ))}
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 flex justify-between items-center text-white">
                     <div className="flex items-center">
                        <Trophy className="w-8 h-8 mr-3 rtl:ml-3 rtl:mr-0 text-yellow-300" />
                        <div>
                            <div className="font-bold text-lg">{t.yourRank} ({filter})</div>
                            <div className="text-purple-200 text-sm">Top 20% of learners</div>
                        </div>
                     </div>
                     <div className="text-right rtl:text-left">
                         <div className="text-3xl font-bold">#{displayList.length > 0 ? 99 : '-'}</div>
                         <div className="text-sm opacity-80">{userEntry.xp} XP</div>
                     </div>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                    {displayList.length === 0 ? (
                        <div className="p-12 text-center text-slate-500 dark:text-slate-400">
                            No active learners in this region yet. Be the first!
                        </div>
                    ) : (
                        displayList.map((entry) => (
                            <div key={entry.id} className="p-4 flex items-center hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                                <div className="w-12 flex justify-center mr-4 rtl:ml-4 rtl:mr-0">
                                    {getRankIcon(entry.rank)}
                                </div>
                                <div className="relative">
                                    <img src={entry.avatar} className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 dark:border-slate-600 mr-4 rtl:ml-4 rtl:mr-0" />
                                    <span className="absolute -bottom-1 right-2 text-xs" title={entry.country}>{entry.flag}</span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                        {entry.name}
                                    </h4>
                                    <span className="text-xs text-slate-400">Level {Math.floor(entry.xp / 100) + 1} • {entry.country}</span>
                                </div>
                                <div className="font-mono font-bold text-blue-600 dark:text-blue-400">
                                    {entry.xp} XP
                                </div>
                            </div>
                        ))
                    )}

                    {/* Sticky Current User Row */}
                    <div className="p-4 flex items-center bg-blue-50 dark:bg-blue-900/20 border-t border-slate-200 dark:border-slate-700">
                         <div className="w-12 flex justify-center mr-4 rtl:ml-4 rtl:mr-0">
                             <span className="font-bold text-slate-500 dark:text-slate-400 w-6 text-center">99</span>
                         </div>
                         <div className="relative">
                             <img src={userEntry.avatar} className="w-10 h-10 rounded-full bg-slate-100 border border-blue-200 dark:border-blue-500 mr-4 rtl:ml-4 rtl:mr-0" />
                             <span className="absolute -bottom-1 right-2 text-xs">{userEntry.flag}</span>
                         </div>
                         <div className="flex-1">
                             <h4 className="font-bold text-slate-800 dark:text-white flex items-center">
                                {userEntry.name} <span className="ml-2 rtl:mr-2 rtl:ml-0 text-[10px] bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-200 px-1.5 py-0.5 rounded">YOU</span>
                             </h4>
                             <span className="text-xs text-slate-400">Level {Math.floor(userEntry.xp / 100) + 1} • {userEntry.country}</span>
                         </div>
                         <div className="font-mono font-bold text-blue-600 dark:text-blue-400">
                             {userEntry.xp} XP
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
