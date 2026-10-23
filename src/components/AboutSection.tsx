import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { Menu, X, Edit3, Rocket, Terminal } from 'lucide-react';

interface AboutSectionProps {
  onEdit: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onEdit }) => {
  const { about, isEditMode } = useDatabase();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Smooth scroll helper
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const topOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setMobileMenuOpen(false);
  };

  return (
    <section id="about" className="relative">
      
      {/* Top Header Navigation */}
      <header className="fixed top-0 w-full z-40 bg-surface/80 backdrop-blur-md border-b border-surface-variant/30 shadow-[0_4px_30px_rgba(0,229,255,0.03)] selection:bg-primary/20">
        <div className="flex justify-between items-center px-6 lg:px-12 py-4 max-w-7xl mx-auto">
          
          <div className="flex items-center gap-2">
            <Terminal className="text-primary-container" size={22} />
            <span className="font-headline text-lg lg:text-xl font-bold text-primary-fixed tracking-tight">
              {about.title || "My robot Sirius"}
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            <a 
              className="text-primary-container hover:text-white transition-colors text-sm font-medium border-b border-primary-container pb-0.5 font-sans" 
              href="#about"
              onClick={(e) => handleScroll(e, 'about')}
            >
              About
            </a>
            <a 
              className="text-on-surface-variant hover:text-primary-container transition-all hover:scale-105 duration-200 text-sm font-medium font-sans" 
              href="#experience"
              onClick={(e) => handleScroll(e, 'experience')}
            >
              Experience
            </a>
            <a 
              className="text-on-surface-variant hover:text-primary-container transition-all hover:scale-105 duration-200 text-sm font-medium font-sans" 
              href="#skills"
              onClick={(e) => handleScroll(e, 'skills')}
            >
              Skills
            </a>
            <a 
              className="text-on-surface-variant hover:text-primary-container transition-all hover:scale-105 duration-200 text-sm font-medium font-sans" 
              href="#certifications"
              onClick={(e) => handleScroll(e, 'certifications')}
            >
              Certifications & Awards
            </a>
            <a 
              className="text-on-surface-variant hover:text-primary-container transition-all hover:scale-105 duration-200 text-sm font-medium font-sans" 
              href="#portfolio"
              onClick={(e) => handleScroll(e, 'portfolio')}
            >
              Portfolio
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="lg:hidden text-primary-fixed hover:text-white focus:outline-none focus:ring-0"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-surface-container-high/95 backdrop-blur-md border-b border-surface-variant/30 py-4 px-6 animate-fade-in">
            <nav className="flex flex-col gap-4">
              <a 
                className="text-primary-container text-sm font-semibold py-1 block" 
                href="#about"
                onClick={(e) => handleScroll(e, 'about')}
              >
                About
              </a>
              <a 
                className="text-on-surface-variant hover:text-primary-container text-sm font-medium py-1 block transition-colors" 
                href="#experience"
                onClick={(e) => handleScroll(e, 'experience')}
              >
                Experience
              </a>
              <a 
                className="text-on-surface-variant hover:text-primary-container text-sm font-medium py-1 block transition-colors" 
                href="#skills"
                onClick={(e) => handleScroll(e, 'skills')}
              >
                Skills
              </a>
              <a 
                className="text-on-surface-variant hover:text-primary-container text-sm font-medium py-1 block transition-colors" 
                href="#certifications"
                onClick={(e) => handleScroll(e, 'certifications')}
              >
                Certifications & Awards
              </a>
              <a 
                className="text-on-surface-variant hover:text-primary-container text-sm font-medium py-1 block transition-colors" 
                href="#portfolio"
                onClick={(e) => handleScroll(e, 'portfolio')}
              >
                Portfolio
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section Container */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-32 pb-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Hero Left Content Column */}
          <div className="space-y-6 relative group">
            
            {/* CMS Trigger Overlays */}
            {isEditMode && (
              <button 
                onClick={onEdit}
                className="absolute -top-4 -left-4 z-20 bg-primary-container text-surface-container-lowest p-2 rounded-full hover:scale-110 transition-transform shadow-lg cursor-pointer flex items-center gap-1.5 text-xs font-bold font-sans"
              >
                <Edit3 size={14} />
                소개 수정
              </button>
            )}

            <p className="font-mono text-xs text-primary-container uppercase tracking-wider">
              System Status: Online
            </p>

            <h1 className="font-headline text-[38px] lg:text-[56px] font-bold text-on-surface leading-[1.1] tracking-tight typing-cursor">
              <span>{about.aboutTitle || "Building robot, and coding "}</span>
            </h1>

            <p className="font-headline text-lg lg:text-xl font-medium text-primary-fixed-dim">
              <span>{about.aboutSubtitle || "로봇을 만들고, 코딩을 하는 과정을 소개"}</span>
            </p>

            <div className="glass-panel p-6 rounded-xl card-border neon-glow relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-container/40 to-transparent"></div>
              
              <p className="text-on-surface-variant leading-relaxed text-sm lg:text-base whitespace-pre-wrap">
                <span>{about.aboutDescription || "저는 로봇을 만들고 코딩하며 문제를 해결하는 것을 좋아합니다. 센서와 모터를 활용해 로봇이 스스로 움직이도록 만드는 과정에 관심이 있습니다. 실패한 로봇을 다시 수정하고 테스트하면서 더 나은 해결 방법을 찾는 과정을 배우고 있습니다."}</span>
              </p>

              <div className="mt-5 inline-flex items-center gap-2.5 px-4 py-2 bg-primary-container/10 border border-primary-container/30 rounded-full text-primary-container font-mono text-[11px] lg:text-xs">
                <Rocket size={14} className="animate-bounce-short" />
                <span>{about.aboutGoal || "Goal: 앞으로 로봇을 많이 만들면서 창의력을 키우겠다."}</span>
              </div>
            </div>
          </div>

          {/* Hero Right Media Column */}
          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden card-border neon-glow group">
            <img 
              alt="Robot coding illustration" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover mix-blend-luminosity opacity-70 group-hover:opacity-100 group-hover:mix-blend-normal transition-all duration-500" 
              src={about.aboutImageUrl}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent pointer-events-none"></div>
          </div>

        </div>
      </div>

    </section>
  );
};
