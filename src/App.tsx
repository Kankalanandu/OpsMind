/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar, NavTab } from './components/Sidebar.tsx';
import { Header } from './components/Header.tsx';
import { OverviewView } from './components/OverviewView.tsx';
import { IncidentDetailView } from './components/IncidentDetailView.tsx';
import { IncidentsListView } from './components/IncidentsListView.tsx';
import { MemoryExplorerView } from './components/MemoryExplorerView.tsx';
import { LearningCenterView } from './components/LearningCenterView.tsx';
import { AnalyticsDashboardView } from './components/AnalyticsDashboardView.tsx';
import { RunbooksView } from './components/RunbooksView.tsx';
import { PostMortemView } from './components/PostMortemView.tsx';
import { JuryModeModal } from './components/JuryModeModal.tsx';
import { NewIncidentModal } from './components/NewIncidentModal.tsx';
import { DemoControlsDrawer } from './components/DemoControlsDrawer.tsx';
import { AskOpsMindDrawer } from './components/AskOpsMindDrawer.tsx';
import { HindsightStatusModal } from './components/HindsightStatusModal.tsx';
import { LandingHeroModal } from './components/LandingHeroModal.tsx';
import { CommandPalette } from './components/common/CommandPalette.tsx';
import { Incident, LearningEvent, HindsightStatus, PostMortem, IncidentInvestigation } from './types/index.ts';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('overview');
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [learnings, setLearnings] = useState<LearningEvent[]>([]);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('INC-137');
  const [selectedPostMortem, setSelectedPostMortem] = useState<PostMortem | null>(null);
  const [hindsightStatus, setHindsightStatus] = useState<HindsightStatus | null>(null);

  // Modals & Drawers
  const [isJuryModeOpen, setIsJuryModeOpen] = useState(false);
  const [isNewIncidentOpen, setIsNewIncidentOpen] = useState(false);
  const [isDemoControlsOpen, setIsDemoControlsOpen] = useState(false);
  const [isAskOpsMindOpen, setIsAskOpsMindOpen] = useState(false);
  const [isHindsightStatusOpen, setIsHindsightStatusOpen] = useState(false);
  const [isLandingHeroOpen, setIsLandingHeroOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [chatInitialQuestion, setChatInitialQuestion] = useState<string>('');

  // Initial Data Fetch
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [statusRes, incsRes, lrnRes] = await Promise.all([
        fetch('/api/status').then(r => r.json()).catch(() => null),
        fetch('/api/incidents').then(r => r.json()).catch(() => []),
        fetch('/api/learnings').then(r => r.json()).catch(() => [])
      ]);

      if (statusRes?.hindsight) {
        setHindsightStatus(statusRes.hindsight);
      }
      if (Array.isArray(incsRes)) {
        setIncidents(incsRes);
      }
      if (Array.isArray(lrnRes)) {
        setLearnings(lrnRes);
      }
    } catch (err) {
      console.error('Data load error:', err);
    }
  };

  const handleSelectIncident = (id: string) => {
    setSelectedIncidentId(id);
    setCurrentTab('investigator');
  };

  const handleInvestigate = async (id: string): Promise<IncidentInvestigation> => {
    const res = await fetch(`/api/incidents/${id}/investigate`, { method: 'POST' });
    const data = await res.json();
    // Update local state
    setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, investigation: data } : inc));
    try {
      const statusRes = await fetch('/api/status');
      const statusData = await statusRes.json();
      if (statusData.hindsight) setHindsightStatus(statusData.hindsight);
    } catch {}
    return data;
  };

  const handleResolve = async (id: string, actionTaken: string) => {
    const res = await fetch(`/api/incidents/${id}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actionTaken })
    });
    const updated = await res.json();
    setIncidents(prev => prev.map(inc => inc.id === id ? updated : inc));
    return updated;
  };

  const handleLearn = async (id: string) => {
    const res = await fetch(`/api/incidents/${id}/learn`, { method: 'POST' });
    const data = await res.json();
    if (data.learning) {
      setLearnings(prev => [data.learning, ...prev]);
      setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, learningRetained: true } : inc));
    }
    try {
      const statusRes = await fetch('/api/status');
      const statusData = await statusRes.json();
      if (statusData.hindsight) setHindsightStatus(statusData.hindsight);
    } catch {}
    return data;
  };

  const handleCreateIncident = async (data: Partial<Incident>) => {
    const res = await fetch('/api/incidents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const newInc = await res.json();
    setIncidents(prev => [newInc, ...prev]);
    setSelectedIncidentId(newInc.id);
    setCurrentTab('investigator');
  };

  const handleOpenPostMortem = async (id: string) => {
    const res = await fetch('/api/postmortem/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ incidentId: id })
    });
    const pm = await res.json();
    setSelectedPostMortem(pm);
    setCurrentTab('postmortems');
  };

  const handleAskOpsMindWithContext = (question: string) => {
    setChatInitialQuestion(question);
    setIsAskOpsMindOpen(true);
  };

  const handleResetDemo = async () => {
    await fetch('/api/demo/reset', { method: 'POST' });
    await loadAllData();
    setSelectedIncidentId('INC-137');
    setCurrentTab('overview');
  };

  const currentIncident = incidents.find(i => i.id === selectedIncidentId) || incidents[0] || null;

  return (
    <div className="flex h-screen bg-[#161616] text-[#F4F4F4] overflow-hidden font-sans">
      {/* Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        hindsightStatus={hindsightStatus}
        onOpenJuryMode={() => setIsJuryModeOpen(true)}
        onOpenDemoControls={() => setIsDemoControlsOpen(true)}
        onOpenHindsightStatus={() => setIsHindsightStatusOpen(true)}
        activeIncidentsCount={incidents.filter(i => i.status !== 'RESOLVED').length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#161616]">
        {/* Top Header */}
        <Header
          hindsightStatus={hindsightStatus}
          onOpenNewIncident={() => setIsNewIncidentOpen(true)}
          onOpenJuryMode={() => setIsJuryModeOpen(true)}
          onOpenAskOpsMind={() => {
            setChatInitialQuestion('');
            setIsAskOpsMindOpen(true);
          }}
          onOpenHindsightStatus={() => setIsHindsightStatusOpen(true)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        />

        {/* Scrollable Main View */}
        <main className="flex-1 overflow-y-auto bg-[#161616]">
          {currentTab === 'overview' && (
            <OverviewView
              incidents={incidents}
              learnings={learnings}
              onSelectIncident={handleSelectIncident}
              onNavigateTab={setCurrentTab}
              onRunDemo1={() => handleSelectIncident('INC-104')}
              onRunDemo2={() => handleSelectIncident('INC-137')}
              onOpenJuryMode={() => setIsJuryModeOpen(true)}
            />
          )}

          {currentTab === 'incidents' && (
            <IncidentsListView
              incidents={incidents}
              onSelectIncident={handleSelectIncident}
              onOpenNewIncident={() => setIsNewIncidentOpen(true)}
            />
          )}

          {currentTab === 'investigator' && currentIncident && (
            <IncidentDetailView
              incident={currentIncident}
              onBack={() => setCurrentTab('overview')}
              onInvestigate={handleInvestigate}
              onResolve={handleResolve}
              onLearn={handleLearn}
              onOpenPostMortem={handleOpenPostMortem}
              onAskOpsMindWithContext={handleAskOpsMindWithContext}
            />
          )}

          {currentTab === 'memory' && (
            <MemoryExplorerView hindsightStatus={hindsightStatus} />
          )}

          {currentTab === 'learning' && (
            <LearningCenterView
              learnings={learnings}
              onSelectIncident={handleSelectIncident}
              hindsightStatus={hindsightStatus}
            />
          )}

          {currentTab === 'analytics' && (
            <AnalyticsDashboardView />
          )}

          {currentTab === 'runbooks' && (
            <RunbooksView
              onAskOpsMindWithContext={handleAskOpsMindWithContext}
            />
          )}

          {currentTab === 'postmortems' && (
            selectedPostMortem ? (
              <PostMortemView
                postMortem={selectedPostMortem}
                onBack={() => setCurrentTab('overview')}
                onRetainToHindsight={handleLearn}
                hindsightStatus={hindsightStatus}
              />
            ) : (
              <div className="p-12 text-center text-xs text-slate-500 font-mono space-y-3">
                <div>No active post-mortem selected.</div>
                <button
                  onClick={() => handleOpenPostMortem('INC-104')}
                  className="px-3.5 py-1.5 rounded-xs bg-[#0F62FE] hover:bg-[#0353E9] text-white font-medium text-xs font-mono transition-colors cursor-pointer"
                >
                  Load INC-104 Post-Mortem
                </button>
              </div>
            )
          )}
        </main>
      </div>

      {/* JURY MODE MODAL */}
      <JuryModeModal
        isOpen={isJuryModeOpen}
        onClose={() => setIsJuryModeOpen(false)}
        onJumpToIncident={handleSelectIncident}
        hindsightStatus={hindsightStatus}
      />

      {/* NEW INCIDENT MODAL */}
      <NewIncidentModal
        isOpen={isNewIncidentOpen}
        onClose={() => setIsNewIncidentOpen(false)}
        onCreateIncident={handleCreateIncident}
        onLoadIncident1={() => handleSelectIncident('INC-104')}
        onLoadIncident2={() => handleSelectIncident('INC-137')}
      />

      {/* DEMO CONTROLS DRAWER */}
      <DemoControlsDrawer
        isOpen={isDemoControlsOpen}
        onClose={() => setIsDemoControlsOpen(false)}
        onResetDemo={handleResetDemo}
        onLoadIncident1={() => handleSelectIncident('INC-104')}
        onResolveIncident1={async () => {
          await handleResolve('INC-104', 'Rollback deployment v4.2.1');
        }}
        onRetainLearningIncident1={async () => {
          await handleLearn('INC-104');
        }}
        onLoadIncident2={() => handleSelectIncident('INC-137')}
        onInvestigateIncident2={async () => {
          handleSelectIncident('INC-137');
          await handleInvestigate('INC-137');
        }}
      />

      {/* ASK OPSMIND CHAT DRAWER */}
      <AskOpsMindDrawer
        isOpen={isAskOpsMindOpen}
        onClose={() => setIsAskOpsMindOpen(false)}
        currentIncident={currentIncident}
        initialQuestion={chatInitialQuestion}
        hindsightStatus={hindsightStatus}
      />

      {/* HINDSIGHT STATUS MODAL */}
      <HindsightStatusModal
        isOpen={isHindsightStatusOpen}
        onClose={() => setIsHindsightStatusOpen(false)}
        status={hindsightStatus}
        onRefreshStatus={loadAllData}
        onOpenMemoryExplorer={() => setCurrentTab('memory')}
      />

      {/* LANDING HERO MODAL */}
      <LandingHeroModal
        isOpen={isLandingHeroOpen}
        onClose={() => setIsLandingHeroOpen(false)}
        onOpenConsole={() => setCurrentTab('overview')}
        onExploreMemory={() => setCurrentTab('memory')}
        onLaunchJuryMode={() => setIsJuryModeOpen(true)}
      />

      {/* GLOBAL COMMAND PALETTE (⌘K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        incidents={incidents}
        onSelectIncident={handleSelectIncident}
        onNavigateTab={setCurrentTab}
      />
    </div>
  );
}
