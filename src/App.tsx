import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './views/DashboardView';
import { SchoolProfileView } from './views/SchoolProfileView';
import { UsersView } from './views/UsersView';
import { UnitsView } from './views/UnitsView';
import { ProgramsView } from './views/ProgramsView';
import { SchedulesView } from './views/SchedulesView';
import { InstrumentsView } from './views/InstrumentsView';
import { AssessmentExecutionView } from './views/AssessmentExecutionView';
import { AssessmentResultsView } from './views/AssessmentResultsView';
import { AiAnalysisView } from './views/AiAnalysisView';
import { FindingsRecommendationsView } from './views/FindingsRecommendationsView';
import { RTLView } from './views/RTLView';
import { MonitoringRTLView } from './views/MonitoringRTLView';
import { OfficialReportsView } from './views/OfficialReportsView';
import { DigitalArchivesView } from './views/DigitalArchivesView';
import { SettingsView } from './views/SettingsView';
import { Menu, X } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeMenu } = useApp();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <DashboardView />;
      case 'profil-sekolah':
        return <SchoolProfileView />;
      case 'data-pengguna':
        return <UsersView />;
      case 'data-unit':
        return <UnitsView />;
      case 'program-supervisi':
        return <ProgramsView />;
      case 'jadwal-supervisi':
        return <SchedulesView />;
      case 'instrumen-supervisi':
        return <InstrumentsView />;
      case 'pelaksanaan':
        return <AssessmentExecutionView />;
      case 'hasil-penilaian':
        return <AssessmentResultsView />;
      case 'analisis-ai':
        return <AiAnalysisView />;
      case 'temuan-rekomendasi':
        return <FindingsRecommendationsView />;
      case 'rencana-tindak-lanjut':
        return <RTLView />;
      case 'monitoring-rtl':
        return <MonitoringRTLView />;
      case 'laporan-supervisi':
        return <OfficialReportsView />;
      case 'arsip-digital':
        return <DigitalArchivesView />;
      case 'pengaturan':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 selection:bg-amber-400 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        {/* Mobile Hamburger Floating Button */}
        <div className="lg:hidden fixed bottom-5 right-5 z-50">
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="w-13 h-13 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center shadow-2xl border-2 border-amber-500 hover:scale-105 transition-transform"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Overlay */}
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-slate-950/60 lg:hidden backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        {/* Sidebar (Responsive) */}
        <Sidebar
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Workspace Body */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
