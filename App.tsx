
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Flashcards from './components/Flashcards';
import ChatTutor from './components/Chat';
import Analyzer from './components/Analyzer';
import ReferenceBook from './components/ReferenceBook';
import Notebook from './components/Notebook';
import Game from './components/Game';
import Auth from './components/Auth';
import ProfileSettings from './components/ProfileSettings';
import Leaderboard from './components/Leaderboard';
import Community from './components/Community';
import Download from './components/Download';
import { AppView, Language, UserProfile, ThemeMode } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [language, setLanguage] = useState<Language>('English');
  const [loading, setLoading] = useState(true);
  const [detectedLocation, setDetectedLocation] = useState<string>('');

  // Auto-detect System Theme and Location on Mount
  useEffect(() => {
    const initializeApp = async () => {
      // 1. Theme Detection
      const savedUser = localStorage.getItem('pyflow-user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        applyTheme(parsedUser.theme);
      } else {
        // No user logged in: Use system preference
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(systemDark ? 'dark' : 'light');
      }

      // 2. View & Language persistence
      const savedView = localStorage.getItem('pyflow-last-view');
      const savedLang = localStorage.getItem('pyflow-lang');
      if (savedView) setCurrentView(savedView as AppView);
      if (savedLang) setLanguage(savedLang as Language);

      // 3. Location Detection (IP-based)
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        if (data.country_name) {
            setDetectedLocation(data.country_name);
        }
      } catch (e) {
        console.warn("Could not detect location automatically.");
      }

      setLoading(false);
    };

    initializeApp();

    // Listen for system theme changes if no user preference overrides it
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
        if (!localStorage.getItem('pyflow-user')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    };
    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  const applyTheme = (theme: ThemeMode) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogin = (newUser: UserProfile) => {
    // Merge detected location if user doesn't have one (e.g. new signup)
    const userWithLocation = {
        ...newUser,
        country: newUser.country || detectedLocation
    };
    
    setUser(userWithLocation);
    // If user has a saved theme preference, apply it. Otherwise, keep current system/state theme.
    if (newUser.theme) {
        applyTheme(newUser.theme);
    }
    localStorage.setItem('pyflow-user', JSON.stringify(userWithLocation));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('pyflow-user');
    setCurrentView(AppView.DASHBOARD);
    // Revert to system theme on logout
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(systemDark ? 'dark' : 'light');
  };

  const handleViewChange = (view: AppView) => {
    setCurrentView(view);
    localStorage.setItem('pyflow-last-view', view);
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('pyflow-lang', lang);
  };

  const handleThemeChange = (mode: ThemeMode) => {
    // Update state immediately for UI responsiveness
    applyTheme(mode);
    
    if (user) {
        const updatedUser = { ...user, theme: mode };
        setUser(updatedUser);
        localStorage.setItem('pyflow-user', JSON.stringify(updatedUser));
    }
  };

  const handleAvatarChange = (avatarUrl: string) => {
      if(!user) return;
      const updatedUser = { ...user, avatar: avatarUrl };
      setUser(updatedUser);
      localStorage.setItem('pyflow-user', JSON.stringify(updatedUser));
  }

  const handleUpdateUser = (updatedUser: UserProfile) => {
      setUser(updatedUser);
      localStorage.setItem('pyflow-user', JSON.stringify(updatedUser));
      // Ensure theme is applied if changed in settings
      applyTheme(updatedUser.theme);
  };

  const handleXpGain = (amount: number) => {
      if (!user) return;
      const newXp = user.xp + amount;
      const updatedUser = { ...user, xp: newXp };
      setUser(updatedUser);
      localStorage.setItem('pyflow-user', JSON.stringify(updatedUser));
      localStorage.setItem('pyflow-xp', newXp.toString());
  };

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
        return <Dashboard onNavigate={handleViewChange} language={language} xp={user.xp} />;
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
      case AppView.PROFILE:
        return <ProfileSettings user={user} onUpdateUser={handleUpdateUser} />;
      case AppView.LEADERBOARD:
        return <Leaderboard currentUser={user} />;
      case AppView.COMMUNITY:
        return <Community />;
      case AppView.DOWNLOAD:
        return <Download />;
      default:
        return <Dashboard onNavigate={handleViewChange} language={language} xp={user.xp} />;
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
    >
      {renderContent()}
    </Layout>
  );
};

export default App;