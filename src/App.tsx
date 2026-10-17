import React, { useState } from 'react';
import { 
  BarChart3, 
  Coins, 
  ChevronLeft, 
  ChevronRight, 
  Compass,
  ArrowRight
} from 'lucide-react';
import { HeaderNav, TopNavTab } from './components/HeaderNav';
import { ShandongWebGISMap } from './components/ShandongWebGISMap';
import { LeftPanel } from './components/LeftPanel';
import { RightPanel } from './components/RightPanel';
import { BottomTimelineSimulator } from './components/BottomTimelineSimulator';
import { MultiDimensionalAnalysisView, AnalysisDimension } from './components/MultiDimensionalAnalysisView';
import { CarbonTradingView } from './components/CarbonTradingView';
import { CCERReportView } from './components/CCERReportView';
import { AIExpertPrescriptionView } from './components/AIExpertPrescriptionView';
import { LoginScreen } from './components/LoginScreen';
import { 
  PROVINCE_OVERVIEW, 
  STATIONS, 
  ALERTS_LIST, 
  StationData, 
  EcologicalAlert 
} from './data/blueCarbonData';

export default function App() {
  // Authentication State: Open Login Screen first by default
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; role: string }>({
    name: '省海洋局高级核算员',
    role: '系统总调度中心',
  });

  // Top Nav Tab View State (Direct View Switching, No Popup Modals)
  const [activeNavTab, setActiveNavTab] = useState<TopNavTab>('gis');

  // Multi-Dimensional Analysis Perspective State
  const [activeDimension, setActiveDimension] = useState<AnalysisDimension>('demographics');

  // Left & Right Panels collapsed by default in GIS view
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState<boolean>(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState<boolean>(false);

  // Station and simulation parameters
  const [currentStation, setCurrentStation] = useState<StationData>(PROVINCE_OVERVIEW);
  const [year, setYear] = useState<number>(2026);
  const [intervention, setIntervention] = useState<number>(75);

  // Selected Alert for AI prescription
  const [selectedAlert, setSelectedAlert] = useState<EcologicalAlert | null>(ALERTS_LIST[0]);

  const handleLoginSuccess = (user: { name: string; role: string }) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleSelectStation = (station: StationData) => {
    setCurrentStation(station);
  };

  const handleResetStation = () => {
    setCurrentStation(PROVINCE_OVERVIEW);
  };

  // When user clicks an alert in the GIS right panel -> switch to AI prescription view
  const handleOpenAlertPrescription = (alert: EcologicalAlert) => {
    setSelectedAlert(alert);
    setActiveNavTab('ai');
  };

  // If not logged in, render the Login Screen (kept intact as requested)
  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col bg-[#030914] text-slate-100 font-sans">
      {/* Background radial gradient glow for deep-sea luminescence */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-cyan-950/20 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[350px] bg-emerald-950/15 blur-[120px] pointer-events-none rounded-full" />

      {/* Top Header Navigation Bar with Direct View Switching and Integrated Dropdown */}
      <HeaderNav
        currentStation={currentStation}
        activeNavTab={activeNavTab}
        setActiveNavTab={setActiveNavTab}
        activeDimension={activeDimension}
        onSelectDimension={(dim) => {
          setActiveDimension(dim);
          setActiveNavTab('stats');
        }}
        onResetStation={handleResetStation}
        onLogout={handleLogout}
        userRole={currentUser.role}
        isLeftPanelOpen={isLeftPanelOpen}
        onToggleLeftPanel={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
        isRightPanelOpen={isRightPanelOpen}
        onToggleRightPanel={() => setIsRightPanelOpen(!isRightPanelOpen)}
      />

      {/* Main Workspace Screen Container (Dynamic View Switching) */}
      <div className="relative flex-1 min-h-0 flex w-full overflow-hidden">
        {/* VIEW 1: WebGIS Digital Twin Cockpit */}
        {activeNavTab === 'gis' && (
          <main className="relative flex-1 min-h-0 flex w-full overflow-hidden animate-in fade-in duration-200">
            {/* Left Drawer Column: Ecological Charts (Collapsible) */}
            {isLeftPanelOpen && (
              <div className="h-full z-20 shrink-0 animate-in slide-in-from-left duration-250">
                <LeftPanel
                  station={currentStation}
                  year={year}
                  intervention={intervention}
                  onClose={() => setIsLeftPanelOpen(false)}
                />
              </div>
            )}

            {/* Center Column: Interactive Full-Scale Shandong WebGIS Map Stage */}
            <section className="flex-1 min-w-0 h-full relative">
              <ShandongWebGISMap
                currentStation={currentStation}
                onSelectStation={handleSelectStation}
                year={year}
                intervention={intervention}
              />

              {/* Floating Action Tab for Left Panel (when collapsed) */}
              {!isLeftPanelOpen && (
                <button
                  onClick={() => setIsLeftPanelOpen(true)}
                  className="absolute left-3 top-16 z-20 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950/90 hover:bg-slate-900 border border-cyan-500/40 text-cyan-300 text-xs font-bold shadow-[0_0_20px_rgba(6,182,212,0.35)] backdrop-blur-md transition-all hover:scale-105 group cursor-pointer"
                  title="点击展开左侧生态碳汇图表面板"
                >
                  <BarChart3 className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span>生态图表</span>
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}

              {/* Floating Action Tab for Right Panel (when collapsed) */}
              {!isRightPanelOpen && (
                <button
                  onClick={() => setIsRightPanelOpen(true)}
                  className="absolute right-3 top-16 z-20 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950/90 hover:bg-slate-900 border border-amber-500/40 text-amber-200 text-xs font-bold shadow-[0_0_20px_rgba(245,158,11,0.35)] backdrop-blur-md transition-all hover:scale-105 group cursor-pointer"
                  title="点击展开右侧蓝碳银行与工况面板"
                >
                  <ChevronLeft className="w-3.5 h-3.5 text-amber-400 group-hover:-translate-x-0.5 transition-transform" />
                  <Coins className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span>蓝碳资产</span>
                </button>
              )}
            </section>

            {/* Right Drawer Column: Asset Accounting & Telemetry Gauges (Collapsible) */}
            {isRightPanelOpen && (
              <div className="h-full z-20 shrink-0 animate-in slide-in-from-right duration-250">
                <RightPanel
                  station={currentStation}
                  year={year}
                  intervention={intervention}
                  onOpenCCERModal={() => setActiveNavTab('ccer')}
                  onSelectAlert={handleOpenAlertPrescription}
                  onClose={() => setIsRightPanelOpen(false)}
                />
              </div>
            )}
          </main>
        )}

        {/* VIEW 2: Multi-Dimensional Policy, Demographics & Blue Carbon Analysis Center */}
        {activeNavTab === 'stats' && (
          <div className="flex-1 w-full h-full animate-in fade-in duration-200">
            <MultiDimensionalAnalysisView
              currentDimension={activeDimension}
              onDimensionChange={setActiveDimension}
              onBackToGis={() => setActiveNavTab('gis')}
              year={year}
            />
          </div>
        )}

        {/* VIEW 3: Carbon Asset Trading & Clearing Cockpit */}
        {activeNavTab === 'trading' && (
          <div className="flex-1 w-full h-full animate-in fade-in duration-200">
            <CarbonTradingView
              station={currentStation}
              year={year}
              onBackToGis={() => setActiveNavTab('gis')}
            />
          </div>
        )}

        {/* VIEW 4: CCER National Verification Report View */}
        {activeNavTab === 'ccer' && (
          <div className="flex-1 w-full h-full animate-in fade-in duration-200">
            <CCERReportView
              station={currentStation}
              year={year}
              intervention={intervention}
              onBackToGis={() => setActiveNavTab('gis')}
            />
          </div>
        )}

        {/* VIEW 5: AI Expert Prescription & Telemetry Diagnosis Cockpit */}
        {activeNavTab === 'ai' && (
          <div className="flex-1 w-full h-full animate-in fade-in duration-200">
            <AIExpertPrescriptionView
              alert={selectedAlert}
              onBackToGis={() => setActiveNavTab('gis')}
              onSelectAlert={setSelectedAlert}
            />
          </div>
        )}
      </div>

      {/* Bottom Timeline & Ecological Intervention Simulator (Visible in GIS Cockpit) */}
      {activeNavTab === 'gis' && (
        <BottomTimelineSimulator
          year={year}
          setYear={setYear}
          intervention={intervention}
          setIntervention={setIntervention}
        />
      )}
    </div>
  );
}
