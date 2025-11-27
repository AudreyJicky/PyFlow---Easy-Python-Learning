
export type Language = 
  | 'English' 
  | 'Chinese (Simplified)' 
  | 'Malay' 
  | 'Japanese' 
  | 'Korean' 
  | 'Indonesian' 
  | 'Thai' 
  | 'Vietnamese' 
  | 'Myanmar' 
  | 'Arabic';

export const APP_VERSION = "1.2.4 (Beta)";

export type ThemeMode = 'light' | 'dark' | 'auto';
export type Gender = 'Male' | 'Female' | 'Other' | 'Prefer not to say';

export type MissionPeriod = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export type SubscriptionTier = 'FREE' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' | 'LIFETIME';

export interface DailyMission {
  id: string;
  title: string;
  xpReward: number;
  isCompleted: boolean;
  isCollected: boolean;
  type: 'LOGIN' | 'LESSON' | 'QUIZ' | 'NOTE' | 'GAME' | 'ANALYSIS' | 'REFERRAL';
  period: MissionPeriod;
}

export interface UserProfile {
  name: string;
  email: string; // Used as unique ID for login
  avatar: string; // URL or emoji/base64
  theme: ThemeMode;
  xp: number;
  // Personal Details
  birthday?: string;
  gender?: Gender;
  bio?: string;
  joinedDate?: string;
  country?: string;
  // Settings
  autoTranslate?: boolean;
  studyReminder?: string; // HH:MM format
  // Daily Activity
  lastActiveDate?: string;
  isClockedIn?: boolean;
  missions?: DailyMission[];
  // Subscription
  subscriptionTier?: SubscriptionTier;
  isTrial?: boolean;
  trialEndDate?: string;
  // Referral
  referredBy?: string; // The code/name of the person who referred this user
  referralBonusClaimed?: boolean; // True if the 1000 XP milestone bonus was triggered
}

export interface SavedAccount {
  name: string;
  email: string;
  avatar: string;
  method: 'email' | 'phone' | 'google';
  lastLogin: number;
}

export interface Flashcard {
  id: string;
  concept: string;      
  category: string;     
  definition: string;   
  syntax: string;       
  exampleCode: string;  
  level?: string;
}

export interface AnalysisToken {
  segment: string;      
  type: string;         
  explanation: string;  
}

export interface AnalysisResult {
  originalCode: string;
  summary: string;      
  concepts: AnalysisToken[];
  bestPracticeTip: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  COURSE = 'COURSE',
  EXAM = 'EXAM',
  REFERENCE = 'REFERENCE',
  FLASHCARDS = 'FLASHCARDS',
  GAME = 'GAME',
  NOTEBOOK = 'NOTEBOOK',
  CHAT = 'CHAT',
  ANALYZER = 'ANALYZER',
  SEARCH = 'SEARCH',
  PLAYGROUND = 'PLAYGROUND',
  PROFILE = 'PROFILE',
  LEADERBOARD = 'LEADERBOARD',
  COMMUNITY = 'COMMUNITY',
  DOWNLOAD = 'DOWNLOAD',
  SUBSCRIPTION = 'SUBSCRIPTION'
}

export interface DailyTip {
  topic: string;
  codeSnippet: string;
  explanation: string;
  funFact: string;
}

export type NoteCategory = 'Study' | 'Work' | 'Daily' | 'Info';

export interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  tags: string[];
  category: NoteCategory;
  authorName?: string; // For shared notes
  isShared?: boolean;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string; // The correct option string
  explanation: string;
  codeBlock?: string;
}

export interface ReferenceTopic {
  id: string;
  title: string;
  emoji: string;
  description: string;
}

export interface LeaderboardEntry {
    id: string;
    name: string;
    avatar: string;
    xp: number;
    rank: number;
}

export type ClassroomMode = 'CONVERSATION' | 'VOICE' | 'FOCUS';

export interface GroupMember {
    id: string;
    name: string;
    avatar: string;
    country: string;
    xp: number;
    level: string;
    isOnline: boolean;
    status: 'IDLE' | 'FOCUSING' | 'SPEAKING' | 'TYPING';
    isFriend: boolean;
}

export interface StudyGroup {
    id: string;
    name: string;
    members: number;
    description: string;
    tags: string[];
    isJoined?: boolean;
    country?: string;
    activeMembers?: GroupMember[];
}

export interface SearchResult {
    term: string;
    definition: string;
    syntax: string;
    example: string;
    related: string[];
}

export type GameMode = 'TRIVIA' | 'BUG_HUNTER' | 'SYNTAX_SPRINT';
export type GameLevel = 'Beginner' | 'Intermediate' | 'Professional';

// --- NEW COURSE TYPES ---

export interface VisualStep {
    line: number;
    description: string;
    variables: Record<string, string>; // e.g., { "x": "5", "y": "10" }
    output?: string;
}

export interface LessonContent {
    title: string;
    concept: string;
    code: string;
    steps: VisualStep[];
    quiz: QuizQuestion[];
}

export interface CourseModule {
    id: string;
    title: string;
    description: string;
    level: GameLevel;
    isLocked: boolean;
    lessons: { id: string; title: string; isCompleted: boolean }[];
}

// --- NEW EXAM TYPES ---

export interface ExamPaper {
    id: string;
    title: string;
    year: string;
    level: GameLevel;
    durationMinutes: number;
    questions: QuizQuestion[];
}
