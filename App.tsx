
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Flashcards from './components/Flashcards';
import ChatTutor from './components/Chat';
import Analyzer from './components/Analyzer';
import ReferenceBook from './components/ReferenceBook';
import Notebook from './components/Notebook';
import Game from './components/Game';
import Course from './components/Course';
import Exam from './components/Exam';
import Auth from './components/Auth';
import ProfileSettings from './components/ProfileSettings';
import Leaderboard from './components/Leaderboard';
import Community from './components/Community';
import Download from './components/Download';
import CodeSearch from './components/CodeSearch';
import Subscription from './components/Subscription';
import Playground from './components/Playground';
import { AppView, Language, UserProfile, ThemeMode, SavedAccount, DailyMission, SubscriptionTier } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [language, setLanguage] = useState<Language>('English');
  const [loading, setLoading] = useState(true);
  const [detectedLocation, setDetectedLocation] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isMissionSidebarOpen, setIsMissionSidebarOpen] = useState(false);
  
  // Store referral code if present in URL on launch
  const [pendingReferralCode, setPendingReferralCode] = useState<string | null>(null);

  const generateMissions = (): DailyMission[] => [
      // Daily
      { id: 'm_d1', title: 'Daily Check Up', xpReward: 20, isCompleted: false, isCollected: false, type: 'LOGIN', period: 'DAILY' },
      { id: 'm_d2', title: 'Complete 1 Micro-Lesson', xpReward: 50, isCompleted: false, isCollected: false, type: 'LESSON', period: 'DAILY' },
      { id: 'm_d3', title: 'Defeat the Bug Monster (Quiz)', xpReward: 30, isCompleted: false, isCollected: false, type: 'QUIZ', period: 'DAILY' },
      { id: 'm_d4', title: 'Scribble a Code Note', xpReward: 15, isCompleted: false, isCollected: false, type: 'NOTE', period: 'DAILY' },
      // Weekly
      { id: 'm_w1', title: 'Code Marathon: 3 Lessons', xpReward: 150, isCompleted: false, isCollected: false, type: 'LESSON', period: 'WEEKLY' },
      { id: 'm_w2', title: 'Perfect Score in Arcade', xpReward: 100, isCompleted: false, isCollected: false, type: 'GAME', period: 'WEEKLY' },
      { id: 'm_w3', title: 'Referral Bonus: Friend hits 1k XP', xpReward: 100, isCompleted: false, isCollected: false, type: 'REFERRAL', period: 'WEEKLY' },
      { id: 'm_w4', title: 'Analyze 5 Snippets', xpReward: 75, isCompleted: false, isCollected: false, type: 'ANALYSIS', period: 'WEEKLY' },
      // Monthly
      { id: 'm_m1', title: 'Master a Module', xpReward: 500, isCompleted: false, isCollected: false, type: 'LESSON', period: 'MONTHLY' },
      { id: 'm_m2', title: 'Earn 1000 XP', xpReward: 300, isCompleted: false, isCollected: false, type: 'GAME', period: 'MONTHLY' },
      // Yearly
      { id: 'm_y1', title: 'Reach Grandmaster Rank', xpReward: 5000, isCompleted: false, isCollected: false, type: 'LESSON', period: 'YEARLY' },
      { id: 'm_y2', title: '365 Days Streak', xpReward: 10000, isCompleted: false, isCollected: false, type: 'LOGIN', period: 'YEARLY' },
  ];

  const applyTheme = (theme: ThemeMode) => {
    let isDark = false;
    if (theme === 'auto') {
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
        isDark = theme === 'dark';
    }

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Theme Persistence Effect
  // This ensures that whenever the user object updates (e.g. via ProfileSettings save),
  // the theme is correctly applied to the DOM.
  useEffect(() => {
      if (user) {
          applyTheme(user.theme);
      }
  }, [user?.theme]);

  // Auto-detect System Theme, Location, and Referral Code on Mount
  useEffect(() => {
    const initializeApp = async () => {
      // 0. Check Referral param
      const params = new URLSearchParams(window.location.search);
      const refCode = params.get('ref');
      if (refCode) {
          setPendingReferralCode(refCode);
          console.log("Referral Code Detected:", refCode);
      }

      // 1. Theme Detection
      const savedUser = localStorage.getItem('pyflow-user');
      let currentUser: UserProfile | null = null;
      if (savedUser) {
        currentUser = JSON.parse(savedUser);
        
        // --- Daily Logic Check ---
        const today = new Date().toDateString();
        if (currentUser && currentUser.lastActiveDate !== today) {
            currentUser.lastActiveDate = today;
            currentUser.isClockedIn = false;
            // Regenerate missions for new day
            const freshMissions = generateMissions();
            currentUser.missions = freshMissions;
            localStorage.setItem('pyflow-user', JSON.stringify(currentUser));
        }
        
        setUser(currentUser);
        applyTheme(currentUser.theme);
      } else {
        // No user logged in: Use auto
        applyTheme('auto');
      }

      // 2. View & Language persistence
      const savedView = localStorage.getItem('pyflow-last-view');
      const savedLang = localStorage.getItem('pyflow-lang');
      if (savedView) setCurrentView(savedView as AppView);
      if (savedLang) setLanguage(savedLang as Language);

      // 3. Location Detection (IP-based) with Fallback
      let country = '';
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (res.ok) {
            const data = await res.json();
            country = data.country_name;
        } else {
            throw new Error("Primary failed");
        }
      } catch (e) {
        try {
            const res = await fetch('https://ipwho.is/');
            if (res.ok) {
                const data = await res.json();
                country = data.country;
            }
        } catch (e2) {
            console.warn("Could not detect location automatically.");
        }
      }

      if (country) {
          setDetectedLocation(country);
          if (currentUser && !currentUser.country) {
              const updatedUser = { ...currentUser, country: country };
              setUser(updatedUser);
              localStorage.setItem('pyflow-user', JSON.stringify(updatedUser));
          }
      }

      setLoading(false);
    };

    initializeApp();

    // Listener for system theme changes (Auto Mode)
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
        // Check if we should respect system theme
        const savedUserStr = localStorage.getItem('pyflow-user');
        if (savedUserStr) {
            const u = JSON.parse(savedUserStr);
            if (u.theme === 'auto') {
                applyTheme('auto');
            }
        } else {
            // No user, default is auto
            applyTheme('auto');
        }
    };
    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  const handleLogin = (newUser: UserProfile, method: 'email' | 'phone' | 'google') => {
    const today = new Date().toDateString();
    
    // Check if it is a fresh login (no history)
    const isNewUser = !localStorage.getItem('pyflow-saved-accounts')?.includes(newUser.email);
    let extraProps: Partial<UserProfile> = {};
    
    if (isNewUser) {
        // Apply 7-Day Trial
        extraProps.isTrial = true;
        extraProps.trialEndDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        
        // Apply Referral Code if exists
        if (pendingReferralCode) {
            extraProps.referredBy = pendingReferralCode;
        }
    }

    const userWithLocation: UserProfile = {
        ...newUser,
        country: newUser.country || detectedLocation,
        lastActiveDate: today,
        missions: newUser.missions || generateMissions(),
        isClockedIn: newUser.isClockedIn || false,
        theme: newUser.theme || 'auto', // Default to auto for new logins
        ...extraProps
    };
    
    setUser(userWithLocation);
    applyTheme(userWithLocation.theme);
    
    localStorage.setItem('pyflow-user', JSON.stringify(userWithLocation));
    localStorage.setItem('pyflow-xp', userWithLocation.xp.toString()); // Init XP

    const savedAccountsJson = localStorage.getItem('pyflow-saved-accounts');
    let savedAccounts: SavedAccount[] = savedAccountsJson ? JSON.parse(savedAccountsJson) : [];
    savedAccounts = savedAccounts.filter(acc => acc.email !== newUser.email);
    const newSavedAccount: SavedAccount = {
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
        method: method,
        lastLogin: Date.now()
    };
    savedAccounts.unshift(newSavedAccount);
    if (savedAccounts.length > 5) savedAccounts.pop();
    localStorage.setItem('pyflow-saved-accounts', JSON.stringify(savedAccounts));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('pyflow-user');
    setCurrentView(AppView.DASHBOARD);
    applyTheme('auto'); // Revert to system default on logout
  };

  const handleViewChange = (view: AppView) => {
    setCurrentView(view);
    localStorage.setItem('pyflow-last-view', view);
    setIsMissionSidebarOpen(false); // Close sidebar on nav
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('pyflow-lang', lang);
  };

  const handleThemeChange = (mode: ThemeMode) => {
    // This function now mostly serves as a way to update the user object.
    // The visual application is handled by the useEffect watching user.theme.
    // We keep applyTheme here for immediate feedback in other contexts if needed.
    applyTheme(mode);
    if (user) {
        const updatedUser = { ...user, theme: mode };
        handleUpdateUser(updatedUser);
    }
  };

  const handleAvatarChange = (avatarUrl: string) => {
      if(!user) return;
      const updatedUser = { ...user, avatar: avatarUrl };
      handleUpdateUser(updatedUser);
  }

  const handleUpdateUser = (updatedUser: UserProfile) => {
      setUser(updatedUser);
      localStorage.setItem('pyflow-user', JSON.stringify(updatedUser));
      // Ensure XP is persisted separately for Auth component recovery and consistency
      localStorage.setItem('pyflow-xp', updatedUser.xp.toString()); 
  };

  const handleXpGain = (amount: number) => {
      if (!user) return;
      const newXp = user.xp + amount;
      
      let updatedUser = { ...user, xp: newXp };

      // --- CHECK REFERRAL MILESTONE (1000 XP) ---
      // If user has > 1000 XP, was referred, and hasn't claimed the bonus yet
      if (newXp >= 1000 && user.referredBy && !user.referralBonusClaimed) {
          updatedUser.xp += 100; // Bonus
          updatedUser.referralBonusClaimed = true;
          alert(`🎉 Milestone Reached!\n\nBecause you used a referral code (${user.referredBy}), you and your friend both get +100 Bonus XP!`);
      }

      handleUpdateUser(updatedUser);
  };

  const handleSubscribe = (tier: SubscriptionTier) => {
      if (!user) return;
      const updatedUser = { ...user, subscriptionTier: tier, isTrial: false }; // Trial ends if subscription starts
      handleUpdateUser(updatedUser);
      alert(`Successfully subscribed to ${tier} plan!`);
      setCurrentView(AppView.DASHBOARD);
  };
  
  const handleRedeemXp = (cost: number, tier: SubscriptionTier) => {
      if (!user) return;
      if (user.xp < cost) {
          alert('Insufficient XP!');
          return;
      }
      const updatedUser = { 
          ...user, 
          xp: user.xp - cost, 
          subscriptionTier: tier, 
          isTrial: false 
      };
      handleUpdateUser(updatedUser);
      alert(`Redeemed ${cost} XP for ${tier} plan!`);
      setCurrentView(AppView.DASHBOARD);
  };

  // --- Mission Logic Handlers ---

  const handleClockIn = () => {
    if (!user || user.isClockedIn) return;
    
    // Update mission status for clock in
    const updatedMissions = user.missions?.map(m => 
        m.type === 'LOGIN' ? { ...m, isCompleted: true } : m
    );

    const updatedUser = {
        ...user,
        isClockedIn: true,
        missions: updatedMissions
    };
    handleUpdateUser(updatedUser);
  };

  const handleCollectReward = (missionId: string, xpReward: number) => {
      if (!user) return;
      const updatedMissions = user.missions?.map(m => 
          m.id === missionId ? { ...m, isCollected: true } : m
      );

      const updatedUser = {
          ...user,
          xp: user.xp + xpReward,
          missions: updatedMissions
      };
      handleUpdateUser(updatedUser);
  };

  const handleReferral = () => {
      if (!user) return;
      // Mark referral mission as complete for the *referrer* immediately for this demo
      // In a real backend app, this would be updated via server push when the friend reaches 1000 XP
      const updatedMissions = user.missions?.map(m => 
          m.type === 'REFERRAL' ? { ...m, isCompleted: true } : m
      );
      
      const updatedUser = { ...user, missions: updatedMissions };
      handleUpdateUser(updatedUser);
  }

  if (loading) return null;

  if (!user) {
    return (
        <Auth 
            onLogin={handleLogin} 
            language={language} 
            onLanguageChange={handleLanguageChange}
            detectedLocation={detectedLocation}
        />
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard onNavigate={handleViewChange} language={language} user={user} onShowMissions={() => setIsMissionSidebarOpen(true)} />;
      case AppView.PLAYGROUND:
        return <Playground language={language} />;
      case AppView.COURSE:
        return <Course language={language} onXpGain={handleXpGain} />;
      case AppView.EXAM:
        return <Exam language={language} />;
      case AppView.REFERENCE:
        return <ReferenceBook language={language} />;
      case AppView.GAME:
        return <Game language={language} onXpGain={handleXpGain} />;
      case AppView.NOTEBOOK:
        return <Notebook language={language} />;
      case AppView.FLASHCARDS:
        return <Flashcards language={language} />;
      case AppView.CHAT:
        return <ChatTutor language={language} />;
      case AppView.ANALYZER:
        return <Analyzer language={language} />;
      case AppView.SEARCH:
        return <CodeSearch language={language} />;
      case AppView.PROFILE:
        return <ProfileSettings 
                    user={user} 
                    onUpdateUser={handleUpdateUser} 
                    language={language} 
                    onLanguageChange={handleLanguageChange} 
                    onThemeChange={handleThemeChange} 
                    onFeedback={() => setShowFeedback(true)}
                    onLogout={handleLogout}
                    onReferral={handleReferral}
                />;
      case AppView.LEADERBOARD:
        return <Leaderboard currentUser={user} />;
      case AppView.COMMUNITY:
        return <Community />;
      case AppView.DOWNLOAD:
        return <Download />;
      case AppView.SUBSCRIPTION:
        return <Subscription user={user} language={language} onSubscribe={handleSubscribe} onRedeemXp={handleRedeemXp} />;
      default:
        return <Dashboard onNavigate={handleViewChange} language={language} user={user} onShowMissions={() => setIsMissionSidebarOpen(true)} />;
    }
  };

  return (
    <Layout 
      currentView={currentView} 
      onChangeView={handleViewChange}
      language={language}
      onLanguageChange={handleLanguageChange}
      user={user}
      onLogout={handleLogout}
      onThemeChange={handleThemeChange}
      onAvatarChange={handleAvatarChange}
      onClockIn={handleClockIn}
      onCollectReward={handleCollectReward}
      showFeedback={showFeedback}
      setShowFeedback={setShowFeedback}
      isMissionSidebarOpen={isMissionSidebarOpen}
      onCloseMissionSidebar={() => setIsMissionSidebarOpen(false)}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
