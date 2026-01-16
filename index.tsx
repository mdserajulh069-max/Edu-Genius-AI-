
import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// --- TYPES ---
export type Subject = string;

export interface SubjectInfo {
  id: Subject;
  icon: string;
  color: string;
}

export type ToolMode = 'SOLVER' | 'NOTES' | 'PYQ' | 'MATERIAL';

export interface AssistantRequest {
  subject: Subject;
  mode: ToolMode;
  query: string;
  language: string;
}

export interface AssistantResponse {
  content: string;
  title: string;
}

export interface AdConfig {
  banner: {
    text: string;
    link: string;
    isActive: boolean;
    color: string;
  };
  sidebar: {
    title: string;
    description: string;
    imageUrl: string;
    link: string;
    isActive: boolean;
  };
  admob: {
    bannerActive: boolean;
    bannerUnitId: string;
    appId: string;
    autoAdsActive: boolean;
    publisherId: string;
    interstitialActive: boolean;
    interstitialUnitId: string;
  };
}

// --- CONSTANTS ---
const DEFAULT_SUBJECTS: SubjectInfo[] = [
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
  { id: 'Global Universities', icon: '🌎', color: 'bg-purple-700' },
  { id: 'SSC (CGL/CHSL/MTS)', icon: '🏢', color: 'bg-slate-600' },
  { id: 'UPSC/IAS', icon: '⚖️', color: 'bg-amber-600' },
  { id: 'JEE (Mains/Adv)', icon: '🚀', color: 'bg-rose-600' },
  { id: 'NEET', icon: '🩺', color: 'bg-red-600' },
];

const MODES: { id: ToolMode; label: string; description: string; icon: React.ReactNode }[] = [
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
  }
];

const ADMIN_EMAILS = [
  'mdserajulhaque976@gmail.com',
  'mdserajulh069@gmail.com',
  'mdmujahidul859790@gmail.com'
];
const ADMIN_PASSWORD = 'md859790';

const COLOR_OPTIONS = [
  'bg-blue-500', 'bg-indigo-500', 'bg-pink-500', 'bg-green-500', 'bg-orange-500', 
  'bg-red-500', 'bg-yellow-500', 'bg-emerald-600', 'bg-teal-700', 'bg-sky-600'
];

// --- COMPONENTS ---

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n');
  return (
    <div className="prose prose-indigo max-w-none text-slate-700">
      {lines.map((line, idx) => {
        if (line.startsWith('### ')) return <h3 key={idx} className="text-xl font-bold mt-6 mb-2 text-indigo-700">{line.replace('### ', '')}</h3>;
        if (line.startsWith('## ')) return <h2 key={idx} className="text-2xl font-bold mt-8 mb-4 text-indigo-800 border-b pb-2">{line.replace('## ', '')}</h2>;
        if (line.startsWith('# ')) return <h1 key={idx} className="text-3xl font-black mt-10 mb-6 text-indigo-900">{line.replace('# ', '')}</h1>;
        if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
          return (
            <div key={idx} className="flex items-start space-x-2 ml-4 mb-1">
              <span className="text-indigo-500 mt-1.5 text-[8px]">●</span>
              <span>{line.trim().substring(2)}</span>
            </div>
          );
        }
        if (line.includes('**')) {
          const parts = line.split('**');
          return (
            <p key={idx} className="mb-3 leading-relaxed">
              {parts.map((part, i) => (i % 2 === 1 ? <strong key={i} className="font-bold text-slate-900">{part}</strong> : part))}
            </p>
          );
        }
        if (line.trim() === '') return <div key={idx} className="h-2"></div>;
        return <p key={idx} className="mb-3 leading-relaxed">{line}</p>;
      })}
    </div>
  );
};

// --- SERVICES ---

