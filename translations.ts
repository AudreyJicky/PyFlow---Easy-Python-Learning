
import { Language } from './types';

const en = {
    nav: {
      dashboard: 'Dashboard',
      course: 'Course & Lessons',
      exam: 'Test & Exam',
      reference: 'Reference Book',
      game: 'Arcade',
      leaderboard: 'Rankings',
      community: 'Study Groups',
      notebook: 'Notebook',
      flashcards: 'Concept Cards',
      chat: 'Py-Sensei',
      analyzer: 'Code Explainer',
      search: 'Code Dictionary',
      download: 'Download App',
      profile: 'Profile',
      logout: 'Sign Out',
      theme: 'Theme',
      nativeLang: 'Native Language',
      subscription: 'Premium Plans',
      feedback: 'Feedback & Bugs',
      version: 'Ver'
    },
    auth: {
      title: 'PyFlow',
      subtitle: 'Master Python the fun way.',
      getStarted: 'Get Started',
      emailLogin: 'Email',
      phoneLogin: 'Phone',
      google: 'Continue with Google',
      email: 'Continue with Email',
      phone: 'Continue with Phone',
      emailLabel: 'Email Address',
      phoneLabel: 'Phone Number',
      nameLabel: 'Full Name',
      placeholderEmail: 'you@example.com',
      placeholderPhone: '123 456 7890',
      placeholderName: 'John Doe',
      signIn: 'Sign In',
      signUp: 'Create Account',
      back: 'Back',
      terms: 'By continuing, you agree to our Terms of Service.',
      agreeLabel: 'I agree to the Terms of Service and allow data usage to improve the app.',
      noAccount: "Don't have an account?",
      hasAccount: "Already have an account?",
      verifyTitle: "Verify it's you",
      verifyDesc: "We sent a 6-digit code to",
      codeLabel: "Verification Code",
      resend: "Resend Code",
      verifyBtn: "Verify & Continue",
      googleVerify: "Enter the code from your Google Authenticator or Device.",
      welcomeBack: "Welcome back!",
      chooseAccount: "Choose an account to continue",
      useAnother: "Use another account"
    },
    dashboard: {
      hello: 'Hello',
      subtitle: 'Ready to level up your Python skills?',
      dailyXp: 'Daily XP',
      dailyTip: 'Daily Python Tip',
      loading: 'Loading tip...',
      failedTip: 'Failed to load tip.',
      clockIn: 'Check Up',
      clockedIn: 'Checked Up',
      comeBack: 'All set for today!',
      missions: 'Missions',
      collect: 'Collect',
      collected: 'Collected',
      periods: {
          DAILY: 'Daily',
          WEEKLY: 'Weekly',
          MONTHLY: 'Monthly',
          YEARLY: 'Yearly'
      },
      features: {
        course: { title: 'Interactive Course', desc: 'Step-by-step animated lessons.' },
        exam: { title: 'Exam Prep', desc: 'Mock tests and yearly papers.' },
        reference: { title: 'Reference Book', desc: 'Master the basics with simple guides.' },
        game: { title: 'Python Arcade', desc: 'Play quizzes and earn XP!' },
        notebook: { title: 'My Notebook', desc: 'Save useful code snippets.' },
        flashcards: { title: 'Concept Cards', desc: 'Swipe to memorize syntax.' },
        chat: { title: 'Ask Py-Sensei', desc: 'Chat with your AI Tutor.' },
        analyzer: { title: 'Code Explainer', desc: 'Paste code to understand it.' }
      },
      open: 'Open'
    },
    course: {
        title: 'Python Journey',
        desc: 'Follow the path to mastery. Each level contains detailed modules and lessons.',
        start: 'Start Lesson',
        locked: 'Locked',
        completed: 'Completed',
        visualize: 'Visualizing Code...',
        step: 'Step',
        output: 'Output',
        variables: 'Memory',
        quizTime: 'Lesson Quiz',
        nextLesson: 'Next Lesson',
        finishModule: 'Finish Module',
        modules: {
            basics: 'Python Basics',
            control: 'Control Flow',
            structures: 'Data Structures'
        }
    },
    exam: {
        title: 'Exam Hall',
        desc: 'Prepare for certifications with mock exams and yearly papers.',
        mock: 'Mock Exam',
        practice: 'Topic Practice',
        start: 'Start Exam',
        questions: 'Questions',
        mins: 'Mins',
        score: 'Final Score',
        passed: 'Passed',
        failed: 'Needs Improvement',
        review: 'Review Answers',
        quit: 'Quit Exam'
    },
    flashcards: {
      newDeck: 'New Python Deck',
      topicLabel: 'Topic (e.g., Loops, Lists)',
      difficultyLabel: 'Difficulty Level',
      currentLang: 'Current Language',
      generate: 'Generate Cards',
      generating: 'Generating...',
      setup: 'Back to Setup',
      flip: 'Tap to see code',
      restart: 'Restart Deck',
      syntax: 'Syntax',
      example: 'Example',
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced'
    },
    game: {
      title: 'Python Arcade',
      desc: 'Select a game mode and difficulty to start earning XP!',
      start: 'Start Game',
      loading: 'Loading Quiz...',
      gameOver: 'Game Over!',
      score: 'You scored',
      playAgain: 'Play Again',
      question: 'Question',
      next: 'Next Question',
      finish: 'Finish',
      explanation: 'Explanation',
      modes: {
        trivia: { title: 'Classic Trivia', desc: 'Test your general knowledge.' },
        bug: { title: 'Bug Hunter', desc: 'Find and fix the error in the code.' },
        sprint: { title: 'Syntax Sprint', desc: 'Fast-paced syntax questions.' }
      },
      levels: {
        beginner: 'Novice',
        intermediate: 'Apprentice',
        professional: 'Grandmaster'
      }
    },
    notebook: {
      title: 'My Notes',
      sharedTitle: 'Shared Notes',
      empty: 'No notes here yet.',
      newNote: 'New Note',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
      titlePlaceholder: 'Note Title...',
      tagsPlaceholder: 'Tags (comma separated)...',
      contentPlaceholder: 'Write your code, work notes, or daily tasks here...',
      selectPrompt: 'Select a note or create a new one to get started.',
      all: 'All Notes',
      myNotes: 'My Notes',
      friendsNotes: 'Friends & Groups',
      sharedBy: 'Shared by',
      categories: {
          Study: 'Study',
          Work: 'Work',
          Daily: 'Daily',
          Info: 'Info'
      }
    },
    chat: {
      title: 'Py-Sensei',
      online: 'Online',
      placeholder: 'Ask about a Python concept...',
      send: 'Send',
      reset: 'Reset Chat',
      welcome: 'Hello! I am Py-Sensei 🐍. I make learning Python fun and easy! What do you want to build today?'
    },
    analyzer: {
      title: 'Code Explainer',
      desc: 'Paste Python code to understand how it works in',
      placeholder: 'Paste Python code here... (e.g. for i in range(5): print(i))',
      analyze: 'Explain Code',
      analyzing: 'Analyzing...',
      summary: 'Code Summary',
      concepts: 'Key Concepts Used',
      proTip: 'Pro Tip'
    },
    search: {
        title: 'Code Dictionary',
        desc: 'Search for any Python keyword or function to get a quick definition.',
        placeholder: 'Search e.g. "print", "len", "lambda"...',
        button: 'Search',
        searching: 'Searching...',
        syntax: 'Syntax',
        example: 'Example',
        related: 'Related Terms',
        error: 'Definition not found. Try a different term.'
    },
    reference: {
      basics: 'Table of Contents',
      select: 'Select a topic to start reading!',
      loading: 'Writing your textbook...',
      sections: {
          core: 'Core Curriculum',
          practical: 'Practical Applications'
      },
      topics: {
        variables: 'Variables',
        datatypes: 'Data Types',
        lists: 'Lists',
        loops: 'Loops',
        functions: 'Functions',
        conditionals: 'Conditionals',
        dictionaries: 'Dictionaries'
      },
      desc: {
        variables: 'Storing data containers',
        datatypes: 'Strings, Integers, Booleans',
        lists: 'Collections of items',
        loops: 'Repeating actions',
        functions: 'Reusable code blocks',
        conditionals: 'If, Elif, Else logic',
        dictionaries: 'Key-value pairs'
      }
    },
    profile: {
      title: 'Profile Settings',
      memberSince: 'Member Since',
      fullName: 'Full Name',
      email: 'Email (Read-only)',
      birthday: 'Birthday',
      gender: 'Gender',
      bio: 'Learning Preferences / Bio',
      bioPlaceholder: 'Tell us about your coding goals...',
      save: 'Save Changes',
      saved: 'Saved Successfully',
      autoTranslate: 'Auto-Translate Messages',
      studyReminder: 'Daily Study Reminder',
      webLink: 'Web Access Link',
      generateLink: 'Copy Web Link',
      linkCopied: 'Link Copied!',
      referral: 'Refer & Earn',
      referralDesc: 'Share link. When your friend reaches 1000 XP, both of you get 100 XP!',
      copyReferral: 'Copy Referral Link',
      actions: 'Account Actions'
    },
    leaderboard: {
      title: 'Global Leaderboard',
      desc: 'See how you stack up against other learners!',
      yourRank: 'Your Current Rank',
      topPct: 'Top 20% of learners',
      rank: 'Rank',
      regions: {
          Global: 'Global',
          Asia: 'Asia',
          Europe: 'Europe',
          Americas: 'Americas',
          Local: 'My Country'
      }
    },
    community: {
      title: 'Community Groups',
      desc: 'Join a squad and learn together!',
      create: 'Create Group',
      search: 'Search for topics, languages, or groups...',
      yourGroups: 'Your Groups',
      explore: 'Explore Groups',
      members: 'Members',
      online: 'Online',
      openChat: 'Open Chat',
      join: 'Join Group',
      classroom: {
          back: 'Leave Classroom',
          conversation: 'Conversation',
          voice: 'Voice Mode',
          focus: 'Focus Timer',
          typing: 'typing...',
          online: 'Online',
          busy: 'Focusing',
          speaking: 'Speaking',
          addFriend: 'Add Friend',
          reminder: 'Set Reminder',
          friendAdded: 'Friend Added!',
          reminderSet: 'Reminder Sent!',
          rank: 'Rank',
          level: 'Level',
          xp: 'XP',
          startFocus: 'Start Focus',
          stopFocus: 'Stop Focus',
          translate: 'Translate',
          original: 'Original'
      },
      createModal: {
          title: 'Start a New Study Group',
          name: 'Group Name',
          desc: 'Description',
          tags: 'Tags',
          country: 'Region/Country',
          submit: 'Create Classroom',
          cancel: 'Cancel'
      }
    },
    download: {
      title: 'Take PyFlow Everywhere',
      desc: 'Learn Python on the go. Sync your progress across all your devices.',
      ios: 'iOS',
      android: 'Android',
      desktop: 'Desktop',
      web: 'Web',
      launchWeb: 'Open Website',
      betaTitle: 'Join the beta testing group',
      betaDesc: 'Get early access to new features like the "Advanced Python" course.',
      betaBtn: 'Join Beta Program'
    },
    subscription: {
        title: 'Unlock Premium',
        desc: 'Choose a plan to master Python faster.',
        weekly: 'Weekly',
        monthly: 'Monthly',
        yearly: 'Yearly',
        lifetime: 'Lifetime',
        trial: '7-Day Free Trial Active',
        select: 'Select Plan',
        current: 'Current Plan',
        benefits: {
            unlimited: 'Unlimited AI Chat',
            offline: 'Offline Mode',
            certified: 'Get Certified',
            ads: 'No Ads'
        },
        redeem: {
            title: 'Redeem XP for Premium',
            desc: 'Use your hard-earned XP to unlock free premium access.',
            week: '1 Week Free',
            month: '1 Month Free',
            year: '1 Year Free',
            btn: 'Redeem',
            insufficient: 'Need more XP'
        }
    },
    feedback: {
        title: 'Improve PyFlow',
        desc: 'Found a bug or have a suggestion? Let us know!',
        category: 'Category',
        design: 'Design / UI',
        content: 'Content / Info',
        bug: 'Bug / Error',
        suggestion: 'Suggestion',
        message: 'Message',
        submit: 'Submit Feedback',
        thanks: 'Thanks for your feedback!'
    }
};

