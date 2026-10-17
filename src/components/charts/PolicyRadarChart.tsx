import React from 'react';
import { ShieldCheck, Award, TrendingUp } from 'lucide-react';

export const PolicyRadarChart: React.FC = () => {
  // 6 Core Axes of Shandong Blue Carbon Policy Assessment
  const axes = [
    { label: '生态红线管控', score: 100, unit: '%' },
    { label: '重大科技攻关', score: 94, unit: '分' },
    { label: '海湾水质优良', score: 91, unit: '%' },
    { label: '碳普惠覆盖度', score: 89, unit: '分' },
    { label: '绿色金融授信', score: 95, unit: '分' },
    { label: 'CCER资产化', score: 96, unit: '分' },
  ];

  const size = 320;
  const center = size / 2;
  const radius = 110;
  const numAxes = axes.length;

  const getCoordinates = (index: number, score: number) => {
    const angle = (Math.PI * 2 / numAxes) * index - Math.PI / 2;
    const r = (score / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const polygonPoints = axes.map((a, i) => {
    const { x, y } = getCoordinates(i, a.score);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Left: SVG Hexagonal Radar */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
          {/* Concentric Polygons */}
          {[0.2, 0.4, 0.6, 0.8, 1.0].map((level, lIdx) => {
            const points = axes.map((_, i) => {
              const { x, y } = getCoordinates(i, level * 100);
              return `${x},${y}`;
            }).join(' ');
            return (
              <polygon
                key={lIdx}
                points={points}
                fill={level === 1.0 ? 'rgba(6, 182, 212, 0.03)' : 'none'}
                stroke="rgba(255, 255, 255, 0.1)"
                strokeDasharray={level === 1.0 ? 'none' : '3 3'}
                strokeWidth="1"
              />
            );
          })}

          {/* Spokes */}
          {axes.map((_, i) => {
            const { x, y } = getCoordinates(i, 100);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth="1"
              />
            );
          })}

          {/* Active Data Polygon */}
          <polygon
            points={polygonPoints}
            fill="rgba(16, 185, 129, 0.25)"
            stroke="#10b981"
            strokeWidth="2.5"
            className="drop-shadow-[0_0_12px_rgba(16,185,129,0.5)] transition-all duration-300"
          />

          {/* Data Points and Labels */}
          {axes.map((a, i) => {
            const { x, y } = getCoordinates(i, a.score);
            const outerCoord = getCoordinates(i, 118);
            return (
              <g key={i}>
                <circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#030914"
                  stroke="#34d399"
                  strokeWidth="2"
                  className="hover:r-6 cursor-pointer transition-all"
                />
                <text
                  x={outerCoord.x}
                  y={outerCoord.y + (i === 0 ? -4 : i === 3 ? 10 : 4)}
                  textAnchor="middle"
                  fill="#cbd5e1"
                  className="font-bold text-[11px]"
                >
                  {a.label}
                </text>
                <text
                  x={outerCoord.x}
                  y={outerCoord.y + (i === 0 ? 8 : i === 3 ? 22 : 16)}
                  textAnchor="middle"
                  fill="#10b981"
                  className="font-mono text-[10px] font-bold"
                >
                  {a.score}{a.unit}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Right: Policy Highlights & Milestone Badges */}
      <div className="flex-1 space-y-3 text-xs">
        <div className="flex items-center gap-2 text-emerald-400 font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>山东省海洋强省六维综合绩效评定：AAA 级卓越</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">生态保护红线管控率</span>
            <span className="text-emerald-400 font-mono font-bold text-sm">100.0%</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">全域严防违法用海占用</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">重大科技攻关支持</span>
            <span className="text-cyan-400 font-mono font-bold text-sm">94.0分</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">崂山实验室微型生物碳泵</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">生态补偿转移兑付</span>
            <span className="text-amber-300 font-mono font-bold text-sm">117.1亿元</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">黄渤海水质达标激励</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">CCER资产化达成</span>
            <span className="text-purple-400 font-mono font-bold text-sm">96.0分</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">国家温室气体自愿减排</span>
          </div>
        </div>

        <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
          依据《山东省碳达峰实施方案》考核细则及自然资源部国家级海洋督察评估结果汇总生成。
        </p>
      </div>
    </div>
  );
};
