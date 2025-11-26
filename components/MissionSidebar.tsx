
import React, { useState } from 'react';
import { DailyMission, Language, UserProfile, MissionPeriod } from '../types';
import { translations } from '../translations';
import { Clock, CheckCircle, Trophy, Calendar, Target, Flag } from 'lucide-react';

interface MissionSidebarProps {
    user: UserProfile;
    language: Language;
    onClockIn: () => void;
    onCollectReward: (missionId: string, xpReward: number) => void;
}

const MissionSidebar: React.FC<MissionSidebarProps> = ({ user, language, onClockIn, onCollectReward }) => {
    const [activeTab, setActiveTab] = useState<MissionPeriod>('DAILY');
    const t = translations[language].dashboard; // Reusing dashboard translations for missions

    const filteredMissions = user.missions?.filter(m => m.period === activeTab) || [];
    const tabs: MissionPeriod[] = ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'];

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 w-full overflow-hidden transition-colors">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700">
                <h3 className="font-bold text-slate-800 dark:text-white mb-4 text-lg">{t.dailyActions || 'Daily Actions'}</h3>
                
                {/* Check Up Card */}
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-4 text-white shadow-lg flex flex-col items-center justify-center text-center mb-2">
                    <div className="bg-white/20 p-2 rounded-full mb-3">
                        <Clock className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold mb-1">{t.clockIn}</h3>
                    {user.isClockedIn ? (
                        <div className="bg-white/20 px-3 py-1.5 rounded-lg flex items-center text-xs font-medium animate-fade-in">
                            <CheckCircle className="w-3 h-3 mr-1.5" /> {t.comeBack}
                        </div>
                    ) : (
                        <button 
                            onClick={onClockIn}
                            className="bg-white text-indigo-600 px-4 py-1.5 rounded-full text-xs font-bold hover:scale-105 transition-transform shadow-md"
                        >
                            {t.clockIn} (+20 XP)
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center">
                        <Trophy className="w-4 h-4 text-yellow-500 mr-2 rtl:ml-2 rtl:mr-0" /> {t.missions}
                    </h3>
                </div>
                
                {/* Period Tabs */}
                <div className="flex p-1 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-x-auto scrollbar-hide mb-3 shrink-0">
                    {tabs.map(period => (
                        <button
                            key={period}
                            onClick={() => setActiveTab(period)}
                            className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all whitespace-nowrap flex-1 ${
                                activeTab === period 
                                ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' 
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                            }`}
                        >
                            {t.periods[period]}
                        </button>
                    ))}
                </div>
                
                <div className="space-y-3">
                    {filteredMissions.length === 0 && (
                        <div className="text-center py-8 text-slate-400 text-xs">
                            No missions.
                        </div>
                    )}
                    {filteredMissions.map((mission) => (
                        <div key={mission.id} className="flex flex-col p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700 gap-2 hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
                            <div className="flex items-start gap-3">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                                    mission.isCompleted ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500'
                                }`}>
                                    {mission.isCompleted 
                                        ? <CheckCircle className="w-3 h-3" /> 
                                        : activeTab === 'YEARLY' ? <Flag className="w-3 h-3" /> 
                                        : activeTab === 'MONTHLY' ? <Calendar className="w-3 h-3" />
                                        : <Target className="w-3 h-3" />
                                    }
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`font-semibold text-xs leading-tight ${mission.isCompleted ? 'text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                                        {/* Translate Mission Title using ID prefix mapping */}
                                        {t.missionTitles && t.missionTitles[`m_${mission.id.split('_')[1]}`] ? t.missionTitles[`m_${mission.id.split('_')[1]}`] : mission.title}
                                    </p>
                                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">+{mission.xpReward} XP</p>
                                </div>
                            </div>
                            <button
                                onClick={() => onCollectReward(mission.id, mission.xpReward)}
                                disabled={!mission.isCompleted || mission.isCollected}
                                className={`w-full py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider ${
                                    mission.isCollected 
                                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default' 
                                    : mission.isCompleted 
                                        ? 'bg-yellow-400 hover:bg-yellow-500 text-yellow-900 shadow-sm animate-bounce-short' 
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                                }`}
                            >
                                {mission.isCollected ? t.collected : t.collect}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MissionSidebar;
