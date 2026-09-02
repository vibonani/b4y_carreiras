import React, { useState, useEffect, useRef } from 'react';
import logo from '../assets/back4you-logo.png';

interface HeaderProps {
  currentView: 'candidate' | 'dashboard';
  onNavigate: (view: 'candidate' | 'dashboard') => void;
  onLogoClick: () => void;
  candidateName?: string;
  jobPosition?: string;
  showNav?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onLogoClick,
  candidateName,
  jobPosition,
  showNav = true
}) => {
  const [navVisible, setNavVisible] = useState(true);
  const [atTop, setAtTop] = useState(window.scrollY <= 10);
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const goingDown = currentScrollY > lastScrollY.current;

      if (goingDown && currentScrollY > 80) {
        setNavVisible(false);
      } else {
        setNavVisible(true);
      }

      setAtTop(currentScrollY <= 10);

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header id="app-main-header" className="sticky top-0 z-40 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">

          {/* Logo & Brand Identity */}
          <button
            id="btn-logo-home"
            type="button"
            onClick={onLogoClick}
            title="Voltar para o início"
            className={`flex items-center space-x-3 transition-all duration-300 cursor-pointer ${
              atTop ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3 pointer-events-none'
            }`}
          >
            <img src={logo} alt="Back4You" className="h-7 sm:h-8 w-auto" />
          </button>

          {/* Right-side cluster: Pill Navigation + Candidate Info / Quick Switch */}
          <div className="flex items-center space-x-4">
            {currentView === 'candidate' && showNav && (
              <nav
                className={`hidden sm:flex items-center space-x-1 bg-[#0a2e35]/50 backdrop-blur-sm rounded-full px-2 py-1.5 shadow-sm transition-all duration-300 ${
                  navVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3 pointer-events-none'
                }`}
              >
                <a
                  href="https://back4you.com.br/quem-somos/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                >
                  Quem somos
                </a>
                <a
                  href="https://www.linkedin.com/company/back4you/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                >
                  Linkedin
                </a>
              </nav>
            )}

            {currentView === 'candidate' && candidateName && (
              <div
                className={`hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 transition-all duration-300 ${
                  navVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3 pointer-events-none'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="font-semibold text-slate-900">{candidateName}</span>
                {jobPosition && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-600">{jobPosition}</span>
                  </>
                )}
              </div>
            )}

            {/* Actions & Status */}
            {currentView === 'dashboard' && (
              <div
                className={`flex items-center space-x-1 bg-[#0a2e35]/50 backdrop-blur-sm rounded-full px-2 py-1.5 shadow-sm transition-all duration-300 ${
                  navVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3 pointer-events-none'
                }`}
              >
                <button
                  id="btn-view-candidate-test"
                  onClick={() => onNavigate('candidate')}
                  className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                  title="Retornar para o fluxo do candidato"
                >
                  <span>Ver Fluxo do Candidato</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
