import React, { useState } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Activity, 
  Layers,
  Sparkles,
  GitMerge,
  Radar,
  X
} from 'lucide-react';
import { StationData } from '../data/blueCarbonData';

interface LeftPanelProps {
  station: StationData;
  year: number;
  intervention: number;
  onClose?: () => void;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({ station, year, intervention, onClose }) => {
  const [activeTab, setActiveTab] = useState<'trends' | 'radar'>('trends');

  // Multiplier from slider
  const factor = 1 + (intervention / 100) * 0.18 + (year - 2026) * 0.025;
  const currentTotal = (station.carbonTotal * factor).toFixed(1);

  // Donut chart stroke data
  const saltmarsh = station.carbonShare.saltmarsh;
  const seagrass = station.carbonShare.seagrass;
  const shellfish = station.carbonShare.shellfishAlgae;

  const radius = 35;
  const circ = 2 * Math.PI * radius;
  const d1 = (saltmarsh / 100) * circ;
  const d2 = (seagrass / 100) * circ;
  const d3 = (shellfish / 100) * circ;

  // Monthly comparative bar data
  const monthlyData = [
    { month: '1月', v2025: 22, v2026: 28 },
    { month: '3月', v2025: 38, v2026: 46 },
    { month: '5月', v2025: 65, v2026: 79 },
    { month: '7月', v2025: 84, v2026: 98 },
    { month: '9月', v2025: 72, v2026: 86 },
    { month: '11月', v2025: 41, v2026: 52 },
  ];

  // 5-Axis Radar Chart calculation
  const radarKeys: { key: keyof StationData['radarScores']; label: string }[] = [
    { key: 'biodiversity', label: '生物多样性' },
    { key: 'waterQuality', label: '水质优良率' },
    { key: 'sinkStability', label: '碳汇稳定性' },
    { key: 'ndviIndex', label: '遥感植被指数' },
    { key: 'economicRatio', label: '经济转化率' },
  ];
  const radarCenter = { x: 100, y: 75 };
  const radarRadius = 55;
  const radarShapePoints = radarKeys.map((item, i) => {
    const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    const val = station.radarScores[item.key] / 100;
    const x = radarCenter.x + radarRadius * val * Math.cos(angle);
    const y = radarCenter.y + radarRadius * val * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-[360px] h-full flex flex-col gap-2 p-2 bg-slate-950/90 backdrop-blur-md border-r border-cyan-500/20 overflow-y-auto z-20 shadow-2xl">
      {/* Top Header of Left Panel with Quick Close */}
      <div className="flex items-center justify-between px-1 py-1 border-b border-cyan-500/20 shrink-0">
        <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300">
          <BarChart3 className="w-4 h-4 text-cyan-400" />
          <span>生态碳汇全景数据看板</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer border border-slate-800"
            title="收起生态图表面板"
          >
            <span>收起面板</span>
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Module 1: 三大蓝碳生态系统固碳贡献占比 (Donut Chart + Progress Bars) */}
      <div className="p-2.5 rounded-lg bg-slate-900/80 border border-cyan-500/20 tech-border flex flex-col gap-1.5 shrink-0">
        <div className="flex items-center justify-between border-b border-cyan-500/15 pb-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <h3 className="text-xs font-bold text-slate-100">
              三大蓝碳生态贡献环形分布
            </h3>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-0.5">
            <TrendingUp className="w-2.5 h-2.5" />
            +{station.carbonGrowthRate}%
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 pt-0.5">
          {/* Donut SVG */}
          <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 90 90" className="w-full h-full -rotate-90">
              <circle cx="45" cy="45" r={radius} fill="none" stroke="#0f172a" strokeWidth="10" />
              {/* Saltmarsh: Emerald */}
              <circle
                cx="45"
                cy="45"
                r={radius}
                fill="none"
                stroke="#10b981"
                strokeWidth="10"
                strokeDasharray={`${d1} ${circ}`}
                strokeDashoffset={0}
              />
              {/* Seagrass: Cyan */}
              <circle
                cx="45"
                cy="45"
                r={radius}
                fill="none"
                stroke="#06b6d4"
                strokeWidth="10"
                strokeDasharray={`${d2} ${circ}`}
                strokeDashoffset={-d1}
              />
              {/* Shellfish/Algae: Amber */}
              <circle
                cx="45"
                cy="45"
                r={radius}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="10"
                strokeDasharray={`${d3} ${circ}`}
                strokeDashoffset={-(d1 + d2)}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-num text-xs font-bold text-white leading-none">
                {currentTotal}
              </span>
              <span className="text-[8px] text-slate-400 font-mono mt-0.5">万吨</span>
            </div>
          </div>

          {/* Color Legend & Percentage Bars */}
          <div className="flex-1 space-y-1.5 text-[11px]">
            <div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-1.5 text-[10px]">
                  <span className="w-2 h-2 rounded-xs bg-emerald-500 inline-block" />
                  <span>盐沼湿地</span>
                </span>
                <span className="font-num font-bold text-emerald-300 text-xs">{saltmarsh}%</span>
              </div>
              <div className="w-full h-1 bg-slate-800 rounded-full mt-0.5 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${saltmarsh}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-1.5 text-[10px]">
                  <span className="w-2 h-2 rounded-xs bg-cyan-500 inline-block" />
                  <span>海草床</span>
                </span>
                <span className="font-num font-bold text-cyan-300 text-xs">{seagrass}%</span>
              </div>
              <div className="w-full h-1 bg-slate-800 rounded-full mt-0.5 overflow-hidden">
                <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${seagrass}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-1.5 text-[10px]">
                  <span className="w-2 h-2 rounded-xs bg-amber-500 inline-block" />
                  <span>贝藻养殖</span>
                </span>
                <span className="font-num font-bold text-amber-300 text-xs">{shellfish}%</span>
              </div>
              <div className="w-full h-1 bg-slate-800 rounded-full mt-0.5 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${shellfish}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Module 2: 2021-2026年固碳增汇趋势 (Dual Curve Area Chart) */}
      <div className="p-2.5 rounded-lg bg-slate-900/80 border border-cyan-500/20 tech-border flex flex-col gap-1 shrink-0">
        <div className="flex items-center justify-between border-b border-cyan-500/15 pb-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <h3 className="text-xs font-bold text-slate-100">
              固碳增汇多周期演化曲线 (万吨)
            </h3>
          </div>
          <div className="flex items-center gap-2 text-[9px] font-mono">
            <span className="text-cyan-400">● 实测</span>
            <span className="text-amber-400">--- 潜能</span>
          </div>
        </div>

        {/* SVG Curve */}
        <div className="relative w-full h-[88px] pt-1">
          <svg viewBox="0 0 310 80" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="trendAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            <line x1="20" y1="15" x2="295" y2="15" stroke="rgba(148, 163, 184, 0.12)" strokeDasharray="3 3" />
            <line x1="20" y1="40" x2="295" y2="40" stroke="rgba(148, 163, 184, 0.12)" strokeDasharray="3 3" />
            <line x1="20" y1="65" x2="295" y2="65" stroke="rgba(148, 163, 184, 0.2)" />

            <path
              d="M 25,58 C 65,42 95,50 135,36 C 175,24 225,18 285,10 L 285,65 L 25,65 Z"
              fill="url(#trendAreaGrad)"
            />
            <path
              d="M 25,58 C 65,42 95,50 135,36 C 175,24 225,18 285,10"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2"
            />
            <path
              d="M 25,52 C 65,38 110,32 160,22 C 210,14 250,8 285,4"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />

            {[
              { x: 25, y: 58, val: '48' },
              { x: 77, y: 46, val: '60' },
              { x: 129, y: 38, val: '55' },
              { x: 181, y: 26, val: '78' },
              { x: 233, y: 19, val: '88' },
              { x: 285, y: 10, val: currentTotal },
            ].map((p, idx) => (
              <g key={idx}>
                <circle cx={p.x} cy={p.y} r="2.5" fill="#06b6d4" stroke="#ffffff" strokeWidth="1" />
                <text x={p.x} y={p.y - 4} fill="#e2e8f0" fontSize="7.5" textAnchor="middle" fontFamily="JetBrains Mono, monospace">
                  {p.val}
                </text>
              </g>
            ))}
          </svg>

          <div className="flex justify-between px-2 text-[8px] text-slate-400 font-mono">
            <span>2021</span>
            <span>2022</span>
            <span>2023</span>
            <span>2024</span>
            <span>2025</span>
            <span className="text-cyan-400 font-bold">2026</span>
          </div>
        </div>
      </div>

      {/* Module 3: 月度海-气通量净吸收对比柱状图 (Grouped Bar Chart) */}
      <div className="p-2.5 rounded-lg bg-slate-900/80 border border-cyan-500/20 tech-border flex flex-col gap-1 shrink-0">
        <div className="flex items-center justify-between border-b border-cyan-500/15 pb-1">
          <div className="flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
            <h3 className="text-xs font-bold text-slate-100">
              月度海-气吸收强度柱状图 (mmol/m²·d)
            </h3>
          </div>
          <div className="flex items-center gap-2 text-[9px] font-mono">
            <span className="text-slate-400">■ 2025</span>
            <span className="text-cyan-300">■ 2026</span>
          </div>
        </div>

        <div className="h-[80px] w-full flex items-end justify-between gap-1.5 px-2 pt-1 border-b border-slate-800">
          {monthlyData.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5 h-full justify-end">
              <div className="w-full flex items-end justify-center gap-1 h-[60px]">
                <div
                  className="w-2 bg-slate-700/80 rounded-t-xs"
                  style={{ height: `${(d.v2025 / 100) * 100}%` }}
                  title={`2025年: ${d.v2025}`}
                />
                <div
                  className="w-2 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-xs shadow-[0_0_6px_rgba(6,182,212,0.4)]"
                  style={{ height: `${(d.v2026 / 100) * 100}%` }}
                  title={`2026年: ${d.v2026}`}
                />
              </div>
              <span className="text-[8px] text-slate-400 font-mono">{d.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Module 4: 五维生态健康度雷达图 (Radar Chart) */}
      <div className="p-2.5 rounded-lg bg-slate-900/80 border border-emerald-500/30 tech-border flex flex-col gap-1 shrink-0">
        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-1">
          <div className="flex items-center gap-1.5">
            <Radar className="w-3.5 h-3.5 text-emerald-400" />
            <h3 className="text-xs font-bold text-slate-100">
              {station.shortName} · 五维健康度雷达图
            </h3>
          </div>
          <span className="text-[9px] font-mono text-emerald-400">综合健康: 94.2分</span>
        </div>

        <div className="flex items-center justify-between gap-1 pt-0.5">
          {/* Radar Chart SVG */}
          <div className="relative w-44 h-36 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 200 150" className="w-full h-full overflow-visible">
              {/* Concentric spider rings */}
              {[0.33, 0.66, 1.0].map((ratio, idx) => (
                <polygon
                  key={idx}
                  points={radarKeys
                    .map((_, i) => {
                      const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
                      const r = radarRadius * ratio;
                      return `${radarCenter.x + r * Math.cos(angle)},${radarCenter.y + r * Math.sin(angle)}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke="rgba(6, 182, 212, 0.2)"
                  strokeWidth="1"
                />
              ))}

              {/* Axis lines */}
              {radarKeys.map((item, i) => {
                const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
                const x2 = radarCenter.x + radarRadius * Math.cos(angle);
                const y2 = radarCenter.y + radarRadius * Math.sin(angle);
                const textX = radarCenter.x + (radarRadius + 14) * Math.cos(angle);
                const textY = radarCenter.y + (radarRadius + 10) * Math.sin(angle);
                return (
                  <g key={i}>
                    <line x1={radarCenter.x} y1={radarCenter.y} x2={x2} y2={y2} stroke="rgba(6, 182, 212, 0.2)" strokeWidth="1" />
                    <text x={textX} y={textY} fill="#94a3b8" fontSize="7.5" textAnchor="middle" dominantBaseline="middle">
                      {item.label.slice(0, 3)}
                    </text>
                  </g>
                );
              })}

              {/* Radar Area */}
              <polygon points={radarShapePoints} fill="rgba(16, 185, 129, 0.4)" stroke="#10b981" strokeWidth="1.5" />
              {radarKeys.map((item, i) => {
                const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
                const val = station.radarScores[item.key] / 100;
                const x = radarCenter.x + radarRadius * val * Math.cos(angle);
                const y = radarCenter.y + radarRadius * val * Math.sin(angle);
                return <circle key={i} cx={x} cy={y} r="2" fill="#38bdf8" stroke="#ffffff" strokeWidth="0.8" />;
              })}
            </svg>
          </div>

          {/* Quick Score Bars */}
          <div className="flex-1 space-y-1 text-[10px]">
            {radarKeys.map((item) => (
              <div key={item.key}>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">{item.label}</span>
                  <span className="font-num text-cyan-300 font-bold">{station.radarScores[item.key]}</span>
                </div>
                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mt-0.5">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${station.radarScores[item.key]}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
