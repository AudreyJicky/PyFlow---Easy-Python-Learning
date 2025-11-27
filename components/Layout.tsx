
import React, { useState, useEffect } from 'react';
import { AppView, Language, UserProfile, ThemeMode, APP_VERSION } from '../types';
import { translations } from '../translations';
import { LayoutDashboard, Layers, MessageCircle, Code2, Menu, X, Terminal, BookOpen, PenTool, Gamepad2, Camera, Trophy, Users, Download, Settings, Search, GraduationCap, FileCheck, Crown, MessageSquarePlus, Play } from 'lucide-react';
import FeedbackModal from './FeedbackModal';
import MissionSidebar from './MissionSidebar';

interface LayoutProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  children: React.ReactNode;
  user: UserProfile;
  onLogout: () => void;
  onThemeChange: (mode: ThemeMode) => void;
  onAvatarChange: (url: string) => void;
  // Mission Props
  onClockIn: () => void;
  onCollectReward: (missionId: string, xpReward: number) => void;
  showFeedback: boolean;
  setShowFeedback: (show: boolean) => void;
  isMissionSidebarOpen: boolean;
  onCloseMissionSidebar: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
    currentView, 
    onChangeView, 
    language, 
    children, 
    user, 
    onLogout, 
    onThemeChange,
    onAvatarChange,
    onClockIn,
    onCollectReward,
    showFeedback,
    setShowFeedback,
    isMissionSidebarOpen,
    onCloseMissionSidebar
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  
  const t = translations[language];
  const isRTL = language === 'Arabic';

  // Apply direction to body
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [isRTL]);

  const navItems = [
    { id: AppView.DASHBOARD, label: t.nav.dashboard, icon: LayoutDashboard },
    { id: AppView.PLAYGROUND, label: t.nav.playground, icon: Play }, // Added Playground
    { id: AppView.COURSE, label: t.nav.course, icon: GraduationCap },
    { id: AppView.EXAM, label: t.nav.exam, icon: FileCheck },
    { id: AppView.REFERENCE, label: t.nav.reference, icon: BookOpen },
    { id: AppView.GAME, label: t.nav.game, icon: Gamepad2 },
    { id: AppView.SEARCH, label: t.nav.search, icon: Search },
    { id: AppView.LEADERBOARD, label: t.nav.leaderboard, icon: Trophy },
    { id: AppView.COMMUNITY, label: t.nav.community, icon: Users },
    { id: AppView.NOTEBOOK, label: t.nav.notebook, icon: PenTool },
    { id: AppView.FLASHCARDS, label: t.nav.flashcards, icon: Layers },
    { id: AppView.CHAT, label: t.nav.chat, icon: MessageCircle },
    { id: AppView.ANALYZER, label: t.nav.analyzer, icon: Code2 },
    { id: AppView.DOWNLOAD, label: t.nav.download, icon: Download },
  ];

  const avatars = [
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Calvin',
      'https://api.dicebear.com/7.x/bottts/svg?seed=Robot',
      'https://api.dicebear.com/7.x/notionists/svg?seed=Coder',
  ];

  const handleNavClick = (view: AppView) => {
    onChangeView(view);
    setIsMobileMenuOpen(false);
  };

  const maxXp = 100;
  const progress = Math.min((user.xp / maxXp) * 100, 100);

  return (
    <div className={`flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden font-sans transition-colors duration-300 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {showFeedback && <FeedbackModal language={language} onClose={() => setShowFeedback(false)} />}

      {/* Avatar Modal */}
      {showAvatarModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowAvatarModal(false)}>
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">{t.profile.title}</h3>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                      {avatars.map((url, i) => (
                          <button 
                            key={i} 
                            onClick={() => { onAvatarChange(url); setShowAvatarModal(false); }}
                            className={`p-1 rounded-full border-2 ${user.avatar === url ? 'border-blue-500' : 'border-transparent hover:border-slate-200 dark:hover:border-slate-600'}`}
                          >
                              <img src={url} alt="avatar" className="w-full h-full rounded-full" />
                          </button>
                      ))}
                  </div>
                  <button onClick={() => setShowAvatarModal(false)} className="w-full py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg font-medium">{t.auth.back}</button>
              </div>
          </div>
      )}

      {/* 1. Main Navigation Sidebar */}
      <aside className="hidden md:flex md:w-64 flex-col bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-colors duration-300 z-10 relative">
        <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="bg-blue-500 p-1.5 rounded-lg">
                <Terminal className="w-6 h-6 text-yellow-300" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">PyFlow</h1>
          </div>
        </div>
        
        {/* User Profile Snippet */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-700">
             <div className="flex items-center space-x-3 mb-3 rtl:space-x-reverse">
                <div className="relative group cursor-pointer" onClick={() => setShowAvatarModal(true)}>
                    <img src={user.avatar} alt="Profile" className="w-10 h-10 rounded-full bg-slate-100" />
                    <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-4 h-4 text-white" />
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user.name}</p>
                    <div className="flex items-center">
                        {user.isTrial || user.subscriptionTier ? (
                            <span className="text-[10px] bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-400 px-1.5 rounded-sm font-bold flex items-center">
                                <Crown className="w-3 h-3 mr-1" /> {user.subscriptionTier || 'TRIAL'}
                            </span>
                        ) : (
                            <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-500 px-1.5 rounded-sm font-bold">FREE</span>
                        )}
                    </div>
                </div>
                <button 
                    onClick={() => onChangeView(AppView.PROFILE)} 
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                    title={t.nav.profile}
                >
                    <Settings className="w-4 h-4" />
                </button>
             </div>
             
             {/* Mini XP Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                <div className="bg-yellow-400 rounded-full h-1.5 transition-all duration-1000" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="flex justify-between mt-1 text-[10px] text-slate-400 dark:text-slate-400">
                <span>Lvl {Math.floor(user.xp / 100) + 1}</span>
                <span>{user.xp} XP</span>
            </div>
        </div>
        
        <div className="p-4">
             {/* Upgrade Button */}
             {!user.subscriptionTier && (
                 <button 
                    onClick={() => onChangeView(AppView.SUBSCRIPTION)}
                    className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-3 rounded-xl shadow-md flex items-center justify-center font-bold text-sm hover:scale-105 transition-transform"
                 >
                     <Crown className="w-4 h-4 mr-2" /> {t.nav.upgrade || 'Upgrade'}
                 </button>
             )}
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto pb-4 custom-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 rtl:space-x-reverse ${
                currentView === item.id
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium shadow-sm ring-1 ring-blue-200 dark:ring-blue-800'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <item.icon className={`w-5 h-5 ${currentView === item.id ? 'text-blue-500 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-100 dark:border-slate-700 text-center">
            <div className="text-[10px] text-slate-400 dark:text-slate-600 font-mono">
                {t.nav.version} {APP_VERSION}
            </div>
        </div>
      </aside>

      {/* 2. Secondary Sidebar for Daily/Missions (Desktop only) */}
      <div className="hidden lg:flex w-72 flex-col z-0">
          <MissionSidebar 
              user={user} 
              language={language} 
              onClockIn={onClockIn}
              onCollectReward={onCollectReward}
          />
      </div>

      {/* Mobile Mission Sidebar Drawer */}
      {isMissionSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden" onClick={onCloseMissionSidebar}>
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
              <div className={`absolute top-0 bottom-0 w-80 bg-white dark:bg-slate-800 shadow-2xl transition-transform duration-300 transform ${isRTL ? 'left-0' : 'right-0'}`} onClick={e => e.stopPropagation()}>
                    <button onClick={onCloseMissionSidebar} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-white z-10">
                        <X className="w-5 h-5" />
                    </button>
                   <MissionSidebar 
                        user={user} 
                        language={language} 
                        onClockIn={onClockIn}
                        onCollectReward={onCollectReward}
                    />
              </div>
          </div>
      )}

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 z-20">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
           <Terminal className="w-6 h-6 text-blue-500" />
           <span className="font-bold text-lg text-slate-800 dark:text-white">PyFlow</span>
        </div>
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600 dark:text-slate-300">
                {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-30 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
           <div className={`absolute top-16 bottom-0 w-72 bg-white dark:bg-slate-800 p-4 shadow-xl flex flex-col overflow-y-auto ${isRTL ? 'left-0' : 'right-0'}`} onClick={e => e.stopPropagation()}>
             
             <div className="flex items-center space-x-3 mb-6 p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg rtl:space-x-reverse">
                <img src={user.avatar} className="w-10 h-10 rounded-full" />
                <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-800 dark:text-white text-sm truncate">{user.name}</p>
                    <button onClick={() => { onChangeView(AppView.PROFILE); setIsMobileMenuOpen(false); }} className="text-xs text-blue-500 flex items-center mt-1">
                        <Settings className="w-3 h-3 mr-1" /> {t.nav.profile}
                    </button>
                </div>
             </div>

             <nav className="space-y-2 flex-1">
               {navItems.map((item) => (
                 <button
                   key={item.id}
                   onClick={() => handleNavClick(item.id)}
                   className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg rtl:space-x-reverse ${
                     currentView === item.id 
                     ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                     : 'text-slate-600 dark:text-slate-400'
                   }`}
                 >
                   <item.icon className="w-5 h-5" />
                   <span>{item.label}</span>
                 </button>
               ))}
             </nav>
             <div className="mt-4 border-t border-slate-100 dark:border-slate-700 pt-4 space-y-3">
                 {/* Mobile also shows daily mission button here since sidebar is hidden */}
                 <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-3">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">{t.nav.dailyProgress || 'Daily Progress'}</h4>
                    <button 
                        onClick={onClockIn}
                        disabled={user.isClockedIn}
                        className="w-full py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold disabled:bg-slate-300 dark:disabled:bg-slate-700"
                    >
                        {user.isClockedIn ? t.dashboard.comeBack : t.dashboard.clockIn}
                    </button>
                 </div>
             </div>
           </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pt-16 md:pt-0 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-6xl mx-auto p-4 md:p-8">
            {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
