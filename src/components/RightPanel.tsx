import React from 'react';
import { 
  Coins, 
  FileText, 
  Activity, 
  Satellite, 
  Radio, 
  ShieldAlert, 
  TrendingUp, 
  ArrowUpRight,
  Sparkles,
  Gauge,
  LineChart,
  X
} from 'lucide-react';
import { StationData, ALERTS_LIST, EcologicalAlert } from '../data/blueCarbonData';

interface RightPanelProps {
  station: StationData;
  year: number;
  intervention: number;
  onOpenCCERModal: () => void;
  onSelectAlert: (alert: EcologicalAlert) => void;
  onClose?: () => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({
  station,
  year,
  intervention,
  onOpenCCERModal,
  onSelectAlert,
  onClose,
}) => {
  // Real-time carbon economics calculation
  const unitCarbonPrice = 78.50 + (year - 2026) * 2.8; 
  const factor = 1 + (intervention / 100) * 0.18 + (year - 2026) * 0.025;
  const currentCarbonTons = station.carbonTotal * factor; // in 万吨
  const totalValuationWanYuan = (currentCarbonTons * 10000 * unitCarbonPrice) / 10000; // in 万元 RMB

  // Device status data
  const deviceStatuses = [
    { name: '天基卫星群', rate: 99.2, current: '3轨覆盖', color: 'from-emerald-500 to-teal-400' },
    { name: '空基无人机', rate: 96.5, current: '8机巢在巡', color: 'from-cyan-500 to-blue-400' },
    { name: '海基浮标阵', rate: 98.1, current: '10Hz采样', color: 'from-cyan-400 to-emerald-400' },
    { name: '水下AUV群', rate: 94.0, current: '自适应探深', color: 'from-amber-400 to-orange-400' },
  ];

  // 4 Characteristic Indicators for Station in mini gauges
  const gauges = station.uniqueMetrics.slice(0, 4);

  return (
    <div className="w-[370px] h-full flex flex-col gap-2 p-2 bg-slate-950/90 backdrop-blur-md border-l border-cyan-500/20 overflow-y-auto z-20 shadow-2xl">
      {/* Top Header of Right Panel with Quick Close */}
      <div className="flex items-center justify-between px-1 py-1 border-b border-cyan-500/20 shrink-0">
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
          <Coins className="w-4 h-4 text-amber-400" />
          <span>蓝碳银行与工况监测舱</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer border border-slate-800"
            title="收起资产核算面板"
          >
            <span>收起面板</span>
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Module 1: 蓝碳银行 · 资产实时核算舱 (Big Numbers + CCER Button) */}
      <div className="p-2.5 rounded-lg bg-slate-900/80 border border-amber-500/30 tech-border flex flex-col gap-1.5 shrink-0">
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-1">
          <div className="flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <h3 className="text-xs font-bold text-slate-100">
              山东省蓝碳银行 · 资产核算舱
            </h3>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950/80 border border-amber-500/30 text-amber-300">
            {year}年度
          </span>
        </div>

        {/* 2 Big Stat Cards */}
        <div className="grid grid-cols-2 gap-2 pt-0.5">
          <div className="p-2.5 rounded bg-slate-950/80 border border-cyan-500/25">
            <span className="text-xs font-semibold text-slate-200 block">实时累计碳汇量</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-num text-xl font-bold text-cyan-300">
                {currentCarbonTons.toFixed(2)}
              </span>
              <span className="text-xs text-cyan-400 font-mono font-bold">万吨 CO₂e</span>
            </div>
            <div className="text-[11px] font-semibold text-emerald-300 mt-1 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              <span>干预增益 +{(intervention * 0.18).toFixed(1)}%</span>
            </div>
          </div>

          <div className="p-2.5 rounded bg-slate-950/80 border border-amber-500/25">
            <span className="text-xs font-semibold text-slate-200 block">可交易经济估值</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-num text-xl font-bold text-amber-300">
                {Math.round(totalValuationWanYuan).toLocaleString()}
              </span>
              <span className="text-xs text-amber-400 font-mono font-bold">万元</span>
            </div>
            <div className="text-[11px] font-semibold text-amber-300 mt-1 font-mono">
              单价: ¥{unitCarbonPrice.toFixed(1)}/吨
            </div>
          </div>
        </div>

        {/* Quick action button */}
        <button
          onClick={onOpenCCERModal}
          className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-amber-600/40 via-amber-500/30 to-amber-600/40 border border-amber-500/50 text-amber-200 text-xs sm:text-sm font-bold hover:bg-amber-500/40 hover:border-amber-300 transition-all flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(245,158,11,0.25)] group cursor-pointer"
        >
          <FileText className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          <span>生成 CCER 国际碳汇核证报告</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
        </button>
      </div>

      {/* Module 2: 24小时潮汐吸碳速率走势 (Wave Curve with Markers) */}
      <div className="p-2.5 rounded-lg bg-slate-900/80 border border-cyan-500/20 tech-border flex flex-col gap-1.5 shrink-0">
        <div className="flex items-center justify-between border-b border-cyan-500/15 pb-1">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-100">
              24h潮汐海-气CO₂净吸收速率曲线
            </h3>
          </div>
          <span className="text-xs font-mono font-semibold text-cyan-400">
            mmol/(m²·h)
          </span>
        </div>