const getAssistantResponse = async (params: AssistantRequest): Promise<AssistantResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  const { subject, mode, query, language } = params;
  
  const systemInstructions = `
    You are EduGenius AI.
    Subject: ${subject}
    Language: ${language}
    Mode: ${mode}

    INSTRUCTIONS:
    1. For Hindi/Bengali subjects, provide deep linguistic and grammatical insights.
    2. For Math/Physics/Chem, show step-by-step solutions with diagrams described in text.
    3. For Islamic/Arab studies, refer to historical texts and cultural contexts accurately.
    4. Provide shortcut methods for competitive exams (SSC/UPSC/JEE).
    Maintain a professional tone. Use Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: query }] }],
      config: { systemInstruction: systemInstructions, temperature: 0.7 },
    });
    return {
      title: `${subject} Knowledge Hub`,
      content: response.text || "Unexpected response from knowledge engine.",
    };
  } catch (error) {
    throw new Error("API Connection failed. Please check your network.");
  }
};

// --- MAIN APP ---

const App: React.FC = () => {
  const [subjects, setSubjects] = useState<SubjectInfo[]>(DEFAULT_SUBJECTS);
  const [selectedSubject, setSelectedSubject] = useState<Subject>('Mathematics');
  const [selectedMode, setSelectedMode] = useState<ToolMode>('SOLVER');
  const [language, setLanguage] = useState<string>('English');
  const [query, setQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<AssistantResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Auth & Admin Panel
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isAdminPanelVisible, setIsAdminPanelVisible] = useState<boolean>(false);
  const [isInterstitialVisible, setIsInterstitialVisible] = useState<boolean>(false);

  // New Subject Form
  const [newSubName, setNewSubName] = useState('');
  const [newSubIcon, setNewSubIcon] = useState('📚');
  const [newSubColor, setNewSubColor] = useState('bg-indigo-500');
  
  // Ad Configuration
  const [adConfig, setAdConfig] = useState<AdConfig>({
    banner: {
      text: "🚀 Join Our Special Arabic & Islamic Studies Batch! Enroll Now.",
      link: "#",
      isActive: true,
      color: "bg-indigo-600"
    },
    sidebar: {
      title: "Competitive Exam Guide",
      description: "Master SSC, UPSC and State Exams with AI-curated mocks.",
      imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=200&h=120",
      link: "#",
      isActive: true
    },
    admob: {
      bannerActive: true,
      bannerUnitId: "ca-app-pub-9675701397964837/9748181208",
      appId: "ca-app-pub-9675701397964837~4642360039",
      autoAdsActive: false,
      publisherId: "pub-9675701397964837",
      interstitialActive: true,
      interstitialUnitId: "ca-app-pub-9675701397964837/xxxxxxxxxx"
    }
  });

  const responseRef = useRef<HTMLDivElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (ADMIN_EMAILS.includes(loginEmail) && loginPass === ADMIN_PASSWORD) {
      setIsAdminLoggedIn(true);
      setShowLoginModal(false);
      setIsAdminPanelVisible(true);
      setLoginError('');
    } else {
      setLoginError('Invalid credentials.');
    }
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setIsAdminPanelVisible(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (adConfig.admob.interstitialActive) {
      setIsInterstitialVisible(true);
      await new Promise(r => setTimeout(r, 2000));
      setIsInterstitialVisible(false);
    }

    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await getAssistantResponse({
        subject: selectedSubject,
        mode: selectedMode,
        query,
        language
      });
      setResponse(result);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (response && responseRef.current) {
      responseRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [response]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-900">
      {/* Interstitial Simulator */}
      {isInterstitialVisible && (
        <div className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl scale-in-center">
            <div className="h-48 bg-indigo-600 flex items-center justify-center text-white">
              <svg className="w-16 h-16 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div className="p-8 text-center">
              <h3 className="text-2xl font-black mb-2">EduGenius Pro</h3>
              <p className="text-slate-500 text-sm mb-6">Unlock all premium subjects and an ad-free experience.</p>
              <button onClick={() => setIsInterstitialVisible(false)} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-all">CLOSE AD</button>
            </div>
            <div className="bg-slate-100 p-2 text-[8px] font-mono text-center text-slate-400">Unit ID: {adConfig.admob.interstitialUnitId}</div>
          </div>
        </div>
      )}

      {/* Internal Banner */}
      {adConfig.banner.isActive && (
        <div className={`${adConfig.banner.color} text-white py-2 px-4 text-center text-xs font-bold tracking-wide relative z-40`}>
          <a href={adConfig.banner.link} className="hover:underline">{adConfig.banner.text}</a>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black text-xl shadow-indigo-200 shadow-lg">E</div>
            <div>
              <h1 className="text-lg font-black tracking-tight leading-none">EduGenius AI</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Universal Learning Engine</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {isAdminLoggedIn ? (
              <button onClick={() => setIsAdminPanelVisible(!isAdminPanelVisible)} className="text-[10px] font-black border-2 border-amber-500 text-amber-600 px-3 py-1.5 rounded-full hover:bg-amber-50 transition-all">
                {isAdminPanelVisible ? 'HIDE ADMIN' : 'ADMIN PANEL'}
              </button>
            ) : (
              <button onClick={() => setShowLoginModal(true)} className="text-[10px] font-black border-2 border-slate-200 text-slate-400 px-3 py-1.5 rounded-full hover:bg-slate-50 transition-all">ADMIN</button>
            )}
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="text-xs font-bold bg-slate-100 border-none rounded-lg px-3 py-1.5 focus:ring-indigo-500">
              <option>English</option>
              <option>Hindi</option>
              <option>Bengali</option>
              <option>Arabic</option>
            </select>
          </div>
        </div>
      </header>

      {/* AdMob Banner Simulation */}
      {adConfig.admob.bannerActive && (
        <div className="w-full bg-slate-100 border-b flex justify-center py-2">
          <div className="w-full max-w-[728px] h-[90px] border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 text-[10px] font-bold uppercase tracking-widest bg-white">
            <span>Google AdMob Banner</span>
            <span className="opacity-50 text-[8px] mt-1">ID: {adConfig.admob.bannerUnitId}</span>
          </div>
        </div>
      )}

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Hub */}
        {isAdminLoggedIn && isAdminPanelVisible && (
          <section className="mb-8 bg-amber-50 border-2 border-amber-200 rounded-3xl p-8 shadow-xl animate-in slide-in-from-top-4 duration-500">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-amber-900">Super Admin Dashboard</h2>
              <button onClick={handleLogout} className="text-[10px] font-black bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700">LOGOUT</button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-white/60 p-6 rounded-2xl border border-amber-100 space-y-4">
                <h3 className="text-xs font-black uppercase text-amber-800 tracking-widest">Ad Settings</h3>
                <div className="space-y-2">
                   <div className="flex items-center justify-between text-xs font-bold">
                     <span>Interstitial Ads</span>
                     <button onClick={() => setAdConfig({...adConfig, admob: {...adConfig.admob, interstitialActive: !adConfig.admob.interstitialActive}})} className={`w-10 h-5 rounded-full relative transition-colors ${adConfig.admob.interstitialActive ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${adConfig.admob.interstitialActive ? 'right-1' : 'left-1'}`} />
                     </button>
                   </div>
                   <div className="flex items-center justify-between text-xs font-bold">
                     <span>Banner Ads</span>
                     <button onClick={() => setAdConfig({...adConfig, admob: {...adConfig.admob, bannerActive: !adConfig.admob.bannerActive}})} className={`w-10 h-5 rounded-full relative transition-colors ${adConfig.admob.bannerActive ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${adConfig.admob.bannerActive ? 'right-1' : 'left-1'}`} />
                     </button>
                   </div>
                </div>
              </div>

              <div className="lg:col-span-2 bg-white/60 p-6 rounded-2xl border border-amber-100 space-y-4">
                 <h3 className="text-xs font-black uppercase text-amber-800 tracking-widest">Subject Manager</h3>
                 <form onSubmit={(e) => { e.preventDefault(); if(!newSubName) return; setSubjects([...subjects, {id: newSubName, icon: newSubIcon, color: newSubColor}]); setNewSubName(''); }} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <input value={newSubName} onChange={e => setNewSubName(e.target.value)} placeholder="New Subject..." className="col-span-2 text-xs font-bold p-3 rounded-xl border border-amber-200" />
                    <input value={newSubIcon} onChange={e => setNewSubIcon(e.target.value)} placeholder="Icon" className="text-xs font-bold p-3 rounded-xl border border-amber-200 text-center" />
                    <button type="submit" className="bg-amber-600 text-white text-[10px] font-black rounded-xl uppercase">Add Subject</button>
                 </form>
                 <div className="flex flex-wrap gap-2">
                    {subjects.map(s => (
                      <div key={s.id} className="flex items-center bg-white border border-amber-200 rounded-lg px-2 py-1 space-x-2">
                        <span className="text-xs">{s.icon} {s.id}</span>
                        <button onClick={() => setSubjects(subjects.filter(sub => sub.id !== s.id))} className="text-red-500 hover:text-red-700">×</button>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: UI Controls */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 overflow-hidden">
               <h2 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-4">Academic Category</h2>
               <div className="grid grid-cols-3 gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {subjects.map(sub => (
                    <button 
                      key={sub.id} 
                      onClick={() => setSelectedSubject(sub.id)}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all border-2 ${selectedSubject === sub.id ? 'border-indigo-600 bg-indigo-50 shadow-sm' : 'border-transparent bg-slate-50 hover:bg-slate-100'}`}
                    >
                      <span className="text-2xl mb-1">{sub.icon}</span>
                      <span className="text-[9px] font-black uppercase text-center leading-tight h-6 flex items-center">{sub.id}</span>
                    </button>
                  ))}
               </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
               <h2 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-4">Select Output Type</h2>
               <div className="space-y-3">
                 {MODES.map(m => (
                    <button 
                      key={m.id} 
                      onClick={() => setSelectedMode(m.id)}
                      className={`w-full flex items-center p-4 rounded-2xl transition-all border-2 ${selectedMode === m.id ? 'border-indigo-600 bg-indigo-50' : 'border-transparent bg-slate-50 hover:bg-slate-100'}`}
                    >
                      <div className={`p-2 rounded-lg mr-4 ${selectedMode === m.id ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400'}`}>{m.icon}</div>
                      <div className="text-left">
                        <p className="text-sm font-black">{m.label}</p>
                        <p className="text-[10px] text-slate-500 leading-tight">{m.description}</p>
                      </div>
                    </button>
                 ))}
               </div>
            </div>

            {adConfig.sidebar.isActive && (
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden group shadow-sm">
                 <img src={adConfig.sidebar.imageUrl} className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-500" />
                 <div className="p-5">
                    <h4 className="text-sm font-black mb-1">{adConfig.sidebar.title}</h4>
                    <p className="text-xs text-slate-500 mb-4">{adConfig.sidebar.description}</p>
                    <a href={adConfig.sidebar.link} className="block text-center bg-slate-900 text-white py-3 rounded-xl text-xs font-black hover:bg-indigo-600 transition-colors">Learn More</a>
                 </div>
              </div>
            )}
          </aside>

          {/* Right Column: Content */}
          <div className="lg:col-span-8 space-y-6">
            <section className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
              <div className="relative z-10">
                <h2 className="text-4xl font-black mb-4 leading-tight">Expert Query Center</h2>
                <p className="text-slate-400 text-sm max-w-md mb-10 leading-relaxed">Type your specific question about {selectedSubject}. Our intelligence engine will synthesize university-level answers for you.</p>
                <form onSubmit={handleSubmit} className="relative">
                  <textarea 
                    value={query} 
                    onChange={e => setQuery(e.target.value)} 
                    placeholder={`E.g. Explain historical context of the subject in ${language}...`}
                    className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-lg text-white placeholder-white/20 min-h-[180px] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                  />
                  <button 
                    disabled={isLoading || !query.trim()}
                    className="absolute bottom-5 right-5 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all active:scale-95 disabled:opacity-50 flex items-center space-x-2"
                  >
                    {isLoading ? <span>Synthesizing...</span> : <span>Query AI</span>}
                  </button>
                </form>
              </div>
              <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -mt-20 -mr-20"></div>
            </section>

            {/* Response Section */}
            {(response || error || isLoading) && (
              <section ref={responseRef} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm animate-in fade-in duration-500">
                <div className="bg-slate-50 border-b px-8 py-5 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">{isLoading ? 'AI is thinking...' : response?.title}</h3>
                  </div>
                  {!isLoading && response && <button onClick={() => window.print()} className="text-[10px] font-black text-indigo-600 border border-indigo-100 px-4 py-1.5 rounded-full hover:bg-white">EXPORT PDF</button>}
                </div>
                <div className="p-10">
                  {isLoading ? (
                    <div className="space-y-4 animate-pulse">
                      <div className="h-4 bg-slate-100 rounded-full w-3/4"></div>
                      <div className="h-4 bg-slate-100 rounded-full w-full"></div>
                      <div className="h-4 bg-slate-100 rounded-full w-5/6"></div>
                      <div className="h-32 bg-slate-50 border-2 border-dashed border-slate-100 rounded-3xl flex items-center justify-center text-slate-300 font-bold italic">Synthesizing International Databases...</div>
                    </div>
                  ) : error ? (
                    <div className="py-12 text-center">
                      <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full mx-auto flex items-center justify-center mb-4">⚠️</div>
                      <h4 className="text-lg font-black text-slate-800 mb-2">Technical Disruption</h4>
                      <p className="text-slate-500 text-sm max-w-xs mx-auto">{error}</p>
                    </div>
                  ) : response ? (
                    <MarkdownRenderer content={response.content} />
                  ) : null}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-900">Admin Login</h2>
              <button onClick={() => setShowLoginModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">✕</button>
            </div>
            <form onSubmit={handleLogin} className="space-y-6">
              {loginError && <p className="text-red-500 text-[10px] font-bold bg-red-50 p-3 rounded-xl border border-red-100">{loginError}</p>}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Administrator Email</label>
                <input type="email" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Secret Passcode</label>
                <input type="password" required value={loginPass} onChange={e => setLoginPass(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-indigo-600 transition-all shadow-xl text-sm uppercase tracking-widest">Verify & Enter</button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center">
          <div>
            <h5 className="font-black text-slate-900">EduGenius Intelligence v3.0</h5>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Powered by Google Gemini 3 Flash</p>
          </div>
          <div className="mt-8 md:mt-0 flex space-x-6">
             <span className="text-[10px] font-black text-slate-300 cursor-default">App ID: {adConfig.admob.appId}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

// --- RENDER ---
const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<React.StrictMode><App /></React.StrictMode>);
}