export const translations: Record<Language, any> = {
  'English': en,
  'Chinese (Simplified)': {
    ...en,
    nav: {
      dashboard: '仪表板', course: '互动课程', exam: '考试模拟', reference: '参考书', game: '街机模式', leaderboard: '排行榜', community: '学习小组', notebook: '笔记本', flashcards: '概念卡片', chat: 'Py-老师', analyzer: '代码解释器', search: '代码词典', download: '下载应用', profile: '个人资料', logout: '登出', theme: '主题', nativeLang: '母语', subscription: '高级订阅', feedback: '反馈', version: '版本'
    },
    subscription: { ...en.subscription, title: '解锁高级版', trial: '7天免费试用中', redeem: { ...en.subscription.redeem, title: '积分兑换', desc: '用您的XP兑换免费会员', btn: '兑换', insufficient: '积分不足' } },
    notebook: {
        ...en.notebook, title: '我的笔记', sharedTitle: '共享笔记', myNotes: '我的笔记', friendsNotes: '朋友和小组', sharedBy: '共享者'
    },
    community: {
        ...en.community, classroom: { ...en.community.classroom, translate: '翻译', original: '原文' }
    },
    download: {
        ...en.download, launchWeb: '打开网站'
    },
    profile: {
        ...en.profile, referral: '推荐并赚取', referralDesc: '分享链接。当您的朋友达到 1000 XP 时，你们每人获得 100 XP！', copyReferral: '复制推荐链接', actions: '账户操作'
    }
  },
  'Malay': {
    ...en,
    nav: {
      dashboard: 'Papan Pemuka', course: 'Kursus', exam: 'Peperiksaan', reference: 'Buku Rujukan', game: 'Arked', leaderboard: 'Ranking', community: 'Kumpulan Belajar', notebook: 'Buku Nota', flashcards: 'Kad Konsep', chat: 'Py-Cikgu', analyzer: 'Penerang Kod', search: 'Kamus Kod', download: 'Muat Turun', profile: 'Profil', logout: 'Log Keluar', theme: 'Tema', nativeLang: 'Bahasa Ibunda', subscription: 'Langganan', feedback: 'Maklum Balas', version: 'Versi'
    },
    notebook: {
        ...en.notebook, title: 'Nota Saya', sharedTitle: 'Nota Dikongsi', myNotes: 'Nota Saya', friendsNotes: 'Kawan & Kumpulan', sharedBy: 'Dikongsi oleh'
    },
    community: {
        ...en.community, classroom: { ...en.community.classroom, translate: 'Terjemah', original: 'Asal' }
    },
    download: {
        ...en.download, launchWeb: 'Buka Laman Web'
    },
    profile: {
        ...en.profile, referral: 'Rujuk & Peroleh', referralDesc: 'Kongsi pautan. Apabila rakan mencapai 1000 XP, anda berdua dapat 100 XP!', copyReferral: 'Salin Pautan Rujukan', actions: 'Tindakan Akaun'
    }
  },
  'Japanese': en,
  'Korean': en,
  'Indonesian': en,
  'Thai': en,
  'Vietnamese': en,
  'Myanmar': en,
  'Arabic': en
};

// Helper to fill missing translations with English for safety
Object.keys(translations).forEach((lang) => {
    if (lang === 'English') return;
    const l = lang as Language;
    const features = ['dashboard', 'flashcards', 'game', 'notebook', 'chat', 'analyzer', 'search', 'reference', 'profile', 'leaderboard', 'community', 'download', 'auth', 'course', 'exam', 'subscription', 'feedback'];
    features.forEach(f => {
        if (!translations[l][f]) translations[l][f] = en[f as keyof typeof en];
    });
});