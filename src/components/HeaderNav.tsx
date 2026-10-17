import React, { useState, useEffect, useRef } from 'react';
import { 
  Waves, 
  RotateCcw, 
  Sparkles, 
  Layers, 
  FileSpreadsheet, 
  FileText, 
  LogOut, 
  TrendingUp, 
  BarChart3, 
  Coins, 
  ChevronDown,
  Users,
  Fish,
  Droplets,
  Check,
  Compass,
  GitBranch
} from 'lucide-react';
import { StationData } from '../data/blueCarbonData';
import { AnalysisDimension } from './MultiDimensionalAnalysisView';

export type TopNavTab = 'gis' | 'stats' | 'trading' | 'ccer' | 'ai';

interface HeaderNavProps {
  currentStation: StationData;
  activeNavTab: TopNavTab;
  setActiveNavTab: (tab: TopNavTab) => void;
  activeDimension: AnalysisDimension;
  onSelectDimension: (dim: AnalysisDimension) => void;
  onResetStation: () => void;
  onLogout: () => void;
  userRole?: string;
  isLeftPanelOpen?: boolean;
  onToggleLeftPanel?: () => void;
  isRightPanelOpen?: boolean;
  onToggleRightPanel?: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentStation,
  activeNavTab,
  setActiveNavTab,
  activeDimension,
  onSelectDimension,
  onResetStation,
  onLogout,
  userRole = '系统总调度中心',
  isLeftPanelOpen = false,
  onToggleLeftPanel,
  isRightPanelOpen = false,
  onToggleRightPanel,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');
  const [isAnalysisDropdownOpen, setIsAnalysisDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toTimeString().split(' ')[0]);
      const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      setDateStr(
        `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(
          now.getDate()
        ).padStart(2, '0')} ${days[now.getDay()]}`
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsAnalysisDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const dimensionsList: { id: AnalysisDimension; title: string; subtitle: string; icon: React.ElementType }[] = [
    { id: 'demographics', title: '沿海人口与社会经济分析', subtitle: '常住人口、男女劳动力比例与密度热力', icon: Users },
    { id: 'policy', title: '山东海洋强省与政策评价', subtitle: '《海洋强省建设》考核达标率与补偿转移', icon: FileText },
    { id: 'bio_carbon', title: '生物固碳与贝藻渔业协同', subtitle: '大型海藻与贝类固碳速率、微型生物碳泵', icon: Fish },
    { id: 'water_environment', title: '陆海统筹水质生态与脆弱性', subtitle: '入海无机氮消减、海水酸化pH与赤潮韧性', icon: Droplets },
    { id: 'ccer_market', title: 'CCER国家碳市场与资产流转', subtitle: '国家注册簿项目备案核证、成交价与绿贷', icon: Coins },
    { id: 'hydrology_ledger', title: '全省蓝碳水文月度台账', subtitle: '1-12月海气碳吸收通量、沉积速率实测', icon: FileSpreadsheet },
    { id: 'sankey_flux', title: '全省蓝碳流向与资产桑基图', subtitle: '海气输入-生态捕获-深海封存-CCER流转', icon: GitBranch },
    { id: 'scenario_sim', title: '2020-2035双碳推演沙盘', subtitle: '科技跃升/规划既定/基准三情景前瞻推演', icon: TrendingUp },
  ];

  const currentDimConfig = dimensionsList.find((d) => d.id === activeDimension) || dimensionsList[0];

  return (
    <header className="relative z-30 h-18 w-full px-4 flex items-center justify-between border-b border-cyan-500/25 bg-slate-950/95 backdrop-blur-md shadow-2xl select-none">
      {/* Background glowing top gradient */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
      <div className="absolute left-1/4 -top-10 w-96 h-14 bg-cyan-500/15 blur-2xl pointer-events-none rounded-full" />

      {/* Zone 1: Left Brand Title */}
      <div className="flex items-center gap-3 shrink-0">
        <div 
          onClick={() => setActiveNavTab('gis')}
          className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/30 to-emerald-500/20 border border-cyan-400/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.35)] cursor-pointer hover:scale-105 transition-transform"
          title="点击返回综合态势大屏"
        >
          <Waves className="w-6 h-6 text-cyan-400 animate-pulse" />
          <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
        </div>
        <div>
          <h1 
            onClick={() => setActiveNavTab('gis')}
            className="text-base lg:text-lg font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-300 cursor-pointer"
          >
            山东省蓝碳智能监测与碳汇资产核算云平台
          </h1>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
            <span className="text-cyan-400 font-bold tracking-wider">SHANDONG BLUE CARBON</span>
            <span>·</span>
            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
              {userRole}
            </span>
            {currentStation.id !== 'all' && (
              <>
                <span>·</span>
                <span className="text-cyan-300 font-sans flex items-center gap-1">
                  当前锚定: {currentStation.shortName}
                  <button
                    onClick={onResetStation}
                    className="text-[9px] text-cyan-400 hover:text-white underline cursor-pointer"
                  >
                    重置全省
                  </button>
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Zone 2: Center Functional View Switching Navigation Bar (NO POPUP MODALS, DIRECT VIEW SWITCHING) */}
      <nav className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/90 border border-cyan-500/35 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
        {/* Button 1: 综合态势孪生 (GIS Big Map) */}
        <button
          onClick={() => setActiveNavTab('gis')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm group ${
            activeNavTab === 'gis'
              ? 'bg-gradient-to-r from-cyan-600/40 via-cyan-500/30 to-cyan-600/40 text-cyan-200 border border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent'
          }`}
          title="切换至全省数字孪生WebGIS主控驾驶舱"
        >
          <Layers className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          <div className="text-left leading-tight">
            <div>综合态势孪生</div>
            <span className="text-[9px] font-mono text-cyan-400/90 block">WebGIS大屏</span>
          </div>
        </button>

        {/* Button 2: DEDICATED MULTI-DIMENSIONAL ANALYSIS WITH INTEGRATED DROPDOWN (As user requested: "像底图一样，点开可以下拉选择哪个分析") */}
        <div className="relative" ref={dropdownRef}>
          <div
            className={`flex items-center rounded-xl transition-all shadow-sm ${
              activeNavTab === 'stats'
                ? 'bg-gradient-to-r from-cyan-600/30 via-emerald-600/20 to-cyan-600/30 text-white border border-cyan-400 shadow-[0_0_18px_rgba(6,182,212,0.4)]'
                : 'bg-slate-950/70 border border-cyan-500/30 text-slate-200 hover:border-cyan-400 hover:text-white'
            }`}
          >
            <button
              onClick={() => {
                setActiveNavTab('stats');
              }}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold cursor-pointer group"
              title="切换至多维宏观综合分析研判中心"
            >
              <currentDimConfig.icon className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <div className="text-left leading-tight">
                <div className="flex items-center gap-1">
                  <span>多维综合分析</span>
                  <span className="px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[8px] font-mono">
                    8维研判
                  </span>
                </div>
                <span className="text-[9px] font-mono text-emerald-400 block truncate max-w-[105px]">
                  {currentDimConfig.title.slice(0, 7)}...
                </span>
              </div>
            </button>

            {/* Dropdown toggle trigger icon */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsAnalysisDropdownOpen(!isAnalysisDropdownOpen);
              }}
              className="pr-2 pl-0.5 py-2 text-cyan-400 hover:text-white transition-colors cursor-pointer"
              title="展开选择分析研判维度"
            >
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isAnalysisDropdownOpen ? 'rotate-180 text-white' : ''
                }`}
              />
            </button>
          </div>

          {/* Header Dropdown Menu for Dimensions */}
          {isAnalysisDropdownOpen && (
            <div className="absolute left-0 top-full mt-2 w-80 rounded-2xl bg-slate-950/95 border border-cyan-500/50 shadow-[0_10px_40px_rgba(0,0,0,0.85),0_0_25px_rgba(6,182,212,0.3)] backdrop-blur-xl p-2 z-50 animate-in fade-in duration-150">
              <div className="px-3 py-1.5 text-[10px] font-mono text-cyan-400 border-b border-slate-800 mb-1 flex items-center justify-between">
                <span>山东省蓝碳多维研判视角</span>
                <span className="text-slate-500">点击即切换视图</span>
              </div>
              <div className="space-y-1">
                {dimensionsList.map((item) => {
                  const isSelected = activeNavTab === 'stats' && activeDimension === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectDimension(item.id);
                        setActiveNavTab('stats');
                        setIsAnalysisDropdownOpen(false);
                      }}
                      className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-500/20 border border-cyan-400/60 text-white shadow-sm'
                          : 'hover:bg-slate-900 border border-transparent text-slate-300 hover:text-white'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${isSelected ? 'bg-cyan-500/30 text-cyan-300' : 'bg-slate-900 text-slate-400'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold tracking-wide truncate">{item.title}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                        </div>
                        <p className="text-[10px] text-slate-400 leading-snug line-clamp-1 mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Button 3: 碳资产交易大盘 (Switches to Trading View) */}
        <button
          onClick={() => setActiveNavTab('trading')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm group ${
            activeNavTab === 'trading'
              ? 'bg-gradient-to-r from-amber-600/35 via-amber-500/25 to-emerald-600/35 text-amber-200 border border-amber-400 shadow-[0_0_18px_rgba(245,158,11,0.4)]'
              : 'bg-slate-950/70 border border-amber-500/35 text-amber-200/90 hover:border-amber-400 hover:text-white hover:bg-slate-800'
          }`}
          title="切换至蓝碳现货交易与CCER资产大盘"
        >
          <div className="relative">
            <TrendingUp className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div className="text-left leading-tight">
            <div className="text-amber-200 flex items-center gap-1">
              <span>碳资产交易大盘</span>
              <span className="px-1 py-0.2 rounded bg-emerald-500/30 text-emerald-300 text-[8px] font-mono">
                行情
              </span>
            </div>
            <span className="text-[9px] font-mono text-amber-400/90 block">¥78.50 (+3.4%)</span>
          </div>
        </button>

        {/* Button 4: CCER 核证报告 (Switches to CCER View) */}
        <button
          onClick={() => setActiveNavTab('ccer')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm group ${
            activeNavTab === 'ccer'
              ? 'bg-gradient-to-r from-emerald-600/35 via-emerald-500/25 to-teal-600/35 text-emerald-200 border border-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.4)]'
              : 'bg-slate-950/70 border border-emerald-500/35 text-slate-200 hover:border-emerald-400 hover:text-white hover:bg-slate-800'
          }`}
          title="切换至国际CCER核证凭证报告中心"
        >
          <FileText className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          <div className="text-left leading-tight">
            <div>CCER 国际核证</div>
            <span className="text-[10px] font-mono text-emerald-400/90 block">国际碳登记凭据</span>
          </div>
        </button>

        {/* Button 5: AI 小蓝 (Switches to AI View) */}
        <button
          onClick={() => setActiveNavTab('ai')}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer shadow-sm group ${
            activeNavTab === 'ai'
              ? 'bg-gradient-to-r from-indigo-600/35 via-indigo-500/25 to-purple-600/35 text-indigo-200 border border-indigo-400 shadow-[0_0_18px_rgba(99,102,241,0.4)]'
              : 'bg-slate-950/70 border border-indigo-500/35 text-slate-200 hover:border-indigo-400 hover:text-white hover:bg-slate-800'
          }`}
          title="切换至AI助手·小蓝生态处方决策中心"
        >
          <Sparkles className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
          <div className="text-left leading-tight">
            <div>AI 小蓝</div>
            <span className="text-[10px] font-mono text-indigo-400/90 block">生态治理处方</span>
          </div>
        </button>
      </nav>

      {/* Zone 3: Right Panel Toggles & Status Telemetry & Logout */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Quick Toggles for Left & Right Panels (only active/relevant in GIS tab) */}
        {activeNavTab === 'gis' && (
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-slate-800 animate-in fade-in">
            {onToggleLeftPanel && (
              <button
                onClick={onToggleLeftPanel}
                className={`flex items-center gap-1 px-2.5 py-1 text-[11px] rounded-lg transition-all font-semibold cursor-pointer ${
                  isLeftPanelOpen
                    ? 'bg-cyan-500/25 border border-cyan-400 text-cyan-200'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title="切换显示/隐藏左侧生态图表面板"
              >
                <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
                <span>{isLeftPanelOpen ? '隐藏图表' : '展开图表'}</span>
              </button>
            )}

            {onToggleRightPanel && (
              <button
                onClick={onToggleRightPanel}
                className={`flex items-center gap-1 px-2.5 py-1 text-[11px] rounded-lg transition-all font-semibold cursor-pointer ${
                  isRightPanelOpen
                    ? 'bg-amber-500/25 border border-amber-400 text-amber-200'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title="切换显示/隐藏右侧资产核算面板"
              >
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>{isRightPanelOpen ? '隐藏资产' : '展开资产'}</span>
              </button>
            )}
          </div>
        )}

        {/* Live Clock */}
        <div className="hidden sm:block text-right">
          <div className="font-num text-xs font-bold tracking-wider text-cyan-300">
            {timeStr || '00:00:00'}
          </div>
          <div className="text-[9px] text-slate-400 font-mono">
            {dateStr || '2026.09.28'}
          </div>
        </div>

        <div className="h-6 w-[1px] bg-slate-800" />

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 hover:bg-rose-950/30 transition-colors text-xs font-semibold cursor-pointer"
          title="退出系统，返回登录界面"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden md:inline">退出</span>
        </button>
      </div>
    </header>
  );
};
