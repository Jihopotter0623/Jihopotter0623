import React, { useState } from 'react';
import { DatabaseProvider, useDatabase } from './context/DatabaseContext';
import { AdminBar } from './components/AdminBar';
import { AboutSection } from './components/AboutSection';
import { ExperienceTimeline } from './components/ExperienceTimeline';
import { SkillsSection } from './components/SkillsSection';
import { CertificationsSection } from './components/CertificationsSection';
import { PortfolioSection } from './components/PortfolioSection';
import { EditDialog } from './components/EditDialog';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Terminal, Shield } from 'lucide-react';

function AppContent() {
  const { loading, about, isEditMode } = useDatabase();
  
  // Unified CMS Dialog State Managers
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'about' | 'experience' | 'skill' | 'certification' | 'portfolio'>('about');
  const [activeItem, setActiveItem] = useState<any>(null);

  const openDialog = (
    type: 'about' | 'experience' | 'skill' | 'certification' | 'portfolio', 
    item: any = null
  ) => {
    setDialogType(type);
    setActiveItem(item);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen circuit-bg text-on-surface flex flex-col font-sans antialiased pb-20 selection:bg-primary-container/25 selection:text-white relative">
      
      {/* Sleek system boot spinner on startup as non-destructive overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-[#011230] flex flex-col items-center justify-center p-6 text-center select-none font-sans">
          <div className="relative mb-6">
            <div className="w-16 h-16 rounded-full border-2 border-primary-container/20 border-t-primary-container animate-spin"></div>
            <Terminal className="text-primary-container absolute inset-0 m-auto" size={24} />
          </div>
          <p className="font-mono text-xs text-primary-container uppercase tracking-widest animate-pulse max-w-xs leading-relaxed">
            SIRIUS BOOTING PROTOCOL... ACTIVE Realtime Database CONNECTED
          </p>
        </div>
      )}

      {/* Dynamic Settings and Unlock Panels */}
      <AdminBar />

      {/* Hero Header Introduction */}
      <AboutSection onEdit={() => openDialog('about', about)} />

      {/* Main Grid Sections */}
      <main className="flex-grow space-y-12 pb-16">
        
        {/* Experience Milestones */}
        <div className="bg-surface-container-lowest/40 border-y border-surface-variant/10">
          <ExperienceTimeline 
            onAdd={() => openDialog('experience', null)} 
            onEdit={(item) => openDialog('experience', item)} 
          />
        </div>

        {/* Highlighted Skills */}
        <SkillsSection />

        {/* Certifications and Badges Grid */}
        <div className="bg-surface-container-lowest/40 border-y border-surface-variant/10">
          <CertificationsSection 
            onAdd={() => openDialog('certification', null)}
            onEdit={(item) => openDialog('certification', item)}
          />
        </div>

        {/* Portfolio specifications cards */}
        <PortfolioSection 
          onAdd={() => openDialog('portfolio', null)}
          onEdit={(item) => openDialog('portfolio', item)}
        />

      </main>

      {/* Unified Contextual Modification overlay */}
      <EditDialog 
        isOpen={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
        type={dialogType} 
        item={activeItem} 
      />

      {/* Modern cyber themed footer */}
      <footer className="mt-auto border-t border-surface-variant/30 py-8 px-6 text-center selection:bg-primary/20">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-4 text-on-surface-variant text-xs md:text-sm">
          <div className="flex items-center gap-1 text-[11px] font-mono text-primary-fixed uppercase tracking-wider bg-surface-container px-3 py-1 rounded-full border border-surface-variant/30">
            <Shield size={12} className="text-primary-container" />
            <span>Interactive Realtime CMS Console • Mode: {isEditMode ? "Admin Override" : "Public Viewer"}</span>
          </div>
          <p className="font-headline font-semibold text-primary-fixed tracking-tight">
            <span>© 2026 {about.title || "My robot Sirius"}. All rights reserved.</span>
          </p>
          <p className="font-mono text-[10px] text-on-surface-variant/40 leading-relaxed max-w-md">
            Development telemetry active. Live synchronize pipelines connected. Built with Google AI Studio and Firebase Firestore Enterprise.
          </p>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <DatabaseProvider>
        <AppContent />
      </DatabaseProvider>
    </ErrorBoundary>
  );
}

