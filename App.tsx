
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Subject, SubjectInfo, ToolMode, AssistantRequest, AssistantResponse, AdConfig } from './types';
import { DEFAULT_SUBJECTS, MODES } from './constants';
import { getAssistantResponse } from './services/geminiService';
import MarkdownRenderer from './components/MarkdownRenderer';

const ADMIN_EMAILS = [
  'mdserajulhaque976@gmail.com',
  'mdserajulh069@gmail.com',
  'mdmujahidul859790@gmail.com'
];
const ADMIN_PASSWORD = 'md859790';

const COLOR_OPTIONS = [
  'bg-blue-500', 'bg-indigo-500', 'bg-pink-500', 'bg-green-500', 'bg-orange-500', 
  'bg-red-500', 'bg-yellow-500', 'bg-emerald-600', 'bg-teal-700', 'bg-sky-600',
  'bg-purple-500', 'bg-fuchsia-600', 'bg-rose-600', 'bg-lime-700', 'bg-stone-600'
];

const App: React.FC = () => {
  const [subjects, setSubjects] = useState<SubjectInfo[]>(DEFAULT_SUBJECTS);
  const [selectedSubject, setSelectedSubject] = useState<Subject>('Mathematics');
  const [selectedMode, setSelectedMode] = useState<ToolMode>('SOLVER');
  const [language, setLanguage] = useState<string>('English');
  const [query, setQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<AssistantResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  const [isAdminPanelVisible, setIsAdminPanelVisible] = useState<boolean>(false);
  const [isInterstitialVisible, setIsInterstitialVisible] = useState<boolean>(false);

  // New Subject Form State
  const [newSubName, setNewSubName] = useState('');
  const [newSubIcon, setNewSubIcon] = useState('📚');
  const [newSubColor, setNewSubColor] = useState('bg-indigo-500');
  
  // Ad Configuration
  const [adConfig, setAdConfig] = useState<AdConfig>({
    banner: {
      text: "🚀 New WBCS Special Batch Starting Next Monday! Enroll Now & Save 40%",
      link: "#",
      isActive: true,
      color: "bg-indigo-600"
    },
    sidebar: {
      title: "UPSC 2025 Test Series",
      description: "Get access to 50+ full-length mocks curated by top educators.",
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
      interstitialActive: false,
      interstitialUnitId: "ca-app-pub-9675701397964837/xxxxxxxxxx"
    }
  });

  const responseRef = useRef<HTMLDivElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (ADMIN_EMAILS.includes(loginEmail) && loginPass === ADMIN_PASSWORD) {
      setIsAdminLoggedIn(true);
      setShowLoginModal(false);
      setLoginError('');
      setIsAdminPanelVisible(true);
    } else {
      setLoginError('Invalid credentials or unauthorized email.');
    }
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setIsAdminPanelVisible(false);
    setLoginEmail('');
    setLoginPass('');
  };

  const showInterstitial = () => {
    return new Promise<void>((resolve) => {
      setIsInterstitialVisible(true);
      setTimeout(() => {
        setIsInterstitialVisible(false);
        resolve();
      }, 3000);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (adConfig.admob.interstitialActive) {
      await showInterstitial();
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

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim()) return;
    
    const newSub: SubjectInfo = {
      id: newSubName.trim(),
      icon: newSubIcon || '📚',
      color: newSubColor
    };

    setSubjects([...subjects, newSub]);
    setNewSubName('');
    setNewSubIcon('📚');
  };

  const handleDeleteSubject = (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id));
    if (selectedSubject === id) {
      setSelectedSubject(subjects[0]?.id || '');
    }
  };

  useEffect(() => {
    if (response && responseRef.current) {
      responseRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [response]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Interstitial Ad Simulation Overlay */}
      {isInterstitialVisible && (
        <div className="fixed inset-0 z-[200] bg-slate-900 flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute top-4 right-4">
            <button 
              onClick={() => setIsInterstitialVisible(false)}
              className="text-white/40 hover:text-white transition-colors flex items-center space-x-2 text-xs font-bold uppercase tracking-widest"
            >
              <span>Skip Ad in 3s</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-500">
            <div className="aspect-video bg-indigo-600 flex items-center justify-center text-white">
              <div className="text-center p-8">
                <div className="w-16 h-16 bg-white/20 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.435 15.657a1 1 0 010-1.414l.707-.707a1 1 0 111.414 1.414l-.707.707a1 1 0 01-1.414 0zM5.757 15.657a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707z" /></svg>
                </div>
                <h3 className="text-2xl font-black mb-2">Unlock Your Potential</h3>
                <p className="text-indigo-100 text-sm opacity-90">Join 1M+ students learning with EduGenius AI across the globe.</p>
              </div>
            </div>
            <div className="p-6 bg-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-bold">AD</div>
                <div>
                  <p className="text-xs font-black text-slate-900 leading-tight">EduGenius Premium</p>
                  <p className="text-[10px] text-slate-500">Go ad-free today.</p>
                </div>
              </div>
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-xs font-bold shadow-lg shadow-indigo-200">INSTALL NOW</button>
            </div>
          </div>
          <p className="mt-8 text-white/30 text-[10px] font-bold uppercase tracking-widest font-mono">Unit: {adConfig.admob.interstitialUnitId}</p>
        </div>
      )}

      {/* Internal Banner Ad */}
      {adConfig.banner.isActive && (
        <div className={`${adConfig.banner.color} text-white py-2 px-4 text-center text-sm font-medium relative overflow-hidden group`}>
          <a href={adConfig.banner.link} className="hover:underline flex items-center justify-center space-x-2">
            <span>{adConfig.banner.text}</span>
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">
              E
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-none">EduGenius AI</h1>
              <p className="text-xs text-slate-500 font-medium tracking-tight">Global University & Exam Hub</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAdminLoggedIn ? (
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setIsAdminPanelVisible(!isAdminPanelVisible)}
                  className={`text-[10px] font-bold px-3 py-1.5 rounded-full transition-all border ${isAdminPanelVisible ? 'bg-amber-100 border-amber-300 text-amber-700' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'}`}
                >
                  {isAdminPanelVisible ? 'HIDE ADMIN' : 'SHOW ADMIN'}
                </button>
                <button 
                  onClick={handleLogout}
                  className="text-[10px] font-bold px-3 py-1.5 rounded-full border border-red-200 text-red-600 hover:bg-red-50"
                >
                  LOGOUT
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowLoginModal(true)}
                className="text-[10px] font-bold px-3 py-1.5 rounded-full border border-slate-200 text-slate-500 hover:bg-slate-100 transition-all"
              >
                ADMIN LOGIN
              </button>
            )}
          </div>
        </div>
      </header>

      {/* AdMob Banner Display */}
      {adConfig.admob.bannerActive && (
        <div className="w-full flex justify-center py-2 bg-slate-50 border-b">
          <div className="w-full max-w-[728px] h-[90px] bg-slate-200 border border-dashed border-slate-400 flex flex-col items-center justify-center text-slate-500 text-[10px] font-bold uppercase tracking-widest relative">
            <span className="bg-white/80 px-2 py-0.5 rounded text-[8px] absolute top-1 right-1 border shadow-xs">AdMob Placement</span>
            <div className="flex flex-col items-center text-center">
              <svg className="w-5 h-5 mb-1 opacity-40" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" /><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" /></svg>
              <span>Google AdMob Banner</span>
              <span className="text-[7px] opacity-60 mt-0.5 font-mono">Unit: {adConfig.admob.bannerUnitId}</span>
            </div>
          </div>
        </div>
      )}

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {isAdminLoggedIn && isAdminPanelVisible && (
          <section className="mb-8 bg-amber-50 border-2 border-dashed border-amber-200 rounded-3xl p-8 animate-in fade-in slide-in-from-top-4 duration-500 shadow-xl space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center font-black text-xl shadow-lg">A</div>
                <div>
                  <h2 className="text-xl font-black text-amber-900 leading-none">Super Admin Hub</h2>
                  <p className="text-[10px] text-amber-700 font-bold uppercase tracking-wider mt-1">Authorized: {loginEmail}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAdminPanelVisible(false)}
                className="text-amber-900 hover:bg-amber-100 p-2 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              {/* Ad Controls Area */}
              <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Internal Banner Control */}
                <div className="bg-white/50 rounded-2xl p-5 border border-amber-100 space-y-4">
                  <h3 className="text-xs font-black text-amber-800 uppercase tracking-widest flex items-center">
                    <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                    Top Promo Banner
                  </h3>
                  <div className="space-y-3">
                    <label className="block">
                      <span className="text-[10px] font-bold text-amber-700 uppercase">Banner Text</span>
                      <textarea 
                        rows={2}
                        value={adConfig.banner.text}
                        onChange={(e) => setAdConfig({...adConfig, banner: {...adConfig.banner, text: e.target.value}})}
                        className="mt-1 block w-full rounded-xl border-amber-200 bg-white text-xs p-3 shadow-sm focus:ring-amber-500 resize-none"
                      />
                    </label>
                    <div className="flex items-center justify-between bg-amber-100/30 p-2 rounded-lg">
                      <span className="text-[10px] font-bold text-amber-700 uppercase">Enable Banner</span>
                      <button 
                        onClick={() => setAdConfig({...adConfig, banner: {...adConfig.banner, isActive: !adConfig.banner.isActive}})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${adConfig.banner.isActive ? 'bg-amber-600' : 'bg-slate-300'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${adConfig.banner.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sidebar Control */}
                <div className="bg-white/50 rounded-2xl p-5 border border-amber-100 space-y-4">
                  <h3 className="text-xs font-black text-amber-800 uppercase tracking-widest flex items-center">
                    <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                    Sidebar Promo
                  </h3>
                  <div className="space-y-3">
                    <label className="block">
                      <span className="text-[10px] font-bold text-amber-700 uppercase">Card Title</span>
                      <input 
                        type="text" 
                        value={adConfig.sidebar.title}
                        onChange={(e) => setAdConfig({...adConfig, sidebar: {...adConfig.sidebar, title: e.target.value}})}
                        className="mt-1 block w-full rounded-xl border-amber-200 bg-white text-xs p-3 shadow-sm"
                      />
                    </label>
                    <div className="flex items-center justify-between bg-amber-100/30 p-2 rounded-lg">
                      <span className="text-[10px] font-bold text-amber-700 uppercase">Enable Sidebar</span>
                      <button 
                        onClick={() => setAdConfig({...adConfig, sidebar: {...adConfig.sidebar, isActive: !adConfig.sidebar.isActive}})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${adConfig.sidebar.isActive ? 'bg-amber-600' : 'bg-slate-300'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${adConfig.sidebar.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Google AdMob Control */}
                <div className="bg-white/50 rounded-2xl p-5 border border-amber-100 space-y-4">
                  <h3 className="text-xs font-black text-amber-800 uppercase tracking-widest flex items-center">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                    Google AdMob
                  </h3>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                    <label className="block">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Banner Unit ID</span>
                      <input 
                        type="text" 
                        value={adConfig.admob.bannerUnitId}
                        onChange={(e) => setAdConfig({...adConfig, admob: {...adConfig.admob, bannerUnitId: e.target.value}})}
                        className="mt-1 block w-full rounded-xl border-slate-200 bg-white text-[10px] p-2 shadow-sm font-mono"
                      />
                    </label>
                    <div className="flex flex-col space-y-2 mt-2">
                      <div className="flex items-center justify-between bg-indigo-50 p-2 rounded-lg">
                        <span className="text-[10px] font-bold text-indigo-700 uppercase">Banner Ads</span>
                        <button 
                          onClick={() => setAdConfig({...adConfig, admob: {...adConfig.admob, bannerActive: !adConfig.admob.bannerActive}})}
                          className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${adConfig.admob.bannerActive ? 'bg-indigo-600' : 'bg-slate-300'}`}
                        >
                          <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${adConfig.admob.bannerActive ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between bg-indigo-50 p-2 rounded-lg">
                        <span className="text-[10px] font-bold text-indigo-700 uppercase">Interstitial</span>
                        <button 
                          onClick={() => setAdConfig({...adConfig, admob: {...adConfig.admob, interstitialActive: !adConfig.admob.interstitialActive}})}
                          className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${adConfig.admob.interstitialActive ? 'bg-indigo-600' : 'bg-slate-300'}`}
                        >
                          <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${adConfig.admob.interstitialActive ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subjects Management Section */}
              <div className="bg-white/50 rounded-2xl p-5 border border-amber-100 space-y-4">
                <h3 className="text-xs font-black text-amber-800 uppercase tracking-widest flex items-center">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                  Academic Subjects
                </h3>
                
                <form onSubmit={handleAddSubject} className="space-y-3">
                  <div className="grid grid-cols-4 gap-2">
                    <input 
                      type="text" 
                      value={newSubIcon}
                      onChange={(e) => setNewSubIcon(e.target.value)}
                      className="col-span-1 rounded-xl border-amber-200 text-center bg-white text-lg p-2"
                      placeholder="Icon"
                    />
                    <input 
                      type="text" 
                      value={newSubName}
                      onChange={(e) => setNewSubName(e.target.value)}
                      className="col-span-3 rounded-xl border-amber-200 bg-white text-xs p-2"
                      placeholder="Subject Name..."
                    />
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {COLOR_OPTIONS.map(c => (
                      <button 
                        key={c}
                        type="button"
                        onClick={() => setNewSubColor(c)}
                        className={`w-4 h-4 rounded-full border-2 ${c} ${newSubColor === c ? 'border-slate-900 scale-125' : 'border-transparent'}`}
                      />
                    ))}
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-amber-600 text-white font-bold py-2 rounded-xl text-[10px] uppercase tracking-widest"
                  >
                    + Add New Subject
                  </button>
                </form>

                <div className="max-h-[160px] overflow-y-auto pr-1 custom-scrollbar space-y-1">
                  {subjects.map(s => (
                    <div key={s.id} className="flex items-center justify-between bg-white/60 p-2 rounded-lg group">
                      <div className="flex items-center space-x-2">
                        <span>{s.icon}</span>
                        <span className="text-[10px] font-bold text-slate-700">{s.id}</span>
                      </div>
                      <button 
                        onClick={() => handleDeleteSubject(s.id)}
                        className="text-red-400 opacity-0 group-hover:opacity-100 hover:text-red-600 transition-all"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="pt-4 flex justify-center">
              <button className="bg-amber-600 text-white px-12 py-3 rounded-2xl text-sm font-black shadow-lg hover:bg-amber-700 transition-all hover:-translate-y-1 active:scale-95 flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                <span>SAVE CHANGES</span>
              </button>
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar: Controls */}
          <div className="lg:col-span-4 space-y-6">
            <section className="bg-white rounded-2xl shadow-sm border p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Academic Category</h2>
                <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">{subjects.length} FIELDS</span>
              </div>
              <div className="grid grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                {subjects.map((sub) => {
                  const isSelected = selectedSubject === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setSelectedSubject(sub.id)}
                      className={`relative flex flex-col items-center justify-center p-3 rounded-xl transition-all border-2 duration-200 ${
                        isSelected 
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm scale-[1.03]' 
                          : 'border-transparent bg-slate-50 text-slate-500 hover:bg-slate-100 hover:scale-[1.02]'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-1 right-1 bg-indigo-600 text-white rounded-full p-0.5 shadow-sm transform transition-transform animate-in fade-in zoom-in duration-300">
                          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                      <span className="text-2xl mb-1">{sub.icon}</span>
                      <span className="text-[9px] font-bold text-center uppercase tracking-tighter leading-tight h-6 flex items-center">{sub.id}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Select Output Type</h2>
              <div className="space-y-3">
                {MODES.map((m) => {
                  const isSelected = selectedMode === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMode(m.id)}
                      className={`w-full flex items-center p-4 rounded-xl border-2 text-left transition-all duration-200 relative ${
                        isSelected 
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 scale-[1.01]' 
                          : 'border-transparent bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <div className={`p-2 rounded-lg mr-4 transition-colors ${isSelected ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400'}`}>
                        {m.icon}
                      </div>
                      <div className="flex-grow">
                        <p className="font-bold text-sm">{m.label}</p>
                        <p className="text-[11px] opacity-80 leading-tight">{m.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Right Area: Prompt & Result */}
          <div className="lg:col-span-8 flex flex-col h-full space-y-6">
            <section className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
              <div className="relative z-10">
                <h2 className="text-3xl font-black mb-2">Global Expert Search</h2>
                <p className="text-slate-400 mb-8 max-w-lg">
                  Access curricula from {selectedSubject === 'Global Universities' ? 'any university in the world' : selectedSubject}. Enter your topic, university name, or exam code.
                </p>

                <form onSubmit={handleSubmit} className="relative">
                  <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={`E.g. Ask anything about ${selectedSubject}...`}
                    className="w-full bg-white/10 border border-white/20 rounded-2xl p-5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[160px] resize-none text-lg transition-all focus:bg-white/15"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !query.trim()}
                    className="absolute bottom-4 right-4 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold flex items-center space-x-2 shadow-lg hover:bg-indigo-500 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span className="flex items-center space-x-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Processing...</span>
                      </span>
                    ) : (
                      <>
                        <span>Submit Intelligence</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              </div>

              <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-60 h-60 bg-white/5 rounded-full blur-3xl"></div>
            </section>

            {/* Response Section */}
            {(response || error || isLoading) && (
              <section ref={responseRef} className="bg-white rounded-3xl shadow-sm border overflow-hidden min-h-[400px]">
                <div className="bg-slate-50 border-b px-8 py-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <h3 className="font-bold text-slate-800 flex items-center space-x-2">
                      <span>{isLoading ? 'Retrieving Knowledge...' : response?.title}</span>
                    </h3>
                  </div>
                  {response && (
                    <button 
                      onClick={() => window.print()}
                      className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-widest border border-indigo-200 px-3 py-1 rounded-full bg-white transition-all hover:shadow-md active:scale-95"
                    >
                      Export PDF
                    </button>
                  )}
                </div>

                <div className="p-8">
                  {isLoading ? (
                    <div className="space-y-6 animate-pulse">
                      <div className="h-8 bg-slate-100 rounded w-1/2"></div>
                      <div className="space-y-3">
                        <div className="h-4 bg-slate-100 rounded w-full"></div>
                        <div className="h-4 bg-slate-100 rounded w-11/12"></div>
                      </div>
                      <div className="h-40 bg-slate-50 rounded-2xl w-full border-2 border-dashed border-slate-100 flex items-center justify-center text-slate-300 font-bold italic">Synthesizing...</div>
                    </div>
                  ) : error ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <h4 className="text-xl font-bold text-slate-800 mb-2">Error Occurred</h4>
                      <p className="text-slate-500 max-w-sm text-sm">{error}</p>
                    </div>
                  ) : response ? (
                    <div className="max-w-none">
                      <MarkdownRenderer content={response.content} />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                        <svg className="w-10 h-10 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <h4 className="text-slate-900 font-bold mb-1">Knowledge Engine Ready</h4>
                      <p className="text-slate-400 text-sm max-w-xs leading-relaxed">Select a subject and type your query.</p>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>

      {/* Admin Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 transform animate-in slide-in-from-bottom-8 duration-500">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-900 leading-tight">Admin Login</h2>
              <button onClick={() => setShowLoginModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              {loginError && (
                <div className="bg-red-50 text-red-600 text-[10px] font-bold p-3 rounded-xl border border-red-100 flex items-center space-x-2">
                  <span>{loginError}</span>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</label>
                <input 
                  type="email" 
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                <input 
                  type="password" 
                  required
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-indigo-600 transition-all active:scale-95 text-sm uppercase"
              >
                Access Portal
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h5 className="font-bold text-slate-900 mb-1">EduGenius Intelligence v2.1</h5>
            <p className="text-slate-400 text-xs">Dynamic Learning Engine. Powered by Gemini 3 Flash.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
