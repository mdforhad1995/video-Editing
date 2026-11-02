import React, { useState, useEffect, useRef } from 'react';
import { Video, Menu, X, ArrowUpRight, Globe, ChevronDown, Check, Shield, Camera } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SUPPORTED_LANGUAGES, Language } from '../data/translations';

interface NavbarProps {
  onOpenTestEdit: () => void;
  onOpenAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenTestEdit, onOpenAdmin }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  const { currentLanguage, setLanguage, currentOption, t, isRtl } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close language dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target as Node)
      ) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLanguage = (code: Language) => {
    setLanguage(code);
    setLangMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-[#08090D]/90 backdrop-blur-md border-b border-slate-800/80 py-3.5 shadow-xl shadow-black/20'
          : 'bg-transparent py-5 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#"
          className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-white whitespace-nowrap shrink-0 group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform duration-200">
            <Video className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
            <span>Clipp<span className="text-cyan-400">Asia</span></span>
            <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-slate-300 px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700/60">
              Studio
            </span>
          </span>
        </a>

        {/* Zone 2: Clean 4–5 single-line navigation links + Photo Editing switcher */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-sm font-medium text-slate-300">
          <a
            href="#challenges"
            className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0"
          >
            {t('navChallenges')}
          </a>
          <a
            href="#comparison"
            className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0"
          >
            {t('navComparison')}
          </a>
          <a
            href="#portfolio"
            className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0"
          >
            {t('navPortfolio')}
          </a>
          <a
            href="#pricing"
            className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0"
          >
            {t('navPricing')}
          </a>
          <a
            href="#process"
            className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0"
          >
            {t('navWorkflow')}
          </a>

          {/* Direct link to Main Photo Editing Service */}
          <a
            href="https://clippasia.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/50 hover:bg-cyan-900/70 border border-cyan-800/60 hover:border-cyan-400 text-cyan-300 hover:text-white transition-all text-xs font-semibold whitespace-nowrap shadow-sm group"
            title="Go to Clippasia Main Photo Editing Website (clippasia.com)"
          >
            <Camera className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span>{t('navPhotoEditing')}</span>
            <ArrowUpRight className="w-3 h-3 text-cyan-400/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </nav>

        {/* Zone 3: Language Switcher + Primary Action */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          
          {/* Language Switcher Dropdown */}
          <div className="relative" ref={langDropdownRef}>
            <button
              type="button"
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              aria-label="Select Language"
              aria-expanded={langMenuOpen}
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="text-sm leading-none">{currentOption.flag}</span>
              <span className="font-mono text-[11px] font-semibold">{currentOption.code.toUpperCase()}</span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${langMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {langMenuOpen && (
              <div
                className={`absolute top-full mt-2 w-48 bg-[#0D111A] border border-slate-800 rounded-xl shadow-2xl p-1.5 z-50 backdrop-blur-xl animate-in fade-in slide-in-from-top-1 duration-150 ${
                  isRtl ? 'left-0' : 'right-0'
                }`}
              >
                <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  {t('navLanguage')}
                </div>
                <div className="space-y-1">
                  {SUPPORTED_LANGUAGES.map((lang) => {
                    const isSelected = lang.code === currentLanguage;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => handleSelectLanguage(lang.code)}
                        className={`w-full px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-500/15 text-cyan-300 font-semibold'
                            : 'text-slate-300 hover:bg-slate-850 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{lang.flag}</span>
                          <span className="font-medium">{lang.nativeName}</span>
                          <span className="text-[10px] text-slate-500 font-mono">({lang.code.toUpperCase()})</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>



          {/* Primary Action Button */}
          <button
            onClick={onOpenTestEdit}
            className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-lg shadow-md shadow-cyan-500/25 transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <span>{t('navBookTest')}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile controls: photo link + language pill + hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Direct Photo Editing Service Link on Mobile Top Bar */}
          <a
            href="https://clippasia.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 py-1 rounded bg-cyan-950/70 border border-cyan-800/80 text-[11px] font-mono text-cyan-300 hover:text-white flex items-center gap-1 transition-colors"
            title="Clippasia Main Photo Editing Website (clippasia.com)"
          >
            <Camera className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold">Photo</span>
            <ArrowUpRight className="w-2.5 h-2.5 text-cyan-400/70" />
          </a>

          {/* Quick Language Toggle on Mobile Top Bar */}
          <button
            onClick={() => {
              const next =
                currentLanguage === 'en' ? 'es' : currentLanguage === 'es' ? 'ar' : 'en';
              setLanguage(next);
            }}
            className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-cyan-300 flex items-center gap-1"
            title="Toggle Language"
          >
            <span>{currentOption.flag}</span>
            <span>{currentOption.code.toUpperCase()}</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-slate-300 hover:text-white p-2"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer with Backdrop and Safe Scrolling */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[57px] max-h-[calc(100vh-65px)] overflow-y-auto bg-[#0A0D16]/98 backdrop-blur-2xl border-b border-slate-800 px-5 py-5 space-y-4 shadow-2xl z-50 animate-in fade-in duration-150">
          
          {/* Featured Card: Switch to Main Photo Editing Service */}
          <a
            href="https://clippasia.com"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            className="p-3 bg-gradient-to-r from-cyan-950/70 via-slate-900 to-blue-950/60 rounded-xl border border-cyan-700/60 hover:border-cyan-400 flex items-center justify-between transition-all group block shadow-md shadow-black/40"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0">
                <Camera className="w-4 h-4 text-cyan-300 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{t('navPhotoEditing')}</span>
                  <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">clippasia.com</span>
                </div>
                <div className="text-[11px] text-slate-400">Clipping path, retouching & eCommerce</div>
              </div>
            </div>
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </a>

          {/* Mobile Language Switcher Buttons */}
          <div className="p-2 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1.5">
            <div className="text-[10px] font-mono uppercase text-slate-400 px-1">
              {t('navLanguage')}
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setMobileMenuOpen(false);
                  }}
                  className={`py-1.5 px-2 rounded-lg text-xs flex items-center justify-center gap-1 font-medium transition-colors ${
                    lang.code === currentLanguage
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                      : 'bg-slate-850 text-slate-300 hover:text-white'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.nativeName}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col space-y-3 text-sm font-medium text-slate-300">
            {/* Direct photo editing menu link */}
            <a
              href="https://clippasia.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 flex items-center justify-between text-cyan-400 hover:text-cyan-300 font-semibold border-b border-slate-800/80 pb-2"
            >
              <span className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-cyan-400" />
                <span>{t('navPhotoEditing')} (clippasia.com)</span>
              </span>
              <ArrowUpRight className="w-4 h-4 text-cyan-400" />
            </a>

            <a
              href="#challenges"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-cyan-400"
            >
              {t('navChallenges')}
            </a>
            <a
              href="#comparison"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-cyan-400"
            >
              {t('navComparison')}
            </a>
            <a
              href="#portfolio"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-cyan-400"
            >
              {t('navPortfolio')}
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-cyan-400"
            >
              {t('navPricing')}
            </a>
            <a
              href="#process"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-cyan-400"
            >
              {t('navWorkflow')}
            </a>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTestEdit();
              }}
              className="w-full py-2.5 px-4 text-xs font-semibold text-center text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg shadow-md shadow-cyan-500/25 flex items-center justify-center gap-1.5"
            >
              <span>{t('navBookTest')}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>


          </div>
        </div>
      )}
    </header>
  );
};
