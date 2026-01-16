
import React from 'react';
import { SubjectInfo, ToolMode } from './types';

export const DEFAULT_SUBJECTS: SubjectInfo[] = [
  { id: 'Mathematics', icon: '📐', color: 'bg-blue-500' },
  { id: 'Physics', icon: '⚛️', color: 'bg-indigo-500' },
  { id: 'Chemistry', icon: '🧪', color: 'bg-pink-500' },
  { id: 'Biology', icon: '🧬', color: 'bg-green-500' },
  { id: 'English', icon: '📖', color: 'bg-orange-500' },
  { id: 'Hindi', icon: '🇮🇳', color: 'bg-red-500' },
  { id: 'Bengali', icon: '🎨', color: 'bg-yellow-500' },
  { id: 'Arabic', icon: '🕌', color: 'bg-emerald-600' },
  { id: 'Islamic Culture and History', icon: '☪️', color: 'bg-teal-700' },
  { id: 'Arab Culture and Islamic Studies', icon: '📜', color: 'bg-emerald-800' },
  { id: 'Economics', icon: '📈', color: 'bg-sky-600' },
  { id: 'Philosophy', icon: '💭', color: 'bg-purple-500' },
  { id: 'Political Science', icon: '🗳️', color: 'bg-blue-800' },
  { id: 'Sociology', icon: '👥', color: 'bg-orange-600' },
  { id: 'SSC (CGL/CHSL/MTS)', icon: '🏢', color: 'bg-slate-600' },
  { id: 'UPSC/IAS', icon: '⚖️', color: 'bg-amber-600' },
  { id: 'JEE (Mains/Adv)', icon: '🚀', color: 'bg-rose-600' },
  { id: 'NEET', icon: '🩺', color: 'bg-red-600' },
  { id: 'UGC NET', icon: '🎓', color: 'bg-blue-700' },
  { id: 'WBPSC (WBCS/Misc)', icon: '🏛️', color: 'bg-emerald-700' },
  { id: 'AUAT', icon: '🕌', color: 'bg-lime-700' },
  { id: 'CUET / Entrance', icon: '📝', color: 'bg-fuchsia-600' },
  { id: 'University Engineering', icon: '⚙️', color: 'bg-slate-700' },
  { id: 'Medical Science', icon: '🏥', color: 'bg-emerald-600' },
  { id: 'Commerce/MBA', icon: '📊', color: 'bg-violet-600' },
  { id: 'Law/Civics', icon: '📜', color: 'bg-stone-600' },
  { id: 'Global Universities', icon: '🌎', color: 'bg-purple-700' },
  { id: 'History', icon: '📅', color: 'bg-amber-700' },
  { id: 'Geography', icon: '🌍', color: 'bg-cyan-500' },
];

export const MODES: { id: ToolMode; label: string; description: string; icon: React.ReactNode }[] = [
  { 
    id: 'SOLVER', 
    label: 'Problem Solver', 
    description: 'Solve complex equations, logical puzzles, or technical questions.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    )
  },
  { 
    id: 'NOTES', 
    label: 'Advanced Notes', 
    description: 'Lecture summaries, concept maps, and board-specific notes.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    )
  },
  { 
    id: 'PYQ', 
    label: 'Exam Archive', 
    description: 'Previous Year Questions for SSC, UPSC, JEE, WBPSC, and University exams.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  { 
    id: 'MATERIAL', 
    label: 'Study Vault', 
    description: 'Specialized materials for graduate and professional exams.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )
  }
];