        {/* Wave SVG */}
        <div className="relative w-full h-[88px] pt-1">
          <svg viewBox="0 0 310 80" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="fluxWaveGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            <line x1="20" y1="15" x2="295" y2="15" stroke="rgba(148, 163, 184, 0.12)" strokeDasharray="3 3" />
            <line x1="20" y1="40" x2="295" y2="40" stroke="rgba(148, 163, 184, 0.12)" strokeDasharray="3 3" />
            <line x1="20" y1="65" x2="295" y2="65" stroke="rgba(148, 163, 184, 0.2)" />

            <path
              d="M 25,58 C 55,48 75,34 110,20 C 145,8 180,6 215,16 C 245,30 270,48 290,60 L 290,65 L 25,65 Z"
              fill="url(#fluxWaveGrad)"
            />
            <path
              d="M 25,58 C 55,48 75,34 110,20 C 145,8 180,6 215,16 C 245,30 270,48 290,60"
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
            />

            {[
              { x: 25, y: 58, val: '-1.8' },
              { x: 68, y: 46, val: '-3.5' },
              { x: 112, y: 22, val: '-7.2' },
              { x: 156, y: 9, val: '-9.4' },
              { x: 200, y: 15, val: '-8.6' },
              { x: 245, y: 38, val: '-4.8' },
              { x: 290, y: 60, val: '-2.1' },
            ].map((p, idx) => (
              <g key={idx}>
                <circle cx={p.x} cy={p.y} r="2.5" fill="#10b981" stroke="#ffffff" strokeWidth="1" />
                <text x={p.x} y={p.y - 4} fill="#6ee7b7" fontSize="7.5" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
                  {p.val}
                </text>
              </g>
            ))}
          </svg>

          <div className="flex justify-between px-2 text-xs text-slate-300 font-mono font-semibold">
            <span>02:00</span>
            <span>06:00</span>
            <span>10:00</span>
            <span className="text-emerald-400 font-bold">12:00(峰值)</span>
            <span>14:00</span>
            <span>18:00</span>
            <span>22:00</span>
          </div>
        </div>
      </div>

      {/* Module 3: 4个微型仪表盘图表 (4 Mini Circular Speedometer / Gauge Charts) */}
      <div className="p-2.5 rounded-lg bg-slate-900/80 border border-cyan-500/20 tech-border flex flex-col gap-1.5 shrink-0">
        <div className="flex items-center justify-between border-b border-cyan-500/15 pb-1">
          <div className="flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-cyan-400" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-100">
              {station.shortName} · 特色微型仪表群
            </h3>
          </div>
          <span className="text-xs text-slate-300 font-mono font-semibold">实时传感器</span>
        </div>

        {/* 4 Mini Gauges in a 4-grid */}
        <div className="grid grid-cols-2 gap-2 pt-0.5">
          {gauges.map((g, idx) => {
            // Gauge semi-circle stroke calculation
            const num = parseFloat(g.value.replace(/[^0-9.]/g, '')) || 85;
            const pct = Math.min(Math.max(num > 100 ? (num % 100) : num, 20), 95);

            return (
              <div key={idx} className="p-2 rounded bg-slate-950/70 border border-slate-800 flex items-center gap-2">
                {/* SVG Semi Gauge */}
                <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 60 60" className="w-full h-full -rotate-90">
                    <circle cx="30" cy="30" r="24" fill="none" stroke="#1e293b" strokeWidth="5" />
                    <circle
                      cx="30"
                      cy="30"
                      r="24"
                      fill="none"
                      stroke={idx % 2 === 0 ? '#06b6d4' : '#10b981'}
                      strokeWidth="5"
                      strokeDasharray={`${(pct / 100) * (2 * Math.PI * 24)} ${2 * Math.PI * 24}`}
                    />
                  </svg>
                  <span className="absolute font-num text-xs font-bold text-slate-100">
                    {pct.toFixed(0)}%
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <span className="text-xs font-semibold text-slate-200 block truncate" title={g.label}>
                    {g.label}
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="font-num text-sm font-bold text-cyan-300">
                      {g.value}
                    </span>
                    <span className="text-xs text-slate-300 font-mono font-semibold">{g.unit}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Module 4: 空天地海监测网在线率柱形仪表 (Visual Progress Meters) */}
      <div className="p-2.5 rounded-lg bg-slate-900/80 border border-cyan-500/20 tech-border flex flex-col gap-1.5 shrink-0">
        <div className="flex items-center justify-between border-b border-cyan-500/15 pb-1">
          <div className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-100">
              空天地海监测网工况柱形图
            </h3>
          </div>
          <span className="text-xs text-emerald-400 font-mono font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            在线率 98.4%
          </span>
        </div>

        <div className="space-y-1.5 pt-0.5">
          {deviceStatuses.map((item, idx) => (
            <div key={idx} className="p-1.5 rounded bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-2 text-xs">
              <span className="text-slate-200 text-xs w-22 shrink-0 font-bold">
                {item.name}
              </span>

              <div className="flex-1 bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                  style={{ width: `${item.rate}%` }}
                />
              </div>

              <div className="w-20 text-right shrink-0">
                <span className="font-num text-xs font-bold text-emerald-300">
                  {item.rate}%
                </span>
                <span className="text-[11px] text-slate-300 font-mono font-semibold block leading-none">
                  {item.current}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
